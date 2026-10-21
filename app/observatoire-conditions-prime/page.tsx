import Link from "next/link";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { OG_IMAGE } from "@/lib/ogImage";
import PublicHeaderServer from "@/components/PublicHeaderServer";
import SiteFooter from "@/components/SiteFooter";
import {
  DELAI_PRATIQUE_LABEL,
  NATURE_REPRISE_LABEL,
  STATUT_DELAI_LABEL,
  campagneActive,
  campagneLabel,
  computeStats,
  dateDuJourParis,
  observatoire,
  offresAvecTerrain,
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
  title: "Quand la prime de parrainage est-elle versée ? | Parrainio",
  description:
    "Observatoire Parrainio : onze offres de parrainage bancaire passées au crible. Délai de versement, conditions et cas de reprise, sources à l’appui.",
  alternates: { canonical: "https://www.parrainio.fr/observatoire-conditions-prime" },
  openGraph: {
    url: "/observatoire-conditions-prime",
    type: "article",
    siteName: "Parrainio",
    locale: "fr_FR",
    images: [OG_IMAGE],
  },
};

// Le statut des campagnes datées vieillit sans nous : revalidation horaire.
export const revalidate = 3600;

const stats = computeStats();
const today = dateDuJourParis();
const retours = offresAvecTerrain();
const terrainStats = computeTerrainStats(retours.map((offre) => offre.terrain!));

/** Date lisible en français ; l'ISO reste réservé au JSON-LD et au CSV. */
const releveLabel = new Date(`${observatoire.releveLe}T12:00:00Z`).toLocaleDateString("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const verifieLabel = observatoire.verifieLe
  ? new Date(`${observatoire.verifieLe}T12:00:00Z`).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    })
  : null;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "Observatoire Parrainio des conditions de versement des primes de parrainage",
  description:
    "Relevé de onze offres de parrainage bancaire en France : délai de versement annoncé, conditions à remplir, durée de conservation et cas de reprise de la prime, avec citation littérale et source officielle.",
  datePublished: observatoire.releveLe,
  dateModified: observatoire.verifieLe ?? observatoire.releveLe,
  inLanguage: "fr-FR",
  isAccessibleForFree: true,
  creator: { "@type": "Organization", name: "Parrainio", url: "https://www.parrainio.fr" },
  spatialCoverage: "France",
  variableMeasured: [
    "Délai de versement annoncé",
    "Délai pratique estimé pour le filleul",
    "Délai de reversement Parrainio",
    "Conditions à remplir",
    "Durée de conservation",
    "Cas de reprise de la prime",
    "Délai constaté sur le terrain",
    "Déclencheur du délai",
    "Commissions versées simultanément ou non",
  ],
  distribution: [
    {
      "@type": "DataDownload",
      encodingFormat: "text/csv",
      contentUrl: "https://www.parrainio.fr/data/observatoire-conditions-2026-10-20.csv",
    },
  ],
};

