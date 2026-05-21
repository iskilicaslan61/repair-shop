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

  await ses.send(new SendEmailCommand({
    Source:      FROM,
    Destination: { ToAddresses: [TO] },
    Message: {
      Subject: { Data: `Neue Anfrage von ${name}` },
      Body: {
        Text: {
          Data: `Name: ${name}\nE-Mail: ${email}\nTelefon: ${phone ?? "-"}\n\nNachricht:\n${message}\n\nZeitpunkt: ${timestamp}\nDSGVO-Einwilligung: Ja`,
        },
      },
    },
  }));

  return {
    statusCode: 200,
    headers: CORS,
    body: JSON.stringify({ success: true, id }),
  };
};
