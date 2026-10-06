import Image from "next/image";
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
      <div className={styles.sectionIntro}>
        <h2 id="moment-selection-title">SÉLECTION DU MOMENT</h2>
        <Image
          className={styles.sectionIllustration}
          src="/images/illustrations/selection-du-moment.webp"
          alt="Un client découvre une offre de cadeau et de réduction sur son téléphone."
          width={420}
          height={280}
          sizes="(max-width: 620px) 120px, 160px"
        />
      </div>
      <div className={styles.grid}>
        {selectedOffers.map((offer) => <article className={styles.card} key={offer.slug}>
          <div className={styles.brand}><OfferLogo name={offer.name} logo={offer.logo} color={offer.color} logoLetter={offer.logoLetter} size={38} /><div><small>{offer.categoryGroup}</small><h3>{offer.name}</h3></div></div>
          <OfferRewards offer={offer} compact />
          <Link href={`/offres/${offer.slug}`} className={styles.cta}>Voir l&apos;offre {offer.name} →</Link>
        </article>)}
      </div>
    </div>
  </section>;
}
