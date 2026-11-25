import type { Metadata } from "next";
import ParcoursGagner1000Detail from "@/components/ParcoursGagner1000Detail";
import { PARCOURS_A } from "@/data/parcoursGagner1000";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: "Parcours A : le parcours classique vers 1 017,50 € | Parrainio",
  description:
    "Consultez les 11 étapes du parcours classique, les dépôts et délais indicatifs, les primes cumulées et les annonces Parrainio correspondantes.",
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
