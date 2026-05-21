# Muaz & Mikail — Geburtstagsparty Einladung

Next.js static site + AWS Lambda + SES + DynamoDB ile kurulmuş, GDPR/DSGVO uyumlu doğum günü partisi davetiye sitesi.

**Canlı site:** https://party.ismailkilicaslan.de  
**Party tarihi:** 7. Juni 2026, 15:00 Uhr

---

## Stack

| Katman | Servis | Açıklama |
|---|---|---|
| Frontend | Next.js 16 (Static Export) | Fredoka font, playful tasarım |
| Hosting | AWS Amplify + GitHub Actions | Push → otomatik deploy |
| Backend | AWS Lambda (Function URL) | RSVP kayıt + misafir sayacı |
| E-posta | AWS SES | HTML formatlı RSVP bildirimi |
| Veritabanı | AWS DynamoDB | Şifreli RSVP kayıtları, 90 gün TTL |
| DNS | AWS Route53 | Domain yönetimi |

**Tahmini aylık maliyet:** ~$0.50–2

---

## Proje Yapısı

```
repair-shop/
├── app/
│   ├── layout.tsx              # Fredoka font + OG meta tags
│   ├── page.tsx                # Ana sayfa (Hero, Details, RSVP, Footer)
│   ├── globals.css             # Renk değişkenleri + animasyonlar
│   ├── impressum/page.tsx      # Yasal zorunlu impressum
│   └── datenschutz/page.tsx    # GDPR gizlilik politikası
├── components/
│   ├── RSVPForm.tsx            # RSVP formu + Lambda entegrasyonu
│   ├── Countdown.tsx           # Geri sayım (7 Haziran 2026)
│   ├── GuestCounter.tsx        # Canlı katılımcı sayacı
│   ├── Confetti.tsx            # Sayfa açılışında konfeti
│   ├── Reveal.tsx              # Scroll reveal animasyonu
│   ├── ScrollToTop.tsx         # Sol alt scroll-up butonu
│   └── CookieBanner.tsx        # GDPR cookie onayı
├── lambda/
│   └── index.mjs               # Lambda kaynak kodu (AWS Console'a manuel deploy)
├── lib/
│   └── constants.ts            # Lambda URL sabiti
├── public/
│   └── og-image.svg            # WhatsApp/sosyal medya önizleme görseli
└── .github/
    └── workflows/deploy.yml    # GitHub Actions → Amplify otomatik deploy
```

---

## Lambda Özellikleri

### GET `/`
DynamoDB'deki `attending: true` kayıtların `guests_count` değerlerini toplar.

```json
{ "count": 12 }
```

### POST `/`
RSVP formunu kaydeder ve HTML formatlı e-posta gönderir.

**Request body:**
```json
{
  "name": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "phone": "+49 176 123456",
  "message": "✅ Kommt! Personenanzahl: 3",
  "consent": true,
  "attending": true,
  "guests_count": 3
}
```

**DynamoDB'ye kaydedilen alanlar:**

| Alan | Tür | Açıklama |
|---|---|---|
| `Id` | String | UUID (partition key) |
| `name` | String | **AES-256-GCM şifreli** |
| `email` | String | **AES-256-GCM şifreli** |
| `phone` | String | **AES-256-GCM şifreli** |
| `message` | String | **AES-256-GCM şifreli** |
| `attending` | Boolean | Şifresiz — sayaç filtresi için |
| `guests_count` | Number | Şifresiz — toplam kişi sayısı için |
| `ip_hash` | String | SHA-256 hash (ham IP kaydedilmez) |
| `timestamp` | String | ISO 8601 |
| `expiresAt` | Number | Unix timestamp (şimdi + 90 gün) |
| `consent` | Boolean | GDPR onayı |

---

## AWS Kurulum Adımları

### 1. Region Seç

```
AWS Console → Europe (Frankfurt) eu-central-1
```

### 2. SES — Domain Doğrula

```
SES → Verified Identities → Create Identity
Identity type: Domain
Domain: ismailkilicaslan.de

DKIM settings: Easy DKIM, RSA_2048_BIT
"Publish DNS records automatically" ✓
```

### 3. DynamoDB Tablosu

