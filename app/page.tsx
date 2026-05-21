import Countdown from "@/components/Countdown";
import RSVPForm from "@/components/RSVPForm";

const BOKEH = [
  { w: 320, h: 320, top: "10%",  left: "5%",   delay: "0s",    dur: "18s" },
  { w: 240, h: 240, top: "60%",  left: "80%",  delay: "3s",    dur: "22s" },
  { w: 180, h: 180, top: "30%",  left: "70%",  delay: "6s",    dur: "15s" },
  { w: 280, h: 280, top: "75%",  left: "15%",  delay: "1.5s",  dur: "20s" },
  { w: 150, h: 150, top: "5%",   left: "55%",  delay: "9s",    dur: "25s" },
];

const STARS = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  size: (((i * 17 + 3) % 20) / 10 + 0.5),
  top:  ((i * 137.5) % 100),
  left: ((i * 97.3)  % 100),
  opacity: ((i * 53)  % 60) / 100 + 0.1,
  dur:  ((i * 31)    % 30) / 10 + 2,
  delay: ((i * 41)   % 40) / 10,
}));

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: "#07111f", color: "#fff" }}>

      {/* ── Stars ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {STARS.map(s => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              width: `${s.size}px`,
              height: `${s.size}px`,
              top: `${s.top}%`,
              left: `${s.left}%`,
              opacity: s.opacity,
              animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Bokeh blobs ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {BOKEH.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: b.w,
              height: b.h,
              top: b.top,
              left: b.left,
              background: "radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)",
              animation: `bokeh ${b.dur} ease-in-out ${b.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">

        {/* Outer decorative rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="rounded-full border"
            style={{
              width: 640, height: 640,
              borderColor: "rgba(212,175,55,0.08)",
              animation: "spin 24s linear infinite",
            }}
          />
          <div
            className="absolute rounded-full border"
            style={{
              width: 440, height: 440,
              borderColor: "rgba(212,175,55,0.05)",
              animation: "spin 18s linear infinite reverse",
            }}
          />
        </div>

        {/* Floating cake */}
        <div className="animate-float mb-6">
          <span
            className="text-7xl"
            style={{
              filter: "drop-shadow(0 0 24px rgba(212,175,55,0.5))",
            }}
          >🎂</span>
        </div>

        {/* Eyebrow */}
        <p
          className="uppercase tracking-[0.35em] text-xs font-semibold mb-5 animate-fadeInUp"
          style={{ color: "#d4af37" }}
        >
          Private Geburtstagsparty &nbsp;·&nbsp; 7. Juni 2026
        </p>

        {/* Main title */}
        <h1
          className="font-extrabold leading-none mb-4 animate-fadeInUp delay-100"
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "clamp(3rem, 10vw, 6.5rem)",
          }}
        >
          <span className="gold-text">Muaz</span>
          <span style={{ color: "rgba(255,255,255,0.25)" }}> & </span>
          <span className="gold-text">Mikail</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg sm:text-2xl mb-2 animate-fadeInUp delay-200"
          style={{ color: "#93c5fd" }}
        >
          werden{" "}
          <span style={{ color: "#f5e642", fontWeight: 700 }}>4</span>
          {" "}& {" "}
          <span style={{ color: "#f5e642", fontWeight: 700 }}>7</span>
          {" "}Jahre alt!
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8 animate-fadeInUp delay-300">
          <div className="h-px w-20" style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.5))" }} />
          <span style={{ color: "rgba(212,175,55,0.7)", fontSize: 20 }}>✦</span>
          <div className="h-px w-20" style={{ background: "linear-gradient(to left, transparent, rgba(212,175,55,0.5))" }} />
        </div>

        {/* Event meta pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-10 animate-fadeInUp delay-400">
          {[
            { icon: "📅", text: "Samstag, 7. Juni 2026" },
            { icon: "🕒", text: "Ab 15:00 Uhr" },
            { icon: "🏠", text: "Bei uns Zuhause" },
          ].map(item => (
            <div
              key={item.text}
              className="glass flex items-center gap-2 px-5 py-2 rounded-full text-sm"
              style={{ color: "#bfdbfe" }}
            >
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Countdown */}
        <div className="mb-10 w-full max-w-md animate-fadeInUp delay-500">
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "rgba(147,197,253,0.7)" }}>
            Noch bis zur Party
          </p>
          <Countdown />
        </div>

        {/* CTA */}
        <a
          href="#rsvp"
          className="btn-gold inline-block px-12 py-4 rounded-full text-lg animate-fadeInUp delay-600"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Jetzt anmelden ✨
        </a>
      </section>

      {/* ══════════════════════════════════════════
          DETAILS
      ══════════════════════════════════════════ */}
      <section
        className="relative z-10 py-24 px-6"
        style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
      >
        <div className="max-w-4xl mx-auto text-center">

          <p className="uppercase tracking-widest text-xs font-semibold mb-2" style={{ color: "#d4af37" }}>
            Was euch erwartet
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-14"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Ein unvergesslicher Nachmittag
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "🎮", title: "Spiele & Spaß",        desc: "Actionreiche Spiele und Aktivitäten, die die Kinder begeistern werden." },
              { icon: "🎁", title: "Überraschungen",        desc: "Besondere Überraschungen und magische Momente für die Geburtstagskinder." },
              { icon: "🍰", title: "Kuchen & Leckereien",   desc: "Eine wunderschöne Geburtstagstorte und viele süße Köstlichkeiten." },
            ].map(card => (
              <div
                key={card.title}
                className="glass glass-hover rounded-2xl p-8 text-left"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-5"
                  style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}
                >
                  {card.icon}
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: "#d4af37", fontFamily: "var(--font-playfair), serif" }}>
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#93c5fd" }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          RSVP
      ══════════════════════════════════════════ */}
      <section
        id="rsvp"
        className="relative z-10 py-24 px-6"
        style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
      >
        <div className="max-w-lg mx-auto">

          <div className="text-center mb-10">
            <p className="uppercase tracking-widest text-xs font-semibold mb-2" style={{ color: "#d4af37" }}>
              Anmeldung
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-3"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Bist du dabei?
            </h2>
            <p className="text-sm" style={{ color: "#60a5fa" }}>
              Bitte bis zum{" "}
              <span style={{ color: "#d4af37", fontWeight: 600 }}>31. Mai 2026</span>
              {" "}anmelden.
            </p>
          </div>

          <div className="glass rounded-3xl p-8 sm:p-10">
            <RSVPForm />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER CTA
      ══════════════════════════════════════════ */}
      <section
        className="relative z-10 py-20 px-6 text-center"
        style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
      >
        <div className="max-w-xl mx-auto">
          <div className="animate-float inline-block mb-6 text-5xl">🎉</div>
          <h3
            className="text-2xl sm:text-3xl font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            <span className="gold-text">Wir freuen uns auf euch!</span>
          </h3>
          <p className="text-sm mb-8" style={{ color: "#60a5fa" }}>
            Es wird ein Nachmittag voller Freude, Lachen und unvergesslicher Momente.
          </p>
          <a href="#rsvp" className="btn-gold inline-block px-10 py-3 rounded-full">
            Zur Anmeldung ↑
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="relative z-10 py-8 px-6 text-center text-xs"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", color: "#3b82f6" }}
      >
        <p>
          &copy; 2026 Familie Kılıçaslan &nbsp;·&nbsp;
          <a href="/datenschutz/" className="hover:underline" style={{ color: "rgba(212,175,55,0.7)" }}>Datenschutz</a>
          &nbsp;·&nbsp;
          <a href="/impressum/"   className="hover:underline" style={{ color: "rgba(212,175,55,0.7)" }}>Impressum</a>
        </p>
      </footer>

    </main>
  );
}
