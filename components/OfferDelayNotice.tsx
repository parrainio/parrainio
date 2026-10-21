import Link from "next/link";
import type { OffreObservatoire } from "@/lib/observatoireConditions";
import {
  NATURE_CONSERVATION_LABEL,
  NATURE_REPRISE_TERRAIN_LABEL,
  type RetourTerrain,
} from "@/lib/experienceTerrain";
import styles from "./OfferDelayNotice.module.css";

/**
 * Réponse courte à « quand la prime est-elle versée ? » sur une fiche.
 *
 * Trois informations distinctes, jamais additionnées :
 * 1. le délai constaté sur le terrain (observation, non officielle) ;
 * 2. le délai publié par l'établissement (citation sourcée) ;
 * 3. le délai de reversement Parrainio, qui court après réception de la commission.
 *
 * `offre` est absente pour les offres hors observatoire : l'encadré n'affiche
 * alors que le retour terrain, sans citation officielle inventée.
 */
export default function OfferDelayNotice({
  offre,
  terrain,
}: {
  offre?: OffreObservatoire;
  terrain?: RetourTerrain;
}) {
  return (
    <aside className={styles.notice} aria-label="Délai de versement de la prime">
      <strong className={styles.title}>Quand la prime est-elle versée ?</strong>

      {terrain ? (
        <p className={styles.block}>
          <span className={styles.label}>Délai constaté — non officiel</span>
          <span className={styles.value}>{terrain.delai.texte}</span>
          <span className={styles.detail}>Déclencheur : {terrain.declencheur}.</span>
          <span className={styles.detail}>
            Retour d’expérience du responsable de Parrainio, {terrain.delais.reversementParrainio} pour
            le reversement. Ce n’est pas une condition de l’établissement.
          </span>
        </p>
      ) : null}

      {offre ? (
        <p className={styles.block}>
          <span className={styles.label}>Délai publié par {offre.nom}</span>
          <span className={styles.value}>{offre.delaiVersement.resume}</span>
        </p>
      ) : null}

      {terrain ? (
        <p className={styles.block}>
          <span className={styles.label}>Conservation et reprise</span>
          <span className={styles.detail}>
            {terrain.conservation.texte} ({NATURE_CONSERVATION_LABEL[terrain.conservation.nature]}).
          </span>
          <span className={styles.detail}>
            {NATURE_REPRISE_TERRAIN_LABEL[terrain.reprise.nature]} : {terrain.reprise.texte}
          </span>
        </p>
      ) : null}

      {terrain?.exception ? <p className={styles.exception}>À noter : {terrain.exception}</p> : null}

      <p className={styles.links}>
        {offre ? (
          <Link href="/observatoire-conditions-prime">Citation et conditions complètes</Link>
        ) : (
          <Link href="/observatoire-conditions-prime">Méthode de nos relevés</Link>
        )}
        {offre?.delaiStructure ? (
          <>
            {" · "}
            <Link href="/echeancier-prime-parrainage">Calculer une date</Link>
          </>
        ) : null}
      </p>
    </aside>
  );
}
