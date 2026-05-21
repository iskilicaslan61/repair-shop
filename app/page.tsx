import ContactForm from "@/components/ContactForm";
import { SITE_NAME, SITE_PHONE, SITE_EMAIL, SITE_ADDRESS } from "@/lib/constants";

export default function Home() {
  return (
    <main className="flex flex-col">
      {/* Header */}
      <header className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">{SITE_NAME}</h1>
          <nav className="flex gap-6 text-sm">
            <a href="#services" className="hover:text-blue-200 transition-colors">Leistungen</a>
            <a href="#contact" className="hover:text-blue-200 transition-colors">Kontakt</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Schnell. Zuverlässig. Günstig.</h2>
          <p className="text-blue-100 text-lg mb-8">
            Professionelle Reparatur für Smartphones, Tablets und Laptops.
            Meist am gleichen Tag fertig.
          </p>
          <a
            href="#contact"
            className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Jetzt anfragen
          </a>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10 text-blue-800">Unsere Leistungen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Smartphone Reparatur", desc: "Display, Akku, Kamera — wir reparieren alle Marken." },
              { title: "Tablet Service", desc: "iPad, Samsung, Huawei — schnelle Diagnose und Reparatur." },
              { title: "Laptop Reparatur", desc: "Hardware, Software, Datensicherung — alles aus einer Hand." },
            ].map(s => (
              <div key={s.title} className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <h3 className="font-semibold text-blue-700 mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2 text-blue-800">Kontakt</h2>
          <p className="text-center text-gray-500 mb-10">Schreiben Sie uns — wir antworten innerhalb von 24 Stunden.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4 text-gray-600">
              <div>
                <p className="font-semibold text-gray-800">Adresse</p>
                <p>{SITE_ADDRESS}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Telefon</p>
                <a href={`tel:${SITE_PHONE}`} className="text-blue-600 hover:underline">{SITE_PHONE}</a>
              </div>
              <div>
                <p className="font-semibold text-gray-800">E-Mail</p>
                <a href={`mailto:${SITE_EMAIL}`} className="text-blue-600 hover:underline">{SITE_EMAIL}</a>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Öffnungszeiten</p>
                <p>Mo–Fr: 09:00–18:00</p>
                <p>Sa: 10:00–15:00</p>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-blue-200 py-6 px-6 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
          <p>© {new Date().getFullYear()} {SITE_NAME}</p>
          <div className="flex gap-4">
            <a href="/impressum/" className="hover:text-white transition-colors">Impressum</a>
            <a href="/datenschutz/" className="hover:text-white transition-colors">Datenschutz</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
