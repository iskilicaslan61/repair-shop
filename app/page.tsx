import Countdown from "@/components/Countdown";
import RSVPForm from "@/components/RSVPForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-blue-950 text-white overflow-x-hidden">

      {/* Stars background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2.5 + 0.5}px`,
              height: `${Math.random() * 2.5 + 0.5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.1,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.3); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .gold-shimmer {
          background: linear-gradient(90deg, #d4af37, #f5e642, #d4af37, #f5e642);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .float { animation: float 4s ease-in-out infinite; }
      `}</style>

      {/* Hero */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">

        {/* Decorative ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-amber-400/10 animate-[spin_20s_linear_infinite]" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-amber-400/5 animate-[spin_15s_linear_infinite_reverse]" />
        </div>

        <div className="float">
          <p className="text-6xl mb-4">🎂</p>
        </div>

        <p className="text-amber-400 uppercase tracking-[0.3em] text-sm font-medium mb-4">
          Private Geburtstagsparty
        </p>

        <h1 className="text-5xl sm:text-7xl font-extrabold mb-2 leading-tight">
          <span className="gold-shimmer">Muaz & Mikail</span>
        </h1>

        <p className="text-blue-300 text-xl sm:text-2xl mb-2">
          werden <span className="text-amber-400 font-bold">4</span> & <span className="text-amber-400 font-bold">7</span> Jahre alt!
        </p>

        <div className="flex items-center gap-3 my-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400/50" />
          <span className="text-amber-400/60 text-lg">✦</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400/50" />
        </div>

        {/* Event details */}
        <div className="flex flex-col sm:flex-row gap-6 mb-10 text-blue-200">
          <div className="flex items-center gap-2">
            <span className="text-amber-400">📅</span>
            <span>7. Juni 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400">🕒</span>
            <span>15:00 Uhr</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400">🏠</span>
            <span>Bei uns Zuhause</span>
          </div>
        </div>

        {/* Countdown */}
        <div className="mb-10 w-full max-w-md">
          <p className="text-blue-400 text-xs uppercase tracking-widest mb-4">Noch bis zur Party</p>
          <Countdown />
        </div>

        <a
          href="#rsvp"
          className="bg-gradient-to-r from-amber-400 to-yellow-300 text-blue-950 font-bold px-10 py-4 rounded-full hover:from-amber-300 hover:to-yellow-200 transition-all shadow-xl shadow-amber-400/20 text-lg"
        >
          Jetzt anmelden ✨
        </a>
      </section>

      {/* Details section */}
      <section className="relative z-10 py-20 px-6 border-t border-blue-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber-400 uppercase tracking-widest text-sm mb-2">Details</p>
          <h2 className="text-3xl font-bold mb-12">Was erwartet euch?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "🎮", title: "Spiele & Spaß", desc: "Tolle Spiele und Aktivitäten für die Kinder" },
              { icon: "🎁", title: "Überraschungen", desc: "Besondere Überraschungen für die Geburtstagskinder" },
              { icon: "🍰", title: "Kuchen & Snacks", desc: "Leckere Geburtstagstorte und viele Snacks" },
            ].map(s => (
              <div key={s.title} className="bg-blue-900/40 border border-amber-400/10 rounded-2xl p-6 hover:border-amber-400/30 transition-colors">
                <p className="text-4xl mb-3">{s.icon}</p>
                <h3 className="font-bold text-amber-400 mb-2">{s.title}</h3>
                <p className="text-blue-300 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="relative z-10 py-20 px-6 border-t border-blue-800/50">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <p className="text-amber-400 uppercase tracking-widest text-sm mb-2">Anmeldung</p>
            <h2 className="text-3xl font-bold mb-3">Bist du dabei?</h2>
            <p className="text-blue-400 text-sm">Bitte bis zum <span className="text-amber-400 font-medium">31. Mai 2026</span> anmelden.</p>
          </div>
          <div className="bg-blue-900/40 border border-amber-400/20 rounded-2xl p-8 backdrop-blur-sm">
            <RSVPForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-blue-800/50 py-8 px-6 text-center">
        <p className="text-4xl mb-3">🎉</p>
        <p className="text-blue-400 text-sm">
          Wir freuen uns auf euch! &nbsp;·&nbsp;
          <a href="/datenschutz/" className="hover:text-amber-400 transition-colors underline">Datenschutz</a>
          &nbsp;·&nbsp;
          <a href="/impressum/" className="hover:text-amber-400 transition-colors underline">Impressum</a>
        </p>
      </footer>

    </main>
  );
}
