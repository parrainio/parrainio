"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ManagedOffer } from "@/data/managedOffers";
import OfferRewards from "@/components/OfferRewards";
import OfferLogo from "@/components/OfferLogo";
import OfferSearch, { normalizeOfferSearch } from "@/components/OfferSearch";
import styles from "@/app/page.module.css";

type OfferSearchResultsProps = {
  offers: ManagedOffer[];
  limit?: number;
  category?: string;
};

export default function OfferSearchResults({ offers, limit = 6, category }: OfferSearchResultsProps) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const query = normalizeOfferSearch(search);
    return offers.filter((offer) => {
      if (category && offer.categoryGroup !== category) return false;
      return !query || normalizeOfferSearch(`${offer.name} ${offer.slug}`).includes(query);
    });
  }, [category, offers, search]);

  const visibleOffers = filtered.slice(0, limit);

  return <>
    <OfferSearch value={search} onChange={setSearch} />
    {visibleOffers.length > 0 ? (
      <div className={styles.compactOffersGrid}>
        {visibleOffers.map((sourceOffer) => {
          const offer = sourceOffer;
          return <article className={styles.featuredCard} key={offer.slug}>
            <Link href={`/offres/${offer.slug}`} className={styles.featuredCardHitArea} aria-label={`Voir la fiche ${offer.name}`} />
            <div className={styles.featuredCardContent}>
              <div className={styles.featuredCardTop}><OfferLogo name={offer.name} logo={offer.logo} color={offer.color} logoLetter={offer.logoLetter} size={38} className={styles.featuredLogo} /><div className={styles.featuredInfo}><small>{offer.categoryGroup}</small><h3>{offer.name}</h3></div></div>
              <OfferRewards offer={offer} compact /><span className={styles.featuredCta}>Voir l&apos;offre {offer.name} →</span>
            </div>
          </article>;
        })}
      </div>
    ) : search ? <p>Aucune offre trouvée.</p> : null}
  </>;
}
