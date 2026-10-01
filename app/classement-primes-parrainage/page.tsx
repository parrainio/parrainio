import Link from "next/link";
import type { Metadata } from "next";
import PublicHeader from "@/components/PublicHeader";
import SiteFooter from "@/components/SiteFooter";
import OfferLogo from "@/components/OfferLogo";
import { OG_IMAGE } from "@/lib/ogImage";
import { SITE_URL } from "@/lib/siteUrl";
import { getManagedOffers, type ManagedOffer } from "@/data/managedOffers";
import { getTotalBenefit, NON_PRIME_SLUGS } from "@/lib/offerFilters";
import styles from "./page.module.css";
import RankingTable, { type RankingRow } from "./RankingTable";
import { FAMILY_CATEGORIES, norm } from "./families";
import FavoritesDock from "@/components/FavoritesDock";

export const metadata: Metadata = {
  title: "Classement des primes de parrainage | Parrainio",
  description:
    "Les primes de parrainage actuellement documentées sur Parrainio : montants filleul, avantage parrain, conditions et reversement Parrainio, offre par offre.",
  alternates: { canonical: "https://www.parrainio.fr/classement-primes-parrainage" },
  openGraph: {
    url: "/classement-primes-parrainage",
    type: "website",
    siteName: "Parrainio",
    locale: "fr_FR",
    images: [OG_IMAGE],
  },
};

// Date de mise à jour contrôlée manuellement (constantes identifiables) :
// à actualiser uniquement lorsqu'un changement de données affecte le classement.
// LAST_UPDATED_ISO alimente le JSON-LD (dateModified) — toujours liées.
const LAST_UPDATED = "01/10/2026";
const LAST_UPDATED_ISO = "2026-10-01";

