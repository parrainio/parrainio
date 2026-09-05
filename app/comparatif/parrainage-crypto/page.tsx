import Link from "next/link";
import type { Metadata } from "next";
import OfferLogo from "@/components/OfferLogo";
import { OG_IMAGE } from "@/lib/ogImage";
import { SITE_URL } from "@/lib/siteUrl";
import { getManagedOffers, type ManagedOffer } from "@/data/managedOffers";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title:
    "Comparatif parrainage crypto : bonus, conditions et risques | Parrainio",
  description:
    "Comparatif des offres de parrainage crypto actuellement documentées sur Parrainio : Coinbase, Crypto.com, OKX et Kraken, ainsi que SwissBorg, Bitstack, Bitpanda, Bybit, Coinhouse et Cointiply. Récompenses filleul, unités (EUR, USD, BTC), reversement Parrainio et conditions essentielles, sans conversion artificielle.",
  alternates: {
    canonical: `${SITE_URL}/comparatif/parrainage-crypto`,
  },
  openGraph: {
    url: "/comparatif/parrainage-crypto",
    type: "website",
    siteName: "Parrainio",
    locale: "fr_FR",
    images: [OG_IMAGE],
  },
};

/**
 * Configuration du comparateur : uniquement les slugs des 10 plateformes
 * réellement crypto. Aucune prime, condition ou reversement n'est copié ici :
 * toutes les valeurs affichées proviennent de getManagedOffers().
 */
const CRYPTO_COMPARATOR_SLUGS = [
  "coinbase",
  "crypto-com",
  "swissborg",
  "bitstack",
  "kraken",
  "bitpanda",
  "bybit",
  "okx",
  "coinhouse",
  "cointiply",
];

const NOT_QUANTIFIED = "Non quantifié";

type RewardUnit = "EUR" | "USD" | "BTC" | "Autre" | "Non quantifié";

type CryptoRow = {
  slug: string;
  name: string;
  category: string;
  partnerReward: string;
  unit: RewardUnit;
  paidInCrypto: boolean;
  parrainioReward: string;
  conditions: string;
  color: string;
  logoLetter: string;
  logo: string | null;
};

/** Dérive l'unité du texte servi — aucune conversion de montant n'est faite. */
function unitOf(reward: string): { unit: RewardUnit; paidInCrypto: boolean } {
  if (reward.includes("€"))
    return { unit: "EUR", paidInCrypto: /\bBTC\b|bitcoin/i.test(reward) };
  if (reward.includes("$"))
    return { unit: "USD", paidInCrypto: /\bBTC\b|bitcoin/i.test(reward) };
  if (/\bBTC\b|bitcoin/i.test(reward)) return { unit: "BTC", paidInCrypto: true };
  return { unit: "Non quantifié", paidInCrypto: false };
}

function rowOf(offer: ManagedOffer): CryptoRow {
  const reward = (offer.partnerReward ?? "").trim();
  const { unit, paidInCrypto } = unitOf(reward);
  const conditions = (offer.conditions ?? [])
    .filter(Boolean)
    .slice(0, 2)
    .join(" ");
  return {
    slug: offer.slug,
    name: offer.name,
    category: offer.category,
    partnerReward: reward || NOT_QUANTIFIED,
    unit,
    paidInCrypto,
    parrainioReward: offer.parrainioReward?.trim() || "Non indiqué",
    conditions: conditions || "Détails sur la fiche de l'offre.",
    color: offer.color,
    logoLetter: offer.logoLetter,
    logo: offer.logo,
  };
}

const UNIT_RANK: Record<RewardUnit, number> = {
  EUR: 0,
  USD: 1,
  BTC: 2,
  Autre: 3,
  "Non quantifié": 4,
};

const UNIT_LABEL: Record<RewardUnit, string> = {
  EUR: "En euros (EUR)",
  USD: "En dollars (USD)",
  BTC: "En Bitcoin (BTC)",
  Autre: "Autre crypto-actif",
  "Non quantifié": "Non quantifié",
};

