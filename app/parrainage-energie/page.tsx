import Link from "next/link";
import type { Metadata } from "next";
import OfferLogo from "@/components/OfferLogo";
import { OG_IMAGE } from "@/lib/ogImage";
import { SITE_URL } from "@/lib/siteUrl";
import { getManagedOffers, type ManagedOffer } from "@/data/managedOffers";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title:
    "Parrainage énergie : prime de parrainage électricité et gaz | Parrainio",
  description:
    "Parrainage énergie : primes filleul des fournisseurs d'électricité et de gaz documentés sur Parrainio, conditions de souscription et points à vérifier avant de changer de contrat.",
  alternates: { canonical: `${SITE_URL}/parrainage-energie` },
  openGraph: {
    url: "/parrainage-energie",
    type: "website",
    siteName: "Parrainio",
    locale: "fr_FR",
    images: [OG_IMAGE],
  },
};

/**
 * Fournisseurs d'énergie (électricité et gaz) actuellement documentés
 * dans le catalogue Parrainio. La liste pilote l'affichage du tableau :
 * les montants et conditions restent servis par getManagedOffers().
 */
const ENERGIE_SLUGS = [
  "totalenergies",
  "edf",
  "engie",
  "primeo-energie",
  "hello-watt",
  "liberte-watts",
  "reevolt",
];

const NOT_INDICATED = "Non indiqué";

type EnergieRow = {
  slug: string;
  name: string;
  partnerReward: string;
  parrainioReward: string;
  conditions: string;
  color: string;
  logoLetter: string;
  logo: string | null;
};

function rowOf(offer: ManagedOffer): EnergieRow {
  const conditions = (offer.conditions ?? [])
    .filter(Boolean)
    .slice(0, 2)
    .join(" ");
  return {
    slug: offer.slug,
    name: offer.name,
    partnerReward: (offer.partnerReward ?? "").trim() || NOT_INDICATED,
    parrainioReward: offer.parrainioReward?.trim() || NOT_INDICATED,
    conditions: conditions || "Détails sur la fiche de l'offre.",
    color: offer.color,
    logoLetter: offer.logoLetter,
    logo: offer.logo,
  };
}

