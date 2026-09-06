"use client";

import { useEffect, useId, useRef, useState } from "react";
import { normalizeOfferSearch } from "@/lib/offerFilters";
import styles from "./OfferFilterBar.module.css";

/**
 * Barre de recherche/filtres /offres — UNE seule rangée horizontale.
 *
 * Chaque bloc se transforme SUR PLACE au clic (aucun champ visible en
 * permanence, aucune seconde rangée) :
 *  1. « 🔎 Rechercher une offre » → champ texte, filtrage en temps réel ;
 *  2. « 💰 Rechercher une prime »  → menu de seuils prédéfinis ;
 *  3. « ⚙️ Rechercher une condition » → menu de conditions vérifiées.
 *
 * Un seul panneau ouvert à la fois. Échap / clic extérieur ferment le panneau.
 */

export type ActivePanel = "search" | "prime" | "condition" | null;

type OfferFilterBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  primeLabel: string | null;
  onPrimeSelect: (label: string | null) => void;
  primeOptions: { value: number; label: string; count: number }[];
  conditionLabel: string | null;
  onConditionSelect: (label: string | null) => void;
  conditionOptions: { key: string; label: string; count: number }[];
};

export default function OfferFilterBar({
  search,
  onSearchChange,
  primeLabel,
  onPrimeSelect,
  primeOptions,
  conditionLabel,
  onConditionSelect,
  conditionOptions,
}: OfferFilterBarProps) {
  const [openPanel, setOpenPanel] = useState<ActivePanel>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  /* Clic extérieur → fermeture du panneau ouvert. */
  useEffect(() => {
    if (!openPanel) return;
    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpenPanel(null);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenPanel(null);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openPanel]);

  function togglePanel(panel: Exclude<ActivePanel, null>) {
    setOpenPanel((current) => (current === panel ? null : panel));
  }

  function focusSearch() {
    requestAnimationFrame(() => searchInputRef.current?.focus());
  }

  const hasActiveFilters = Boolean(search) || Boolean(primeLabel) || Boolean(conditionLabel);

  return (
    <div className={styles.filterBar} ref={rootRef}>
      {/* BLOC 1 — Recherche d'offre (texte, temps réel) */}
      <div className={styles.block}>
        <button
          type="button"
          className={[styles.trigger, openPanel === "search" ? styles.triggerOpen : "", search ? styles.triggerActive : ""].filter(Boolean).join(" ")}
          aria-expanded={openPanel === "search"}
          aria-controls={listId}
          onClick={() => { togglePanel("search"); focusSearch(); }}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className={styles.blockIcon}><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
          <span className={styles.triggerLabel}>Rechercher une offre</span>
        </button>

        {openPanel === "search" && (
          <div className={styles.inlineField} id={listId}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className={styles.blockIcon}><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
            <input
              ref={searchInputRef}
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Fortuneo, cashback…"
              aria-label="Rechercher une offre"
              className={styles.searchInput}
            />
            {search ? (
              <button type="button" className={styles.clearMini} aria-label="Effacer la recherche" onClick={() => { onSearchChange(""); focusSearch(); }}>
                ×
              </button>
            ) : (
              <button type="button" className={styles.clearMini} aria-label="Fermer la recherche" onClick={() => { onSearchChange(""); setOpenPanel(null); }}>
                ×
              </button>
            )}
          </div>
        )}
      </div>

      {/* BLOC 2 — Prime (menu de seuils) */}
      <div className={styles.block}>
        <button
          type="button"
          className={[styles.trigger, openPanel === "prime" ? styles.triggerOpen : "", primeLabel ? styles.triggerActive : ""].filter(Boolean).join(" ")}
          aria-expanded={openPanel === "prime"}
          aria-haspopup="listbox"
          aria-controls={listId}
          onClick={() => togglePanel("prime")}
        >
          <span aria-hidden="true" className={styles.blockIcon}>💰</span>
          <span className={styles.triggerLabel}>{primeLabel ?? "Rechercher une prime"}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className={styles.chevron}><path d="m6 9 6 6 6-6" /></svg>
        </button>

        {openPanel === "prime" && (
          <ul className={styles.menu} role="listbox" aria-label="Filtrer par montant de prime" id={listId}>
            {primeOptions.map(({ value, label, count }) => (
              <li key={value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={primeLabel === label}
                  className={[styles.menuItem, primeLabel === label ? styles.menuItemSelected : ""].filter(Boolean).join(" ")}
                  onClick={() => { onPrimeSelect(primeLabel === label ? null : label); setOpenPanel(null); }}
                >
                  <span>{label}</span>
                  <small>{count}</small>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* BLOC 3 — Condition particulière (menu de conditions vérifiées) */}
      <div className={styles.block}>
        <button
          type="button"
          className={[styles.trigger, openPanel === "condition" ? styles.triggerOpen : "", conditionLabel ? styles.triggerActive : ""].filter(Boolean).join(" ")}
          aria-expanded={openPanel === "condition"}
          aria-haspopup="listbox"
          aria-controls={listId}
          onClick={() => togglePanel("condition")}
        >
          <span aria-hidden="true" className={styles.blockIcon}>⚙️</span>
          <span className={styles.triggerLabel}>{conditionLabel ?? "Rechercher une condition"}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className={styles.chevron}><path d="m6 9 6 6 6-6" /></svg>
        </button>

        {openPanel === "condition" && (
          <ul className={styles.menu} role="listbox" aria-label="Filtrer par condition vérifiée" id={listId}>
            {conditionOptions.map(({ key, label, count }) => (
              <li key={key}>
                <button
                  type="button"
                  role="option"
                  aria-selected={conditionLabel === label}
                  className={[styles.menuItem, conditionLabel === label ? styles.menuItemSelected : ""].filter(Boolean).join(" ")}
                  onClick={() => { onConditionSelect(conditionLabel === label ? null : label); setOpenPanel(null); }}
                >
                  <span>{label}</span>
                  <small>{count}</small>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          className={styles.reset}
          onClick={() => {
            onSearchChange("");
            onPrimeSelect(null);
            onConditionSelect(null);
            setOpenPanel(null);
          }}
        >
          Réinitialiser
        </button>
      )}
    </div>
  );
}

export { normalizeOfferSearch };
