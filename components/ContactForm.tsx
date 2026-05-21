"use client";
import { useState } from "react";
import { LAMBDA_URL } from "@/lib/constants";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", consent: false });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) {
      setErrorMsg("Bitte stimmen Sie der Datenschutzerklärung zu.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(LAMBDA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
      <div className="text-center py-10">
        <p className="text-2xl font-semibold text-green-600">Vielen Dank!</p>
        <p className="text-gray-600 mt-2">Wir melden uns innerhalb von 24 Stunden bei Ihnen.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <input
        required
        type="text"
        placeholder="Ihr Name * (z.B. Max Mustermann)"
        value={form.name}
        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        required
        type="email"
        placeholder="E-Mail * (z.B. name@beispiel.de)"
        value={form.email}
        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="tel"
        placeholder="Telefon (z.B. +49 30 123456)"
        value={form.phone}
        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        required
        rows={5}
        placeholder="Ihre Nachricht * (z.B. Mein iPhone 14 Display ist gebrochen, wann kann ich vorbeikommen?)"
        value={form.message}
        onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={e => setForm(p => ({ ...p, consent: e.target.checked }))}
          className="mt-1"
        />
        <span>
          Ich habe die{" "}
          <a href="/datenschutz/" className="underline text-blue-600">Datenschutzerklärung</a>
          {" "}gelesen und stimme der Verarbeitung meiner Daten zu. *
        </span>
      </label>
      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
      >
        {status === "loading" ? "Wird gesendet…" : "Nachricht senden"}
      </button>
    </form>
  );
}
