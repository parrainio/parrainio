"use client";

import { useMemo, useState } from "react";
import type { Offer } from "@/data/offers";
import Link from "next/link";
import OfferSearch, { normalizeOfferSearch } from "@/components/OfferSearch";
import OfferLogo from "@/components/OfferLogo";
import OfferRewards from "@/components/OfferRewards";
import styles from "./page.module.css";

type CategoryOffersProps = { offers: Offer[]; category: string };

export default function CategoryOffers({ offers, category }: CategoryOffersProps) {
  const [search, setSearch] = useState("");
  const filteredOffers = useMemo(() => {
    const query = normalizeOfferSearch(search);
    return offers.filter((offer) => !query || normalizeOfferSearch(`${offer.name} ${offer.slug}`).includes(query));
  }, [offers, search]);

  return <>
    <OfferSearch value={search} onChange={setSearch} />
    {filteredOffers.length > 0 ? <div className={styles.offersGrid}>{filteredOffers.map((offer) => <article className={styles.offerCard} key={offer.slug}><div className={styles.offerTop}><div className={styles.brand}><OfferLogo name={offer.name} logo={offer.logo} color={offer.color} logoLetter={offer.logoLetter} size={44} /><div><small>{offer.categoryGroup}</small><h3>{offer.name}</h3></div></div></div><p className={styles.description}>{offer.description}</p><OfferRewards offer={offer} /><Link href={`/offres/${offer.slug}`} className={styles.offerLink}>Voir l&apos;offre</Link></article>)}</div> : <div className={styles.emptyState}><strong>Aucune offre trouvée.</strong></div>}
  </>;
}
