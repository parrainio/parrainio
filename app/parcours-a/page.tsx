import type { Metadata } from "next";
import ParcoursGagner1000Detail from "@/components/ParcoursGagner1000Detail";
import { PARCOURS_A } from "@/data/parcoursGagner1000";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: "Parcours A : 1 017,50 € avec le parrainage",
  description:
    "Onze étapes de parrainage pour viser 1 017,50 € : dépôts, délais indicatifs, primes cumulées et offres Parrainio correspondantes, sans dépôt de départ.",
  alternates: { canonical: `${SITE_URL}/parcours-a` },
  openGraph: {
    title: "Parcours A – Le parcours classique | Parrainio",
    description:
      "Les étapes du parcours classique de parrainage, avec l’infographie fournie et les annonces Parrainio liées.",
    url: "/parcours-a",
    type: "article",
    siteName: "Parrainio",
    locale: "fr_FR",
    images: [PARCOURS_A.image],
  },
};

export default function ParcoursAPage() {
  return <ParcoursGagner1000Detail parcours={PARCOURS_A} />;
}
