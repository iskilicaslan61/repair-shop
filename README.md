# Repair Shop — AWS Serverless Contact Form

Next.js static site + AWS Lambda + SES + DynamoDB ile kurulmuş, GDPR/DSGVO uyumlu iletişim formu altyapısı.

**Canlı site:** https://form.ismailkilicaslan.de

---

## Stack

| Katman | Servis | Açıklama |
|---|---|---|
| Frontend | Next.js 16 (Static Export) | SSG ile hızlı, SEO-dostu |
| Hosting | AWS Amplify | Manuel deploy (drag & drop) |
| Backend | AWS Lambda (Function URL) | API Gateway olmadan doğrudan URL |
| E-posta | AWS SES | Form bildirimleri |
| Veritabanı | AWS DynamoDB | Form kayıtları, 90 gün TTL |
| DNS | AWS Route53 | Domain yönetimi |

**Tahmini aylık maliyet:** ~$0.50–2

---

## Proje Yapısı

```
repair-shop/
├── app/
│   ├── layout.tsx           # Root layout + CookieBanner
│   ├── page.tsx             # Ana sayfa (Hero, Hizmetler, Form)
│   ├── impressum/page.tsx   # Yasal zorunlu impressum sayfası
│   └── datenschutz/page.tsx # GDPR gizlilik politikası
├── components/
│   ├── ContactForm.tsx      # Form + Lambda entegrasyonu
│   └── CookieBanner.tsx     # GDPR cookie onayı
├── lib/
│   └── constants.ts         # Site bilgileri ve Lambda URL
├── amplify.yml              # Amplify build config
├── next.config.ts           # Static export ayarları
└── .env.local               # Lambda URL (git'e gitmez!)
```

---

## Ön Koşullar

