import Link from "next/link";
import type { Metadata } from "next";
import OfferLogo from "@/components/OfferLogo";
import { OG_IMAGE } from "@/lib/ogImage";
import { SITE_URL } from "@/lib/siteUrl";
import { getManagedOffers, type ManagedOffer } from "@/data/managedOffers";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title:
    "Comparatif parrainage banque en ligne : primes, conditions et délais | Parrainio",
  description:
    "Comparatif des offres de parrainage bancaire pour les particuliers : BoursoBank, Fortuneo, Hello bank! et Monabanq, ainsi que Revolut, N26, Sumeria et deux banques régionales. Primes filleul, reversement Parrainio et conditions essentielles, sans montant inventé.",
  alternates: {
    canonical: `${SITE_URL}/comparatif/parrainage-bancaire`,
  },
  openGraph: {
    url: "/comparatif/parrainage-bancaire",
    type: "website",
    siteName: "Parrainio",
    locale: "fr_FR",
    images: [OG_IMAGE],
  },
};

/**
 * Comparateur grand public : uniquement les offres de parrainage bancaire
 * destinées aux particuliers. Revolut Business et les services financiers
 * (PayPal, Wise, SumUp, Klarna, Meilleurtaux…) sont volontairement exclus.
 */
const BANK_SLUGS = [
  "boursobank",
  "fortuneo",
  "revolut",
  "hello-bank",
  "n26",
  "monabanq",
  "sumeria",
  "caisse-depargne-loire-centre",
  "credit-agricole-centre-loire",
];

const NOT_INDICATED = "Non indiqué";

/**
 * Corrections d'affichage propres à ce comparateur, pour les cas où la
 * mécanique documentée diffère des champs servis par le catalogue.
 * Uniquement éditorial : aucune donnée du catalogue n'est modifiée.
 */
type DisplayOverride = {
  partnerReward?: string;
  parrainioReward?: string;
  parrainioRewardNote?: string;
};

const DISPLAY_OVERRIDES: Record<string, DisplayOverride> = {
  sumeria: {
    partnerReward: "0 € pour le filleul",
    parrainioReward: "Jusqu'à 13,75 € reversés par Parrainio",
    parrainioRewardNote:
      "25 % de la commission générée : 25 € sans abonnement ou 55 € avec abonnement.",
  },
};

type BankRow = {
  slug: string;
  name: string;
  category: string;
  partnerReward: string;
  parrainioReward: string;
  parrainioRewardNote?: string;
  conditions: string;
  color: string;
  logoLetter: string;
  logo: string | null;
};

function rowOf(offer: ManagedOffer): BankRow {
  const override = DISPLAY_OVERRIDES[offer.slug];
  const conditions = (offer.conditions ?? [])
    .filter(Boolean)
    .slice(0, 2)
    .join(" ");
  return {
    slug: offer.slug,
    name: offer.name,
    category: offer.category,
    partnerReward:
      override?.partnerReward ??
      ((offer.partnerReward ?? "").trim() || NOT_INDICATED),
    parrainioReward:
      override?.parrainioReward ??
      (offer.parrainioReward?.trim() || NOT_INDICATED),
    parrainioRewardNote: override?.parrainioRewardNote,
    conditions: conditions || "Détails sur la fiche de l'offre.",
    color: offer.color,
    logoLetter: offer.logoLetter,
    logo: offer.logo,
  };
}

