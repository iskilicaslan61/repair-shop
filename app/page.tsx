import Countdown from "@/components/Countdown";
import RSVPForm from "@/components/RSVPForm";
import Confetti from "@/components/Confetti";
import ScrollToTop from "@/components/ScrollToTop";
import Reveal from "@/components/Reveal";
import GuestCounter from "@/components/GuestCounter";

const SITE_URL = "https://party.ismailkilicaslan.de";
const WA_TEXT = encodeURIComponent(
  "Du bist eingeladen! 🎂 Muaz & Mikail feiern ihren Geburtstag am 7. Juni 2026! Alle Details: " + SITE_URL
);

const BALLOONS = [
  { color: "#E75C7D", size: 50, left: "5%",  top: "10%", cls: "animate-float" },
  { color: "#C8C72A", size: 40, left: "90%", top: "20%", cls: "animate-float-delayed" },
  { color: "#E75C7D", size: 35, left: "8%",  top: "60%", cls: "animate-float-slow" },
  { color: "#C8C72A", size: 45, left: "85%", top: "70%", cls: "animate-float" },
  { color: "#E75C7D", size: 30, left: "3%",  top: "85%", cls: "animate-float-delayed" },
  { color: "#C8C72A", size: 38, left: "92%", top: "50%", cls: "animate-float-slow" },
];

