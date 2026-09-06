"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { initFavorites, subscribeFavorites } from "@/lib/favorites";
import styles from "./FavoritesCount.module.css";

/**
 * « Mes favoris (n) » — lien présent côté serveur (navigation intacte sans
 * JS) ; le compteur est ajouté après hydratation à partir de l'état local
 * du navigateur. Aucun mismatch : le texte serveur reste exactement
 * « Mes favoris », le compteur est un nœud séparé injecté au client.
 */
export default function FavoritesCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const sync = () => setCount(initFavorites().length);
    sync();
    return subscribeFavorites(sync);
  }, []);

  return (
    <Link href="/mes-favoris" className={styles.favoritesLink}>
      <span className={styles.heart} aria-hidden="true">♥</span>
      <span>Mes favoris</span>
      {count !== null && count > 0 && <span className={styles.count}>{count}</span>}
    </Link>
  );
}
