"use client";
import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex flex-col sm:flex-row items-center justify-between gap-3 z-50">
      <p className="text-sm">
        Diese Website verwendet technisch notwendige Cookies.{" "}
        <a href="/datenschutz/" className="underline text-blue-400">Mehr erfahren</a>
      </p>
      <button
        onClick={accept}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm whitespace-nowrap"
      >
        Akzeptieren
      </button>
    </div>
  );
}
