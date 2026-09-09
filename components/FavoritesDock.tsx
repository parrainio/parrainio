"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  addFavorite,
  getFavorites,
  initFavorites,
  isFavorite,
  removeFavorite,
  subscribeFavorites,
} from "@/lib/favorites";
import { offers } from "@/data/offers";
import OfferLogo from "@/components/OfferLogo";
import styles from "./FavoritesDock.module.css";

/**
 * Accès « Mes favoris » — bouton flottant ♥ + panneau compact.
 *
 * - réutilise EXACTEMENT le système existant (lib/favorites, localStorage,
 *   bus d'événements) : une seule liste de favoris, jamais de second système ;
 * - SSR : état neutre via getServerSnapshot (zéro mismatch d'hydratation,
 *   compteur injecté après hydratation comme dans FavoritesCount) ;
 * - compteur et contenu mis à jour automatiquement via le bus : ajout/retrait
 *   depuis une carte, le panneau ou la page /favoris reste synchronisé.
 */

type DockOffer = {
  slug: string;
  name: string;
  categoryGroup: string;
  partnerReward: string | null;
  parrainioReward: string | null;
  color: string;
  logo: string | null;
  logoLetter: string;
};

let dockOffersCache: DockOffer[] | null = null;
function dockOffers(): DockOffer[] {
  // data/offers est un module de données pur (aucun node:fs) : importable
  // côté client — même flux que les favoris existants.
  if (!dockOffersCache) {
    dockOffersCache = offers.map((offer) => ({
      slug: offer.slug,
      name: offer.name,
      categoryGroup: offer.categoryGroup,
      partnerReward: offer.partnerReward ?? null,
      parrainioReward: offer.parrainioReward ?? null,
      color: offer.color,
      logo: offer.logo ?? null,
      logoLetter: offer.logoLetter,
    }));
  }
  return dockOffersCache;
}

/* ── Bus favoris exposé à useSyncExternalStore ─────────────────────────────── */

const EMPTY: readonly string[] = [];

function subscribe(listener: () => void): () => void {
  return subscribeFavorites(listener);
}

/** Snapshot client : l'instance est stable entre les écritures (cache module). */
function getSnapshot(): readonly string[] {
  return getFavorites();
}

/** Snapshot serveur : liste vide neutre — le HTML initial ne dépend pas du
 *  navigateur, puis React bascule sur l'état réel après hydratation. */
function getServerSnapshot(): readonly string[] {
  return EMPTY;
}

/* ── Affichage compact du reversement dans le panneau ──────────────────────── */

function shortReverse(reward: string | null): string | null {
  if (!reward) return null;
  const m = reward.match(/(\d[\d\u00a0\u202f\s]*(?:[,.]\d+)?)\s*(?:€|euros)/i);
  if (!m) return null;
  return `+ ${m[1].replace(/[\u00a0\u202f\s]/g, " ").trim()} €`;
}

/* ── Composant ─────────────────────────────────────────────────────────────── */

const BUTTON_ID = "favorites-dock-button";

export default function FavoritesDock() {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [open, setOpen] = useState(false);
  const panelId = "favorites-dock-panel";

  /* Initialisation explicite de l'état local au montage (lecture unique). */
  useEffect(() => {
    initFavorites();
  }, []);

  /* Panneau ouvert : fermeture au clic extérieur et à Échap. */
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      const panel = document.getElementById(panelId);
      const button = document.getElementById(BUTTON_ID);
      if (panel?.contains(target) || button?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const bySlug = useMemo(() => {
    const map = new Map<string, DockOffer>();
    for (const offer of dockOffers()) map.set(offer.slug, offer);
    return map;
  }, []);

  const items = favorites
    .map((slug) => bySlug.get(slug))
    .filter((offer): offer is DockOffer => Boolean(offer));
  const count = favorites.length;

  const toggle = (slug: string) => {
    if (isFavorite(slug)) removeFavorite(slug);
    else addFavorite(slug);
  };

  return (
    <>
      <button
        id={BUTTON_ID}
        type="button"
        className={styles.dockButton}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={count > 0 ? `Voir mes favoris (${count})` : "Voir mes favoris"}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.heart} aria-hidden="true">
          {count > 0 ? "♥" : "♡"}
        </span>
        {count > 0 && <span className={styles.count}>{count}</span>}
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label="Mes favoris"
          className={styles.panel}
        >
          <header className={styles.panelHead}>
            <span className={styles.panelTitle}>
              <strong>Mes favoris</strong>
              <span className={styles.panelSub}>
                {count === 1 ? "1 offre enregistrée" : `${count} offres enregistrées`}
              </span>
            </span>
            <button
              type="button"
              className={styles.close}
              aria-label="Fermer le panneau des favoris"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </header>

          {count === 0 ? (
            <div className={styles.empty}>
              <p>Aucun favori pour le moment</p>
              <small>Enregistrez vos offres préférées pour les retrouver facilement.</small>
              <Link href="/offres" className={styles.cta} onClick={() => setOpen(false)}>
                Découvrir les offres <span aria-hidden="true">→</span>
              </Link>
            </div>
          ) : (
            <>
              <ul className={styles.list}>
                {items.map((offer) => {
                  const reverse = shortReverse(offer.parrainioReward);
                  return (
                    <li key={offer.slug} className={styles.item}>
                      <Link href={`/offres/${offer.slug}`} className={styles.itemLink}>
                        <OfferLogo
                          name={offer.name}
                          logo={offer.logo}
                          color={offer.color}
                          logoLetter={offer.logoLetter}
                          size={36}
                        />
                        <span className={styles.itemInfo}>
                          <strong>{offer.name}</strong>
                          <span className={styles.itemReward}>
                            {offer.partnerReward}
                            {reverse ? ` · ${reverse}` : ""}
                          </span>
                        </span>
                      </Link>
                      <button
                        type="button"
                        className={styles.remove}
                        aria-label={`Retirer ${offer.name} des favoris`}
                        onClick={() => toggle(offer.slug)}
                      >
                        ✕
                      </button>
                    </li>
                  );
                })}
              </ul>
              <footer className={styles.panelFoot}>
                <Link href="/favoris" className={styles.seeAll} onClick={() => setOpen(false)}>
                  Voir tous mes favoris <span aria-hidden="true">→</span>
                </Link>
              </footer>
            </>
          )}
        </div>
      )}
    </>
  );
}
