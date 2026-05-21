import { DynamoDBClient, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { randomUUID, createHash } from "crypto";

const dynamo = new DynamoDBClient({});
const ses = new SESClient({});

const TABLE = process.env.DYNAMODB_TABLE;
const FROM = process.env.SES_FROM_EMAIL;
const TO = process.env.SES_TO_EMAIL;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

const CORS = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const handler = async (event) => {
  const method = event.requestContext?.http?.method;

  // ── OPTIONS ──────────────────────────────────────────────
  if (method === "OPTIONS") {
    return { statusCode: 204, headers: CORS, body: "" };
  }

  // ── GET: kaç kişi "Kommt!" dedi ──────────────────────────
  if (method === "GET") {
    try {
      const result = await dynamo.send(new ScanCommand({
        TableName: TABLE,
        Select: "COUNT",
        FilterExpression: "contains(#msg, :val)",
        ExpressionAttributeNames: { "#msg": "message" },
        ExpressionAttributeValues: { ":val": { S: "Kommt!" } },
      }));
      return {
        statusCode: 200,
        headers: CORS,
        body: JSON.stringify({ count: result.Count ?? 0 }),
      };
    } catch {
      return {
        statusCode: 200,
        headers: CORS,
        body: JSON.stringify({ count: 0 }),
      };
    }
  }

  // ── POST: RSVP kaydet + e-posta gönder ───────────────────
  let body;
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { name, email, phone, message, consent } = body;

  if (!name || !email || !message) {
    return { statusCode: 422, headers: CORS, body: JSON.stringify({ error: "name, email, message zorunlu" }) };
  }

  if (!consent) {
    return { statusCode: 422, headers: CORS, body: JSON.stringify({ error: "GDPR consent gerekli" }) };
  }

  const id = randomUUID();
  const timestamp = new Date().toISOString();
  const ip_hash = createHash("sha256").update(event.requestContext?.http?.sourceIp ?? "unknown").digest("hex");
  const expiresAt = Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60;

  await dynamo.send(new PutItemCommand({
    TableName: TABLE,
    Item: {
      Id:        { S: id },
      name:      { S: name },
      email:     { S: email },
      phone:     { S: phone ?? "" },
      message:   { S: message },
      consent:   { BOOL: true },
      timestamp: { S: timestamp },
      ip_hash:   { S: ip_hash },
      expiresAt: { N: String(expiresAt) },
    },
  }));

  await ses.send(new SendEmailCommand({
    Source: FROM,
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
