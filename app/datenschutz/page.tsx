import { SITE_NAME, SITE_EMAIL } from "@/lib/constants";

export default function Datenschutz() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-8 text-blue-800">Datenschutzerklärung</h1>
      <div className="space-y-8 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="font-semibold text-gray-900 mb-2">1. Verantwortlicher</h2>
          <p>{SITE_NAME}, Kontakt: {SITE_EMAIL}</p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-900 mb-2">2. Erhobene Daten</h2>
          <p>Über das Kontaktformular erheben wir folgende Daten: Name, E-Mail-Adresse, Telefonnummer (freiwillig), Nachricht sowie einen anonymisierten IP-Hash (SHA-256).</p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-900 mb-2">3. Zweck und Rechtsgrundlage</h2>
          <p>Die Daten werden ausschließlich zur Bearbeitung Ihrer Anfrage verwendet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen).</p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-900 mb-2">4. Speicherdauer</h2>
          <p>Ihre Daten werden nach 90 Tagen automatisch gelöscht.</p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-900 mb-2">5. Speicherort</h2>
          <p>Die Daten werden in einer AWS DynamoDB Datenbank in der Region eu-central-1 (Frankfurt, Deutschland) gespeichert. E-Mails werden über AWS SES (Frankfurt) versendet.</p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-900 mb-2">6. Ihre Rechte</h2>
          <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung sowie Widerspruch. Wenden Sie sich dazu an: {SITE_EMAIL}</p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-900 mb-2">7. Cookies</h2>
          <p>Diese Website verwendet ausschließlich technisch notwendige Cookies zur Speicherung Ihrer Cookie-Einwilligung (localStorage). Es werden keine Tracking- oder Analyse-Cookies eingesetzt.</p>
        </section>
      </div>
      <a href="/" className="inline-block mt-8 text-blue-600 hover:underline">← Zurück zur Startseite</a>
    </main>
  );
}
