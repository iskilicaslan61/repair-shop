# Repair Shop — AWS Serverless Contact Form

Next.js static site + AWS Lambda + SES + DynamoDB ile kurulmuş, GDPR uyumlu iletişim formu altyapısı.

## Stack

| Katman | Servis |
|---|---|
| Frontend | Next.js (Static Export) |
| Hosting | AWS Amplify |
| Backend | AWS Lambda (Function URL) |
| E-posta | AWS SES |
| Veritabanı | AWS DynamoDB |
| DNS | AWS Route53 |

---

## Ön Koşullar

- AWS hesabı
- GitHub hesabı
- Node.js 22+
- Bir domain (Route53'te kayıtlı)

---

## Adım 1 — AWS Region Seç

Tüm servisleri aynı region'da kur. GDPR uyumu için:

```
AWS Console → Sağ üst köşe → Europe (Frankfurt) eu-central-1
```

> **Önemli:** Tüm adımlarda bu region seçili olmalı.

---

## Adım 2 — SES Kurulumu

### 2.1 E-posta Adresini Doğrula

```
AWS Console → SES → Verified Identities → Create Identity
Identity type: Email address
Email: info@sirketadi.de
```

Gelen doğrulama mailine tıkla, status `Verified` olacak.

### 2.2 Domain Doğrula

```
SES → Verified Identities → Create Identity
Identity type: Domain
Domain: sirketadi.de

DKIM settings:
  - Easy DKIM seç
  - RSA_2048_BIT
  - "Publish DNS records automatically" işaretle (Route53 aynı hesaptaysa otomatik ekler)
```

### 2.3 Production Access Talep Et (İsteğe Bağlı)

Varsayılan sandbox modda sadece doğrulanmış adreslere mail gönderilir.
Müşterilere otomatik onay maili göndermek istersen:

```
SES → Account Dashboard → Request Production Access
Mail type: Transactional
Use case: Contact form notifications for repair shop website
```

> Onay 1-2 iş günü sürer.

---

## Adım 3 — DynamoDB Tablosu

```
AWS Console → DynamoDB → Create Table

Table name:  contact-form-submissions
Partition key: Id    Type: String   ← Büyük "I" olmalı!
```

### TTL Ayarı (GDPR — 90 gün otomatik silme)

```
DynamoDB → Tables → contact-form-submissions
→ Additional settings → Time to Live → Turn on
TTL attribute name: expiresAt
```

> Lambda her kayıt eklerken `expiresAt` değerini otomatik hesaplar.

---

## Adım 4 — Lambda Fonksiyonu

### 4.1 Oluştur

```
AWS Console → Lambda → Create Function

Function name: contact-form-handler
Runtime:       Node.js 22.x
Architecture:  arm64
```

### 4.2 Kodu Ekle

`index.mjs` dosyasının içeriğini sil, şunu yapıştır:

```javascript
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
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
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 204, headers: CORS, body: "" };
  }

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
```

`Deploy` butonuna bas.

### 4.3 Environment Variables

```
Lambda → Configuration → Environment variables → Edit

DYNAMODB_TABLE   contact-form-submissions
SES_FROM_EMAIL   info@sirketadi.de
SES_TO_EMAIL     info@sirketadi.de
ALLOWED_ORIGIN   https://form.sirketadi.de
```

### 4.4 IAM İzinleri

```
Lambda → Configuration → Permissions → Role name → IAM Console
→ Add permissions → Create inline policy → JSON
```

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["dynamodb:PutItem"],
      "Resource": "arn:aws:dynamodb:eu-central-1:*:table/contact-form-submissions"
    },
    {
      "Effect": "Allow",
      "Action": ["ses:SendEmail"],
      "Resource": "*"
    }
  ]
}
```

Policy name: `contact-form-policy` → Create.

### 4.5 Function URL Aktif Et

```
Lambda → Configuration → Function URL → Create function URL
Auth type: NONE
```

Oluşan URL'yi not al:
```
https://xxxxxxxx.lambda-url.eu-central-1.on.aws/
```

### 4.6 Lambda Test Et

```bash
curl -X POST "https://xxxxxxxx.lambda-url.eu-central-1.on.aws/" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@gmail.com","message":"Test","consent":true}'
```

Başarılı yanıt:
```json
{"success":true,"id":"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"}
```

---

## Adım 5 — Next.js Projesi

### 5.1 Oluştur

```bash
npx create-next-app@latest repair-shop --typescript --tailwind --app --no-src-dir --eslint --no-turbopack --no-import-alias
cd repair-shop
```

### 5.2 `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",        // Amplify için static export
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
```

### 5.3 `.env.local`

```env
NEXT_PUBLIC_LAMBDA_URL=https://xxxxxxxx.lambda-url.eu-central-1.on.aws/
```

> Bu dosya `.gitignore`'da olmalı — GitHub'a push etme.

### 5.4 `lib/constants.ts`

```typescript
export const LAMBDA_URL = process.env.NEXT_PUBLIC_LAMBDA_URL!;
export const SITE_NAME = "Repair Shop";
export const SITE_EMAIL = "info@sirketadi.de";
export const SITE_PHONE = "+49 30 123456";
export const SITE_ADDRESS = "Musterstraße 1, 10115 Berlin";
```

### 5.5 `amplify.yml` (proje köküne ekle)

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: out
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### 5.6 Build Test

```bash
npm run build
# out/ klasörü oluşmalı
```

---

## Adım 6 — Amplify ile Deploy

### Seçenek A: Manuel Deploy (Önerilen — daha hızlı)

```bash
# out klasörünü ZIP'le
# Windows PowerShell:
Compress-Archive -Path ".\out\*" -DestinationPath ".\out.zip" -Force
```

```
AWS Console → Amplify → Create new app
→ Deploy without Git provider
→ out.zip dosyasını yükle (drag & drop)
```

### Seçenek B: GitHub ile Otomatik Deploy

```
Amplify → Create new app → GitHub
→ Repo: repair-shop, Branch: main
→ Build output directory: out    ← .next değil, out olmalı!
→ Environment variables: NEXT_PUBLIC_LAMBDA_URL ekle
→ Save and deploy
```

> **Not:** Amplify Next.js'i SSR olarak algılayabilir. Sorun çıkarsa `amplify.yml` dosyasının repoda olduğundan emin ol.

---

## Adım 7 — Custom Domain Bağla

```
Amplify → repair-shop → Custom domains → Add domain
Domain: sirketadi.de
Subdomain: form
```

Route53 aynı hesapta ise DNS kayıtları otomatik eklenir. SSL sertifikası 5-10 dakikada hazır olur.

---

## Adım 8 — Test Checklist

- [ ] Lambda URL'ye direkt POST isteği gönder → `{"success":true}` dönmeli
- [ ] DynamoDB'de kayıt oluştuğunu kontrol et (`eu-central-1` region'ında bak!)
- [ ] Gmail/e-postada "Neue Anfrage" maili geldi mi?
- [ ] Canlı sitede formu doldur ve gönder
- [ ] Consent checkbox olmadan gönderim reddediliyor mu?
- [ ] `/impressum/` sayfası açılıyor mu?
- [ ] `/datenschutz/` sayfası açılıyor mu?
- [ ] Cookie banner görünüyor mu?

---

## Sık Karşılaşılan Hatalar

| Hata | Sebep | Çözüm |
|---|---|---|
| `Missing the key Id in the item` | DynamoDB partition key büyük "I" ile `Id`, kodda küçük `id` var | Lambda kodunda `Id: { S: id }` olmalı |
| `Can't find required-server-files.json` | Amplify SSR modunda çalışıyor | `amplify.yml` ekle, output dir `out` yap |
| DynamoDB boş görünüyor | Yanlış region'a bakıyorsun | Konsol sağ üstten `eu-central-1` seç |
| Mail gelmiyor | Spam klasörüne düşmüş olabilir | Gmail spam'i kontrol et |
| CORS hatası | `ALLOWED_ORIGIN` yanlış | Lambda env variable'ı güncelle, redeploy |

---

## Maliyet Tahmini

| Servis | Aylık |
|---|---|
| Lambda | $0 (free tier) |
| DynamoDB | $0 (free tier) |
| SES | ~$0.01 |
| Amplify Hosting | $0 (free tier) |
| Route53 | $0.50 |
| **Toplam** | **~$0.50–2** |
