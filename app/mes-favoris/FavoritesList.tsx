"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { initFavorites, subscribeFavorites, removeFavorite, isFavorite } from "@/lib/favorites";
import { offers } from "@/data/offers";
import OfferLogo from "@/components/OfferLogo";
import styles from "./page.module.css";

/**
 * Liste des favoris du visiteur (localStorage). Rendu serveur : état vide
 * neutre ; après hydratation : favoris réels. Suppression possible ici.
 */
export default function FavoritesList() {
  const [hydrated, setHydrated] = useState(false);
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setSlugs(initFavorites().filter((slug) => isFavorite(slug)));
    sync();
    setHydrated(true);
    return subscribeFavorites(sync);
  }, []);

  const favorites = slugs
    .map((slug) => offers.find((offer) => offer.slug === slug))
    .filter((offer): offer is (typeof offers)[number] => Boolean(offer));

  if (!hydrated) {
    return <p className={styles.loading}>Chargement de vos favoris…</p>;
  }

  if (favorites.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Vous n’avez pas encore ajouté d’offre à vos favoris.</p>
        <Link href="/offres" className={styles.cta}>
          Parcourir les offres <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {favorites.map((offer) => (
        <li key={offer.slug} className={styles.item}>
          <Link href={`/offres/${offer.slug}`} className={styles.itemLink}>
            <OfferLogo name={offer.name} logo={offer.logo} color={offer.color} logoLetter={offer.logoLetter} size={44} />
            <span className={styles.itemInfo}>
              <small>{offer.categoryGroup}</small>
              <strong>{offer.name}</strong>
              <span className={styles.itemReward}>{offer.partnerReward}</span>
            </span>
          </Link>
          <button
            type="button"
            className={styles.remove}
            aria-label={`Retirer ${offer.name} des favoris`}
            onClick={() => removeFavorite(offer.slug)}
          >
            Retirer
          </button>
        </li>
      ))}
    </ul>
  );
}
