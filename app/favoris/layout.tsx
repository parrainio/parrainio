import type { Metadata } from "next";

/**
 * Layout serveur de /favoris — la page elle-même est un composant client
 * ("use client") et ne peut pas exporter de metadata. La directive noindex
 * est donc portée ici : contenu 100 % navigateur, aucune donnée SEO,
 * page absente du sitemap.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function FavorisLayout({ children }: { children: React.ReactNode }) {
  return children;
}
