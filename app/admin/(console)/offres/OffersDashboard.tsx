"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import OfferLogo from "@/components/OfferLogo";
import styles from "../../admin.module.css";

type DashboardOffer = {
  slug: string;
  name: string;
  category: string;
  partnerReward: string;
  parrainioReward: string | null;
  referralCode: string | null;
  referralLink: string | null;
  conditions: string[];
  lastUpdated: string | null;
  logo: string | null;
  logoVerified: boolean;
  color: string;
  logoLetter: string;
  status: "complete" | "partial" | "incomplete" | "review";
  statusLabel: string;
  indicators: {
    hasCode: boolean;
    hasLink: boolean;
    hasConditions: boolean;
    hasLogo: boolean;
  };
};

type SortKey =
  | "name"
  | "category"
  | "partnerReward"
  | "parrainioReward"
  | "status"
  | "lastUpdated";

function mark(ok: boolean, label: string) {
  return (
    <span className={`${styles.mark} ${ok ? styles.ok : styles.ko}`}>
      {label} {ok ? "✓" : "✗"}
    </span>
  );
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function OffersDashboard({
  offers,
  categories,
  stats,
}: {
  offers: DashboardOffer[];
  categories: string[];
  stats: {
    total: number;
    complete: number;
    partial: number;
    incomplete: number;
    review: number;
  };
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const list = offers.filter((offer) => {
      const matchesQuery =
        !normalized ||
        offer.name.toLowerCase().includes(normalized) ||
        offer.slug.toLowerCase().includes(normalized) ||
        offer.referralCode?.toLowerCase().includes(normalized);
      const matchesCategory = category === "all" || offer.category === category;
      const matchesStatus = status === "all" || offer.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });

    return list.sort((a, b) => {
      const left = a[sortKey] ?? "";
      const right = b[sortKey] ?? "";
      const result = String(left).localeCompare(String(right), "fr", { numeric: true });
      return sortDir === "asc" ? result : -result;
    });
  }, [offers, query, category, status, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("asc");
  }

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p>Back-office</p>
          <h1>Offres Parrainio</h1>
        </div>
        <p className={styles.muted}>{filtered.length} offre{filtered.length > 1 ? "s" : ""} affichée{filtered.length > 1 ? "s" : ""}</p>
      </div>

      <div className={styles.stats}>
        <article className={`${styles.stat} ${styles.statMain}`}>
          <span>Offres complètes</span>
          <strong>
            {stats.complete} / {stats.total}
          </strong>
        </article>
        <article className={styles.stat}>
          <span>Partielles</span>
          <strong>{stats.partial}</strong>
        </article>
        <article className={styles.stat}>
          <span>À compléter</span>
          <strong>{stats.incomplete}</strong>
        </article>
        <article className={styles.stat}>
          <span>À vérifier</span>
          <strong>{stats.review}</strong>
        </article>
        <article className={styles.stat}>
          <span>Total</span>
          <strong>{stats.total}</strong>
        </article>
      </div>

      <div className={styles.filters}>
        <input
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher une entreprise, un slug ou un code"
          value={query}
        />
        <select onChange={(event) => setCategory(event.target.value)} value={category}>
          <option value="all">Toutes les catégories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select onChange={(event) => setStatus(event.target.value)} value={status}>
          <option value="all">Tous les statuts</option>
          <option value="complete">Complète</option>
          <option value="partial">Partielle</option>
          <option value="incomplete">À compléter</option>
          <option value="review">À vérifier</option>
        </select>
        <select
          onChange={(event) => setSortKey(event.target.value as SortKey)}
          value={sortKey}
        >
          <option value="name">Trier par nom</option>
          <option value="category">Trier par catégorie</option>
          <option value="partnerReward">Trier par bonus</option>
          <option value="status">Trier par statut</option>
          <option value="lastUpdated">Trier par modification</option>
        </select>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => toggleSort("name")}>Entreprise</th>
              <th onClick={() => toggleSort("category")}>Catégorie</th>
              <th onClick={() => toggleSort("partnerReward")}>Bonus partenaire</th>
              <th>Récompense Parrainio</th>
              <th>Code</th>
              <th>Lien</th>
              <th>Conditions</th>
              <th onClick={() => toggleSort("status")}>Statut</th>
              <th onClick={() => toggleSort("lastUpdated")}>Modifiée</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((offer) => (
              <tr key={offer.slug}>
                <td>
                  <Link className={styles.company} href={`/admin/offres/${offer.slug}`}>
                    <OfferLogo
                      color={offer.color}
                      logo={offer.logo}
                      logoLetter={offer.logoLetter}
                      name={offer.name}
                      size={34}
                    />
                    <span>{offer.name}</span>
                  </Link>
                </td>
                <td>{offer.category}</td>
                <td>{offer.partnerReward}</td>
                <td>{offer.parrainioReward ?? "—"}</td>
                <td className={styles.truncate}>{offer.referralCode ?? "—"}</td>
                <td className={styles.truncate}>{offer.referralLink ?? "—"}</td>
                <td>
                  <div className={styles.marks}>
                    {mark(offer.indicators.hasCode, "Code")}
                    {mark(offer.indicators.hasLink, "Lien")}
                    {mark(offer.indicators.hasConditions, "Cond.")}
                    <span className={`${styles.mark} ${offer.logo ? styles.ok : styles.ko}`}>
                      {offer.logo ? (offer.logoVerified ? "Logo ✓" : "Logo à vérifier") : "Logo ✗"}
                    </span>
                  </div>
                </td>
                <td>
                  <span className={`${styles.badge} ${styles[offer.status]}`}>
                    {offer.status === "complete"
                      ? "🟢"
                      : offer.status === "partial"
                        ? "🟡"
                        : offer.status === "incomplete"
                          ? "🔴"
                          : "🟠"}{" "}
                    {offer.statusLabel}
                  </span>
                </td>
                <td>{formatDate(offer.lastUpdated)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
