import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://misterdil.ca"),
  title: "Misterdil — Vos colis du Canada, partout dans le monde",
  description:
    "Plateforme de réexpédition internationale de colis. Adresse au Canada, livraison mondiale, suivi en temps réel.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Misterdil",
    description: "Réexpédition de colis du Canada vers le monde entier.",
    type: "website",
    url: "https://misterdil.ca",
    siteName: "Misterdil",
    locale: "fr_CA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900">{children}</body>
    </html>
  );
}
