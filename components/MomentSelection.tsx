import Link from "next/link";
import type { Offer } from "@/data/offers";
import OfferLogo from "@/components/OfferLogo";
import OfferRewards from "@/components/OfferRewards";
import { SELECTION_DU_MOMENT } from "@/data/featuredOffersConfig";
import styles from "./MomentSelection.module.css";

export default function MomentSelection({ offers }: { offers: Offer[] }) {
  const selectedOffers = SELECTION_DU_MOMENT
    .map((slug) => offers.find((offer) => offer.slug === slug))
    .filter((offer): offer is Offer => Boolean(offer));

  return <section className={styles.section} aria-labelledby="moment-selection-title">
    <div className={styles.container}>
      <h2 id="moment-selection-title">SÉLECTION DU MOMENT</h2>
      <div className={styles.grid}>
        {selectedOffers.map((offer) => <article className={styles.card} key={offer.slug}>
          <div className={styles.brand}><OfferLogo name={offer.name} logo={offer.logo} color={offer.color} logoLetter={offer.logoLetter} size={38} /><div><small>{offer.categoryGroup}</small><h3>{offer.name}</h3></div></div>
          <OfferRewards offer={offer} compact />
          <Link href={`/offres/${offer.slug}`} className={styles.cta}>Voir l&apos;offre →</Link>
        </article>)}
      </div>
    </div>
  </section>;
}
