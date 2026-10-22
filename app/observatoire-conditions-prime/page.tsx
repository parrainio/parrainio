import Link from "next/link";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { OG_IMAGE } from "@/lib/ogImage";
import PublicHeaderServer from "@/components/PublicHeaderServer";
import SiteFooter from "@/components/SiteFooter";
import overridesJson from "@/data/offer-overrides.json";
import {
  BASE_DELAI_LABEL,
  NATURE_REPRISE_LABEL,
  STATUT_DELAI_LABEL,
  campagneActive,
  campagneLabel,
  computeStats,
  dateDuJourParis,
  observatoire,
  phraseCle,
} from "@/lib/observatoireConditions";
import {
  CONCORDANCE_TERRAIN_LABEL,
  NATURE_CONSERVATION_LABEL,
  NATURE_REPRISE_TERRAIN_LABEL,
  SIMULTANEITE_LABEL,
  computeTerrainStats,
  experienceTerrain,
} from "@/lib/experienceTerrain";

export const metadata: Metadata = {
  title: "Délais et conditions des primes de parrainage | Parrainio",
  description:
    "Observatoire daté de 11 offres : montants, délais officiels, retours terrain, conditions de conservation et clauses de reprise, avec sources vérifiables.",
  alternates: { canonical: "https://www.parrainio.fr/observatoire-conditions-prime" },
  openGraph: {
    url: "/observatoire-conditions-prime",
    type: "article",
    siteName: "Parrainio",
    locale: "fr_FR",
    images: [OG_IMAGE],
  },
};

// Les badges de campagne changent d'état sans attendre un nouveau déploiement.
export const revalidate = 3600;

type CatalogueSnapshot = {
  partnerReward?: string;
  parrainioReward?: string | null;
  lastVerifiedAt?: string;
  lastUpdated?: string;
};

const catalogueParSlug = overridesJson as Record<string, CatalogueSnapshot>;
const stats = computeStats();
const terrainStats = computeTerrainStats();
const today = dateDuJourParis();
const officialSlugs = new Set(observatoire.offres.map((offer) => offer.slug));
const terrainHorsPerimetre = experienceTerrain.offres.filter((offer) => !officialSlugs.has(offer.slug));
const terrainRattache = observatoire.offres.filter((offer) => offer.terrain).length;

function amountSummary(text: string) {
  if (text.length <= 120) return text;
  const end = text.lastIndexOf(" ", 116);
  return `${text.slice(0, Math.max(end, 100))}…`;
}

const releveLabel = new Date(`${observatoire.releveLe}T12:00:00Z`).toLocaleDateString("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const terrainLabel = new Date(`${experienceTerrain.recuLe}T12:00:00Z`).toLocaleDateString("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "Observatoire Parrainio des conditions de versement des primes de parrainage",
  description:
    "Onze offres documentées à partir de leurs pages officielles, avec un jeu séparé de quatorze retours de terrain attribués et datés.",
  datePublished: observatoire.releveLe,
  dateModified: observatoire.verifieLe ?? observatoire.releveLe,
  inLanguage: "fr-FR",
  isAccessibleForFree: true,
  creator: { "@type": "Organization", name: "Parrainio", url: "https://www.parrainio.fr" },
  spatialCoverage: "France",
  variableMeasured: [
    "Montants annoncés pour le filleul et le parrain",
    "Délai officiel et point de départ",
    "Conditions à remplir",
    "Conservation et reprise des primes",
    "Observations terrain séparées des conditions officielles",
    "Délai de reversement Parrainio après réception de la commission",
  ],
  distribution: [
    {
      "@type": "DataDownload",
      name: "Conditions officielles et observations rattachées — 11 offres",
      encodingFormat: "text/csv",
      contentUrl: `https://www.parrainio.fr/data/observatoire-conditions-${observatoire.releveLe}.csv`,
    },
    {
      "@type": "DataDownload",
      name: "Retours terrain du responsable — 14 observations",
      encodingFormat: "text/csv",
      contentUrl: `https://www.parrainio.fr/data/observatoire-terrain-${experienceTerrain.recuLe}.csv`,
    },
  ],
};

