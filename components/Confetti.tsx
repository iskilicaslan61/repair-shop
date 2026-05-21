"use client";
import { useEffect, useState } from "react";

interface Piece {
  id: number;
  left: number;
  color: string;
  delay: number;
  round: boolean;
}

const COLORS = ["#E75C7D", "#C8C72A", "#FFFFFF", "#FBF4E4", "#FF9F43"];

export default function Confetti() {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    setPieces(
      Array.from({ length: 35 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 2.5,
        round: Math.random() > 0.5,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: "fixed",
            left: `${p.left}%`,
            top: 0,
            width: 10,
            height: 10,
            backgroundColor: p.color,
            borderRadius: p.round ? "50%" : "0",
            animation: `confetti-fall 4s linear ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
