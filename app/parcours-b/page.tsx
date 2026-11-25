import type { Metadata } from "next";
import ParcoursGagner1000Detail from "@/components/ParcoursGagner1000Detail";
import { PARCOURS_B } from "@/data/parcoursGagner1000";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: "Parcours B : la variante vers 1 052,01 € nets | Parrainio",
  description:
    "Découvrez les 12 étapes du parcours alternatif, avec les frais Revolut déduits, les délais indicatifs, les primes et les annonces Parrainio liées.",
  alternates: { canonical: `${SITE_URL}/parcours-b` },
  openGraph: {
    title: "Parcours B – Le parcours alternatif | Parrainio",
    description:
      "Les étapes du parcours alternatif de parrainage, avec le visuel fourni et les annonces Parrainio liées.",
    url: "/parcours-b",
    type: "article",
    siteName: "Parrainio",
    locale: "fr_FR",
    images: [PARCOURS_B.image],
  },
};

export default function ParcoursBPage() {
  return <ParcoursGagner1000Detail parcours={PARCOURS_B} />;
}
