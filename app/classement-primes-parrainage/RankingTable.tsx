"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import OfferLogo from "@/components/OfferLogo";
import { formatProductNames } from "@/lib/productNames";
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

type Props = {
  rows: RankingRow[];
  /** H1 du panneau gauche — contenu serveur, rendu dans le HTML (SEO inchangé). */
  panelHeading: ReactNode;
  /** Introduction courte du panneau gauche. */
  panelLead: ReactNode;
  updated: string;
};

/**
 * Groupes utilisateur — LOGIQUE D'AFFICHAGE UNIQUEMENT.
 * Les 29 catégories sous-jacentes des offres restent strictement inchangées ;
 * la correspondance est insensible à la casse (« sondage » comme « Sondage »).
 */
const FAMILY_CATEGORIES: { label: string; categories: string[] }[] = [
  {
    label: "Banque & assurance",
    categories: ["banque", "assurance", "assurance auto", "finance", "pro & finance", "pro & assurance"],
  },
  {
    label: "Investissement & crypto",
    categories: ["crypto", "investissement", "épargne & assurance-vie"],
  },
  {
    label: "Cashback & récompenses",
    categories: ["cashback", "récompenses", "sondage"],
  },
  {
    label: "Shopping & maison",
    categories: ["shopping", "mode & shopping", "maison", "maison & shopping", "bébé", "animaux", "finance & shopping"],
  },
  {
    label: "Sport & nutrition",
    categories: ["sport", "sport & nutrition", "sport & shopping"],
  },
  {
    label: "Courses & restaurants",
    categories: ["courses", "courses & anti-gaspi", "restaurants"],
  },
  { label: "Jeux & paris", categories: ["jeux & paris"] },
  { label: "Énergie", categories: ["énergie"] },
  { label: "Mobilité", categories: ["mobilité"] },
];

const norm = (value: string) => value.trim().toLowerCase();

const SHORT_LINK_LABELS: Record<string, string> = {
  wise: "Faire un transfert avec Wise",
  "hello-fresh": "Voir HelloFresh",
};

export default function RankingTable({ rows, panelHeading, panelLead, updated }: Props) {
  const [activeFamily, setActiveFamily] = useState<string>("Toutes");

  const families = useMemo(
    () =>
      FAMILY_CATEGORIES.map(({ label, categories }) => ({
        label,
        count: rows.filter((row) => categories.includes(norm(row.category))).length,
      })),
    [rows],
  );

  const visible = useMemo(() => {
    if (activeFamily === "Toutes") return rows;
    const family = FAMILY_CATEGORIES.find(({ label }) => label === activeFamily);
    if (!family) return rows;
    return rows.filter((row) => family.categories.includes(norm(row.category)));
  }, [rows, activeFamily]);

  return (
    <div className={styles.workspace}>
      <aside className={styles.sidePanel}>
        <h1 className={styles.panelTitle}>{panelHeading}</h1>
        <p className={styles.panelLead}>{panelLead}</p>
        <p className={styles.panelCount}>
          <strong>{rows.length}</strong> offres avec un avantage filleul
          exprimé en euros, classées par montant décroissant.
        </p>
        <p className={styles.updated}>Données vérifiées et mises à jour le {updated}.</p>
        <label className={styles.selectLabel} htmlFor="classement-famille">
          Catégorie
        </label>
        <div className={styles.selectWrap}>
          <select
            id="classement-famille"
            className={styles.familySelect}
            value={activeFamily}
            onChange={(event) => setActiveFamily(event.target.value)}
          >
            <option value="Toutes">Toutes les offres ({rows.length})</option>
            {families.map((family) => (
              <option key={family.label} value={family.label}>
                {family.label} ({family.count})
              </option>
            ))}
          </select>
          <span className={styles.selectChevron} aria-hidden="true">
            ▾
          </span>
        </div>
      </aside>

      <div className={styles.rankingPanel}>
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
                      <span className={styles.reverseBadge}>{formatProductNames(row.parrainioReward)}</span>
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
                      {row.parrainioReward ? formatProductNames(row.parrainioReward) : "Non communiqué"}
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
    </div>
  );
}
