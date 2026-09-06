"use client";

/**
 * Favoris d'offres — persistance navigateur (localStorage), sans compte.
 *
 * - stocke UNIQUEMENT des slugs d'offres validés ; aucune donnée personnelle ;
 * - SSR-safe : aucune lecture localStorage au rendu serveur ; l'état n'est
 *   initialisé qu'après hydratation (les boutons rendent un état neutre ♡
 *   avant, puis se mettent à jour au montage — zéro mismatch, pas de saut
 *   de layout notable) ;
 * - synchronisation entre toutes les vues (catalogue, hubs, fiches, page
 *   favoris, compte header) via un event interne + l'event `storage` ;
 * - stockage tolérant aux pannes (navigation privée, quota) : en cas
 *   d'échec d'écriture, l'état reste en mémoire pour la session.
 */

import { offers } from "@/data/offers";

const STORAGE_KEY = "parrainio:favorites";
const EVENT_NAME = "parrainio:favorites-changed";

let cachedFavorites: string[] | null = null;
let hydrated = false;

function validSlugs(): Set<string> {
  try {
    // data/offers.ts est un module de données pur (aucun import node:fs) :
    // utilisable côté client pour valider les slugs stockés.
    return new Set(offers.map((offer) => offer.slug));
  } catch {
    return new Set();
  }
}

function read(): string[] {
  if (typeof window === "undefined") return [];
  if (cachedFavorites) return cachedFavorites;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    const slugs = validSlugs();
    cachedFavorites = Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string" && slugs.has(item))
      : [];
  } catch {
    cachedFavorites = [];
  }
  return cachedFavorites;
}

function write(slugs: string[]): void {
  cachedFavorites = slugs;
  hydrated = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    /* navigation privée / quota : l'état reste en mémoire pour la session */
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function favoritesHydrated(): boolean {
  return hydrated;
}

/** Marque l'état comme initialisé depuis localStorage (appelé au montage). */
export function initFavorites(): string[] {
  const slugs = read();
  hydrated = true;
  return slugs;
}

export function getFavorites(): string[] {
  return read();
}

export function isFavorite(slug: string): boolean {
  return read().includes(slug);
}

export function addFavorite(slug: string): void {
  const current = read();
  if (!current.includes(slug)) write([...current, slug]);
}

export function removeFavorite(slug: string): void {
  write(read().filter((item) => item !== slug));
}

export function toggleFavorite(slug: string): boolean {
  if (isFavorite(slug)) {
    removeFavorite(slug);
    return false;
  }
  addFavorite(slug);
  return true;
}

export function favoritesCount(): number {
  return read().length;
}

/** S'abonne aux changements (internes + autres onglets via event `storage`). */
export function subscribeFavorites(listener: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      cachedFavorites = null;
      listener();
    }
  };
  window.addEventListener(EVENT_NAME, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT_NAME, listener);
    window.removeEventListener("storage", onStorage);
  };
}