```
DynamoDB → Create Table
Table name:    contact-form-submissions
Partition key: Id    Type: String
```

**TTL Ayarı:**
```
DynamoDB → Tables → contact-form-submissions
→ Additional settings → Time to Live → Turn on
TTL attribute name: expiresAt
```

### 4. Lambda Fonksiyonu

```
Lambda → Create Function
Function name: contact-form-handler
Runtime:       Node.js 22.x
Architecture:  arm64
```

**Kodu ekle:** `lambda/index.mjs` içeriğini yapıştır → **Deploy**

**Environment Variables:**
```
DYNAMODB_TABLE    contact-form-submissions
SES_FROM_EMAIL    noreply@ismailkilicaslan.de
SES_TO_EMAIL      ismailkilicaslan61@gmail.com
ALLOWED_ORIGIN    https://party.ismailkilicaslan.de
ENCRYPTION_KEY    <32-byte hex — node -e "require('crypto').randomBytes(32).toString('hex')" ile üret>
```

**IAM Inline Policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["dynamodb:PutItem", "dynamodb:Scan"],
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

**Function URL:**
```
Lambda → Configuration → Function URL → Create function URL
Auth type: NONE
CORS: Allowed origins → https://party.ismailkilicaslan.de
```

### 5. Next.js — `.env.local`

```env
NEXT_PUBLIC_LAMBDA_URL=https://XXXXXXXX.lambda-url.eu-central-1.on.aws/
```

### 6. GitHub Actions Deploy

`.github/workflows/deploy.yml` GitHub Actions ile her push'ta otomatik build + Amplify deploy yapar.

**Gerekli GitHub Secrets:**
```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AMPLIFY_APP_ID
NEXT_PUBLIC_LAMBDA_URL
```

### 7. Custom Domain

```
Amplify → repair-shop → Custom domains → Add domain
Domain: ismailkilicaslan.de
Subdomain prefix: party
```

---

## Test

```bash
# Misafir sayacı
curl https://XXXXXXXX.lambda-url.eu-central-1.on.aws/

# RSVP gönder
curl -X POST https://XXXXXXXX.lambda-url.eu-central-1.on.aws/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"","message":"Kommt! Personenanzahl: 2","consent":true,"attending":true,"guests_count":2}'
```

**Checklist:**
- [ ] GET → `{"count": N}` dönüyor
- [ ] POST → `{"success":true}` dönüyor
- [ ] DynamoDB'de kayıt var, alanlar şifreli
- [ ] HTML formatlı e-posta geliyor (spam'e düşmüyor)
- [ ] Canlı sitede RSVP formu çalışıyor
- [ ] Misafir sayacı artıyor
- [ ] `/impressum/` ve `/datenschutz/` sayfaları açılıyor

---

## Sık Karşılaşılan Hatalar

| Hata | Sebep | Çözüm |
|---|---|---|
| `Missing the key Id` | Lambda'da `id` küçük harf | `Id: { S: id }` olmalı |
| `not authorized to perform: dynamodb:Scan` | IAM'da Scan izni yok | Inline policy'ye `dynamodb:Scan` ekle |
| CORS hatası | `ALLOWED_ORIGIN` yanlış | Lambda env var + Function URL CORS güncelle |
| Mail spam'e düşüyor | Gmail adresiyle SES gönderimi | `noreply@ismailkilicaslan.de` kullan |
| `Can't find required-server-files.json` | Amplify SSR modu | GitHub Actions deploy kullan |
| Turbopack crash | Klasör yolunda `ü`, `ö` gibi Unicode | Projeyi ASCII yola taşı |

---

## GDPR / DSGVO

- Veriler **eu-central-1 (Frankfurt)** — AB sınırları içinde
- IP adresi **SHA-256 hash** olarak kaydedilir, ham IP saklanmaz
- Kişisel veriler (isim, e-posta, telefon, mesaj) **AES-256-GCM** ile şifrelenir
- Tüm kayıtlar **90 gün** sonra DynamoDB TTL ile otomatik silinir
- Consent checkbox olmadan form gönderilemez
- `/datenschutz/` ve `/impressum/` sayfaları mevcut
