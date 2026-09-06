"use client";

import { useEffect, useState } from "react";
import { initFavorites, subscribeFavorites, toggleFavorite, isFavorite } from "@/lib/favorites";
import styles from "./FavoriteButton.module.css";

/**
 * Bouton favori « ♡ Ajouter aux favoris » / « ♥ Retirer des favoris ».
 *
 * - rendu serveur : état neutre ♡ (localStorage indisponible côté serveur) ;
 * - après hydratation : état réel, sans saut de layout (largeur réservée) ;
 * - synchronisé avec toutes les autres vues via le bus d'événements.
 */
export default function FavoriteButton({ slug, variant = "icon" }: { slug: string; variant?: "icon" | "full" }) {
  const [hydrated, setHydrated] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    initFavorites();
    setActive(isFavorite(slug));
    setHydrated(true);
    const unsubscribe = subscribeFavorites(() => setActive(isFavorite(slug)));
    return unsubscribe;
  }, [slug]);

  const isFull = variant === "full";

  return (
    <button
      type="button"
      className={`${styles.favorite} ${isFull ? styles.full : styles.icon} ${hydrated && active ? styles.active : ""}`}
      aria-pressed={hydrated ? active : false}
      aria-label={hydrated && active ? `Retirer ${slug} des favoris` : `Ajouter ${slug} aux favoris`}
      title={hydrated && active ? "Retirer des favoris" : "Ajouter aux favoris"}
      onClick={() => {
        const next = toggleFavorite(slug);
        setActive(next);
      }}
    >
      <span aria-hidden="true" className={styles.heart}>
        {hydrated && active ? "♥" : "♡"}
      </span>
      {isFull && (
        <span className={styles.label}>{hydrated && active ? "Retirer des favoris" : "Ajouter aux favoris"}</span>
      )}
    </button>
  );
}
