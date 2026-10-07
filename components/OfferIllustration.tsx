import Image from "next/image";
import { HUB_ILLUSTRATIONS } from "@/lib/categoryHubs";
import { EXPLICIT_ZERO, ABSENT_PARRAINIO } from "@/components/OfferRewards";
import styles from "./OfferIllustration.module.css";

/**
 * Illustration au-dessus de la carte de droite des fiches offres.
 * CAS 1 : reverse Parrainio réellement exploitable → visuel homepage +25 %.
 * CAS 2 : sinon → illustration de la catégorie via le mapping central
 * HUB_ILLUSTRATIONS (aucun mapping parallèle, aucune image nouvelle).
 * La sémantique du reverse est celle d'OfferRewards (export partagé) :
 * le zéro explicite (« 0 € ») reste exploitable côté carte et bascule ici
 * sur l'illustration de catégorie.
 */
export default function OfferIllustration({
  parrainioReward,
  categoryHubSlug,
  variant = "sidebar",
}: {
  parrainioReward: string | null | undefined;
  categoryHubSlug: string | null;
  variant?: "sidebar" | "mobile";
}) {
  const reward = parrainioReward?.trim() ?? "";
  // Le zéro explicite (« 0 € ») reste affiché tel quel sur la carte par
  // OfferRewards, mais ne constitue pas un reverse exploitable : le cas 2
  // (illustration de catégorie) s'applique, conformément au comportement
  // attendu sur les offres sans reverse (ex. Showroomprivé).
  const hasParrainioReward =
    reward !== "" &&
    !ABSENT_PARRAINIO.test(reward) &&
    !EXPLICIT_ZERO.test(reward);

  const illustration = hasParrainioReward
    ? ({
        src: "/images/illustrations/home-hero-plus25.webp",
        alt: "Jusqu'à 25 % reversés en plus grâce à Parrainio : un client souriant reçoit un cadeau entouré de pièces.",
        width: 550,
        height: 316,
      } as const)
    : categoryHubSlug
      ? HUB_ILLUSTRATIONS[categoryHubSlug]
      : undefined;

  if (!illustration) return null;

  return (
    <Image
      className={`${styles.illustration} ${variant === "mobile" ? styles.illustrationMobile : styles.illustrationSidebar}`}
      src={illustration.src}
      alt={illustration.alt}
      width={illustration.width}
      height={illustration.height}
      unoptimized
    />
  );
}