export default function ComparatifParrainageCryptoPage() {
  const offers = getManagedOffers();
  const rows: CryptoRow[] = CRYPTO_COMPARATOR_SLUGS.map((slug) => {
    const offer = offers.find((o) => o.slug === slug);
    return offer ? rowOf(offer) : null;
  })
    .filter((row): row is CryptoRow => row !== null)
    .sort(
      (a, b) =>
        UNIT_RANK[a.unit] - UNIT_RANK[b.unit] ||
        CRYPTO_COMPARATOR_SLUGS.indexOf(a.slug) -
          CRYPTO_COMPARATOR_SLUGS.indexOf(b.slug),
    );

  const unitGroups = (Object.keys(UNIT_RANK) as RewardUnit[])
    .map((unit) => ({ unit, rows: rows.filter((row) => row.unit === unit) }))
    .filter((group) => group.rows.length > 0);

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
            name: "Comparatif parrainage crypto",
            item: `${SITE_URL}/comparatif/parrainage-crypto`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Offres de parrainage crypto comparées sur Parrainio",
        url: `${SITE_URL}/comparatif/parrainage-crypto`,
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
            <strong>Comparatif parrainage crypto</strong>
          </nav>
          <span className={styles.kicker}>
            <span />
            Comparatif Parrainio
          </span>
          <h1>Parrainage crypto : comparatif des récompenses</h1>
          <p className={styles.lead}>
            Ce comparatif réunit les offres de parrainage des 10 plateformes
            crypto actuellement documentées sur Parrainio : la récompense
            filleul annoncée par chaque plateforme, son unité (euros, dollars
            ou Bitcoin), le reversement Parrainio et les conditions
            essentielles. Les campagnes et les montants peuvent évoluer :
            chaque fiche reste la référence avant inscription.
          </p>
          <div className={styles.heroActions}>
            <a href="#comparatif" className={styles.primaryButton}>
              Voir le comparatif
            </a>
            <Link
              href="/categories/investissement-crypto"
              className={styles.secondaryButton}
            >
              Toutes les offres Investissement & Crypto →
            </Link>
          </div>
        </div>
      </section>

      {/* TRANSPARENCE */}
      <section className={styles.transparency}>
        <div className={styles.container}>
          <ul>
            <li>
              Le comparatif repose uniquement sur les offres crypto
              actuellement documentées sur Parrainio.
            </li>
            <li>
              « Jusqu&apos;à » indique un maximum de campagne : le montant
              réellement versé dépend du volume de trading, du dépôt et des
              conditions actives.
            </li>
            <li>
              Une récompense versée dans un crypto-actif (Bitcoin, CRO, USDT…)
              n&apos;est pas équivalente à un montant en euros garanti : sa
              valeur évolue avec le marché.
            </li>
            <li>
              Aucune conversion artificielle crypto → euro n&apos;est
              effectuée sur cette page : les unités sont conservées telles que
              servies par le catalogue.
            </li>
          </ul>
        </div>
      </section>

      {/* COMPARATEUR */}
      <section className={styles.section} id="comparatif">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Les 10 offres de parrainage <em>crypto documentées</em>
            </h2>
            <p>
              {rows.length} plateformes, regroupées par unité de récompense —
              aucun classement numérique ne mélange euros, dollars et
              crypto-actifs. Cliquez sur une fiche pour le détail complet.
            </p>
          </div>

          {/* TABLEAU — desktop / tablette */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Plateforme</th>
                  <th scope="col">Récompense filleul</th>
                  <th scope="col">Unité</th>
                  <th scope="col">Reversement Parrainio</th>
                  <th scope="col">Conditions essentielles</th>
                  <th scope="col">
                    <span className={styles.srOnly}>Lien vers la fiche</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {unitGroups.map((group) => (
                  <GroupRows key={group.unit} group={group} />
                ))}
              </tbody>
            </table>
          </div>

          {/* CARTES — mobile */}
          <ul className={styles.bankCards}>
            {unitGroups.map((group) => (
              <li key={group.unit} className={styles.cardGroup}>
                <span className={styles.groupChip}>
                  {UNIT_LABEL[group.unit]} · {group.rows.length}
                </span>
                <ul className={styles.cardList}>
                  {group.rows.map((row) => (
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
                          <dt>Récompense filleul</dt>
                          <dd>
                            {row.partnerReward}
                            {row.paidInCrypto && (
                              <small>Versée dans un crypto-actif</small>
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt>Unité</dt>
                          <dd>{row.unit}</dd>
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
                      <Link
                        href={`/offres/${row.slug}`}
                        className={styles.cardLink}
                      >
                        Voir la fiche {row.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <p className={styles.tableNote}>
            « Récompense filleul » : avantage annoncé par le partenaire pour
            un nouveau compte éligible. « Reversement Parrainio » : part de la
            commission reversée par Parrainio une fois le parrainage validé.
            Les montants « Non quantifié » ou « Non indiqué » ne sont pas
            chiffrés dans les données actuellement servies.
          </p>
        </div>
      </section>

      {/* UNITÉS / FORMATS */}
      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Unités et formats <em>de récompense</em>
            </h2>
            <p>
              Les récompenses crypto ne sont pas interchangeables : une
              récompense en Bitcoin n&apos;a pas la valeur d&apos;une prime en
              euros. Cette page conserve l&apos;unité servie par le catalogue,
              sans conversion de marché.
            </p>
          </div>
          <div className={styles.unitExplain}>
            {unitGroups.map((group) => (
              <div key={group.unit}>
                <h3>{UNIT_LABEL[group.unit]}</h3>
                <p>
                  {group.unit === "EUR" &&
                    "Récompense exprimée en euros — le montant peut néanmoins être crédité dans un crypto-actif selon le programme (mentionné sur la fiche)."}
                  {group.unit === "USD" &&
                    "Récompense exprimée en dollars américains, généralement créditée dans un crypto-actif."}
                  {group.unit === "BTC" &&
                    "Récompense directement exprimée en Bitcoin ou dans un crypto-actif."}
                  {group.unit === "Non quantifié" &&
                    "Aucun montant chiffré n'est actuellement documenté : la fiche reste la seule référence."}
                </p>
                <span>
                  {group.rows.map((row) => row.name).join(" · ")}
                </span>
              </div>
            ))}
            <p className={styles.unitNote}>
              {rows.filter((row) => row.paidInCrypto).length} offres sur{" "}
              {rows.length} annoncent une récompense versée dans un
              crypto-actif : sa valeur en euros peut fluctuer après
              l&apos;attribution.
            </p>
          </div>
        </div>
      </section>

      {/* COMMENT COMPARER */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Comment comparer <em>une offre crypto ?</em>
            </h2>
          </div>
          <div className={styles.explainer}>
            <div>
              <h3>Le montant</h3>
              <p>
                Comparez la récompense annoncée et sa formulation : fixe,
                « jusqu&apos;à », fourchette ou variable. Un maximum n&apos;est
                jamais un montant garanti.
              </p>
            </div>
            <div>
              <h3>Les conditions</h3>
              <p>
                Dépôt minimum, volume de trading, vérification d&apos;identité
                (KYC) : chaque plateforme définit ses propres déclencheurs,
                souvent dans un délai précis.
              </p>
            </div>
            <div>
              <h3>La durée de campagne</h3>
              <p>
                Les campagnes évoluent : une prime relevée à une date peut
                changer quelques semaines plus tard. La fiche et le compte du
                parrain restent les références.
              </p>
            </div>
            <div>
              <h3>La nature de la récompense</h3>
              <p>
                Euro, dollar, Bitcoin ou autre crypto-actif : la récompense
                n&apos;est pas un rendement. Sa valeur peut fluctuer, à la
                hausse comme à la baisse.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* À SAVOIR AVANT DE S'INSCRIRE */}
      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              À savoir <em>avant de s&apos;inscrire</em>
            </h2>
          </div>
          <ul className={styles.pointsList}>
            <li>
              <strong>Les campagnes changent.</strong> Les montants affichés
              sont ceux actuellement documentés : vérifiez l&apos;offre au
              moment du parcours.
            </li>
            <li>
              <strong>Volume ou dépôt souvent requis.</strong> Certaines
              récompenses dépendent d&apos;un volume de trading, d&apos;un
              premier dépôt ou d&apos;une action précise sous un délai donné.
            </li>
            <li>
              <strong>Des récompenses en crypto-actifs.</strong> Une
              récompense versée en BTC, CRO ou USDT n&apos;est pas un cash
              garanti : sa valeur suit le marché.
            </li>
            <li>
              <strong>KYC et éligibilité.</strong> La vérification
              d&apos;identité et le pays de résidence conditionnent souvent
              l&apos;attribution de la récompense.
            </li>
            <li>
              <strong>Vérifiez la fiche avant inscription.</strong> Chaque
              fiche détaille les conditions exactes, le délai et le parcours
              de parrainage.
            </li>
            <li>
              <strong>Les crypto-actifs sont risqués.</strong> Leur valeur
              peut fluctuer fortement ; aucun rendement n&apos;est garanti.
              Parrainio ne fournit aucun conseil en investissement.
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
                href="/categories/investissement-crypto"
                className={styles.outlineButton}
              >
                Investissement & Crypto
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

function GroupRows({ group }: { group: { unit: RewardUnit; rows: CryptoRow[] } }) {
  return (
    <>
      <tr className={styles.groupRow}>
        <td colSpan={6}>{UNIT_LABEL[group.unit]} — {group.rows.length}</td>
      </tr>
      {group.rows.map((row) => (
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
            {row.paidInCrypto && <small>Versée dans un crypto-actif</small>}
          </td>
          <td className={styles.unitCol}>
            <span className={styles.unitTag}>{row.unit}</span>
          </td>
          <td className={styles.reverseCol}>
            <span className={styles.reverseValue}>{row.parrainioReward}</span>
          </td>
          <td className={styles.conditionsCol}>{row.conditions}</td>
          <td className={styles.ctaCol}>
            <Link href={`/offres/${row.slug}`} className={styles.ctaLink}>
              Voir la fiche
            </Link>
          </td>
        </tr>
      ))}
    </>
  );
}