- AWS hesabı
- Node.js 22+
- Domain (Route53'te kayıtlı)
- **Proje klasör yolu ASCII karakterler içermeli** — `ü`, `ö`, `ş` gibi Türkçe karakterler Turbopack'i çökertiyor. Doğru: `C:\projects\repair-shop`

---

## Adım 1 — AWS Region Seç

```
AWS Console → Sağ üst köşe → Europe (Frankfurt) eu-central-1
```

> Tüm servisleri bu region'da kur. GDPR için veriler Almanya'da kalır.

---

## Adım 2 — SES Kurulumu

### E-posta Adresini Doğrula

```
SES → Verified Identities → Create Identity
Identity type: Email address
Email: info@siteadi.de
```

Gelen doğrulama mailine tıkla → status `Verified` olacak.

### Domain Doğrula

```
SES → Verified Identities → Create Identity
Identity type: Domain
Domain: siteadi.de

DKIM settings:
  - Easy DKIM
  - RSA_2048_BIT
  - "Publish DNS records automatically" ✓  ← Route53 aynı hesaptaysa otomatik ekler
```

### Production Access Talep Et (İsteğe Bağlı)

Sandbox modda sadece doğrulanmış adreslere mail gönderilebilir.
Müşterilere onay maili göndermek istersen:

```
SES → Account Dashboard → Request Production Access
Mail type: Transactional
Use case: Contact form notifications for repair shop website
```

> 1–2 iş günü onay süresi. Şimdilik sandbox yeterli — sadece doğrulanmış e-postalara gönderim yapar.

---

## Adım 3 — DynamoDB Tablosu

```
AWS Console → DynamoDB → Create Table

Table name:    contact-form-submissions
Partition key: Id    Type: String
```

> **Dikkat:** Partition key büyük "I" ile `Id` olmalı. Küçük `id` yazarsan Lambda "Missing the key Id" hatası verir.

### TTL Ayarı (GDPR — 90 gün otomatik silme)

```
DynamoDB → Tables → contact-form-submissions
→ Additional settings → Time to Live → Turn on
TTL attribute name: expiresAt
```

Lambda her kayıt eklerken `expiresAt` değerini otomatik hesaplar (şimdiki zaman + 90 gün).

---

## Adım 4 — Lambda Fonksiyonu

### Oluştur

```
AWS Console → Lambda → Create Function

Function name: contact-form-handler
Runtime:       Node.js 22.x
Architecture:  arm64
```

### Kodu Ekle

`index.mjs` dosyasının içini tamamen sil, şunu yapıştır ve **Deploy** bas:

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

### Environment Variables

```
Lambda → Configuration → Environment variables → Edit → Add

DYNAMODB_TABLE    contact-form-submissions
SES_FROM_EMAIL    info@siteadi.de
SES_TO_EMAIL      info@siteadi.de
ALLOWED_ORIGIN    https://form.siteadi.de
```

### IAM İzinleri

```
Lambda → Configuration → Permissions → Role name → IAM Console
→ Add permissions → Create inline policy → JSON sekmesi
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

### Function URL Aktif Et

```
Lambda → Configuration → Function URL → Create function URL
Auth type: NONE
```

Oluşan URL'yi `.env.local` dosyasına ekle.

### Lambda Test Et

```bash
curl -X POST "https://XXXXXXXX.lambda-url.eu-central-1.on.aws/" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@gmail.com","message":"Test","consent":true}'
```

Beklenen yanıt: `{"success":true,"id":"..."}`

Ardından kontrol et:
- **DynamoDB → Explore items** — kayıt var mı? (`eu-central-1` region'ında bak!)
- **Gmail** — "Neue Anfrage von Test" maili geldi mi? (Spam klasörünü de kontrol et)

---

## Adım 5 — Next.js Projesi

### Oluştur

```bash
npx create-next-app@latest repair-shop --typescript --tailwind --app --no-src-dir
cd repair-shop
```

### `.env.local`

```env
NEXT_PUBLIC_LAMBDA_URL=https://XXXXXXXX.lambda-url.eu-central-1.on.aws/
```

> Bu dosya `.gitignore`'da — GitHub'a push etme!

### `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
```

### `lib/constants.ts`

```typescript
export const LAMBDA_URL = process.env.NEXT_PUBLIC_LAMBDA_URL!;
export const SITE_NAME = "Repair Shop";
export const SITE_EMAIL = "info@siteadi.de";
export const SITE_PHONE = "+49 30 123456";
export const SITE_ADDRESS = "Musterstraße 1, 10115 Berlin";
```

### `amplify.yml` (proje kökünde olmalı)

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

### Local Build

```bash
npm run build
# out/ klasörü oluşmalı
```

> **Önemli:** Klasör yolunda Türkçe/Unicode karakter varsa (`ü`, `ö` vb.) Turbopack crash yapar. Projeyi ASCII yola koy: `C:\projects\repair-shop`

---

## Adım 6 — Amplify Deploy

### Manuel Deploy (Önerilen)

```powershell
# out klasörünü ZIP'le
Compress-Archive -Path ".\out\*" -DestinationPath ".\out.zip" -Force
```

```
AWS Console → Amplify → Create new app
→ Deploy without Git provider
→ out.zip dosyasını drag & drop ile yükle
```

> **Neden manuel?** Amplify, GitHub entegrasyonunda Next.js'i SSR olarak algılar ve `required-server-files.json` hatası verir. Manuel deploy bu sorunu tamamen atlatır.

### GitHub Otomatik Deploy (İsteğe Bağlı)

GitHub entegrasyonu kullanmak istersen:

```
Amplify → Create new app → GitHub
→ Repo: repair-shop, Branch: main
→ Build output directory: out   ← .next değil!
→ Environment variables: NEXT_PUBLIC_LAMBDA_URL ekle
→ Save and deploy
```

`amplify.yml` dosyası repoda olduğu sürece Amplify bunu otomatik algılar.

---

## Adım 7 — Custom Domain Bağla

```
Amplify → repair-shop → Custom domains → Add domain
Domain: siteadi.de
Subdomain prefix: form
```

Route53 aynı AWS hesabındaysa DNS kayıtları otomatik eklenir.
SSL sertifikası 5–10 dakikada hazır olur.

---

## Adım 8 — Lambda CORS Güncelle

Domain bağlandıktan sonra Lambda'daki `ALLOWED_ORIGIN` değerini güncelle:

```
Lambda → contact-form-handler → Configuration → Environment variables → Edit

ALLOWED_ORIGIN: https://form.siteadi.de
```

---

## Adım 9 — Test Checklist

- [ ] Lambda URL'ye direkt curl POST → `{"success":true}` dönmeli
- [ ] DynamoDB'de kayıt var mı? (`eu-central-1` region'ında bak!)
- [ ] Mail geldi mi? (Spam klasörünü de kontrol et)
- [ ] Canlı sitede formu doldur ve gönder
- [ ] Consent checkbox olmadan gönderim engelleniyor mu?
- [ ] `/impressum/` sayfası açılıyor mu?
- [ ] `/datenschutz/` sayfası açılıyor mu?
- [ ] Cookie banner görünüyor mu?

---

## Sık Karşılaşılan Hatalar

| Hata | Sebep | Çözüm |
|---|---|---|
| `Missing the key Id in the item` | Lambda'da `id` (küçük), DynamoDB'de `Id` (büyük) | Lambda kodunda `Id: { S: id }` olmalı |
| `Can't find required-server-files.json` | Amplify SSR modunda çalışıyor | Manuel deploy kullan (drag & drop) |
| DynamoDB tablosu boş görünüyor | Yanlış region'a bakılıyor | Konsol sağ üstten `eu-central-1` seç |
| Mail gelmiyor | Spam'e düşmüş veya SES sandbox | Gmail spam kontrol et, sandbox'ta sadece doğrulanmış adrese gönderilir |
| CORS hatası | `ALLOWED_ORIGIN` yanlış domain | Lambda env variable güncelle |
| Turbopack panic / char boundary | Klasör yolunda Unicode karakter var | Projeyi ASCII yola taşı |

---

## GDPR / DSGVO

- Form verileri **eu-central-1 (Frankfurt)** DynamoDB'de saklanır — veri AB'de kalır
- IP adresi ham değil **SHA-256 hash** olarak kaydedilir
- Tüm kayıtlar **90 gün** sonra DynamoDB TTL ile otomatik silinir
- Consent checkbox olmadan form gönderilemez
- `/datenschutz/` — veri işleme politikası
- `/impressum/` — Almanya'da yasal zorunluluk

---

## Maliyet Tahmini

| Servis | Aylık |
|---|---|
| Lambda | $0 (free tier) |
| DynamoDB | $0 (free tier) |
| SES | ~$0.01 |
| Amplify Hosting | $0 (free tier) |
| Route53 | $0.50/hosted zone |
| **Toplam** | **~$0.50–2** |
