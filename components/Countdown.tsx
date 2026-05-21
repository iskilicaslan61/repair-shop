"use client";
import { useEffect, useState } from "react";

const TARGET = new Date("2026-06-07T15:00:00");

function pad(n: number) {
  return String(n).padStart(2, "0");
}

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
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        done: false,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (time.done) {
    return (
      <p className="text-2xl font-bold text-amber-400 text-center animate-pulse">
        🎉 Die Party hat begonnen!
      </p>
    );
  }

  const units = [
    { label: "Tage", value: pad(time.days) },
    { label: "Stunden", value: pad(time.hours) },
    { label: "Minuten", value: pad(time.minutes) },
    { label: "Sekunden", value: pad(time.seconds) },
  ];

  return (
    <div className="flex gap-3 sm:gap-6 justify-center">
      {units.map(u => (
        <div key={u.label} className="flex flex-col items-center">
          <div className="bg-blue-900/60 border border-amber-400/30 rounded-xl w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center backdrop-blur-sm">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 tabular-nums">
              {u.value}
            </span>
          </div>
          <span className="text-blue-300 text-xs mt-2 uppercase tracking-widest">{u.label}</span>
        </div>
      ))}
    </div>
  );
}
