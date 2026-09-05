"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import OfferLogo from "@/components/OfferLogo";
import styles from "./page.module.css";

export type RankingRow = {
  slug: string;
  name: string;
  category: string;
  partnerReward: string;
  parrainioReward: string | null;
  /** Conditions complètes — rendues dans le DOM même accordéon fermé (SEO). */
  conditions: string[];
  /** Résumé très court affiché dans la ligne fermée. */
  summary: string;
  color: string;
  logo: string | null;
  logoLetter: string;
};

type Props = { rows: RankingRow[] };

const SHORT_LINK_LABELS: Record<string, string> = {
  wise: "Faire un transfert avec Wise",
  "hello-fresh": "Voir HelloFresh",
};

export default function RankingTable({ rows }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("Toutes");

  const categories = useMemo(
    () => Array.from(new Set(rows.map((row) => row.category))).sort((a, b) => a.localeCompare(b, "fr")),
    [rows],
  );

  const visible = useMemo(
    () =>
      activeCategory === "Toutes"
        ? rows
        : rows.filter((row) => row.category === activeCategory),
    [rows, activeCategory],
  );

  return (
    <div>
      <div className={styles.filterBar} role="group" aria-label="Filtrer par catégorie">
        <button
          type="button"
          className={`${styles.filterChip} ${activeCategory === "Toutes" ? styles.filterChipActive : ""}`}
          onClick={() => setActiveCategory("Toutes")}
        >
          Toutes ({rows.length})
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`${styles.filterChip} ${activeCategory === category ? styles.filterChipActive : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category} ({rows.filter((row) => row.category === category).length})
          </button>
        ))}
      </div>

      <div className={styles.rankList} role="region" aria-label="Classement des primes">
        <div className={styles.rankHead} aria-hidden="true">
          <span className={styles.hRank}>#</span>
          <span className={styles.hOffer}>Offre</span>
          <span className={styles.hPrime}>Prime filleul</span>
          <span className={styles.hReverse}>Reverse Parrainio</span>
          <span className={styles.hCond}>Conditions essentielles</span>
          <span className={styles.hChev} />
        </div>

        {visible.map((row, index) => (
          <div className={styles.rankRow} key={row.slug}>
            <details className={styles.rankDetails}>
              <summary className={styles.rankSummary}>
                <span className={styles.rankNum}>{index + 1}</span>
                <span className={styles.offerCell}>
                  <OfferLogo
                    name={row.name}
                    logo={row.logo}
                    color={row.color}
                    logoLetter={row.logoLetter}
                    size={34}
                  />
                  <span className={styles.offerName}>
                    <strong>{row.name}</strong>
                    <small>{row.category}</small>
                  </span>
                </span>
                <span className={styles.primeCell}>
                  <span className={styles.cellLabel}>Prime filleul</span>
                  <strong>{row.partnerReward}</strong>
                </span>
                <span className={styles.reverseCell}>
                  <span className={styles.cellLabel}>Reverse Parrainio</span>
                  {row.parrainioReward ? (
                    <span className={styles.reverseBadge}>{row.parrainioReward}</span>
                  ) : (
                    <span className={styles.reverseNone}>—</span>
                  )}
                </span>
                <span className={styles.condShort}>
                  <span className={styles.cellLabel}>Conditions</span>
                  <span className={styles.condText}>{row.summary || "Voir la fiche"}</span>
                </span>
                <span className={styles.chev} aria-hidden="true">▾</span>
              </summary>
              <div className={styles.rankBody}>
                <div className={styles.rankBodyCol}>
                  <strong className={styles.rankBodyTitle}>Conditions principales</strong>
                  <ul className={styles.rankConditions}>
                    {row.conditions.map((condition) => (
                      <li key={condition}>{condition}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.rankBodyCol}>
                  <strong className={styles.rankBodyTitle}>Reversement Parrainio</strong>
                  <p className={styles.rankReverseValue}>
                    {row.parrainioReward ?? "Non communiqué"}
                  </p>
                  <p className={styles.rankReverseNote}>
                    Le reversement Parrainio s&apos;ajoute à la prime filleul
                    lorsqu&apos;il existe. Le détail figure sur la fiche de
                    l&apos;offre.
                  </p>
                </div>
              </div>
            </details>
            <Link href={`/offres/${row.slug}`} className={styles.rankCta}>
              {SHORT_LINK_LABELS[row.slug] ?? "Voir l'offre"}
            </Link>
          </div>
        ))}
      </div>

      {visible.length === 0 && (
        <p className={styles.emptyState}>Aucune offre dans cette catégorie pour le moment.</p>
      )}
    </div>
  );
}
