"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Offer } from "@/data/offers";
import OfferRewards from "@/components/OfferRewards";
import OfferLogo from "@/components/OfferLogo";
import OfferSearch, { normalizeOfferSearch } from "@/components/OfferSearch";
import styles from "@/app/page.module.css";

export default function OfferSearchResults({ offers }: { offers: Offer[] }) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const query = normalizeOfferSearch(search);
    return offers.filter((offer) => !query || normalizeOfferSearch(`${offer.name} ${offer.slug}`).includes(query));
  }, [offers, search]);

  return <>
    <OfferSearch value={search} onChange={setSearch} />
    <div className={styles.compactOffersGrid}>
      {filtered.slice(0, 6).map((offer) => <Link href={`/offres/${offer.slug}`} className={styles.featuredCard} key={offer.slug}>
        <div className={styles.featuredCardTop}><OfferLogo name={offer.name} logo={offer.logo} color={offer.color} logoLetter={offer.logoLetter} size={38} className={styles.featuredLogo} /><div className={styles.featuredInfo}><small>{offer.categoryGroup}</small><h3>{offer.name}</h3></div></div>
        <OfferRewards offer={offer} compact /><span className={styles.featuredCta}>Voir l&apos;offre →</span>
      </Link>)}
    </div>
    {search && filtered.length === 0 ? <p>Aucune offre trouvée.</p> : null}
  </>;
}
