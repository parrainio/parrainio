import Link from "next/link";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { OG_IMAGE } from "@/lib/ogImage";
import PublicHeader from "@/components/PublicHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Baromètre du parrainage en France 2026 | Parrainio",
  description:
    "Étude Parrainio sur 117 offres de parrainage analysées et vérifiées le 02/09/2026 : mécanismes, primes filleul, reversements parrain, répartition par secteur. Méthodologie et limites détaillées.",
  alternates: { canonical: "https://www.parrainio.fr/barometre-parrainage" },
  openGraph: { url: "/barometre-parrainage", type: "article", siteName: "Parrainio", locale: "fr_FR", images: [OG_IMAGE] },
};

/* Chiffres issus exclusivement de docs/barometre-snapshot-2026-10-07.json
   (données réellement rendues en production au 07/10/2026, déploiement b3fc3fa).
   Aucun chiffre n'est recalculé depuis une autre source. */

const keyStats = [
  {
    figure: "117",
    unit: "offres",
    label: "analysées — données vérifiées le 02/09/2026",
  },
  {
    figure: "96,6",
    unit: "%",
    label: "des offres publient un code ou un lien d'invitation public (113/117)",
  },
  {
    figure: "10 €",
    unit: "médiane",
    label: "de prime filleul sur les 99 offres à prime en euros",
  },
  {
    figure: "51,3 %",
    unit: "",
    label: "des programmes documentent un reversement parrain (60/117) — médiane 25 €",
  },
  {
    figure: "63",
    unit: "codes",
    label: "recensés, plus 77 liens d'invitation (65,8 % des offres)",
  },
  {
    figure: "94,9 %",
    unit: "",
    label: "des offres affichent un avantage filleul explicite (111/117)",
  },
  {
    figure: "63,2 %",
    unit: "",
    label: "du catalogue concentré sur 3 secteurs (74/117)",
  },
];

const statExplanations = [
  {
    title: "96,6 % des offres publient un code ou un lien d'invitation",
    figure: "113 / 117",
    meaning:
      "Sur 117 offres analysées, 113 permettent d'accéder au parrainage sans contact préalable : un code à saisir ou un lien d'invitation à activer. Seules 4 offres (3,4 %) exigent un autre parcours (rattachement par e-mail du parrain, accès réservé, ou mécanisme non documenté publiquement).",
    limits:
      "Le comptage porte sur ce qui est publiquement documenté au 02/09/2026. Certaines offres non couvertes acceptent peut-être un parrainage via leur application, sans que ce mécanisme soit documenté sur leur page publique.",
  },
  {
    title: "Prime filleul médiane : 10 €",
    figure: "n = 99",
    meaning:
      "Parmi les 111 offres qui affichent un avantage filleul, 99 expriment un montant en euros. La valeur médiane — la moitié des offres propose moins, l'autre moitié plus — est de 10 €.",
    limits:
      "Une médiane est utilisée plutôt qu'une moyenne : les montants sont publiés en texte libre et la moyenne serait biaisée par les valeurs extrêmes. Les 15 fourchettes « jusqu'à X € » sont comptées à leur borne haute, ce qui tire la médiane légèrement vers le haut. Les 12 avantages non monétaires (% , crédits, points fidélité) sont exclus de ce calcul, faute d'unité commune.",
  },
  {
    title: "51,3 % des programmes reversent quelque chose au parrain",
    figure: "60 / 117 — médiane 25 € (n = 55)",
    meaning:
      "60 programmes documentent ce que reçoit la personne qui parraine. Sur les 55 exprimés en euros, le reversement médian est de 25 €. Ce gain parrain s'ajoute souvent à la prime filleul — c'est le « double avantage » du parrainage.",
    limits:
      "5 reversements sont exprimés en pourcentage de commissions et sont exclus de la médiane (unité incompatible avec l'euro). La présence d'un reversement ne préjuge ni de son montant final ni des conditions de déblocage.",
  },
  {
    title: "117 offres sur 117 vérifiées à la même date",
    figure: "02/09/2026",
    meaning:
      "Les données ont été relevées le 07/10/2026 sur un catalogue de 117 offres dont les fiches avaient toutes été vérifiées le 02/09/2026. Les chiffres de ce baromètre décrivent donc un instant unique du marché.",
    limits:
      "Les offres de parrainage évoluent régulièrement (campagnes datées, montants révisés). Les montants peuvent avoir évolué depuis la date de vérification : consulter la fiche de chaque offre pour la valeur en cours.",
  },
  {
    title: "63 codes recensés, dont 2 sur 3 sont des codes personnels",
    figure: "42 / 10 / 10 / 1",
    meaning:
      "Le parrainage français fonctionne majoritairement avec des codes personnels attribués à un parrain (42), devant les numéros d'invitation (10), les codes publics de marque (10) et un mécanisme par e-mail (1). Les liens d'invitation sont le mécanisme le plus répandu : 77 offres (65,8 %) en publient un, et 27 cumulent code et lien.",
    limits:
      "Un même programme peut proposer plusieurs mécanismes : la somme codes + liens (140) est donc supérieure au nombre d'offres. La distinction code personnel / code public reflète la classification Parrainio au moment de l'analyse.",
  },
  {
    title: "94,9 % des offres affichent un avantage filleul explicite",
    figure: "111 / 117",
    meaning:
      "Presque tous les programmes annoncent noir sur blanc ce que gagne le filleul. Les 6 offres restantes n'affichent pas d'avantage documenté (« voir l'offre » ou équivalent) au moment de l'analyse.",
    limits:
      "Un avantage affiché peut être conditionné (dépôt minimum, premier achat, durée) : ce chiffre mesure la transparence de l'information, pas la facilité d'obtention de la prime.",
  },
  {
    title: "63,2 % du catalogue concentré sur 3 secteurs",
    figure: "74 / 117",
    meaning:
      "Shopping & Courses (36 offres), Banque & Finance (20) et Investissement & Crypto (18) rassemblent près des deux tiers du catalogue analysé. Le parrainage en France n'est donc pas l'affaire des seules banques : le e-commerce pèse plus lourd que la finance.",
    limits:
      "Le périmètre est le catalogue Parrainio : la répartition reflète les offres documentées et vérifiées par Parrainio, pas une mesure exhaustive du marché français.",
  },
];

