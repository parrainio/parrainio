import "./globals.css";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/siteUrl";
import { OG_IMAGE } from "@/lib/ogImage";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: "Parrainio — Les offres de parrainage, en clair",
  description:
    "Découvrez les meilleures offres de parrainage et récupérez jusqu'à 25 % de votre avantage.",
  // Socle Open Graph partagé : chaque page hérite de site_name/type/locale,
  // et Next.js dérive og:title, og:description et og:url de ses propres
  // title/description/canonical. Les pages qui définissent leur propre
  // openGraph (offres, hubs) doivent déclarer siteName explicitement.
  openGraph: {
    url: "/",
    type: "website",
    siteName: "Parrainio",
    locale: "fr_FR",
    images: [OG_IMAGE],
  },
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
