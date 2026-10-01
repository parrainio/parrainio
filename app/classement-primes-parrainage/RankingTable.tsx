"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import OfferLogo from "@/components/OfferLogo";
import { formatProductNames } from "@/lib/productNames";
import { FAMILY_CATEGORIES, norm } from "./families";
import styles from "./page.module.css";

export type RankingRow = {
  slug: string;
  name: string;
  category: string;
  partnerReward: string;
  parrainioReward: string | null;
  /** Conditions complètes — rendues dans le DOM même accordéon fermé (SEO). */
  conditions: string[];
  /** Avantage total (prime filleul + reverse Parrainio) — rang ex æquo. */
  total: number;
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
 * Familles utilisateur : voir families.ts (module partagé avec la page —
 * mêmes groupes pour le filtre client et la section serveur « par catégorie »).
 */

const SHORT_LINK_LABELS: Record<string, string> = {
  wise: "Faire un transfert avec Wise",
};

export default function RankingTable({ rows, panelHeading, panelLead, updated }: Props) {
  const [activeFamily, setActiveFamily] = useState<string>("Toutes");
  /** Ligne dont le popover de conditions est épinglé (clic/clavier). */
  const [openCond, setOpenCond] = useState<string | null>(null);

  /* Fermeture : clic extérieur ou Échap (le bouton lui-même gère son toggle). */
  useEffect(() => {
    if (!openCond) return;
    const onDocClick = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest("[data-cond-popover]")) setOpenCond(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenCond(null);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openCond]);

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

  /* Rangs « ex æquo » : les offres à avantage total égal partagent le rang de
     la première d'entre elles (numérotation compétitive). Recalculé à chaque
     filtre de famille, sur la liste visible. */
  const rankBySlug = useMemo(() => {
    const map = new Map<string, number>();
    const firstByTotal = new Map<number, number>();
    visible.forEach((row, index) => {
      const first = firstByTotal.get(row.total);
      if (first === undefined) {
        firstByTotal.set(row.total, index + 1);
        map.set(row.slug, index + 1);
      } else {
        map.set(row.slug, first);
      }
    });
    return map;
  }, [visible]);

  return (
    <div className={styles.workspace}>
      <aside className={styles.sidePanel}>
        <h1 className={styles.panelTitle}>{panelHeading}</h1>
        <p className={styles.panelLead}>{panelLead}</p>
        <p className={styles.panelCount}>
          <strong>{rows.length}</strong> offres avec un avantage total exprimé
          en euros, classées par avantage total décroissant (prime filleul +
          reversement Parrainio). En cas d&apos;égalité, les offres partagent
          le même rang et sont ordonnées alphabétiquement.
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
        <h2 className={styles.rankTitle}>Les primes de parrainage les plus élevées</h2>
        <div className={styles.rankList} role="region" aria-label="Classement des primes">
          <div className={styles.rankHead} aria-hidden="true">
            <span className={styles.hRank}>#</span>
            <span className={styles.hOffer}>Offre</span>
            <span className={styles.hPrime}>Prime filleul</span>
            <span className={styles.hReverse}>Reverse Parrainio</span>
            <span className={styles.hCond}>Conditions</span>
            <span className={styles.hChev} />
          </div>

          {visible.map((row, index) => (
            <div className={styles.rankRow} key={row.slug}>
              <details className={styles.rankDetails}>
                <summary className={styles.rankSummary}>
                  <span className={styles.rankNum} aria-label={`Rang ${rankBySlug.get(row.slug) ?? index + 1}`}>
                    {rankBySlug.get(row.slug) ?? index + 1}
                  </span>
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
                  <span
                    className={styles.condCell}
                    data-cond-popover=""
                    data-open={openCond === row.slug || undefined}
                  >
                    {row.conditions.length > 0 && (
                      <button
                        type="button"
                        className={styles.condDots}
                        aria-label={`Conditions essentielles — ${row.name}`}
                        aria-expanded={openCond === row.slug}
                        aria-controls={`cond-${row.slug}`}
                        onClick={(event) => {
                          /* N'ouvre PAS l'accordéon <details> parent. */
                          event.preventDefault();
                          event.stopPropagation();
                          setOpenCond(openCond === row.slug ? null : row.slug);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Escape") setOpenCond(null);
                        }}
                      >
                        ⋯
                      </button>
                    )}
                    {row.conditions.length > 0 && (
                      <span
                        id={`cond-${row.slug}`}
                        className={styles.condPopover}
                        role="group"
                        aria-label={`Conditions essentielles — ${row.name}`}
                      >
                        <strong>Conditions essentielles</strong>
                        <ul>
                          {row.conditions.map((condition) => (
                            <li key={condition}>{condition}</li>
                          ))}
                        </ul>
                      </span>
                    )}
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
