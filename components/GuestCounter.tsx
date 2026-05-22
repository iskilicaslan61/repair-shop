"use client";
import { useEffect, useState } from "react";
import { LAMBDA_URL } from "@/lib/constants";

export default function GuestCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch(LAMBDA_URL, { method: "GET" })
      .then(r => r.json())
      .then(d => { if (typeof d.count === "number") setCount(d.count); })
      .catch(() => {});
  }, []);

  if (count === null || count === 0) return null;

  return (
    <div
      className="flex items-center justify-center gap-2 mb-6 px-6 py-3 rounded-full font-semibold text-lg animate-pulse-scale"
      style={{ background: "#38BDF8", color: "#1E293B", display: "inline-flex" }}
    >
      <span>🎉</span>
      <span>Bereits <strong>{count}</strong> {count === 1 ? "Gast hat" : "Gäste haben"} zugesagt!</span>
    </div>
  );
}
