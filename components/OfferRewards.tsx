import type { Offer } from "@/data/offers";
import { getReverseAmount } from "@/data/offers";
import { formatProductNames } from "@/lib/productNames";
import styles from "./OfferRewards.module.css";

type OfferRewardsProps = {
  offer: Pick<Offer, "partnerReward" | "parrainioReward">;
  compact?: boolean;
};

/* Zéro explicitement défini dans les données (« 0 € », « 0,00 € ») : affiché tel quel. */
const EXPLICIT_ZERO = /^0(?:[,.]0+)?\s*€$/;

/* Valeurs d'absence / non renseignées : masquées, jamais transformées en 0 €. */
const ABSENT_PARTNER = /^(?:aucun|aucune|voir l'offre)$/i;
const ABSENT_PARRAINIO =
  /^(?:aucun(?:e)?(?:\s+(?:bonus\s+)?parrainio(?:\s+bonus)?)?(?:\s+pour\s+cette\s+offre)?|rien(?:\s+pour\s+cette\s+fois)?)$/i;

export default function OfferRewards({ offer, compact = false }: OfferRewardsProps) {
  const partner = offer.partnerReward?.trim() ?? "";
  const showPartner = EXPLICIT_ZERO.test(partner) || (partner !== "" && !ABSENT_PARTNER.test(partner));
  const parrainio = offer.parrainioReward?.trim() ?? "";
  const showParrainio =
    EXPLICIT_ZERO.test(parrainio) || (parrainio !== "" && !ABSENT_PARRAINIO.test(parrainio));

  return (
    <div className={`${styles.rewards} ${compact ? styles.compact : ""}`}>
      {showPartner && (
        <div className={styles.partner}>
          <span>VOUS GAGNEZ</span>
          <strong>{offer.partnerReward}</strong>
        </div>
      )}
      {showParrainio && (
        <div className={styles.parrainio}>
          <span>PARRAINIO REVERSE EN PLUS</span>
          <strong>{formatProductNames(getReverseAmount(offer as Offer))}</strong>
        </div>
      )}
    </div>
  );
}