const EXCLUDED_PATTERN = /^(voir l'offre|aucun)/i;
const VARIABLE_PATTERN =
  /(selon (la campagne|l'offre active|les paliers|le programme|le territoire|la campagne active)|variable|paliers|en bitcoin selon|btc selon)/i;

const euroFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

/**
 * FAQ visible — unique source des questions affichées ET du JSON-LD FAQPage,
 * pour garantir la correspondance exacte entre contenu visible et données
 * structurées.
 */
const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "Comment est calculé le classement des primes ?",
    answer:
      "Chaque offre est positionnée selon son avantage total : la prime filleul additionnée au reversement Parrainio lorsque les deux sont chiffrés en euros. Pour un même champ, c'est le montant le plus élevé réellement écrit qui compte — « jusqu'à 160 € » vaut donc 160 €, en tant que maximum de campagne. Les offres à avantage égal partagent le même rang et sont ordonnées alphabétiquement.",
  },
  {
    question: "Quelle différence entre la prime filleul et la prime parrain ?",
    answer:
      "La prime affichée dans le classement est celle du filleul : c'est l'avantage reçu en s'inscrivant via une invitation. Le parrain reçoit souvent une contrepartie distincte, indiquée sur la fiche de chaque offre. Le reversement Parrainio, lorsqu'il existe, s'ajoute à la prime filleul.",
  },
  {
    question: "Pourquoi certaines offres n'affichent-elles pas de montant ?",
    answer:
      "Parce que leur récompense n'est pas chiffrée en euros : pourcentage de réduction, points, crédits ou simple « Voir l'offre ». Aucune conversion artificielle n'est appliquée : ces offres sont regroupées dans les sections dédiées plus bas, et chaque fiche détaille l'avantage réel.",
  },
  {
    question: "Une prime peut-elle changer au cours d'une campagne ?",
    answer:
      "Oui. Certains partenaires font varier leur prime selon la campagne, des paliers ou le territoire. Ces offres sont listées à part, avec la formulation exacte des données. Avant de vous inscrire, vérifiez le montant en vigueur et la date limite sur la fiche de l'offre.",
  },
  {
    question: "Peut-on comparer des primes en euros avec des avantages en points ?",
    answer:
      "Pas directement : un pourcentage ou un nombre de points n'a pas de valeur universelle en euros. C'est pourquoi le classement ne retient que les avantages chiffrés en euros et regroupe les autres. Exception : lorsqu'un partenaire écrit lui-même une équivalence (par exemple « 2 000 Yumks = 20 € »), c'est cette valeur écrite qui est retenue.",
  },
  {
    question: "Comment vérifier les conditions d'une offre ?",
    answer:
      "Chaque ligne du classement affiche les conditions essentielles (bouton « ⋯ » ou ligne dépliée) et renvoie vers la fiche de l'offre, qui détaille dépôt, achat minimum, délai de versement et étapes d'activation.",
  },
];

function rowOf(offer: ManagedOffer, total: number): RankingRow {
  const conditions = (offer.conditions ?? []).filter(Boolean);
  return {
    slug: offer.slug,
    name: offer.name,
    category: offer.category,
    partnerReward: (offer.partnerReward ?? "").trim(),
    parrainioReward: offer.parrainioReward,
    conditions,
    color: offer.color,
    logo: offer.logo,
    logoLetter: offer.logoLetter,
    total,
  };
}

export default async function ClassementPrimesPage() {
  const euros: { offer: ManagedOffer; total: number }[] = [];
  const others: ManagedOffer[] = [];
  const variables: ManagedOffer[] = [];

  for (const offer of await getManagedOffers()) {
    const reward = (offer.partnerReward ?? "").trim();
    const reverse = (offer.parrainioReward ?? "").trim();
    // Classement par AVANTAGE TOTAL : prime filleul + Parraino reverse.
    // Une offre avec 0 € de prime mais un reverse chiffré reste classée
    // (ex. Revolut 0 € + 40 € → 40 € d'avantage total).
    if (
      (!reward || EXCLUDED_PATTERN.test(reward)) &&
      (!reverse || EXCLUDED_PATTERN.test(reverse))
    ) {
      continue;
    }
    if (NON_PRIME_SLUGS.has(offer.slug)) {
      continue;
    }
    if (VARIABLE_PATTERN.test(reward) || VARIABLE_PATTERN.test(reverse)) {
      variables.push(offer);
      continue;
    }
    const total = getTotalBenefit(offer);
    // Hiérarchie des unités : aucun montant € réellement écrit (prime en %,
    // en points, en crédits, ou « Voir l'offre » avec un reverse « 0 € ») →
    // aucune valeur comparable en euros → section « autre unité », jamais un
    // rang « 0 € » artificiel dans le classement.
    if (total === null || total <= 0) {
      others.push(offer);
      continue;
    }
    euros.push({ offer, total });
  }

  euros.sort(
    (a, b) =>
      b.total - a.total ||
      a.offer.name.localeCompare(b.offer.name, "fr"),
  );

  // Offre la mieux placée de chaque famille (euros est déjà trié par avantage
  // total décroissant) — calcul serveur, affiché dans la section « par catégorie ».
  const familyLeaders = FAMILY_CATEGORIES.flatMap((family) => {
    const members = euros.filter(({ offer }) =>
      family.categories.includes(norm(offer.category)),
    );
    if (members.length === 0) return [];
    return [
      {
        label: family.label,
        count: members.length,
        leader: members[0],
      },
    ];
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/classement-primes-parrainage`,
        url: `${SITE_URL}/classement-primes-parrainage`,
        name: "Classement des primes de parrainage",
        description:
          "Les primes de parrainage actuellement documentées sur Parrainio : montants filleul, avantage parrain, conditions et reversement Parrainio, offre par offre.",
        inLanguage: "fr-FR",
        dateModified: LAST_UPDATED_ISO,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Classement des primes",
            item: `${SITE_URL}/classement-primes-parrainage`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Les primes de parrainage les plus élevées",
        numberOfItems: euros.length,
        itemListElement: euros.map(({ offer }, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: offer.name,
          url: `${SITE_URL}/offres/${offer.slug}`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };

  return (
    <main className={styles.page}>
      <PublicHeader active="ranking" />
      <FavoritesDock />

      <div className={styles.slimTop}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">→</span>
            <strong>Classement des primes</strong>
          </nav>
        </div>
      </div>

      <section className={styles.section} id="classement">
        <div className={styles.container}>
          <RankingTable
            rows={euros.map(({ offer, total }) => rowOf(offer, total))}
            panelHeading={
              <>
                Classement des primes <em>de parrainage</em>
              </>
            }
            panelLead={
              <>
                Classement selon l&apos;avantage total potentiel : prime filleul
                + Parraino reverse. Pour chaque offre, les deux montants restent
                affichés séparément avec les conditions essentielles.
              </>
            }
            updated={LAST_UPDATED}
          />
        </div>
      </section>

      <section className={styles.transparency}>
        <div className={styles.container}>
          <ul>
            <li>
              Le classement repose sur l&apos;avantage total potentiel :
              prime filleul + Parraino reverse, additionnés.
            </li>
            <li>
              Les montants peuvent évoluer selon les campagnes des partenaires :
              « jusqu&apos;à » indique un maximum, pas un montant garanti.
            </li>
            <li>
              Des conditions s&apos;appliquent — première commande, dépôt,
              délai, activation : chaque fiche les détaille.
            </li>
            <li>
              Une offre affichée plus haut n&apos;est pas nécessairement la
              meilleure pour tout le monde.
            </li>
            <li>
              Parrainio privilégie les montants vérifiés et une information
              claire sur qui reçoit quoi.
            </li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Comment lire <em>ce classement ?</em>
            </h2>
          </div>
          <div className={styles.explainer}>
            <div>
              <h3>Filleul et parrain</h3>
              <p>
                La prime affichée est celle du filleul, c&apos;est-à-dire
                l&apos;avantage que vous recevez en vous inscrivant via
                l&apos;invitation. Le parrain reçoit souvent une contrepartie
                distincte, indiquée sur chaque fiche.
              </p>
            </div>
            <div>
              <h3>Maximum ou montant garanti</h3>
              <p>
                « Jusqu&apos;à 160 € » signifie que 160 € est le plafond de la
                campagne : le montant réellement versé dépend du produit choisi
                et des conditions remplies.
              </p>
            </div>
            <div>
              <h3>Campagnes temporaires</h3>
              <p>
                Certaines offres sont datées (rentrée, fin de mois, opération
                spéciale). Une prime élevée liée à une campagne courte mérite
                une vérification de la date limite.
              </p>
            </div>
            <div>
              <h3>Les conditions qui comptent</h3>
              <p>
                Premier dépôt, minimum de commande, délai de versement,
                conservation du compte : c&apos;est souvent là que se joue la
                différence entre la promesse et le résultat.
              </p>
            </div>
            <div>
              <h3>Récompenses non monétaires</h3>
              <p>
                Points, Wards, Yums, crédits ou réductions en pourcentage
                n&apos;ont pas de valeur universelle : ils sont regroupés à
                part, sans conversion artificielle en euros.
              </p>
            </div>
          </div>
          <p className={styles.excludedNote}>
            Les offres sans montant chiffré en euros — récompense en
            pourcentage, en points, en crédits, ou simple « Voir l&apos;offre »
            — sont regroupées dans les sections ci-dessous, sans conversion
            artificielle. Celles dont l&apos;avantage n&apos;est pas une prime
            — une remise de frais par exemple — ne sont volontairement pas
            classées ; elles restent consultables sur leurs fiches et dans le
            catalogue. Pour savoir concrètement quoi saisir ou activer à
            l&apos;inscription, la page{" "}
            <Link href="/codes-parrainage">codes et invitations de parrainage</Link>{" "}
            détaille le mécanisme de chaque offre.
          </p>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Les primes de parrainage <em>par catégorie</em>
            </h2>
            <p>
              L&apos;avantage total le plus élevé actuellement documenté dans
              chaque univers, d&apos;après les offres du classement. La fiche
              liée détaille la prime complète et ses conditions.
            </p>
          </div>
          <div className={styles.familyGrid}>
            {familyLeaders.map(({ label, count, leader }) => (
              <Link
                key={label}
                href={`/offres/${leader.offer.slug}`}
                className={styles.familyCard}
              >
                <OfferLogo
                  name={leader.offer.name}
                  logo={leader.offer.logo}
                  color={leader.offer.color}
                  logoLetter={leader.offer.logoLetter}
                  size={34}
                />
                <span>
                  <small>
                    {label} — {count} {count > 1 ? "offres classées" : "offre classée"}
                  </small>
                  <strong>{leader.offer.name}</strong>
                  <em>{euroFormatter.format(leader.total)} d&apos;avantage total</em>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Récompenses dans <em>une autre unité</em>
            </h2>
            <p>
              Ces avantages ne sont pas directement comparables en euros :
              pourcentages, points ou crédits propres au partenaire. Le détail
              se lit sur chaque fiche.
            </p>
          </div>
          <div className={styles.unitGrid}>
            {others.map((offer) => (
              <Link
                key={offer.slug}
                href={`/offres/${offer.slug}`}
                className={styles.unitCard}
              >
                <OfferLogo
                  name={offer.name}
                  logo={offer.logo}
                  color={offer.color}
                  logoLetter={offer.logoLetter}
                  size={34}
                />
                <span>
                  <strong>{offer.name}</strong>
                  <small>{(offer.partnerReward ?? "").trim()}</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {variables.length > 0 && (
        <section className={styles.sectionAlt}>
          <div className={styles.container}>
            <div className={styles.sectionHead}>
              <h2>
                Avantages variables <em>selon la campagne</em>
              </h2>
              <p>
                Ces offres affichent une récompense variable — campagne,
                paliers ou territoire. Le montant ne peut pas être comparé
                directement avec les autres.
              </p>
            </div>
            <ul className={styles.variableList}>
              {variables.map((offer) => (
                <li key={offer.slug}>
                  <Link href={`/offres/${offer.slug}`}>{offer.name}</Link>
                  <span> — {(offer.partnerReward ?? "").trim()}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Questions fréquentes sur <em>les primes de parrainage</em>
            </h2>
          </div>
          <div className={styles.faqList}>
            {FAQ_ITEMS.map(({ question, answer }) => (
              <div className={styles.faqItem} key={question}>
                <h3>{question}</h3>
                <p>{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div>
              <h2>
                Comparez, puis lancez-vous <em>en connaissance de cause.</em>
              </h2>
              <p>
                Le catalogue détaille les conditions de chaque offre, et les
                catégories regroupent les univers les plus recherchés.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <Link href="/offres" className={styles.primaryButton}>
                Voir toutes les offres
              </Link>
              <Link href="/categories/banque-finance" className={styles.outlineButton}>
                Banque & finance
              </Link>
              <Link href="/categories/shopping-courses" className={styles.outlineButton}>
                Shopping & courses
              </Link>
              <Link href="/pourquoi-parrainio" className={styles.secondaryButton}>
                Comment ça marche →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteFooter />
    </main>
  );
}