function Balloon({ color, size, left, top, cls }: typeof BALLOONS[0]) {
  const w = size;
  const h = Math.round(size * 1.35);
  return (
    <div className={`absolute pointer-events-none ${cls}`} style={{ left, top }}>
      <svg width={w} height={h} viewBox="0 0 60 82">
        <ellipse cx="30" cy="35" rx="25" ry="32" fill={color} />
        <ellipse cx="20" cy="20" rx="8" ry="12" fill="rgba(255,255,255,0.3)" />
        <polygon points="30,67 26,80 34,80" fill={color} />
        <line x1="30" y1="80" x2="30" y2="110" stroke="#aaa" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

const ACTIVITIES = [
  { icon: "🎮", title: "Spiele & Spaß",    desc: "Actionreiche Spiele, die die Kinder begeistern!",       border: "#E75C7D" },
  { icon: "🎁", title: "Überraschungen",    desc: "Besondere Momente für die Geburtstagskinder.",           border: "#C8C72A" },
  { icon: "🍰", title: "Riesige Torte",     desc: "Mit 4 & 7 Kerzen – natürlich für beide!",               border: "#E75C7D" },
  { icon: "🎈", title: "Ballonspiele",      desc: "So viel Spaß mit bunten Ballons!",                       border: "#C8C72A" },
  { icon: "🎨", title: "Bastel-Ecke",       desc: "Bastele deine eigene Geburtstagskrone!",                 border: "#E75C7D" },
  { icon: "💃", title: "Musik & Tanz",      desc: "Lieblingslieder und wilde Tanzeinlagen!",                border: "#C8C72A" },
];

const GALLERY = ["🎂","🎁","🎵","🎈","😊","⭐","✨","❤️","🎀","🪄","🍭","🎪"];

export default function Home() {
  return (
    <main style={{ background: "#FBF4E4", color: "#242424", overflowX: "hidden" }}>
      <Confetti />
      <ScrollToTop />

      {/* ── Fixed balloon background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {BALLOONS.map((b, i) => <Balloon key={i} {...b} />)}
      </div>

      {/* ════════════════════════════════════
          HERO
      ════════════════════════════════════ */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">

        <div className="absolute top-16 left-8 md:left-20 animate-spin-slow text-5xl pointer-events-none select-none">⭐</div>
        <div className="absolute bottom-32 right-8 md:right-20 animate-spin-reverse text-4xl pointer-events-none select-none">✨</div>

        {/* Floating icon */}
        <div className="animate-float mb-6">
          <div className="rounded-full p-6 shadow-2xl inline-block" style={{ background: "#E75C7D" }}>
            <span className="text-5xl">🎉</span>
          </div>
        </div>

        {/* Main headline */}
        <h1
          className="font-bold leading-none mb-4"
          style={{ fontSize: "clamp(3rem,12vw,7rem)", textShadow: "5px 5px 0px #C8C72A", color: "#242424" }}
        >
          MUAZ & MIKAIL
        </h1>

        {/* Badge */}
        <div
          className="inline-block px-8 py-3 rounded-full text-2xl md:text-4xl font-bold mb-6"
          style={{ background: "#E75C7D", color: "#fff", transform: "rotate(-2deg)" }}
        >
          4 & 7. GEBURTSTAG 🎂
        </div>

        <p className="text-xl md:text-2xl font-semibold mb-8" style={{ color: "#242424" }}>
          Es ist Zeit zu feiern! 🎈
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <a
            href="#details"
            className="card-lift px-8 py-4 rounded-full font-bold text-lg shadow-lg"
            style={{ background: "#C8C72A", color: "#242424" }}
          >
            Details ansehen
          </a>
          <a
            href="#rsvp"
            className="card-lift px-8 py-4 rounded-full font-bold text-lg shadow-lg"
            style={{ background: "#E75C7D", color: "#fff" }}
          >
            Jetzt anmelden 🎉
          </a>
        </div>

        {/* WhatsApp share */}
        <a
          href={`https://wa.me/?text=${WA_TEXT}`}
          target="_blank"
          rel="noopener noreferrer"
          className="card-lift inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-base shadow-lg mb-12"
          style={{ background: "#25D366", color: "#fff" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Einladung auf WhatsApp teilen
        </a>

        {/* Countdown */}
        <div className="w-full max-w-lg">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#E75C7D" }}>
            Noch bis zur Party
          </p>
          <Countdown />
        </div>
      </section>

      {/* ════════════════════════════════════
          PARTY DETAILS
      ════════════════════════════════════ */}
      <section id="details" className="relative z-10 py-20 px-4" style={{ background: "#fff" }}>
        <div className="max-w-5xl mx-auto">

          <Reveal className="text-center mb-12">
            <h2 className="font-bold mb-3" style={{ fontSize: "clamp(2rem,6vw,3.5rem)", color: "#242424" }}>
              Party Details
            </h2>
            <div className="h-2 w-28 rounded-full mx-auto" style={{ background: "#C8C72A" }} />
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "📅", title: "Wann?",    lines: ["Sonntag", "7. Juni", "2026"],         border: "#E75C7D" },
              { icon: "🕒", title: "Uhrzeit?", lines: ["Beginn um", "15:00 Uhr", "bis ca. 18:00"], border: "#C8C72A" },
              { icon: "🏠", title: "Wo?",      lines: ["Bei uns", "Zuhause", "Adresse folgt"], border: "#E75C7D" },
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 0.12}>
                <div
                  className="card-lift bg-white rounded-3xl p-8 text-center shadow-xl"
                  style={{ border: `4px solid ${card.border}` }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl"
                    style={{ background: card.border }}
                  >
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: "#242424" }}>{card.title}</h3>
                  {card.lines.map((line, j) => (
                    <p key={j} className={j === 1 ? "text-3xl font-bold" : "text-lg"} style={{ color: j === 1 ? card.border : "#242424" }}>
                      {line}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          ACTIVITIES
      ════════════════════════════════════ */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto">

          <Reveal className="text-center mb-12">
            <h2 className="font-bold mb-3" style={{ fontSize: "clamp(2rem,6vw,3.5rem)", color: "#242424" }}>
              Was erwartet euch?
            </h2>
            <div className="h-2 w-28 rounded-full mx-auto" style={{ background: "#E75C7D" }} />
          </Reveal>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {ACTIVITIES.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.1}>
                <div
                  className="card-lift rounded-3xl p-6 shadow-lg"
                  style={{ background: "#fff", border: `3px solid ${a.border}` }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-md"
                    style={{ background: a.border }}
                  >
                    {a.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: "#242424" }}>{a.title}</h3>
                  <p className="text-sm" style={{ color: "#555" }}>{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          EMOJI GALLERY
      ════════════════════════════════════ */}
      <section className="relative z-10 py-20 px-4" style={{ background: "#fff" }}>
        <div className="max-w-4xl mx-auto">

          <Reveal className="text-center mb-12">
            <h2 className="font-bold mb-3" style={{ fontSize: "clamp(2rem,6vw,3.5rem)", color: "#242424" }}>
              Party-Vibes 🥳
            </h2>
            <div className="h-2 w-28 rounded-full mx-auto" style={{ background: "#C8C72A" }} />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
              {GALLERY.map((emoji, i) => {
                const bg = i % 3 === 0 ? "#E75C7D" : i % 3 === 1 ? "#C8C72A" : "#242424";
                return (
                  <div
                    key={emoji}
                    className="card-lift aspect-square rounded-2xl flex items-center justify-center text-4xl shadow-lg"
                    style={{ background: bg }}
                  >
                    {emoji}
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════
          RSVP
      ════════════════════════════════════ */}
      <section
        id="rsvp"
        className="relative z-10 py-20 px-4"
        style={{ background: "#E75C7D" }}
      >
        <div className="max-w-xl mx-auto">
          <Reveal>
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="text-center mb-6">
                <div className="animate-wiggle inline-block text-6xl mb-4">🎁</div>
                <h2 className="font-bold mb-3" style={{ fontSize: "clamp(2rem,6vw,3rem)", color: "#242424" }}>
                  Bist du dabei?
                </h2>
                <p className="text-lg font-medium mb-4" style={{ color: "#555" }}>
                  Bitte bis zum{" "}
                  <span className="font-bold" style={{ color: "#E75C7D" }}>31. Mai 2026</span>
                  {" "}anmelden!
                </p>
                {/* Live guest counter */}
                <div className="flex justify-center">
                  <GuestCounter />
                </div>
              </div>
              <RSVPForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════
          GIFT IDEAS
      ════════════════════════════════════ */}
      <section className="relative z-10 py-20 px-4" style={{ background: "#FBF4E4" }}>
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="text-5xl mb-6 animate-pulse-scale inline-block">✨</div>
            <h2 className="font-bold mb-4" style={{ fontSize: "clamp(2rem,6vw,3rem)", color: "#242424" }}>
              Geschenk-Ideen
            </h2>
            <p className="text-lg font-medium mb-8" style={{ color: "#555" }}>
              Muaz und Mikail wünschen sich Bücher, Spiele, LEGO oder Erlebnisse!<br />
              Aber das Wichtigste ist:{" "}
              <strong style={{ color: "#E75C7D" }}>DASS IHR DA SEID!</strong> 🎈
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["📚 Bücher", "🧸 Kuscheltiere", "🎨 Mal-Sachen", "🧩 Puzzle & Spiele", "🪀 Spielzeug"].map(item => (
                <span key={item} className="px-6 py-3 rounded-full font-bold shadow-md" style={{ background: "#fff", color: "#242424" }}>
                  {item}
                </span>
              ))}
              <span className="px-6 py-3 rounded-full font-bold shadow-md" style={{ background: "#E75C7D", color: "#fff" }}>
                ❤️ Eure Anwesenheit
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-12 px-4 text-center" style={{ background: "#242424", color: "#fff" }}>
        <div className="animate-bounce-gentle inline-block text-5xl mb-4">🎂</div>
        <h3 className="text-2xl font-bold mb-3">Wir sehen uns bei der Party!</h3>

        {/* Footer WhatsApp */}
        <a
          href={`https://wa.me/?text=${WA_TEXT}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm mb-6 transition-opacity hover:opacity-90"
          style={{ background: "#25D366", color: "#fff" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Einladung teilen
        </a>

        <div className="flex justify-center gap-3 text-3xl mb-6">
          {["🎂","🎈","🎁","🎉","🥳"].map(e => <span key={e}>{e}</span>)}
        </div>
        <p className="text-sm" style={{ color: "#666" }}>
          <a href="/datenschutz/" className="hover:underline" style={{ color: "#E75C7D" }}>Datenschutz</a>
          &nbsp;·&nbsp;
          <a href="/impressum/"   className="hover:underline" style={{ color: "#E75C7D" }}>Impressum</a>
        </p>
      </footer>
    </main>
  );
}
