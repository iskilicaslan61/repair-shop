import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Muaz & Mikail 🎂 – Private Geburtstagsparty",
  description: "Du bist eingeladen! Muaz wird 4 und Mikail wird 7 Jahre alt. Feier mit uns am 7. Juni 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
