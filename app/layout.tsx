import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Muaz & Mikail 🎂 – Geburtstagsparty",
  description:
    "Du bist eingeladen! Muaz wird 4 und Mikail wird 7 Jahre alt. Feier mit uns am 7. Juni 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={fredoka.variable}>
      <body className="min-h-screen flex flex-col">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
