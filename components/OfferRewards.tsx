import type { Offer } from "@/data/offers";
import { getReverseAmount } from "@/data/offers";
import styles from "./OfferRewards.module.css";

type OfferRewardsProps = {
  offer: Pick<Offer, "partnerReward" | "parrainioReward">;
  compact?: boolean;
};

export default function OfferRewards({ offer, compact = false }: OfferRewardsProps) {
  return (
    <div className={`${styles.rewards} ${compact ? styles.compact : ""}`}>
      {offer.partnerReward && !/^(?:0(?:[,.]0+)?\s*€?|aucun|aucune|voir l'offre)$/i.test(offer.partnerReward.trim()) && <div className={styles.partner}>
        <span>VOUS GAGNEZ</span>
        <strong>{offer.partnerReward}</strong>
      </div>}
      {offer.parrainioReward && !/^(?:0(?:[,.]0+)?\s*€?|aucun(?:e)?\s+(?:bonus\s+)?parrainio(?:\s+bonus)?|rien\s+pour\s+cette\s+fois\.?)$/i.test(offer.parrainioReward.trim()) && (
        <div className={styles.parrainio}>
          <span>PARRAINIO REVERSE EN PLUS</span>
          <strong>{getReverseAmount(offer as Offer)}</strong>
        </div>
      )}
    </div>
  );
}
