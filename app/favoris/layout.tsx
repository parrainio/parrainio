import type { ReactNode } from "react";
import type { Metadata } from "next";
import PublicHeaderServer from "@/components/PublicHeaderServer";

/**
 * Layout serveur de /favoris — la page elle-même est un composant client
 * ("use client") et ne peut pas exporter de metadata. La directive noindex
 * reste portée ici : contenu 100 % navigateur, page absente du sitemap.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function FavoritesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicHeaderServer />
      {children}
    </>
  );
}
