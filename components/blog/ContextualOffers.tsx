import Link from "next/link";
import OfferLogo from "@/components/OfferLogo";
import { formatProductNames } from "@/lib/productNames";
import type { BlogOfferContext } from "@/lib/blogOffers";
import styles from "./ContextualOffers.module.css";

/**
 * Offres contextuelles du Guide — module purement serveur (aucun JS client).
 *
 * - desktop  : petite colonne latérale (~280px), sticky ;
 * - ≤940px   : micro-bandeau horizontal (scroll natif + snap), très compact ;
 * - aucune donnée codée en dur : tout vient de lib/blogOffers.ts ;
 * - le CTA utilise le lien géré sécurisé, ou la fiche interne en secours
 *   (jamais "#").
 */
export default function ContextualOffers({ context }: { context: BlogOfferContext }) {
  if (context.offers.length === 0) return null;

  return (
    <aside className={styles.module} aria-label={context.label}>
      <p className={styles.moduleTitle}>{context.label}</p>
      <ul className={styles.offerList}>
        {context.offers.map((offer) => (
          <li className={styles.offerCard} key={offer.slug}>
            <div className={styles.offerHead}>
              <OfferLogo
                name={offer.name}
                logo={offer.logo}
                color={offer.color}
                logoLetter={offer.logoLetter}
                size={24}
              />
              <strong className={styles.offerName}>{offer.name}</strong>
            </div>
            <span className={styles.offerReward}>{offer.partnerReward || "Voir l'offre"}</span>
            {offer.parrainioReward && (
              <span className={styles.offerReverse}>
                + Parrainio : {formatProductNames(offer.parrainioReward)}
              </span>
            )}
            <Link
              href={offer.referralUrl ?? `/offres/${offer.slug}`}
              className={styles.offerCta}
              {...(offer.referralUrl ? { target: "_blank", rel: "sponsored nofollow noopener" } : {})}
            >
              En profiter →
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/offres" className={styles.moduleLink}>
        Voir toutes les offres →
      </Link>
    </aside>
  );
}
