"use client";
import { useState } from "react";
import { LAMBDA_URL } from "@/lib/constants";

export default function RSVPForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    attending: "",
    guests: "1",
    message: "",
    consent: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.attending) { setErrorMsg("Bitte wähle eine Option aus! 🎈"); return; }
    if (!form.consent) { setErrorMsg("Bitte stimme der Datenschutzerklärung zu."); return; }
    setStatus("loading");
    setErrorMsg("");

    const messageText = form.attending === "ja"
      ? `✅ Kommt! Personenanzahl: ${form.guests}${form.message ? `\n\nNachricht: ${form.message}` : ""}`
      : `❌ Kann leider nicht kommen.${form.message ? `\n\nNachricht: ${form.message}` : ""}`;

    try {
      const res = await fetch(LAMBDA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email || "keine@email.de",
          phone: `${form.guests} Person(en)`,
          message: messageText,
          consent: true,
          guests_count: form.attending === "ja" ? parseInt(form.guests) : 0,
          attending: form.attending === "ja",
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Ein Fehler ist aufgetreten. Bitte versuche es später nochmal.");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-10 space-y-4">
        <p className="text-6xl animate-bounce-gentle">
          {form.attending === "ja" ? "🎉" : "💌"}
        </p>
        <p className="text-3xl font-bold" style={{ color: "#2563EB" }}>
          {form.attending === "ja" ? "Super! Wir freuen uns! 🎈" : "Danke für deine Antwort!"}
        </p>
        <p className="text-lg" style={{ color: "#1E293B" }}>
          {form.attending === "ja"
            ? "Deine Anmeldung wurde erfolgreich übermittelt."
            : "Schade, aber vielleicht beim nächsten Mal!"}
        </p>
      </div>
    );
  }

  const inputClass = "w-full px-5 py-3 rounded-2xl text-base font-medium focus:outline-none transition-colors"
    + " border-2 border-transparent focus:border-[#2563EB]"
    + " bg-[#EFF6FF] text-[#1E293B] placeholder:text-gray-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        required
        type="text"
        placeholder="Dein Name *"
        value={form.name}
        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
        className={inputClass}
      />
      <input
        type="email"
        placeholder="E-Mail (optional)"
        value={form.email}
        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
        className={inputClass}
      />

      {/* Attending toggle */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { value: "ja",   label: "🎈 Ich bin dabei!" },
          { value: "nein", label: "😢 Ich kann leider nicht" },
        ].map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setForm(p => ({ ...p, attending: opt.value }))}
            className="py-3 px-3 rounded-2xl text-sm font-semibold transition-all border-2"
            style={
              form.attending === opt.value
                ? { background: "#2563EB", borderColor: "#2563EB", color: "#fff" }
                : { background: "#EFF6FF", borderColor: "#e5e5e5", color: "#1E293B" }
            }
          >
            {opt.label}
          </button>
        ))}
      </div>

      {form.attending === "ja" && (
        <div>
          <label className="block font-semibold mb-2" style={{ color: "#1E293B" }}>
            Wie viele kommen?
          </label>
          <select
            value={form.guests}
            onChange={e => setForm(p => ({ ...p, guests: e.target.value }))}
            className={inputClass}
          >
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>{n} Person{n > 1 ? "en" : ""}</option>
            ))}
          </select>
        </div>
      )}

      <textarea
        rows={3}
        placeholder="Nachricht (optional)"
        value={form.message}
        onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
        className={`${inputClass} resize-none`}
      />

      <label className="flex items-start gap-3 text-sm font-medium cursor-pointer" style={{ color: "#1E293B" }}>
        <input
          type="checkbox"
          checked={form.consent}
          onChange={e => setForm(p => ({ ...p, consent: e.target.checked }))}
          className="mt-1 accent-[#2563EB] w-4 h-4"
        />
        <span>
          Ich stimme der Verarbeitung meiner Daten gemäß der{" "}
          <a href="/datenschutz/" className="underline font-semibold" style={{ color: "#2563EB" }}>
            Datenschutzerklärung
          </a>{" "}zu. *
        </span>
      </label>

      {errorMsg && (
        <p className="text-sm font-medium" style={{ color: "#2563EB" }}>{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all disabled:opacity-50"
        style={{ background: "#38BDF8", color: "#1E293B" }}
      >
        {status === "loading" ? "Wird gesendet… 🎈" : "Ich bin dabei! 🎉"}
      </button>
    </form>
  );
}
