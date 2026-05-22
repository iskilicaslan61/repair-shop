"use client";
import { useEffect, useState } from "react";

const TARGET = new Date("2026-06-07T15:00:00");

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const UNIT_COLORS = ["#2563EB", "#38BDF8", "#2563EB", "#38BDF8"];

export default function Countdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, done: false });

  useEffect(() => {
    const tick = () => {
      const diff = TARGET.getTime() - Date.now();
      if (diff <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0, done: true });
        return;
      }
      setTime({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        done:    false,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (time.done) {
    return (
      <p className="text-2xl font-bold text-center animate-pulse-scale" style={{ color: "#2563EB" }}>
        🎉 Die Party hat begonnen!
      </p>
    );
  }

  const units = [
    { label: "Tage",     value: pad(time.days) },
    { label: "Stunden",  value: pad(time.hours) },
    { label: "Minuten",  value: pad(time.minutes) },
    { label: "Sekunden", value: pad(time.seconds) },
  ];

  return (
    <div className="flex gap-3 sm:gap-5 justify-center">
      {units.map((u, i) => (
        <div key={u.label} className="flex flex-col items-center">
          <div
            className="rounded-2xl w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center shadow-lg"
            style={{ backgroundColor: UNIT_COLORS[i] }}
          >
            <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
              {u.value}
            </span>
          </div>
          <span className="text-xs mt-2 font-semibold uppercase tracking-wider" style={{ color: "#1E293B" }}>
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
