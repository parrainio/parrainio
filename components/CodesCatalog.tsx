"use client";

import Link from "next/link";
import { useState } from "react";
import CopyTextButton from "@/components/CopyTextButton";
import OfferLogo from "@/components/OfferLogo";
import styles from "./CodesCatalog.module.css";

/**
 * Item du hub /codes-parrainage : une offre dont le mécanisme est
 * code (public ou parrain), numéro d'invitation, ou invitation par lien/e-mail.
 */
export type HubItem = {
  slug: string;
  name: string;
  category: string;
  mechanism: "CODE_PUBLIC" | "CODE_PARRAIN" | "NUMERO_PARRAIN" | "LIEN_EMAIL";
  mechanismLabel: string;
  code?: string;
  invitationHref?: string;
  reward: string;
  reverse: string | null;
  color: string;
  logo: string | null;
  logoLetter: string;
};

/**
 * Listing du hub : filtre par catégorie côté client (aucune URL indexable
 * générée), cartes scannables. Le bouton « Copier » n'est rendu que pour les
 * vrais codes/numéros — jamais pour un lien ou une invitation e-mail.
 */
export default function CodesCatalog({
  items,
  categories,
}: {
  items: HubItem[];
  categories: string[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const visible = active ? items.filter((item) => item.category === active) : items;

  return (
    <div className={styles.wrap}>
      <div className={styles.filters} role="group" aria-label="Filtrer par catégorie">
        <button
          type="button"
          className={`${styles.filter} ${active === null ? styles.filterActive : ""}`}
          aria-pressed={active === null}
          onClick={() => setActive(null)}
        >
          Tous ({items.length})
        </button>
        {categories.map((category) => {
          const count = items.filter((item) => item.category === category).length;
          return (
            <button
              key={category}
              type="button"
              className={`${styles.filter} ${active === category ? styles.filterActive : ""}`}
              aria-pressed={active === category}
              onClick={() => setActive(active === category ? null : category)}
            >
              {category} ({count})
            </button>
          );
        })}
      </div>
      <div className={styles.grid}>
        {visible.map((item) => (
          <article key={item.slug} className={styles.card}>
            <div className={styles.cardHead}>
              <OfferLogo
                color={item.color}
                logo={item.logo}
                logoLetter={item.logoLetter}
                name={item.name}
                size={38}
              />
              <div className={styles.cardTitle}>
                <strong>{item.name}</strong>
                <span className={styles.mechanism}>{item.mechanismLabel}</span>
              </div>
            </div>
            <p className={styles.reward}>{item.reward}</p>
            {item.reverse && (
              <p className={styles.reverse}>Parrainio reverse en plus : {item.reverse}</p>
            )}
            <div className={styles.valueRow}>
              {item.code ? (
                <>
                  <code className={styles.codeValue}>{item.code}</code>
                  <CopyTextButton value={item.code} label="Copier" copiedLabel="Copié ✓" />
                </>
              ) : item.invitationHref ? (
                <a
                  className={styles.inviteLink}
                  href={item.invitationHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  Accéder à l&apos;invitation →
                </a>
              ) : null}
            </div>
            <Link href={`/offres/${item.slug}`} className={styles.cardCta}>
              Voir la fiche et les conditions →
            </Link>
          </article>
        ))}
      </div>
      {visible.length === 0 && (
        <p className={styles.empty}>Aucune offre dans cette catégorie.</p>
      )}
    </div>
  );
}
