import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import { SITE_NAME } from "@/lib/constants";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: SITE_NAME,
  description: "Ihr zuverlässiger Reparaturservice",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={geist.className}>
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
