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
  conditions: string;
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

      <div className={styles.tableWrap} role="region" aria-label="Classement des primes">
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col" className={styles.rankCol}>#</th>
              <th scope="col">Offre</th>
              <th scope="col" className={styles.amountCol}>Prime filleul</th>
              <th scope="col" className={styles.reverseCol}>Reverse Parrainio</th>
              <th scope="col" className={styles.conditionsCol}>Conditions essentielles</th>
              <th scope="col" className={styles.ctaCol}><span className={styles.srOnly}>Fiche détaillée</span></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row, index) => (
              <tr key={row.slug}>
                <td className={styles.rankCol}>{index + 1}</td>
                <td>
                  <div className={styles.offerCell}>
                    <OfferLogo
                      name={row.name}
                      logo={row.logo}
                      color={row.color}
                      logoLetter={row.logoLetter}
                      size={34}
                    />
                    <span>
                      <strong>{row.name}</strong>
                      <small>{row.category}</small>
                    </span>
                  </div>
                </td>
                <td className={styles.amountCol}>
                  <strong>{row.partnerReward}</strong>
                </td>
                <td className={styles.reverseCol}>{row.parrainioReward ?? "—"}</td>
                <td className={styles.conditionsCol}>{row.conditions || "Voir la fiche"}</td>
                <td className={styles.ctaCol}>
                  <Link
                    href={`/offres/${row.slug}`}
                    className={styles.ctaLink}
                  >
                    {SHORT_LINK_LABELS[row.slug] ?? "Voir l'offre"}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visible.length === 0 && (
        <p className={styles.emptyState}>Aucune offre dans cette catégorie pour le moment.</p>
      )}
    </div>
  );
}
