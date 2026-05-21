import { DynamoDBClient, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { randomUUID, createHash, randomBytes, createCipheriv } from "crypto";

const dynamo = new DynamoDBClient({});
const ses = new SESClient({});

const TABLE          = process.env.DYNAMODB_TABLE;
const FROM           = process.env.SES_FROM_EMAIL;
const TO             = process.env.SES_TO_EMAIL;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;
const ENC_KEY        = process.env.ENCRYPTION_KEY; // 64-char hex = 32 bytes

const CORS = {
  "Access-Control-Allow-Origin":  ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/* AES-256-GCM encrypt → "iv.authTag.ciphertext" (base64 parts) */
function encrypt(plaintext) {
  const iv     = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", Buffer.from(ENC_KEY, "hex"), iv);
  const enc    = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag    = cipher.getAuthTag();
  return [iv, tag, enc].map(b => b.toString("base64")).join(".");
}

export const handler = async (event) => {
  const method = event.requestContext?.http?.method;

  // ── OPTIONS ──────────────────────────────────────────────
  if (method === "OPTIONS") {
    return { statusCode: 204, headers: CORS, body: "" };
  }

  // ── GET: toplam katılımcı sayısı ─────────────────────────
  if (method === "GET") {
    try {
      const result = await dynamo.send(new ScanCommand({
        TableName:        TABLE,
        FilterExpression: "attending = :yes",
        ExpressionAttributeValues: { ":yes": { BOOL: true } },
        ProjectionExpression: "guests_count",
      }));
      const total = (result.Items ?? []).reduce((sum, item) => {
        return sum + (parseInt(item.guests_count?.N ?? "1") || 1);
      }, 0);
      return {
        statusCode: 200,
        headers: CORS,
        body: JSON.stringify({ count: total }),
      };
    } catch {
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ count: 0 }) };
    }
  }

  // ── POST: RSVP kaydet + e-posta gönder ───────────────────
  let body;
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { name, email, phone, message, consent, guests_count, attending } = body;

  if (!name || !email || !message) {
    return { statusCode: 422, headers: CORS, body: JSON.stringify({ error: "name, email, message zorunlu" }) };
  }
  if (!consent) {
    return { statusCode: 422, headers: CORS, body: JSON.stringify({ error: "GDPR consent gerekli" }) };
  }

  const id        = randomUUID();
  const timestamp = new Date().toISOString();
  const ip_hash   = createHash("sha256").update(event.requestContext?.http?.sourceIp ?? "unknown").digest("hex");
  const expiresAt = Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60;

  await dynamo.send(new PutItemCommand({
    TableName: TABLE,
    Item: {
      Id:           { S: id },
      name:         { S: encrypt(name) },
      email:        { S: encrypt(email) },
      phone:        { S: encrypt(phone ?? "") },
      message:      { S: encrypt(message) },
      attending:    { BOOL: attending === true },
      consent:      { BOOL: true },
      timestamp:    { S: timestamp },
      ip_hash:      { S: ip_hash },
      expiresAt:    { N: String(expiresAt) },
      guests_count: { N: String(guests_count ?? 1) },
    },
  }));

  const isAttending = attending === true;
  const guestCount  = guests_count ?? 1;
  const subject     = isAttending
    ? `🎉 RSVP: ${name} kommt! (${guestCount} ${guestCount === 1 ? "Person" : "Personen"})`
    : `😢 RSVP: ${name} kann leider nicht kommen`;

  const html = `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#FBF4E4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FBF4E4;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:${isAttending ? "#E75C7D" : "#888"};padding:28px 32px;text-align:center;">
          <p style="margin:0;font-size:40px;">${isAttending ? "🎉" : "😢"}</p>
          <h1 style="margin:8px 0 4px;color:#fff;font-size:22px;">
            ${isAttending ? "Neue Zusage!" : "Absage"}
          </h1>
          <p style="margin:0;color:rgba(255,255,255,0.85);font-size:14px;">
            Muaz & Mikail · Geburtstagsparty · 7. Juni 2026
          </p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px;">

          <!-- Status badge -->
          <div style="background:${isAttending ? "#C8C72A" : "#f0f0f0"};border-radius:8px;padding:12px 20px;margin-bottom:24px;text-align:center;">
            <strong style="font-size:16px;color:#242424;">
              ${isAttending
                ? `✅ Kommt &nbsp;·&nbsp; ${guestCount} ${guestCount === 1 ? "Person" : "Personen"}`
                : "❌ Kann leider nicht kommen"}
            </strong>
          </div>

          <!-- Details -->
          <table width="100%" cellpadding="0" cellspacing="0">
            ${[
              ["👤 Name",    name],
              ["📧 E-Mail",  email],
              ["📱 Telefon", phone || "—"],
            ].map(([label, value]) => `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px;width:110px;">${label}</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#242424;font-size:14px;font-weight:600;">${value}</td>
            </tr>`).join("")}
            ${message ? `
            <tr>
              <td style="padding:10px 0;color:#888;font-size:13px;vertical-align:top;">💬 Nachricht</td>
              <td style="padding:10px 0;color:#242424;font-size:14px;">${message.replace(/\n/g, "<br>")}</td>
            </tr>` : ""}
          </table>

        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f9f9f9;padding:16px 32px;text-align:center;border-top:1px solid #eee;">
          <p style="margin:0;color:#aaa;font-size:12px;">
            ${new Date(timestamp).toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}
            &nbsp;·&nbsp; DSGVO-Einwilligung: Ja
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `${subject}

Name:     ${name}
E-Mail:   ${email}
Telefon:  ${phone || "—"}
Status:   ${isAttending ? `Kommt (${guestCount} ${guestCount === 1 ? "Person" : "Personen"})` : "Kann nicht kommen"}
${message ? `\nNachricht:\n${message}` : ""}

Zeitpunkt: ${new Date(timestamp).toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}
DSGVO-Einwilligung: Ja`;

  await ses.send(new SendEmailCommand({
    Source:      FROM,
    Destination: { ToAddresses: [TO] },
    Message: {
      Subject: { Data: subject },
      Body: {
        Html: { Data: html },
        Text: { Data: text },
      },
    },
  }));

  return {
    statusCode: 200,
    headers: CORS,
    body: JSON.stringify({ success: true, id }),
  };
};