export default function ParrainageEnergiePage() {
  const offers = getManagedOffers();
  const rows: EnergieRow[] = ENERGIE_SLUGS.map((slug) => {
    const offer = offers.find((o) => o.slug === slug);
    return offer ? rowOf(offer) : null;
  }).filter((row): row is EnergieRow => row !== null);

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
            name: "Parrainage énergie",
            item: `${SITE_URL}/parrainage-energie`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Fournisseurs d'énergie avec offre de parrainage documentée sur Parrainio",
        url: `${SITE_URL}/parrainage-energie`,
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
            <strong>Parrainage énergie</strong>
          </nav>
          <span className={styles.kicker}>
            <span />
            Parrainage énergie
          </span>
          <h1>Parrainage énergie : prime sur l&apos;électricité et le gaz</h1>
          <p className={styles.lead}>
            Plusieurs fournisseurs d&apos;électricité et de gaz proposent un
            programme de parrainage : un client existant recommande son
            fournisseur à un proche, et une prime est prévue lorsque les
            conditions du programme sont remplies. Cette page réunit les
            fournisseurs documentés sur Parrainio, la prime filleul annoncée par
            chacun et les points à vérifier avant de souscrire.
          </p>
          <div className={styles.heroActions}>
            <a href="#fournisseurs" className={styles.primaryButton}>
              Voir les fournisseurs
            </a>
            <Link
              href="/categories/energie"
              className={styles.secondaryButton}
            >
              Toutes les offres Énergie →
            </Link>
          </div>
        </div>
      </section>

      {/* TRANSPARENCE */}
      <section className={styles.transparency}>
        <div className={styles.container}>
          <ul>
            <li>
              La page repose uniquement sur les offres d&apos;énergie
              actuellement documentées sur Parrainio : montants et conditions
              proviennent des fiches et peuvent évoluer selon les campagnes.
            </li>
            <li>
              « Jusqu&apos;à » indique un maximum de campagne : la prime
              réellement versée dépend des conditions remplies par le filleul.
            </li>
            <li>
              La prime dépend parfois de l&apos;offre souscrite : contrat
              groupé électricité-gaz, offre d&apos;énergie verte ou
              équipement spécifique peuvent être traités différemment.
            </li>
            <li>
              La prime ne doit jamais être le seul critère : le prix au kWh et
              l&apos;adéquation du contrat à votre consommation comptent
              davantage sur la facture annuelle.
            </li>
          </ul>
        </div>
      </section>

      {/* FOURNISSEURS DOCUMENTÉS */}
      <section className={styles.section} id="fournisseurs">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Les fournisseurs d&apos;énergie <em>avec parrainage</em>
            </h2>
            <p>
              {rows.length} fournisseurs documentés sur Parrainio. Chaque fiche
              détaille les conditions exactes, les délais et la date de
              vérification des informations.
            </p>
          </div>

          {/* TABLEAU — desktop / tablette */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Fournisseur</th>
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
                          <small>Électricité &amp; gaz</small>
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
          <ul className={styles.offerCards}>
            {rows.map((row) => (
              <li key={row.slug} className={styles.offerCard}>
                <div className={styles.offerCardTop}>
                  <OfferLogo
                    name={row.name}
                    logo={row.logo}
                    color={row.color}
                    logoLetter={row.logoLetter}
                    size={42}
                  />
                  <span>
                    <strong>{row.name}</strong>
                    <small>Électricité &amp; gaz</small>
                  </span>
                </div>
                <dl className={styles.offerCardMeta}>
                  <div>
                    <dt>Prime filleul</dt>
                    <dd>{row.partnerReward}</dd>
                  </div>
                  <div>
                    <dt>Reversement Parrainio</dt>
                    <dd>{row.parrainioReward}</dd>
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
            « Prime filleul » : avantage annoncé par le fournisseur pour une
            souscription éligible. « Reversement Parrainio » : part de la
            commission reversée par Parrainio une fois le parrainage validé.
            Les montants « Non indiqué » ne sont pas documentés actuellement
            sur Parrainio.
          </p>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Comment fonctionne <em>le parrainage énergie ?</em>
            </h2>
            <p>
              Le parcours suit le même schéma chez la plupart des fournisseurs,
              avec des conditions propres à chaque programme.
            </p>
          </div>
          <ol className={styles.steps}>
            <li>
              <strong>Identifier une offre.</strong> Le proche repère un
              fournisseur et une offre adaptés à son besoin réel :
              électricité seule, électricité et gaz, ou service spécialisé.
            </li>
            <li>
              <strong>Vérifier le programme de parrainage.</strong> Prime,
              conditions d&apos;éligibilité et offres concernées sont détaillées
              sur la fiche du fournisseur et dans ses conditions officielles.
            </li>
            <li>
              <strong>Utiliser le lien ou le code prévu.</strong> La
              souscription doit se faire via le mécanisme prévu par le
              programme : un lien de parrainage ou un code à saisir.
            </li>
            <li>
              <strong>Souscrire et activer le contrat.</strong> La prime est
              généralement attachée à une souscription effective, parfois
              limitée à certaines offres.
            </li>
            <li>
              <strong>Attendre la validation.</strong> Entre la signature et le
              versement de la prime, plusieurs semaines peuvent s&apos;écouler
              selon le partenaire.
            </li>
          </ol>
        </div>
      </section>

      {/* POINTS À VÉRIFIER */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Changer de fournisseur : <em>ce qu&apos;il faut savoir</em>
            </h2>
            <p>
              Avant de regarder la prime, quelques repères sur le changement de
              fournisseur lui-même, issus de{" "}
              <a
                href="https://www.energie-info.fr/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Energie-Info
              </a>{" "}
              (Médiateur national de l&apos;énergie).
            </p>
          </div>
          <ul className={styles.pointsList}>
            <li>
              <strong>Le changement est gratuit.</strong> Pour un particulier,
              changer de fournisseur d&apos;électricité ou de gaz est possible
              à tout moment, sans frais de résiliation ni engagement de durée.
            </li>
            <li>
              <strong>Aucune coupure de fourniture.</strong> La souscription se
              fait auprès du nouveau fournisseur, qui prend le relais à la date
              convenue : pas d&apos;intervention sur l&apos;installation ni de
              changement de compteur.
            </li>
            <li>
              <strong>L&apos;ancien contrat est résilié automatiquement.</strong>{" "}
              C&apos;est le nouveau fournisseur qui gère la reprise du contrat ;
              une facture de clôture peut néanmoins arriver de l&apos;ancien.
            </li>
            <li>
              <strong>Comparer le contrat, pas seulement la prime.</strong>{" "}
              Prix au kWh, abonnement, évolution des prix et services doivent
              être regardés avant la souscription. Le{" "}
              <a
                href="https://comparateur-offres.energie-info.fr/"
                target="_blank"
                rel="noopener noreferrer"
              >
                comparateur officiel
              </a>{" "}
              est impartial et gratuit.
            </li>
            <li>
              <strong>La prime ne fait pas une économie récurrente.</strong>{" "}
              Une prime est un avantage ponctuel lié à la souscription : elle
              ne remplace pas la comparaison du prix du contrat dans la durée.
            </li>
            <li>
              <strong>Le reversement Parrainio.</strong> Une fois le
              parrainage validé par le partenaire, Parrainio peut reverser une
              partie de sa commission, jusqu&apos;à 25 %.
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
                Prêt à comparer <em>les fournisseurs ?</em>
              </h2>
              <p>
                Chaque fiche détaille les conditions exactes, les délais et la
                date de vérification. Notre guide explique aussi le
                fonctionnement du parrainage énergie en détail.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <Link href="/categories/energie" className={styles.primaryButton}>
                Voir les offres Énergie
              </Link>
              <Link href="/blog/parrainage-energie" className={styles.outlineButton}>
                Le guide parrainage énergie
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
