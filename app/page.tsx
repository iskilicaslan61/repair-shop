import ContactForm from "@/components/ContactForm";
import { SITE_NAME, SITE_PHONE, SITE_EMAIL, SITE_ADDRESS } from "@/lib/constants";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">

      {/* Header */}
      <header className="bg-blue-950 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center text-blue-950 font-black text-sm">R</div>
            <h1 className="text-lg font-bold tracking-wide">{SITE_NAME}</h1>
          </div>
          <nav className="flex gap-8 text-sm font-medium">
            <a href="#services" className="text-blue-300 hover:text-white transition-colors">Leistungen</a>
            <a href="#contact" className="bg-blue-500 hover:bg-blue-400 px-4 py-1.5 rounded-full transition-colors">Kontakt</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-800 to-blue-950 text-white py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-block bg-blue-500/30 text-blue-200 text-sm font-medium px-4 py-1 rounded-full mb-6">
            Professioneller Reparaturservice
          </span>
          <h2 className="text-5xl font-extrabold mb-5 leading-tight">
            Schnell.<br className="sm:hidden" /> Zuverlässig.<br className="sm:hidden" /> Günstig.
          </h2>
          <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
            Professionelle Reparatur für Smartphones, Tablets und Laptops.
            Meist am gleichen Tag fertig.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="bg-white text-blue-900 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors shadow-lg">
              Jetzt anfragen
            </a>
            <a href="#services" className="border border-blue-300 text-white font-medium px-8 py-3 rounded-full hover:bg-blue-800/50 transition-colors">
              Unsere Leistungen
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-900 text-white py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { value: "500+", label: "Reparaturen" },
            { value: "24h", label: "Schnellservice" },
            { value: "100%", label: "Zufriedenheit" },
          ].map(s => (
            <div key={s.label}>
              <p className="text-2xl font-extrabold text-blue-300">{s.value}</p>
              <p className="text-sm text-blue-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-6 bg-blue-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-blue-500 font-medium mb-2 text-sm uppercase tracking-widest">Was wir anbieten</p>
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-950">Unsere Leistungen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "📱", title: "Smartphone Reparatur", desc: "Display, Akku, Kamera — wir reparieren alle Marken schnell und günstig." },
              { icon: "💻", title: "Tablet Service", desc: "iPad, Samsung, Huawei — schnelle Diagnose und professionelle Reparatur." },
              { icon: "🖥️", title: "Laptop Reparatur", desc: "Hardware, Software, Datensicherung — alles aus einer Hand." },
            ].map(s => (
              <div key={s.title} className="bg-white rounded-2xl p-8 shadow-sm border border-blue-100 hover:shadow-md hover:border-blue-300 transition-all">
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-bold text-blue-900 mb-3 text-lg">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-blue-500 font-medium mb-2 text-sm uppercase tracking-widest">Schreiben Sie uns</p>
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-950">Kontakt aufnehmen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

            {/* Info */}
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-4">Kontaktdaten</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-500 mt-0.5">📍</span>
                    <span>{SITE_ADDRESS}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-500">📞</span>
                    <a href={`tel:${SITE_PHONE}`} className="text-blue-600 hover:underline">{SITE_PHONE}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-500">✉️</span>
                    <a href={`mailto:${SITE_EMAIL}`} className="text-blue-600 hover:underline">{SITE_EMAIL}</a>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-4">Öffnungszeiten</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Montag – Freitag</span>
                    <span className="font-medium text-blue-800">09:00 – 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samstag</span>
                    <span className="font-medium text-blue-800">10:00 – 15:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sonntag</span>
                    <span className="text-gray-400">Geschlossen</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-6">Nachricht senden</h3>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-blue-300 py-8 px-6 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
          <p className="text-blue-400">© {new Date().getFullYear()} {SITE_NAME} — Alle Rechte vorbehalten</p>
          <div className="flex gap-6">
            <a href="/impressum/" className="hover:text-white transition-colors">Impressum</a>
            <a href="/datenschutz/" className="hover:text-white transition-colors">Datenschutz</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
