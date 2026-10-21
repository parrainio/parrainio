"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import type { BaseDelai, OffreObservatoire } from "@/lib/observatoireConditions";
import { echeanceAuPlusTard, formatDateFr } from "@/lib/observatoireEcheance.mjs";

type Props = {
  offres: OffreObservatoire[];
  reversementDelai: string;
  /** Date du jour rendue par le serveur : évite tout décalage d'hydratation. */
  today: string;
};

/** ISO (AAAA-MM-JJ) → date française lisible, sans dépendre du fuseau du navigateur. */
function isoToFr(value: string): string {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return value;
  return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

// Libellés dupliqués côté client pour ne pas embarquer le jeu de données complet.
const BASES: Record<BaseDelai, string> = {
  ouverture_effective: "à partir de l'ouverture effective du compte",
  ouverture_definitive: "à partir de l'ouverture définitive du compte",
  ouverture_compte: "à partir de l'ouverture du compte",
  reussite_parrainage: "à partir de la validation du parrainage",
  validation_parrainage: "à partir de la validation du parrainage",
  entree_en_vigueur_contrat: "à partir de l'entrée en vigueur du contrat",
  signature_contrat_assurance_pret: "à partir de la signature du contrat d'assurance de prêt",
  souscription_contrat: "à partir de la souscription du contrat",
};

export default function Echeancier({ offres, reversementDelai, today }: Props) {
  const [slug, setSlug] = useState(offres[0]?.slug ?? "");
  const [date, setDate] = useState("");

  const offre = useMemo(() => offres.find((o) => o.slug === slug) ?? offres[0], [offres, slug]);
  const structure = offre?.delaiStructure ?? null;
  const echeance = useMemo(() => (structure && date ? echeanceAuPlusTard(structure, date) : null), [structure, date]);

  return (
    <div className={styles.tool}>
      <div className={styles.fields}>
        <label className={styles.field}>
          <span>Offre de parrainage</span>
          <select value={slug} onChange={(event) => setSlug(event.target.value)}>
            {offres.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.nom}
                {item.delaiStructure ? "" : " — délai non publié"}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>{structure ? BASES[structure.base] : "Date de départ"}</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
      </div>

      <div className={styles.result} aria-live="polite">
        {!structure ? (
          <>
            <p className={styles.resultLabel}>Aucune date ne peut être calculée</p>
            <p className={styles.resultText}>
              {offre?.nom} ne publie pas de délai de versement chiffré. Nous ne remplaçons pas cette
              absence par une estimation.
            </p>
            {offre?.terrain ? (
              <p className={styles.terrainNote}>
                <strong>Ce que le terrain indique :</strong> {offre.terrain.delai.texte}, déclenché par :{" "}
                {offre.terrain.declencheur}. C’est une observation du responsable de Parrainio, pas une règle
                publiée : le point de départ exact n’étant pas écrit par la banque, aucune date n’est calculée.
              </p>
            ) : null}
            {offre ? (
              <a className={styles.source} href={offre.source} target="_blank" rel="nofollow noopener">
                Vérifier sur la page officielle ↗
              </a>
            ) : null}
          </>
        ) : !date ? (
          <>
            <p className={styles.resultLabel}>Choisissez une date de départ</p>
            <p className={styles.resultText}>
              Le calcul applique le délai publié ({structure.texte}) à la date que vous indiquez.
            </p>
            {offre?.terrain ? (
              <p className={styles.terrainNote}>
                <strong>Repère terrain :</strong> {offre.terrain.delai.texte}, déclenché par :{" "}
                {offre.terrain.declencheur}. Observation non officielle, affichée à titre indicatif.
              </p>
            ) : null}
          </>
        ) : echeance ? (
          <>
            <p className={styles.resultLabel}>Versement attendu au plus tard le</p>
            <p className={styles.resultDate}>{formatDateFr(echeance)}</p>
            <p className={styles.resultText}>
              Délai publié : {structure.texte}, {BASES[structure.base]}. Ce calcul applique la règle de
              la banque ; il ne garantit ni le versement ni sa date exacte.
            </p>
            <p className={styles.resultText}>
              S’y ajoute le reversement Parrainio : {reversementDelai} après réception de sa
              commission, une fois le parrainage validé et payé par le partenaire.
            </p>
            {offre?.terrain ? (
              <p className={styles.terrainNote}>
                <strong>Ce que le terrain indique :</strong> {offre.terrain.delai.texte}, déclenché par :{" "}
                {offre.terrain.declencheur}. Cette durée est constatée par le responsable de Parrainio, pas
                publiée par la banque ; elle ne remplace pas l’échéance ci-dessus.
              </p>
            ) : null}
            {offre?.campagne ? (
              <p className={styles.warning}>
                {today <= offre.campagne.finLe
                  ? `Campagne en cours : ${offre.campagne.libelle}.`
                  : `Campagne terminée le ${isoToFr(offre.campagne.finLe)} : les montants peuvent avoir changé.`}{" "}
                Une souscription hors campagne change le montant, pas le délai publié.
              </p>
            ) : null}
            {offre ? (
              <a className={styles.source} href={offre.source} target="_blank" rel="nofollow noopener">
                Lire la condition à la source ↗
              </a>
            ) : null}
          </>
        ) : null}
      </div>

      {offre ? (
        <div className={styles.details}>
          <p>
            <strong>Ce que la banque écrit :</strong> « {offre.delaiVersement.citation} »
          </p>
          <p className={styles.detailsMeta}>
            Relevé du {isoToFr(offre.luLe)}, revérifié le {isoToFr(offre.verifieLe ?? offre.luLe)} —{" "}
            <Link href="/observatoire-conditions-prime">voir la méthode et les onze offres</Link>.
          </p>
          {offre.terrain ? (
            <p>
              <strong>Délais constatés, séparément :</strong> prime du filleul {offre.terrain.delais.primeFilleul} ;
              prime du parrain {offre.terrain.delais.commissionParrain} ; reversement Parrainio{" "}
              {offre.terrain.delais.reversementParrainio}. Source : responsable de Parrainio, non officiel.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
