"use client";

import { useMemo, useState } from "react";
import styles from "./BlogSearch.module.css";

/**
 * Recherche de guides — minuscule composant client.
 *
 * - filtre INSTANTANÉMENT les cartes SSR (rendues par le serveur, jamais
 *   supprimées du DOM côté serveur) sur le TITRE ;
 * - état initial neutre → aucun mismatch d'hydratation ;
 * - masquage via un attribut HTML (pas de re-render de la liste) : les
 *   10 cartes restent dans le DOM, seules les non-correspondantes sont
 *   cachées visuellement.
 */
export default function BlogSearch({ total }: { total: number }) {
  const [query, setQuery] = useState("");

  const normalized = useMemo(() => query.trim().toLowerCase(), [query]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    const value = event.target.value.trim().toLowerCase();
    const grid = document.getElementById("guides-grid");
    if (!grid) return;
    let visible = 0;
    for (const card of Array.from(grid.children) as HTMLElement[]) {
      const match = !value || card.textContent.toLowerCase().includes(value);
      card.style.display = match ? "" : "none";
      if (match) visible += 1;
    }
    const empty = document.getElementById("guides-empty");
    if (empty) empty.style.display = visible === 0 ? "" : "none";
  };

  return (
    <div className={styles.searchWrap}>
      <label className={styles.label} htmlFor="recherche-guide">
        <span aria-hidden="true">🔎</span> Rechercher un guide
      </label>
      <input
        id="recherche-guide"
        className={styles.input}
        type="search"
        placeholder="Rechercher un guide…"
        value={query}
        onChange={handleInput}
        aria-describedby="guides-count"
      />
      <span id="guides-count" className={styles.count}>
        {total} guides
      </span>
    </div>
  );
}
