import { SITE_NAME, SITE_ADDRESS, SITE_PHONE, SITE_EMAIL } from "@/lib/constants";

export default function Impressum() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-8 text-blue-800">Impressum</h1>
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="font-semibold text-gray-900 mb-1">Angaben gemäß § 5 TMG</h2>
          <p>{SITE_NAME}</p>
          <p>{SITE_ADDRESS}</p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-900 mb-1">Kontakt</h2>
          <p>Telefon: {SITE_PHONE}</p>
          <p>E-Mail: {SITE_EMAIL}</p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-900 mb-1">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p>İsmail Kılıçaslan</p>
          <p>{SITE_ADDRESS}</p>
        </section>
      </div>
      <a href="/" className="inline-block mt-8 text-blue-600 hover:underline">← Zurück zur Startseite</a>
    </main>
  );
}
