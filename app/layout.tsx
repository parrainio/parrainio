import "./globals.css";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: "Parrainio — Les offres de parrainage, en clair",
  description:
    "Découvrez les meilleures offres de parrainage et récupérez jusqu'à 25 % de votre avantage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<html lang="fr" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