function TerrainDetails({ retour }: { retour: (typeof experienceTerrain.offres)[number] }) {
  return (
    <section className={styles.terrainPanel} aria-label={`Retour terrain pour ${retour.nom}`}>
      <div className={styles.panelHeading}>
        <div>
          <p className={styles.kicker}>Observation indépendante des conditions officielles</p>
          <h3>Transmission du responsable</h3>
        </div>
        <span className={`${styles.tag} ${styles.tagTerrain}`}>Non officielle · {terrainLabel}</span>
      </div>
      <dl className={styles.factGrid}>
        <div>
          <dt>Prime du filleul</dt>
          <dd>{retour.delais.primeFilleul}</dd>
        </div>
        <div>
          <dt>Prime ou commission du parrain</dt>
          <dd>{retour.delais.commissionParrain}</dd>
        </div>
        <div>
          <dt>Reversement Parrainio</dt>
          <dd>{retour.delais.reversementParrainio}</dd>
        </div>
        <div>
          <dt>Déclencheur observé</dt>
          <dd>{retour.declencheur}</dd>
        </div>
        <div>
          <dt>Montants communiqués</dt>
          <dd>{retour.montantsObserves ?? "Aucun montant communiqué pour cette observation."}</dd>
        </div>
        <div>
          <dt>Calendrier des primes</dt>
          <dd>{SIMULTANEITE_LABEL[retour.simultaneite]}</dd>
        </div>
        <div>
          <dt>Conservation</dt>
          <dd>
            <span className={styles.inlineTag}>{NATURE_CONSERVATION_LABEL[retour.conservation.nature]}</span>{" "}
            {retour.conservation.texte}
          </dd>
        </div>
        <div>
          <dt>Reprise rapportée</dt>
          <dd>
            <span className={styles.inlineTag}>{NATURE_REPRISE_TERRAIN_LABEL[retour.reprise.nature]}</span>{" "}
            {retour.reprise.texte}
          </dd>
        </div>
        {retour.exception ? (
          <div className={styles.factWide}>
            <dt>Exception ou réserve</dt>
            <dd>{retour.exception}</dd>
          </div>
        ) : null}
        <div className={styles.factWide}>
          <dt>Écart avec la source officielle</dt>
          <dd>{CONCORDANCE_TERRAIN_LABEL[retour.concordance]}</dd>
        </div>
        <div className={styles.factWide}>
          <dt>Note du responsable</dt>
          <dd>{retour.note}</dd>
        </div>
        {retour.transmissionComplementaire ? (
          <div className={styles.factWide}>
            <dt>Complément financier reçu le {terrainLabel}</dt>
            <dd>
              <p><strong>Prime observée :</strong> {retour.transmissionComplementaire.primeObservee}</p>
              <p><strong>Reversement Parrainio :</strong> {retour.transmissionComplementaire.reversementObserve}</p>
              <p><strong>Concordance indiquée :</strong> {CONCORDANCE_TERRAIN_LABEL[retour.transmissionComplementaire.concordance]}</p>
              <p>{retour.transmissionComplementaire.note}</p>
            </dd>
          </div>
        ) : null}
      </dl>
      <p className={styles.provenance}>
        Source : {experienceTerrain.source}, reçu le {terrainLabel}. Retour d’une seule personne ; aucun
        effectif ni protocole de mesure par offre n’est communiqué. Ces éléments décrivent une pratique,
        pas une condition contractuelle.
      </p>
    </section>
  );
}

