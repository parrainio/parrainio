"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Offer } from "@/data/offers";
import OfferRewards from "@/components/OfferRewards";
import OfferLogo from "@/components/OfferLogo";
import OfferSearch, { normalizeOfferSearch } from "@/components/OfferSearch";
import styles from "@/app/page.module.css";

type OfferSearchResultsProps = {
  offers: Offer[];
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
        {visibleOffers.map((offer) => (
          <Link href={`/offres/${offer.slug}`} className={styles.featuredCard} key={offer.slug}>
            <div className={styles.featuredCardTop}><OfferLogo name={offer.name} logo={offer.logo} color={offer.color} logoLetter={offer.logoLetter} size={38} className={styles.featuredLogo} /><div className={styles.featuredInfo}><small>{offer.categoryGroup}</small><h3>{offer.name}</h3></div></div>
            <OfferRewards offer={offer} compact /><span className={styles.featuredCta}>Voir l&apos;offre {offer.name} →</span>
          </Link>
        ))}
      </div>
    ) : search ? <p>Aucune offre trouvée.</p> : null}
  </>;
}