export default function ComparatifParrainageBancairePage() {
  const offers = getManagedOffers();
  const rows: BankRow[] = BANK_SLUGS.map((slug) => {
    const offer = offers.find((o) => o.slug === slug);
    return offer ? rowOf(offer) : null;
  }).filter((row): row is BankRow => row !== null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Offres", item: `${SITE_URL}/offres` },
          {
            "@type": "ListItem",
            position: 3,
            name: "Comparatif parrainage bancaire",
            item: `${SITE_URL}/comparatif/parrainage-bancaire`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Offres de parrainage bancaire comparées sur Parrainio",
        url: `${SITE_URL}/comparatif/parrainage-bancaire`,
        numberOfItems: rows.length,
        itemListElement: rows.map((row, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: row.name,
          url: `${SITE_URL}/offres/${row.slug}`,
        })),
      },
    ],
  };

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HEADER */}
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

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">→</span>
            <Link href="/offres">Offres</Link>
            <span aria-hidden="true">→</span>
            <strong>Comparatif parrainage bancaire</strong>
          </nav>
          <span className={styles.kicker}>
            <span />
            Comparatif Parrainio
          </span>
          <h1>Parrainage bancaire : comparatif des offres actuelles</h1>
          <p className={styles.lead}>
            Ce comparatif réunit les offres de parrainage bancaire destinées
            aux particuliers, actuellement documentées sur Parrainio : la
            prime filleul annoncée par chaque banque, le reversement Parrainio
            lorsque l&apos;offre le prévoit et les conditions essentielles à
            remplir. Les montants proviennent des fiches du site et peuvent
            évoluer selon les campagnes des partenaires.
          </p>
          <div className={styles.heroActions}>
            <a href="#comparatif" className={styles.primaryButton}>
              Voir le comparatif
            </a>
            <Link href="/categories/banque-finance" className={styles.secondaryButton}>
              Toutes les offres Banque & Finance →
            </Link>
          </div>
        </div>
      </section>

      {/* TRANSPARENCE */}
      <section className={styles.transparency}>
        <div className={styles.container}>
          <ul>
            <li>
              Le comparatif repose uniquement sur les offres bancaires pour
              particuliers actuellement documentées sur Parrainio.
            </li>
            <li>
              « Jusqu&apos;à » indique un maximum de campagne : le montant
              réellement versé dépend des conditions remplies.
            </li>
            <li>
              Une prime élevée ne rend pas une banque meilleure pour tout le
              monde : frais, carte et services du quotidien comptent autant.
            </li>
            <li>
              La contrepartie du parrain est propre à chaque partenaire et
              varie selon la campagne : elle est détaillée sur chaque fiche.
            </li>
          </ul>
        </div>
      </section>

      {/* COMPARATEUR */}
      <section className={styles.section} id="comparatif">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Les 9 offres de parrainage <em>bancaire pour particuliers</em>
            </h2>
            <p>
              {rows.length} banques comparées, de la banque en ligne à la
              banque régionale. Cliquez sur une fiche pour le détail complet
              des conditions.
            </p>
          </div>

          {/* TABLEAU — desktop / tablette */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Banque</th>
                  <th scope="col">Prime filleul</th>
                  <th scope="col">Reversement Parrainio</th>
                  <th scope="col">Conditions essentielles</th>
                  <th scope="col">
                    <span className={styles.srOnly}>Lien vers la fiche</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.slug}>
                    <td>
                      <div className={styles.offerCell}>
                        <OfferLogo
                          name={row.name}
                          logo={row.logo}
                          color={row.color}
                          logoLetter={row.logoLetter}
                          size={38}
                        />
                        <span>
                          <strong>{row.name}</strong>
                          <small>{row.category}</small>
                        </span>
                      </div>
                    </td>
                    <td className={styles.amountCol}>
                      <strong>{row.partnerReward}</strong>
                    </td>
                    <td className={styles.reverseCol}>
                      <span className={styles.reverseValue}>
                        {row.parrainioReward}
                      </span>
                      {row.parrainioRewardNote && (
                        <small>{row.parrainioRewardNote}</small>
                      )}
                    </td>
                    <td className={styles.conditionsCol}>{row.conditions}</td>
                    <td className={styles.ctaCol}>
                      <Link href={`/offres/${row.slug}`} className={styles.ctaLink}>
                        Voir la fiche
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CARTES — mobile */}
          <ul className={styles.bankCards}>
            {rows.map((row) => (
              <li key={row.slug} className={styles.bankCard}>
                <div className={styles.bankCardTop}>
                  <OfferLogo
                    name={row.name}
                    logo={row.logo}
                    color={row.color}
                    logoLetter={row.logoLetter}
                    size={42}
                  />
                  <span>
                    <strong>{row.name}</strong>
                    <small>{row.category}</small>
                  </span>
                </div>
                <dl className={styles.bankCardMeta}>
                  <div>
                    <dt>Prime filleul</dt>
                    <dd>{row.partnerReward}</dd>
                  </div>
                  <div>
                    <dt>Reversement Parrainio</dt>
                    <dd>
                      {row.parrainioReward}
                      {row.parrainioRewardNote && (
                        <small>{row.parrainioRewardNote}</small>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>Conditions essentielles</dt>
                    <dd>{row.conditions}</dd>
                  </div>
                </dl>
                <Link href={`/offres/${row.slug}`} className={styles.cardLink}>
                  Voir la fiche {row.name}
                </Link>
              </li>
            ))}
          </ul>

          <p className={styles.tableNote}>
            « Prime filleul » : avantage annoncé par le partenaire pour une
            première ouverture éligible. « Reversement Parrainio » : part de la
            commission reversée par Parrainio une fois le parrainage validé. Les
            montants affichés « Non indiqué » ne sont pas documentés
            actuellement sur Parrainio.
          </p>
        </div>
      </section>

      {/* QUELLE BANQUE CHOISIR ? */}
      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Quelle banque <em>choisir ?</em>
            </h2>
            <p>
              Quelques repères pour lire le comparatif, fondés uniquement sur
              les données actuellement documentées.
            </p>
          </div>
          <div className={styles.explainer}>
            <div>
              <h3>Une prime filleul élevée</h3>
              <p>
                Monabanq affiche jusqu&apos;à 280 €, BoursoBank et Fortuneo
                jusqu&apos;à 160 €, Hello bank! et la Caisse d&apos;Épargne
                Loire-Centre jusqu&apos;à 80 €. Ce sont des maximums de
                campagne : versement initial, opérations carte ou mobilité
                bancaire sont souvent requis pour les atteindre.
              </p>
            </div>
            <div>
              <h3>Banques en ligne et néobanques</h3>
              <p>
                BoursoBank, Fortuneo, Monabanq et Hello bank! sont des banques
                en ligne ; Revolut, N26 et Sumeria des applications bancaires
                mobiles. Toutes ouvrent un compte à distance, avec des
                conditions d&apos;éligibilité propres (nouveau client, majeur,
                résidence).
              </p>
            </div>
            <div>
              <h3>Banques régionales</h3>
              <p>
                La Caisse d&apos;Épargne Loire-Centre et le Crédit Agricole
                Centre Loire proposent des campagnes régionales : l&apos;offre
                applicable dépend de la caisse concernée, et la mobilité
                bancaire y est souvent au cœur du dispositif.
              </p>
            </div>
            <div>
              <h3>Offres au-delà du compte courant</h3>
              <p>
                Fortuneo étend son parrainage à la Bourse (PEA, PEA-PME, CTO)
                et à l&apos;assurance-vie avec un versement initial dédié.
                Revolut et N26 conditionnent la récompense à l&apos;utilisation
                de la carte (paiements ou achat qualifiant).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* À SAVOIR AVANT DE CHOISIR */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              À savoir <em>avant de choisir</em>
            </h2>
          </div>
          <ul className={styles.pointsList}>
            <li>
              <strong>Les primes évoluent.</strong> Les campagnes changent :
              le montant applicable est celui affiché au démarrage du parcours,
              pas celui d&apos;un comparatif lu plus tôt.
            </li>
            <li>
              <strong>L&apos;éligibilité d&apos;abord.</strong> Nouveau client,
              âge, résidence : chaque banque vérifie ses propres critères avant
              d&apos;attribuer la prime.
            </li>
            <li>
              <strong>Les actions demandées.</strong> Premier versement,
              paiements par carte ou mobilité bancaire : c&apos;est souvent là
              que se joue la différence entre la promesse et la prime reçue.
            </li>
            <li>
              <strong>Le délai de versement.</strong> Les primes sont créditées
              après validation par la banque, parfois plusieurs semaines après
              l&apos;ouverture.
            </li>
            <li>
              <strong>La contrepartie du parrain.</strong> Elle dépend du
              programme de chaque partenaire : vérifiez-la sur la fiche avant
              d&apos;inviter quelqu&apos;un.
            </li>
            <li>
              <strong>Le reversement Parrainio.</strong> Une fois le parrainage
              validé par le partenaire, Parrainio peut reverser une partie de
              sa commission, jusqu&apos;à 25 %.
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div>
              <h2>
                Comparez, puis lancez-vous <em>en connaissance de cause.</em>
              </h2>
              <p>
                Chaque fiche détaille les conditions exactes, les délais et le
                parcours de parrainage. Les catégories du site regroupent les
                univers les plus recherchés.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <Link href="/offres" className={styles.primaryButton}>
                Voir toutes les offres
              </Link>
              <Link
                href="/categories/banque-finance"
                className={styles.outlineButton}
              >
                Banque & finance
              </Link>
              <Link
                href="/classement-primes-parrainage"
                className={styles.outlineButton}
              >
                Classement des primes
              </Link>
              <Link href="/comment-ca-marche" className={styles.secondaryButton}>
                Comment ça marche →
              </Link>
              <Link href="/nos-avantages" className={styles.secondaryButton}>
                Nos avantages →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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