export default function ObservatoireConditionsPrimePage() {
  return (
    <main className={styles.page}>
      <PublicHeaderServer active="how" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}><span />Observatoire Parrainio — édition 2026</p>
          <h1>Quand la prime de parrainage <em>arrive-t-elle</em> ?</h1>
          <p className={styles.heroLead}>
            Les comparatifs répondent au <strong>combien</strong>. Rarement au <strong>quand</strong>, et
            presque jamais au <strong>qu’est-ce qui peut me la reprendre</strong>. Nous avons lu les pages
            officielles de {stats.total} offres de parrainage bancaire le {releveLabel} et relevé,
            mot pour mot, ce que chacune publie.
          </p>
          <div className={styles.heroMeta}>
            <span>{stats.total} offres lues</span>
            <span>Relevé du {releveLabel}</span>
            <span>Citations et sources vérifiables</span>
            {verifieLabel ? <span>Sources revérifiées le {verifieLabel}</span> : null}
            <span>CSV téléchargeable</span>
          </div>
        </div>
      </section>

      <section className={styles.keySection}>
        <div className={styles.container}>
          <div className={styles.keyGrid}>
            <article className={styles.keyCard}>
              <p className={styles.keyFigure}><strong>{stats.delaiChiffre}</strong><span>/ {stats.total}</span></p>
              <p className={styles.keyLabel}>offres indiquent un délai de versement chiffré</p>
            </article>
            <article className={styles.keyCard}>
              <p className={styles.keyFigure}><strong>{stats.reprisePrelevement}</strong><span>/ {stats.total}</span></p>
              <p className={styles.keyLabel}>offres décrivent un prélèvement rétroactif de la prime</p>
            </article>
            <article className={styles.keyCard}>
              <p className={styles.keyFigure}><strong>{stats.delaiActionDocumente}</strong><span>/ {stats.total}</span></p>
              <p className={styles.keyLabel}>offres indiquent une échéance pour remplir les conditions</p>
            </article>
            <article className={styles.keyCard}>
              <p className={styles.keyFigure}><strong>{stats.delaiNonPublie + stats.delaiRenvoi}</strong><span>/ {stats.total}</span></p>
              <p className={styles.keyLabel}>offres ne donnent aucun délai lisible sur la page</p>
            </article>
          </div>
          <p className={styles.keyNote}>
            Décompte sur {stats.total} offres : {stats.delaiChiffre} délais chiffrés, {stats.delaiRenvoi} renvois
            vers un document externe, {stats.delaiNonPublie} absence de délai. Les dénominateurs sont toujours
            le nombre d’offres incluses, jamais le nombre de mentions trouvées.
          </p>
        </div>
      </section>

      <section className={styles.chainSection} id="delai-pratique">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>Du versement au reversement</p>
            <h2>Trois délais, <em>trois natures</em></h2>
            <p>
              Un parrainage ne produit pas un versement, mais une chaîne. La banque valide le
              parrainage et verse la prime ; Parrainio reçoit ensuite la commission du partenaire,
              puis reverse sa part au filleul. Chaque étape a son propre délai — et une seule est
              écrite noir sur blanc dans les conditions de la banque.
            </p>
          </div>

          <ol className={styles.chain}>
            <li>
              <span className={styles.chainNumber}>1</span>
              <div>
                <h3>Les conditions sont remplies</h3>
                <p>
                  Dépôt, premier versement, opérations : la banque vérifie que le filleul a fait ce
                  que l’offre demande. Tant que ce n’est pas fait, aucun délai de versement ne court.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.chainNumber}>2</span>
              <div>
                <h3>La banque verse la prime</h3>
                <p>
                  C’est le délai publié dans le tableau ci-dessous. Il s’agit souvent d’un maximum,
                  pas d’une date : « au plus tard dans les 2 mois » n’annonce pas un virement à
                  échéance fixe.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.chainNumber}>3</span>
              <div>
                <h3>Parrainio reçoit sa commission</h3>
                <p>
                  Le partenaire rémunère le site de parrainage pour le client apporté. Notre retour
                  de terrain indique que ce règlement accompagne généralement le versement de la
                  prime, et qu’une notification ou un e-mail signale l’opération. Aucune page
                  officielle ne le garantit offre par offre.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.chainNumber}>4</span>
              <div>
                <h3>Parrainio reverse sa part</h3>
                <p>
                  Le reversement part après réception de cette commission, généralement sous{" "}
                  {observatoire.reversement.delai}. C’est un engagement de Parrainio, pas une
                  condition bancaire : il ne peut pas commencer avant que la banque ait payé.
                </p>
              </div>
            </li>
          </ol>

          <div className={styles.chainCards}>
            <article>
              <p className={styles.chainTag}>Ce que dit la banque</p>
              <h3>Délai publié</h3>
              <p>
                {stats.delaiChiffre} offres sur {stats.total} le chiffrent. Il est cité mot pour mot,
                avec sa source et sa date — et laissé vide quand il n’existe pas.
              </p>
            </article>
            <article>
              <p className={styles.chainTag}>Ce que nous estimons</p>
              <h3>Délai pratique</h3>
              <p>
                {stats.estimationDisponible} offres sur {stats.total} permettent une estimation :
                délai publié + 24 à 72 h de traitement. C’est un ordre de grandeur haut, jamais une
                date promise.
              </p>
            </article>
            <article>
              <p className={styles.chainTag}>Ce que nous observons</p>
              <h3>Retour de terrain</h3>
              <p>
                {stats.terrainDocumente} offres du relevé ont un délai constaté par le responsable de
                Parrainio, et {terrainStats.avecRetour} au total dans notre base. Il est stocké dans un
                fichier distinct, marqué non officiel, et confronté à la page de la banque ci-dessous.
              </p>
            </article>
          </div>

          <p className={styles.chainNote}>
            <strong>Une exception documentée.</strong> {experienceTerrain.reversement.simultaneite}{" "}
            Le relevé terrain contient une exception : chez assurancevie.com, la prime du filleul arrive
            vers 30 jours et celle du parrain vers 90 jours. Pour cette offre, le calendrier du
            reversement ne suit donc pas celui de la prime du filleul, et un reversement peut être
            versé avant que Parrainio ait reçu sa commission. Les deux primes ne se lisent jamais comme
            une seule durée. {" "}
            {observatoire.noteDelaiPratique} Pour comprendre pourquoi un versement peut tarder, voir{" "}
            <Link href="/blog/prime-parrainage-pas-encore-versee">les causes d’un versement retardé</Link> ;
            pour les durées de conservation, voir{" "}
            <Link href="/blog/reprise-prime-parrainage-cloture-compte">la reprise après clôture</Link>, et{" "}
            <Link href="/blog/delai-versement-prime-parrainage-comment-lire">le guide de lecture des délais</Link>{" "}
            pour les unités et les points de départ.
          </p>
        </div>
      </section>

      <section className={styles.tableSection} id="tableau">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>Le tableau</p>
            <h2>Ce que chaque banque publie — <em>et ce qu’elle tait</em></h2>
            <p>
              Une ligne par offre. La première ligne de la colonne « délai de versement » ne reprend que ce
              qui est écrit sur la page officielle ; la seconde est notre estimation, clairement séparée.
              Quand la page ne dit rien, les deux le disent.
            </p>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.srOnly}>
                Délai de versement, conditions et cas de reprise des primes de parrainage, par offre, relevé le{" "}
                {releveLabel}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Offre</th>
                  <th scope="col">Prime annoncée</th>
                  <th scope="col">Délai de versement</th>
                  <th scope="col">Conditions à remplir</th>
                  <th scope="col">Ce qui peut faire perdre la prime</th>
                </tr>
              </thead>
              <tbody>
                {observatoire.offres.map((offre) => (
                  <tr key={offre.slug}>
                    <th scope="row">
                      <Link className={styles.offerName} href={`/offres/${offre.slug}`}>
                        {offre.nom}
                      </Link>
                      <span className={styles.offerCat}>{offre.categorie}</span>
                    </th>
                    <td data-label="Prime annoncée">
                      {offre.primeAnnoncee}
                      {offre.campagne ? (
                        <span
                          className={`${styles.campagneBadge} ${
                            campagneActive(offre.campagne, today) ? "" : styles.campagneBadgeExpiree
                          }`}
                          title={offre.campagne.libelle}
                        >
                          {campagneLabel(offre.campagne, today)}
                        </span>
                      ) : null}
                    </td>
                    <td data-label="Délai de versement">
                      <span className={`${styles.badge} ${styles[`badge_${offre.delaiVersement.statut}`]}`}>
                        {STATUT_DELAI_LABEL[offre.delaiVersement.statut]}
                      </span>
                      <span className={styles.cellText}>{offre.delaiVersement.resume}</span>
                      <span className={styles.practice}>
                        <span className={styles.practiceLabel}>
                          {DELAI_PRATIQUE_LABEL[offre.delaiPratique?.statut ?? "non_calculable"]}
                        </span>
                        <span className={offre.delaiPratique?.resume ? styles.practiceValue : styles.muted}>
                          {offre.delaiPratique?.resume ??
                            (offre.delaiVersement.statut === "renvoi"
                              ? "Délai dans les mentions : pas d’estimation"
                              : "Aucun délai publié : pas d’estimation")}
                        </span>
                        {offre.delaiPratique?.exception ? (
                          <span className={styles.practiceException}>À noter : {offre.delaiPratique.exception}</span>
                        ) : null}
                      </span>
                      {offre.terrain ? (
                        <span className={styles.terrain}>
                          <span className={styles.terrainLabel}>Délai constaté — non officiel</span>
                          <span className={styles.terrainValue}>{offre.terrain.delai.texte}</span>
                          <span className={styles.terrainDeclencheur}>Déclencheur : {offre.terrain.declencheur}</span>
                        </span>
                      ) : null}
                    </td>
                    <td data-label="Conditions à remplir">{offre.delaiAction ? offre.delaiAction.resume : <span className={styles.muted}>Non détaillées sur la page</span>}</td>
                    <td data-label="Ce qui peut faire perdre la prime">
                      <span className={`${styles.badge} ${offre.reprise.nature === "aucune_publication" ? styles.badge_non_publie : styles.badge_prelevement}`}>
                        {NATURE_REPRISE_LABEL[offre.reprise.nature]}
                      </span>
                      <span className={offre.reprise.nature === "aucune_publication" ? styles.muted : styles.cellText}>
                        {offre.reprise.resume}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.tableNote}>
            Les montants affichés sont ceux de nos fiches au {releveLabel} ; les campagnes changent,
            seule la page de l’établissement fait foi au moment de souscrire. Le « délai pratique »
            est une estimation Parrainio, pas une information de la banque : elle additionne le délai
            publié et 24 à 72 h de traitement du reversement, en supposant que le délai publié décrit
            la commission reçue par Parrainio. Aucune durée n’est calculée quand le délai n’est pas
            lisible sur la page officielle. La dernière ligne de chaque cellule, « délai constaté »,
            vient du terrain : ce n’est pas une condition publiée et elle n’entre pas dans le calcul.
          </p>
        </div>
      </section>

      <section className={styles.quotesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>Les mots exacts</p>
            <h2>Chaque ligne a sa <em>citation</em></h2>
            <p>
              Un résumé peut trahir. Voici les extraits littéraux, avec la page d’origine : vous pouvez tout
              revérifier sans nous croire.
            </p>
          </div>
          <div className={styles.quoteList}>
            {observatoire.offres.map((offre) => (
              <article key={offre.slug} className={styles.quoteCard}>
                <div className={styles.quoteHead}>
                  <h3>{offre.nom}</h3>
                  <a href={offre.source} rel="nofollow noopener" target="_blank" className={styles.sourceLink}>
                    Page officielle ↗
                  </a>
                </div>
                <blockquote className={styles.quote}>
                  <p>« {offre.delaiVersement.citation} »</p>
                </blockquote>
                {offre.reprise.citation ? (
                  <p className={styles.quoteSecond}>
                    <strong>Reprise :</strong> « {offre.reprise.citation} »
                  </p>
                ) : null}
                {offre.ambiguite ? (
                  <p className={styles.ambiguity}><strong>Ambiguïté relevée :</strong> {offre.ambiguite}</p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.experienceSection} id="retours-experience">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>Retours d’expérience</p>
            <h2>Ce que le terrain montre — <em>et ce qui reste à prouver</em></h2>
            <p>
              Ces observations viennent du responsable de Parrainio, pas des banques. Elles ne sont ni
              des conditions officielles ni des garanties : chaque ligne indique si la page de
              l’établissement la confirme, la contredit, ou ne permet pas de trancher.
            </p>
          </div>
          <div className={styles.experienceGrid}>
            {retours.map((offre) => {
              const terrain = offre.terrain!;
              return (
                <article key={offre.slug} className={styles.experienceCard}>
                  <div className={styles.experienceHead}>
                    <h3>
                      <Link href={`/offres/${offre.slug}`}>{offre.nom}</Link>
                    </h3>
                    <span
                      className={`${styles.concordance} ${styles[`concordance_${terrain.concordance}`]}`}
                    >
                      {CONCORDANCE_TERRAIN_LABEL[terrain.concordance]}
                    </span>
                  </div>
                  <dl className={styles.experienceList}>
                    <div>
                      <dt>Délai constaté</dt>
                      <dd>{terrain.delai.texte}</dd>
                    </div>
                    <div>
                      <dt>Déclencheur</dt>
                      <dd>{terrain.declencheur}</dd>
                    </div>
                    <div>
                      <dt>Prime du filleul</dt>
                      <dd>{terrain.delais.primeFilleul}</dd>
                    </div>
                    <div>
                      <dt>Prime du parrain</dt>
                      <dd>{terrain.delais.commissionParrain}</dd>
                    </div>
                    <div>
                      <dt>Reversement Parrainio</dt>
                      <dd>
                        {terrain.delais.reversementParrainio} — {SIMULTANEITE_LABEL[terrain.simultaneite]}
                      </dd>
                    </div>
                    <div>
                      <dt>Conservation</dt>
                      <dd>
                        {terrain.conservation.texte}
                        <span className={styles.natureTag}>
                          {NATURE_CONSERVATION_LABEL[terrain.conservation.nature]}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt>Reprise</dt>
                      <dd>
                        <span className={styles.natureTag}>{NATURE_REPRISE_TERRAIN_LABEL[terrain.reprise.nature]}</span>
                        {terrain.reprise.texte}
                      </dd>
                    </div>
                    {terrain.montantsObserves ? (
                      <div>
                        <dt>Montants observés</dt>
                        <dd>{terrain.montantsObserves}</dd>
                      </div>
                    ) : null}
                  </dl>
                  {terrain.exception ? (
                    <p className={styles.experienceException}><strong>Exception :</strong> {terrain.exception}</p>
                  ) : null}
                  <p className={styles.experienceNote}>{terrain.note}</p>
                  <p className={styles.experienceSource}>
                    {experienceTerrain.source}, {experienceTerrain.recuLe} — non officiel, non mesuré.
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.methodSection}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>Méthode</p>
            <h2>Comment ces {stats.total} lignes <em>ont été construites</em></h2>
          </div>
          <div className={styles.methodGrid}>
            <article className={styles.methodCard}>
              <h3>Périmètre</h3>
              <p>
                Les offres du groupe Banque &amp; Finance du catalogue dont une page officielle de parrainage
                était lisible le {releveLabel}. Dix autres ont été écartées : page inexistante,
                accès refusé ou conditions réservées à l’espace client.
              </p>
            </article>
            <article className={styles.methodCard}>
              <h3>Ce qui est compté</h3>
              <p>
                Un délai n’est « chiffré » que s’il est écrit en jours, semaines ou mois. Un renvoi vers un
                règlement non lu n’est pas un délai. Une absence de mention n’est jamais convertie en
                estimation.
              </p>
            </article>
            <article className={styles.methodCard}>
              <h3>Délai d’action ≠ délai de versement</h3>
              <p>
                « Versement sous 6 jours » décrit une action à faire. « Prime versée sous 60 jours » décrit
                l’arrivée de l’argent. Les deux colonnes sont séparées pour ne pas les confondre.
              </p>
            </article>
            <article className={styles.methodCard}>
              <h3>Délai estimé ≠ délai garanti</h3>
              <p>
                Le « délai pratique » additionne un maximum publié et notre délai de traitement. Il
                suppose que la page officielle décrit la commission reçue par Parrainio, ce qu’elle
                ne précise pas toujours. Il sert à se situer, pas à réclamer une date.
              </p>
            </article>
            <article className={styles.methodCard}>
              <h3>Faits et retours de terrain</h3>
              <p>
                Chaque page officielle est citée. Les délais constatés par le responsable de
                Parrainio vivent dans un fichier distinct ({experienceTerrain.offres.length} offres,
                reçu le {experienceTerrain.recuLe}) et s’affichent dans une section séparée, marquée
                « retour d’expérience ». Ils ne valent pas condition et sont signalés comme
                concordants ou non avec la source.
              </p>
            </article>
            <article className={styles.methodCard}>
              <h3>Ce que d’autres publient déjà</h3>
              <p>
                Certains comparateurs indiquent parfois un délai, sans source ni date par ligne.
                Notre parti pris est différent : chaque valeur est citée, datée, et l’absence est
                écrite comme une absence.
              </p>
            </article>
            <article className={styles.methodCard}>
              <h3>Fraîcheur</h3>
              <p>
                Relevé unique, daté. Les campagnes changent vite : chaque ligne porte sa date et sa source,
                et une offre dont la page change est réexaminée avant republication.
              </p>
            </article>
          </div>

          <div className={styles.downloadCard}>
            <div>
              <h3>Réutiliser les données</h3>
              <p>
                Le relevé complet est disponible en CSV : une ligne par offre, les mêmes valeurs que ce
                tableau, sources comprises.
              </p>
            </div>
            <a className={styles.downloadLink} href="/data/observatoire-conditions-2026-10-20.csv" download>
              Télécharger le CSV
            </a>
          </div>

          <div className={styles.excludedCard}>
            <h3>Offres écartées du relevé</h3>
            <ul>
              {observatoire.exclues.map((e) => (
                <li key={e.nom}><strong>{e.nom}</strong> — {e.motif}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.synthesisSection} id="synthese">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>Note de synthèse</p>
            <h2>Ce que le relevé montre — <em>et ce qu’il ne prouve pas</em></h2>
            <p>
              Ces chiffres portent sur {stats.total} offres dont la page officielle a été lue, pas sur
              l’ensemble du marché bancaire. Ils décrivent ce que ces pages publiaient le {releveLabel}.
            </p>
          </div>

          <div className={styles.synthesisGrid}>
            <article>
              <h3>Un délai souvent publié, pas toujours daté</h3>
              <p>
                {stats.delaiChiffre} offres sur {stats.total} chiffrent leur délai de versement. Une
                seule renvoie à un document externe, une seule n’en publie aucun. Le chiffre ne dit rien
                de la date réelle : la base de calcul (ouverture, validation, signature) change d’une
                offre à l’autre.
              </p>
            </article>
            <article>
              <h3>La reprise est minoritaire, pas absente</h3>
              <p>
                {stats.reprisePrelevement} offres sur {stats.total} décrivent un prélèvement rétroactif,
                sur 12 ou 24 mois. {stats.repriseNonPubliee} ne publient aucune clause de reprise — ce
                qui ne signifie pas qu’elles l’interdisent, seulement que la page ne documente pas le
                point. Une clause absente n’est pas une autorisation.
              </p>
            </article>
            <article>
              <h3>Conservation et échéance d’action ne se recouvrent pas</h3>
              <p>
                {stats.conservationDocumentee} offres publient une durée de conservation et{" "}
                {stats.delaiActionDocumente} une échéance pour remplir une condition. Ce sont deux
                horloges distinctes : l’une court après l’ouverture, l’autre avant ou pendant. Les
                confondre fait croire qu’une prime est acquise alors qu’une action reste à faire.
              </p>
            </article>
            <article>
              <h3>Le terrain nuance, il ne remplace pas</h3>
              <p>
                {terrainStats.avecRetour} offres ont un retour d’expérience du responsable de
                Parrainio, dont {terrainStats.ecarts} divergent de la page officielle,
                {" "}{terrainStats.concordent} concordent et {terrainStats.nonVerifiables} ne sont pas
                vérifiables (page muette ou non lue). Ces retours sont déclarés, non mesurés : ils ne
                constituent ni un taux de versement ni une moyenne.
              </p>
            </article>
          </div>

          <div className={styles.citationCard}>
            <div>
              <h3>Citer cette page</h3>
              <p className={styles.citationText}>« {phraseCle(stats)} »</p>
              <p className={styles.citationSource}>
                Parrainio, <em>Observatoire des conditions de versement des primes de parrainage</em>,
                édition 2026, relevé du {releveLabel}
                {verifieLabel ? `, sources revérifiées le ${verifieLabel}` : ""}.
              </p>
              <p className={styles.citationUrl}>
                https://www.parrainio.fr/observatoire-conditions-prime#synthese
              </p>
            </div>
            <a
              className={styles.downloadLink}
              href="mailto:parrainage@parrainio.fr?subject=Correction%20observatoire"
            >
              Signaler une correction
            </a>
          </div>

          <p className={styles.synthesisNote}>
            <strong>Limites.</strong> Périmètre de {stats.total} offres sur les 21 du groupe Banque &amp;
            Finance, dix écartées avec motif ; un seul lecteur par page, sans double lecture ; retours de
            terrain déclarés et non mesurés ; campagnes datées à revérifier après leur échéance. Aucun de
            ces chiffres ne doit être présenté comme représentatif de toutes les banques françaises.
            Pour le détail des unités et des points de départ, voir{" "}
            <Link href="/blog/delai-versement-prime-parrainage-comment-lire">le guide de lecture des délais</Link>.
            {" "}Vous avez déjà parrainé ? La marche à suivre est décrite dans{" "}
            <Link href="/pourquoi-parrainio#reversement">le fonctionnement du reversement</Link>.
          </p>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div>
              <h2>Comparer les montants, puis <em>vérifier les conditions.</em></h2>
              <p>
                L’<Link href="/echeancier-prime-parrainage">échéancier de versement</Link> applique ces délais
                à une date de souscription ; le <Link href="/classement-primes-parrainage">classement des primes</Link> donne les montants ;
                le <Link href="/comparatif/parrainage-bancaire">comparatif bancaire</Link> détaille les parcours ;
                l’<Link href="/chiffres-parrainio-2026">étude 2026</Link> replace ces offres dans l’ensemble du
                catalogue, et <Link href="/comprendre-prime-parrain-filleul-commission">les trois montants d’un
                parrainage</Link> expliquent qui paie quoi.
              </p>
            </div>
            <Link href="/offres" className={styles.ctaButton}>Voir les offres →</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
