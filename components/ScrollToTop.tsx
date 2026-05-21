"use client";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 350);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      aria-label="Nach oben scrollen"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed z-50 bottom-6 left-6 w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-xl font-bold transition-all hover:scale-110 active:scale-95"
      style={{ background: "#E75C7D", color: "#fff" }}
    >
      ↑
    </button>
  );
}
