import Link from "next/link";
import type { Metadata } from "next";
import OfferLogo from "@/components/OfferLogo";
import { OG_IMAGE } from "@/lib/ogImage";
import { getManagedOffers, type ManagedOffer } from "@/data/managedOffers";
import styles from "./page.module.css";
import RankingTable, { type RankingRow } from "./RankingTable";

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

// Date de mise à jour contrôlée manuellement (constante identifiable) :
// à actualiser uniquement lorsqu'un changement de données affecte le classement.
const LAST_UPDATED = "04/09/2026";

const EXCLUDED_PATTERN = /^(voir l'offre|aucun)/i;
const VARIABLE_PATTERN =
  /(selon (la campagne|l'offre active|les paliers|le programme|le territoire|la campagne active)|variable|paliers|en bitcoin selon|btc selon)/i;
const PERCENT_PATTERN = /%\s*(de réduction|de remise|sur votre)/i;

// Avantages non assimilables à une prime (remise de frais, etc.).
const NON_BONUS_SLUGS = new Set(["wise"]);

function toEuroValue(reward: string): number | null {
  const match = reward.match(/(\d[\d\s.,]*)\s*€/);
  if (!match) return null;
  const parsed = parseFloat(match[1].replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function rowOf(offer: ManagedOffer): RankingRow {
  const conditions = (offer.conditions ?? [])
    .filter(Boolean)
    .slice(0, 2)
    .join(" ");
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
  };
}

export default function ClassementPrimesPage() {
  const euros: { offer: ManagedOffer; euroValue: number }[] = [];
  const others: ManagedOffer[] = [];
  const variables: ManagedOffer[] = [];

  for (const offer of getManagedOffers()) {
    const reward = (offer.partnerReward ?? "").trim();
    if (
      !reward ||
      EXCLUDED_PATTERN.test(reward) ||
      /^0([,.]0+)?\s*€?$/.test(reward) ||
      NON_BONUS_SLUGS.has(offer.slug)
    ) {
      continue;
    }
    if (VARIABLE_PATTERN.test(reward)) {
      variables.push(offer);
      continue;
    }
    if (PERCENT_PATTERN.test(reward)) {
      others.push(offer);
      continue;
    }
    const euroValue = toEuroValue(reward);
    if (euroValue === null) {
      others.push(offer);
      continue;
    }
    euros.push({ offer, euroValue });
  }

  euros.sort(
    (a, b) =>
      b.euroValue - a.euroValue ||
      a.offer.name.localeCompare(b.offer.name, "fr"),
  );

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerInner}>
            <Link href="/" className={styles.logo} aria-label="Parrainio, accueil">
              <span className={styles.logoMark}>P</span>
              <span>Parrainio</span>
            </Link>
            <nav className={styles.nav} aria-label="Navigation principale">
              <Link href="/">Accueil</Link>
              <Link href="/offres">Offres</Link>
              <Link href="/comment-ca-marche">Comment ça marche</Link>
              <Link href="/nos-avantages">Nos avantages</Link>
            </nav>
            <Link href="/offres" className={styles.headerButton}>
              Voir les offres →
            </Link>
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.container}>
          <span className={styles.kicker}>Comparatif Parrainio</span>
          <h1>
            Classement des primes <em>de parrainage</em>
          </h1>
          <p className={styles.lead}>
            Toutes les offres actuellement documentées sur Parrainio dont
            l&apos;avantage filleul est chiffré, classées du montant le plus
            élevé au plus bas. Pour chaque offre : la prime, le reversement
            Parrainio lorsqu&apos;il existe et les conditions essentielles.
          </p>
          <div className={styles.heroActions}>
            <a href="#classement" className={styles.primaryButton}>
              Voir le classement
            </a>
            <Link href="/offres" className={styles.secondaryButton}>
              Toutes les offres →
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.transparency}>
        <div className={styles.container}>
          <ul>
            <li>
              Le classement repose uniquement sur les offres actuellement
              documentées sur Parrainio, avec un avantage filleul chiffré.
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
          <p className={styles.updated}>
            Données vérifiées et mises à jour le {LAST_UPDATED}.
          </p>
        </div>
      </section>

      <section className={styles.section} id="classement">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Les primes de parrainage <em>actuellement documentées</em>
            </h2>
            <p>
              {euros.length} offres avec un avantage filleul exprimé en euros,
              classées par montant décroissant. Filtrez par catégorie pour
              comparer ce qui vous concerne.
            </p>
          </div>
          <RankingTable rows={euros.map(({ offer }) => rowOf(offer))} />
        </div>
      </section>

      <section className={styles.sectionAlt}>
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
            Pourquoi certaines offres n&apos;apparaissent pas ? Les offres sans
            montant chiffré (« Voir l&apos;offre ») et celles dont
            l&apos;avantage n&apos;est pas une prime — une remise de frais par
            exemple — ne sont volontairement pas classées. Elles restent
            consultables sur leurs fiches et dans le catalogue.
          </p>
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
              <Link href="/comment-ca-marche" className={styles.secondaryButton}>
                Comment ça marche →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div>
              <Link href="/" className={styles.footerLogo}>
                <span className={styles.logoMark}>P</span>Parrainio
              </Link>
              <p>
                Le nouveau réflexe pour découvrir et profiter des offres de
                parrainage.
              </p>
            </div>
            <div>
              <h3>Découvrir</h3>
              <Link href="/offres">Les offres</Link>
              <Link href="/comment-ca-marche">Comment ça marche</Link>
            </div>
            <div>
              <h3>Parrainio</h3>
              <Link href="/nos-avantages">Nos avantages</Link>
              <a href="mailto:parrainage@parrainio.fr">Contact</a>
            </div>
            <div>
              <h3>Informations légales</h3>
              <Link href="/mentions-legales">Mentions légales</Link>
              <Link href="/confidentialite">Politique de confidentialité</Link>
              <Link href="/cgu">Conditions générales</Link>
            </div>
          </div>
          <div className={styles.footerBottom}>
            © 2026 Parrainio. Tous droits réservés.
          </div>
        </div>
      </footer>
    </main>
  );
}