function OfficialOfferDetails({ offer }: { offer: (typeof observatoire.offres)[number] }) {
  const catalogue = catalogueParSlug[offer.slug];
  const catalogueDate = catalogue?.lastVerifiedAt ?? catalogue?.lastUpdated;
  const noClawbackPublished = offer.reprise.nature === "aucune_publication";

  return (
    <details className={styles.offerDetails} id={`offre-${offer.slug}`}>
      <summary>
        <span className={styles.summaryName}>{offer.nom}</span>
        <span className={styles.summaryHint}>{STATUT_DELAI_LABEL[offer.delaiVersement.statut]}</span>
      </summary>
      <div className={styles.offerBody}>
        <div className={styles.officialPanel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.kicker}>Conditions publiées par le partenaire</p>
              <h3>{offer.nom}</h3>
            </div>
            <a className={styles.sourceLink} href={offer.source} target="_blank" rel="noreferrer">
              Ouvrir la source officielle ↗
            </a>
          </div>
          <p className={styles.sourceDate}>Page relue le {releveLabel} · source primaire du partenaire · état : {offer.sourceStatut ?? "non précisé"}</p>
          {offer.sourcesComplementaires.filter((source) => source.url !== offer.source).length ? (
            <ul className={styles.sourceList} aria-label={`Sources officielles complémentaires pour ${offer.nom}`}>
              {offer.sourcesComplementaires.filter((source) => source.url !== offer.source).map((source) => (
                <li key={`${source.url}-${source.label}`}>
                  <a href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>
                  <span>Vérifiée le {new Date(`${source.verifieLe}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className={styles.factGrid}>
            <div>
              <h4>Montant filleul annoncé</h4>
              <p>{offer.primeAnnoncee}</p>
            </div>
            <div>
              <h4>Montant parrain annoncé</h4>
              <p>{offer.primeParrain || "Non chiffré dans la source consultée."}</p>
            </div>
            <div className={styles.factWide}>
              <h4>Étapes et conditions d’éligibilité</h4>
              <p>{offer.conditionsOffre.resume}</p>
            </div>
            <div className={styles.factWide}>
              <h4>Délai officiel et point de départ</h4>
              <p>
                <span className={`${styles.tag} ${styles[`tag_${offer.delaiVersement.statut}`]}`}>
                  {STATUT_DELAI_LABEL[offer.delaiVersement.statut]}
                </span>{" "}
                {offer.delaiVersement.resume}
              </p>
              {offer.delaiStructure ? (
                <p className={styles.secondaryText}>
                  Durée structurée : {offer.delaiStructure.texte}, {BASE_DELAI_LABEL[offer.delaiStructure.base]}.
                </p>
              ) : null}
            </div>
            <div className={styles.factWide}>
              <h4>Actions ou validations requises</h4>
              <p>{offer.delaiAction?.resume ?? "Aucune action supplémentaire n’est chiffrée dans la source relevée."}</p>
            </div>
            <div>
              <h4>Conservation publiée</h4>
              <p>{offer.conservation?.resume ?? "Aucune durée de conservation relevée sur cette page."}</p>
            </div>
            <div>
              <h4>Reprise ou non-paiement</h4>
              <p>
                <span className={`${styles.tag} ${offer.reprise.nature === "prelevement" ? styles.tagRisk : styles.tagNeutral}`}>
                  {NATURE_REPRISE_LABEL[offer.reprise.nature]}
                </span>{" "}
                {offer.reprise.resume}
                {noClawbackPublished ? " Cela ne garantit pas qu’aucune reprise soit possible." : ""}
              </p>
            </div>
            <div className={styles.factWide}>
              <h4>Estimation Parrainio</h4>
              {offer.delaiPratique?.resume ? (
                <>
                  <p>{offer.delaiPratique.resume}</p>
                  <p className={styles.secondaryText}>{offer.delaiPratique.hypothese} Estimation indicative, pas un délai du partenaire.</p>
                  {offer.delaiPratique.exception ? <p className={styles.secondaryText}>{offer.delaiPratique.exception}</p> : null}
                </>
              ) : (
                <p>{offer.delaiPratique?.hypothese ?? "Aucune estimation calculable à partir des informations publiées."}</p>
              )}
            </div>
            {offer.differences || offer.ambiguite ? (
              <div className={styles.factWide}>
                <h4>Divergences et informations à vérifier</h4>
                {offer.differences ? <p>{offer.differences}</p> : null}
                {offer.ambiguite ? <p className={styles.warningText}>{offer.ambiguite}</p> : null}
              </div>
            ) : null}
          </div>

          <details className={styles.citationDetails}>
            <summary>Voir les repères de source et les limites de lecture</summary>
            <div className={styles.citationBody}>
              <p><strong>Délai :</strong> {offer.delaiVersement.citation || "Aucun délai chiffré dans la source consultée."}</p>
              <p><strong>Éligibilité :</strong> {offer.conditionsOffre.citation}</p>
              {offer.delaiAction?.citation ? <p><strong>Étapes :</strong> {offer.delaiAction.citation}</p> : null}
              {offer.conservation?.citation ? <p><strong>Conservation :</strong> {offer.conservation.citation}</p> : null}
              {offer.reprise.citation ? <p><strong>Reprise :</strong> {offer.reprise.citation}</p> : null}
              <p>Relevé officiel : {offer.luLe}. État de source : {offer.sourceStatut ?? "non précisé"}.</p>
            </div>
          </details>

          <div className={styles.cataloguePanel}>
            <h4>Instantané du catalogue Parrainio versionné</h4>
            <p><strong>Prime partenaire :</strong> {catalogue?.partnerReward ?? "Non renseignée dans l’override versionné."}</p>
            <p><strong>Reversement Parrainio :</strong> {catalogue?.parrainioReward ?? "Non renseigné dans l’override versionné."}</p>
            <p className={styles.secondaryText}>
              Fichier <code>data/offer-overrides.json</code>{catalogueDate ? ` · vérification indiquée : ${catalogueDate}` : " · date de vérification absente"}.
              Cet instantané Git peut différer de la fiche actuellement servie si une valeur a été modifiée dans l’administration.
            </p>
          </div>
        </div>

        {offer.terrain ? <TerrainDetails retour={offer.terrain} /> : null}

        <p className={styles.offerFooter}>
          <Link href={`/offres/${offer.slug}`}>Voir la fiche Parrainio de {offer.nom} ↗</Link>
        </p>
      </div>
    </details>
  );
}

function TerrainOnlyDetails({ retour }: { retour: (typeof experienceTerrain.offres)[number] }) {
  return (
    <details className={styles.offerDetails} id={`terrain-${retour.slug}`}>
      <summary>
        <span className={styles.summaryName}>{retour.nom}</span>
        <span className={styles.summaryHint}>{retour.fiche ? "Fiche au catalogue" : "Hors catalogue Parrainio"}</span>
      </summary>
      <div className={styles.offerBody}>
        {!retour.fiche ? (
          <p className={styles.warningText}>Observation conservée, mais aucune fiche Parrainio ne permet de la rattacher à une offre suivie.</p>
        ) : null}
        <TerrainDetails retour={retour} />
        {retour.fiche ? <p className={styles.offerFooter}><Link href={`/offres/${retour.slug}`}>Voir la fiche Parrainio de {retour.nom} ↗</Link></p> : null}
      </div>
    </details>
  );
}

export default function ObservatoireConditionsPrimePage() {
  return (
    <main className={styles.page}>
      <PublicHeaderServer active="how" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>Observatoire Parrainio · relevé du {releveLabel}</p>
          <h1>Quand arrivent les primes de parrainage&nbsp;?</h1>
          <p className={styles.heroLead}>
            Nous confrontons les conditions publiées par les partenaires, les montants du catalogue Parrainio
            et les observations du responsable. Chaque donnée garde sa source, sa date et son statut :
            officielle, constatée, estimée ou encore inconnue.
          </p>
          <div className={styles.heroLinks}>
            <a href={`#offres-${observatoire.releveLe}`}>Comparer les 11 offres</a>
            <a href="#retours-terrain">Voir les 14 retours terrain</a>
            <a href="#telechargements">Télécharger les données</a>
          </div>
        </div>
      </section>

      <section className={styles.metricsSection} aria-label="Résultats du relevé">
        <div className={`${styles.container} ${styles.metricsGrid}`}>
          <article><strong>{stats.delaiChiffre}/{stats.total}</strong><span>délai officiel chiffré</span></article>
          <article><strong>{stats.reprisePrelevement}/{stats.total}</strong><span>clause de prélèvement rétroactif identifiée</span></article>
          <article><strong>{terrainRattache}/{stats.total}</strong><span>offres du relevé avec un retour terrain rattaché</span></article>
          <article><strong>{terrainStats.total}</strong><span>observations terrain transmises, dont {terrainHorsPerimetre.length} hors périmètre officiel</span></article>
        </div>
        <p className={styles.metricsNote}>
          Périmètre : {stats.total} partenaires du catalogue Parrainio en banque, finance et assurance, relus le {releveLabel}.
          Les retours terrain couvrent {terrainStats.total} offres et ne représentent pas un échantillon statistique.
        </p>
      </section>

      <section className={styles.processSection}>
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>Quatre étapes distinctes</p>
            <h2>Le point de départ change selon l’offre</h2>
            <p>Une durée ne se lit qu’avec son déclencheur. Une ouverture de compte, un dépôt, une opération qualifiante et une validation ne sont pas la même date.</p>
          </div>
          <ol className={styles.steps}>
            <li><b>1</b><div><h3>Remplir les conditions</h3><p>Dépôt, achat, validations ou justificatifs : la fiche de chaque offre indique les étapes relevées.</p></div></li>
            <li><b>2</b><div><h3>Le partenaire verse la prime</h3><p>Le délai officiel et son point de départ sont cités séparément. Un délai d’action n’est pas un délai de paiement.</p></div></li>
            <li><b>3</b><div><h3>Parrainio reçoit sa commission</h3><p>Le responsable rapporte que cela accompagne généralement la prime du filleul ou du parrain. Les pages partenaires ne le garantissent pas offre par offre.</p></div></li>
            <li><b>4</b><div><h3>Parrainio reverse sa part</h3><p>Le délai habituel communiqué est de 24 à 72 heures après réception de la commission. Pour assurancevie.com, le responsable signale une exception de calendrier à clarifier.</p></div></li>
          </ol>
          <p className={styles.exceptionNote}>
            <strong>Exception assurancevie.com :</strong> les données du responsable indiquent une prime filleul autour de 30 jours,
            une prime parrain autour de 90 jours et la possibilité d’un reversement Parrainio avant réception de la commission.
            Le déclencheur exact de ce reversement n’est pas établi ; la règle générale de 24 à 72 heures ne lui est donc pas appliquée automatiquement.
          </p>
        </div>
      </section>

      <section className={styles.tableSection} id={`offres-${observatoire.releveLe}`}>
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>Comparaison rapide</p>
            <h2>Les 11 offres relues</h2>
            <p>Les montants du partenaire sont distincts entre filleul et parrain. Ouvrez une ligne pour les sources, les citations, les conditions de conservation, les écarts de catalogue et les détails terrain.</p>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.srOnly}>Montants, délais officiels, observations terrain et clauses de reprise, relevé du {releveLabel}</caption>
              <thead><tr><th scope="col">Offre</th><th scope="col">Montants partenaire</th><th scope="col">Délai officiel</th><th scope="col">Retour terrain</th><th scope="col">Conservation / reprise</th></tr></thead>
              <tbody>
                {observatoire.offres.map((offer) => (
                  <tr key={offer.slug}>
                    <th scope="row" data-label="Offre"><a href={`#offre-${offer.slug}`}>{offer.nom}</a><small>{offer.categorie}</small></th>
                    <td data-label="Montants partenaire"><span title={offer.primeAnnoncee}><b>Filleul :</b> {amountSummary(offer.primeAnnoncee.replace(/^Filleul\s*:\s*/i, ""))}</span><span title={offer.primeParrain}><b>Parrain :</b> {amountSummary((offer.primeParrain || "Non chiffré").replace(/^Parrain\s*:\s*/i, ""))}</span></td>
                    <td data-label="Délai officiel"><span className={`${styles.tag} ${styles[`tag_${offer.delaiVersement.statut}`]}`}>{STATUT_DELAI_LABEL[offer.delaiVersement.statut]}</span><span>{offer.delaiStructure?.texte ?? offer.delaiVersement.resume}</span></td>
                    <td data-label="Retour terrain">{offer.terrain ? <><strong>{offer.terrain.delai.texte}</strong><span>Départ : {offer.terrain.declencheur}</span></> : <span className={styles.unknown}>Aucun retour rattaché</span>}</td>
                    <td data-label="Conservation / reprise"><strong>{offer.conservation?.resume ?? "Conservation non précisée sur la page relevée"}</strong><span>{offer.reprise.resume}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.tableNote}>
            « Aucun cas publié » signifie qu’aucune clause n’a été identifiée dans la source consultée ; ce n’est pas une garantie d’absence de reprise.
            Les campagnes datées peuvent expirer : vérifiez le règlement affiché par le partenaire avant de souscrire.
          </p>
          <div className={styles.offerDetailList}>
            {observatoire.offres.map((offer) => <OfficialOfferDetails key={offer.slug} offer={offer} />)}
          </div>
        </div>
      </section>

      <section className={styles.terrainSection} id="retours-terrain">
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>Source séparée · non contractuelle</p>
            <h2>Les {terrainStats.total} observations du responsable</h2>
            <p>{experienceTerrain.note} Huit observations recoupent les 11 offres officielles ci-dessus ; les autres restent accessibles ici, y compris celle de BNP Paribas qui n’a pas de fiche au catalogue.</p>
          </div>
          <div className={styles.offerDetailList}>
            {terrainHorsPerimetre.map((retour) => <TerrainOnlyDetails key={retour.slug} retour={retour} />)}
          </div>
        </div>
      </section>

      <section className={styles.methodSection} id="methodologie">
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>Méthode et limites</p>
            <h2>Ce que les données permettent de dire</h2>
          </div>
          <div className={styles.methodGrid}>
            <article><h3>Officiel</h3><p>Les résumés s’appuient sur les pages publiques des partenaires, relues le {releveLabel}. Les conditions, extraits, URL et dates de vérification figurent dans le détail de chaque offre et dans le CSV.</p></article>
            <article><h3>Terrain</h3><p>Les retours ont été communiqués par le responsable le {terrainLabel}. Ils décrivent son suivi, mais aucun nombre d’observations par offre ni protocole de mesure n’est fourni.</p></article>
            <article><h3>Estimation</h3><p>Quand elle existe, elle combine le délai public et le traitement Parrainio annoncé de 24 à 72 heures après réception de la commission. C’est une estimation interne, pas une date promise par le partenaire.</p></article>
            <article><h3>Inconnu</h3><p>Une information non trouvée reste inconnue. Une clause de reprise absente de la page lue n’est jamais présentée comme une garantie qu’aucune reprise n’existe.</p></article>
          </div>
          <blockquote className={styles.citationReady}>
            <p>{phraseCle(stats)}</p>
            <cite>Observatoire Parrainio · relevé officiel du {releveLabel} · périmètre : {stats.total} partenaires en Banque, Finance et Assurance</cite>
          </blockquote>
          <div className={styles.downloadGrid} id="telechargements">
            <a className={styles.downloadCard} href={`/data/observatoire-conditions-${observatoire.releveLe}.csv`} download>
              <strong>CSV des conditions officielles · {stats.total} offres</strong>
              <span>Inclut citations, montants du catalogue versionné, dates, déclencheurs et retours terrain rattachés.</span>
            </a>
            <a className={styles.downloadCard} href={`/data/observatoire-terrain-${experienceTerrain.recuLe}.csv`} download>
              <strong>CSV des observations terrain · {terrainStats.total} offres</strong>
              <span>Jeu séparé comprenant les 14 transmissions, les réserves et les compléments financiers.</span>
            </a>
          </div>
          <details className={styles.methodDetails}>
            <summary>Périmètre et offres écartées</summary>
            <div>
              <p>{observatoire.perimetre} Le relevé décrit les sources consultées, pas l’ensemble du marché.</p>
              <ul>{observatoire.exclues.map((item) => <li key={item.nom}><strong>{item.nom} :</strong> {item.motif}</li>)}</ul>
            </div>
          </details>
          <p className={styles.reportLink}>Les fichiers téléchargeables préservent les valeurs détaillées et leur provenance. Pour calculer une échéance indicative, consultez <Link href="/echeancier-prime-parrainage">l’échéancier</Link>.</p>
        </div>
      </section>

      <section className={styles.linksSection}>
        <div className={styles.container}>
          <p>Pour comprendre une prime en attente, voir <Link href="/blog/prime-parrainage-pas-encore-versee">le guide des retards</Link>. Pour les reprises, consulter <Link href="/blog/reprise-prime-parrainage-cloture-compte">les clauses de clôture</Link>. Les montants de Parrainio et le rôle de la commission sont expliqués dans <Link href="/comprendre-prime-parrain-filleul-commission">le guide filleul, parrain et commission</Link> et dans la <Link href="/faq">FAQ</Link>.</p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