const mechanismBars = [
  { label: "Codes personnels de parrain", value: 42, total: 63, tone: "green" as const },
  { label: "Numéros d'invitation", value: 10, total: 63, tone: "orange" as const },
  { label: "Codes publics de marque", value: 10, total: 63, tone: "orange" as const },
  { label: "Mécanisme par e-mail", value: 1, total: 63, tone: "light" as const },
];

const categories = [
  { label: "Shopping & Courses", value: 36, top: true },
  { label: "Banque & Finance", value: 20, top: true },
  { label: "Investissement & Crypto", value: 18, top: true },
  { label: "Récompenses & Applications", value: 10 },
  { label: "Cashback", value: 9 },
  { label: "Énergie", value: 7 },
  { label: "Jeux & Paris", value: 7 },
  { label: "Voyage & Mobilité", value: 4 },
  { label: "Services numériques", value: 3 },
  { label: "Autres bons plans", value: 2 },
  { label: "Téléphone & Internet", value: 1 },
];

const excluded = [
  {
    title: "Un montant moyen des primes ou des reversements",
    reason:
      "Les montants sont publiés en texte libre et mélangent des unités incompatibles (€, %, crédits, points). Une moyenne mélangerait ces unités et serait tirée par quelques valeurs extrêmes. La médiane, moins sensible aux extrêmes, est la seule agrégation défendable.",
  },
  {
    title: "« X offres lancées depuis janvier 2026 » ou une ancienneté moyenne",
    reason:
      "Les dates de publication disponibles couvrent 106 offres sur 117, dans des formats hétérogènes, et ne figurent pas parmi les données affichées publiquement sur chaque fiche. Tout calcul temporel serait fragile et difficilement vérifiable par un tiers.",
  },
  {
    title: "« La plus grosse prime du marché : 500 € »",
    reason:
      "Les montants les plus élevés du catalogue sont des fourchettes « jusqu'à 500 € » dont la nature réelle (transfert offert, bonus de campagne) n'est pas un versement garanti en euros. Affiché sans qualification, ce chiffre serait trompeur. Les meilleures primes restent consultables offre par offre dans le classement.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Baromètre du parrainage en France 2026",
  description:
    "Étude sur 117 offres de parrainage analysées et vérifiées le 02/09/2026 : mécanismes d'accès, primes filleul, reversements parrain et répartition par secteur.",
  datePublished: "2026-10-07",
  dateModified: "2026-10-07",
  inLanguage: "fr-FR",
  author: { "@type": "Organization", name: "Parrainio", url: "https://www.parrainio.fr" },
  publisher: { "@type": "Organization", name: "Parrainio", url: "https://www.parrainio.fr" },
  mainEntityOfPage: "https://www.parrainio.fr/barometre-parrainage",
};

export default function BarometreParrainagePage() {
  return (
    <main className={styles.page}>
      <PublicHeader active="how" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}><span />Étude Parrainio — édition 2026</p>
          <h1>Baromètre du parrainage <em>en France&nbsp;2026</em></h1>
          <p className={styles.heroLead}>
            À quel point le parrainage est-il accessible, transparent et rémunérateur&nbsp;?
            Pour répondre factuellement, Parrainio a analysé l&apos;intégralité de son catalogue&nbsp;:
            <strong> 117 offres analysées</strong>, dont les données ont été vérifiées une à une le{" "}
            <strong>02/09/2026</strong>. Ce baromètre observe le marché à partir de ce périmètre&nbsp;:
            ce que les programmes publient, ce qu&apos;ils cachent, et ce qu&apos;ils reversent réellement.
          </p>
          <div className={styles.heroMeta}>
            <span>Étude du 07/10/2026</span>
            <span>117 offres analysées — vérifiées le 02/09/2026</span>
            <span>Méthodologie et limites détaillées</span>
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section id="chiffres-cles" className={styles.keySection}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>Chiffres clés</p>
            <h2>Le parrainage français en <em>7 mesures</em></h2>
          </div>
          <div className={styles.keyGrid}>
            {keyStats.map((s) => (
              <article className={styles.keyCard} key={s.label}>
                <p className={styles.keyFigure}>
                  <strong>{s.figure}</strong>{s.unit ? <span>{s.unit}</span> : null}
                </p>
                <p className={styles.keyLabel}>{s.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Lecture détaillée */}
      <section id="lecture" className={styles.readSection}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>Lecture détaillée</p>
            <h2>Ce que mesure chaque chiffre — <em>et ce qu&apos;il ne mesure pas</em></h2>
          </div>
          <div className={styles.readList}>
            {statExplanations.map((s) => (
              <article className={styles.readCard} key={s.title}>
                <div className={styles.readHead}>
                  <h3>{s.title}</h3>
                  <span className={styles.readFigure}>{s.figure}</span>
                </div>
                <p>{s.meaning}</p>
                <p className={styles.readLimits}><strong>Limites&nbsp;:</strong> {s.limits}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Typologie */}
      <section id="typologie" className={styles.typoSection}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>Typologie</p>
            <h2>Comment accède-t-on à un parrainage&nbsp;?</h2>
            <p>
              Sur les 117 offres analysées, <strong>63 publient un code</strong> et{" "}
              <strong>77 publient un lien d&apos;invitation</strong> — 27 cumulent les deux,
              et 4 n&apos;offrent aucun mécanisme public. Voici la répartition des 63 codes&nbsp;:
            </p>
          </div>
          <div className={styles.bars}>
            {mechanismBars.map((b) => (
              <div className={styles.barRow} key={b.label}>
                <span className={styles.barLabel}>{b.label}</span>
                <span className={styles.barTrack}>
                  <span
                    className={`${styles.barFill} ${styles[b.tone === "green" ? "fillGreen" : b.tone === "orange" ? "fillOrange" : "fillLight"]}`}
                    style={{ width: `${Math.max(4, (b.value / 63) * 100)}%` }}
                  />
                </span>
                <span className={styles.barValue}>{b.value}</span>
              </div>
            ))}
          </div>
          <p className={styles.typoNote}>
            Le lien d&apos;invitation reste le mécanisme le plus répandu (77 offres, soit 65,8&nbsp;%),
            mais le code personnalise l&apos;expérience&nbsp;: il identifie nominativement le parrain,
            là où le code public de marque fonctionne pour tout le monde.
          </p>
        </div>
      </section>

      {/* Secteurs */}
      <section id="secteurs" className={styles.sectorSection}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>Répartition</p>
            <h2>Où trouve-t-on des offres de parrainage&nbsp;?</h2>
            <p>
              Les 11 familles du catalogue, avec leur nombre exact d&apos;offres vérifiées&nbsp;:
            </p>
          </div>
          <div className={styles.bars}>
            {categories.map((c) => (
              <div className={styles.barRow} key={c.label}>
                <span className={styles.barLabel}>{c.label}</span>
                <span className={styles.barTrack}>
                  <span
                    className={`${styles.barFill} ${c.top ? styles.fillGreen : styles.fillLight}`}
                    style={{ width: `${Math.max(3, (c.value / 36) * 100)}%` }}
                  />
                </span>
                <span className={styles.barValue}>{c.value}</span>
              </div>
            ))}
          </div>
          <p className={styles.typoNote}>
            Shopping &amp; Courses, Banque &amp; Finance et Investissement &amp; Crypto pèsent à eux
            trois 74 offres sur 117 (63,2&nbsp;%).{" "}
            <Link href="/offres">Parcourir les offres par catégorie</Link> ou{" "}
            <Link href="/offres?category=Cashback#offres">comparer les offres Cashback</Link>.
          </p>
        </div>
      </section>

      {/* Méthodologie */}
      <section id="methodologie" className={styles.methodSection}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>Méthodologie</p>
            <h2>Comment ce baromètre <em>a été construit</em></h2>
          </div>
          <div className={styles.methodGrid}>
            <article className={styles.methodCard}>
              <h3>Périmètre</h3>
              <p>
                117 offres de parrainage documentées dans le catalogue Parrainio, analysées
                intégralement. Il s&apos;agit d&apos;une observation à partir de ce périmètre,
                pas d&apos;un recensement exhaustif du marché français.
              </p>
            </article>
            <article className={styles.methodCard}>
              <h3>Source des données</h3>
              <p>
                Snapshot du catalogue réalisé le 07/10/2026 ; les 117 fiches analysées
                portaient une date de vérification au 02/09/2026. Les chiffres proviennent
                du catalogue réellement rendu en production à la date du snapshot
                (snapshot <code>barometre-snapshot-2026-10-07.json</code>)&nbsp;:
                chaque valeur a été relevée sur les pages publiques du site.
              </p>
            </article>
            <article className={styles.methodCard}>
              <h3>Vérification</h3>
              <p>
                Les 117 offres ont été vérifiées une à une (prime, mécanisme, conditions) le
                02/09/2026. Les montants peuvent évoluer après cette date&nbsp;: les fiches
                individuelles font foi pour la valeur en cours.
              </p>
            </article>
            <article className={styles.methodCard}>
              <h3>Agrégations</h3>
              <p>
                Les montants étant publiés en texte libre, ce baromètre privilégie les comptages
                et les médianes, jamais les moyennes. Les fourchettes «&nbsp;jusqu&apos;à
                X&nbsp;€&nbsp;» sont comptées à leur borne haute, ce qui peut surestimer
                légèrement la médiane. Les montants hors euro sont exclus des agrégations
                monétaires.
              </p>
            </article>
          </div>
          <div className={styles.excludedCard}>
            <h3>Statistiques volontairement exclues</h3>
            <ul>
              {excluded.map((e) => (
                <li key={e.title}>
                  <strong>{e.title}</strong> — {e.reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div>
              <h2>Explorez les données <em>offre par offre.</em></h2>
              <p>
                Le détail complet des 117 offres analysées est public&nbsp;:{" "}
                <Link href="/offres">le catalogue d&apos;offres</Link>,{" "}
                <Link href="/codes-parrainage">les codes et mécanismes d&apos;invitation</Link> et{" "}
                <Link href="/classement-primes-parrainage">le classement des primes</Link>.
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
