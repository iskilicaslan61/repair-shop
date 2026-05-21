import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = "https://party.ismailkilicaslan.de";

export const metadata: Metadata = {
  title: "Muaz & Mikail 🎂 – Geburtstagsparty",
  description:
    "Du bist eingeladen! Muaz wird 4 und Mikail wird 7 Jahre alt. Feier mit uns am 7. Juni 2026 ab 15:00 Uhr!",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Muaz & Mikail werden 4 & 7! 🎂🎈",
    description:
      "Private Geburtstagsparty – Sonntag, 7. Juni 2026 ab 15:00 Uhr. Komm und feier mit uns!",
    url: SITE_URL,
    siteName: "Geburtstagsparty Muaz & Mikail",
    type: "website",
    locale: "de_DE",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Muaz & Mikail Geburtstagsparty – 7. Juni 2026",
      },
    ],
  },
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
