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
    if (!form.attending) { setErrorMsg("Bitte wählen Sie eine Option."); return; }
    if (!form.consent) { setErrorMsg("Bitte stimmen Sie der Datenschutzerklärung zu."); return; }
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
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-10 space-y-3">
        <p className="text-5xl">
          {form.attending === "ja" ? "🎉" : "💌"}
        </p>
        <p className="text-2xl font-bold text-amber-400">
          {form.attending === "ja" ? "Wir freuen uns auf dich!" : "Danke für deine Antwort!"}
        </p>
        <p className="text-blue-300 text-sm">
          {form.attending === "ja"
            ? "Deine Anmeldung wurde erfolgreich übermittelt."
            : "Schade, aber vielleicht beim nächsten Mal!"}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        required
        type="text"
        placeholder="Dein Name *"
        value={form.name}
        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
        className="w-full bg-blue-900/40 border border-amber-400/20 rounded-xl px-4 py-3 text-white placeholder:text-blue-400 focus:outline-none focus:border-amber-400/60 transition-colors"
      />
      <input
        type="email"
        placeholder="E-Mail (optional)"
        value={form.email}
        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
        className="w-full bg-blue-900/40 border border-amber-400/20 rounded-xl px-4 py-3 text-white placeholder:text-blue-400 focus:outline-none focus:border-amber-400/60 transition-colors"
      />

      <div className="grid grid-cols-2 gap-3">
        {[
          { value: "ja", label: "🎉 Ich komme!" },
          { value: "nein", label: "😢 Ich kann leider nicht" },
        ].map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setForm(p => ({ ...p, attending: opt.value }))}
            className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
              form.attending === opt.value
                ? "bg-amber-400 border-amber-400 text-blue-950"
                : "bg-blue-900/40 border-amber-400/20 text-blue-300 hover:border-amber-400/40"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {form.attending === "ja" && (
        <div>
          <label className="text-blue-300 text-sm mb-2 block">Anzahl der Personen</label>
          <select
            value={form.guests}
            onChange={e => setForm(p => ({ ...p, guests: e.target.value }))}
            className="w-full bg-blue-900/40 border border-amber-400/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400/60 transition-colors"
          >
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n} className="bg-blue-950">{n} Person{n > 1 ? "en" : ""}</option>
            ))}
          </select>
        </div>
      )}

      <textarea
        rows={3}
        placeholder="Nachricht (optional)"
        value={form.message}
        onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
        className="w-full bg-blue-900/40 border border-amber-400/20 rounded-xl px-4 py-3 text-white placeholder:text-blue-400 focus:outline-none focus:border-amber-400/60 transition-colors resize-none"
      />

      <label className="flex items-start gap-3 text-sm text-blue-400 cursor-pointer">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={e => setForm(p => ({ ...p, consent: e.target.checked }))}
          className="mt-1 accent-amber-400"
        />
        <span>
          Ich stimme der Verarbeitung meiner Daten gemäß der{" "}
          <a href="/datenschutz/" className="underline text-amber-400/80 hover:text-amber-400">Datenschutzerklärung</a> zu. *
        </span>
      </label>

      {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-gradient-to-r from-amber-400 to-yellow-300 text-blue-950 font-bold py-3 rounded-xl hover:from-amber-300 hover:to-yellow-200 disabled:opacity-50 transition-all shadow-lg shadow-amber-400/20"
      >
        {status === "loading" ? "Wird gesendet…" : "Anmeldung absenden ✨"}
      </button>
    </form>
  );
}
