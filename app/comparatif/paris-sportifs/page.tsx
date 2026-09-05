import Link from "next/link";
import type { Metadata } from "next";
import OfferLogo from "@/components/OfferLogo";
import { OG_IMAGE } from "@/lib/ogImage";
import { SITE_URL } from "@/lib/siteUrl";
import { getManagedOffers, type ManagedOffer } from "@/data/managedOffers";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title:
    "Comparatif paris sportifs : bonus, conditions et offres | Parrainio",
  description:
    "Comparatif des offres de parrainage des opérateurs de paris sportifs actuellement documentés sur Parrainio : Winamax, Betclic, Unibet, Parions Sport et Betsson. Bonus filleul, reversement Parrainio et conditions essentielles, sans promesse de gain.",
  alternates: {
    canonical: `${SITE_URL}/comparatif/paris-sportifs`,
  },
  openGraph: {
    url: "/comparatif/paris-sportifs",
    type: "website",
    siteName: "Parrainio",
    locale: "fr_FR",
    images: [OG_IMAGE],
  },
};

/**
 * Configuration du comparateur : uniquement les slugs des 5 opérateurs de
 * paris sportifs réellement comparables. Aucun montant, bonus, condition,
 * durée ou cote n'est copié ici : toutes les valeurs affichées proviennent
 * de getManagedOffers().
 */
const PARIS_SPORTIFS_SLUGS = [
  "winamax",
  "betclic",
  "unibet",
  "parions-sport",
  "betsson",
];

const NOT_INDICATED = "Non indiqué";

type ParisSportifsRow = {
  slug: string;
  name: string;
  category: string;
  partnerReward: string;
  parrainioReward: string;
  conditions: string;
  color: string;
  logoLetter: string;
  logo: string | null;
};

function rowOf(offer: ManagedOffer): ParisSportifsRow {
  const conditions = (offer.conditions ?? [])
    .filter(Boolean)
    .slice(0, 2)
    .join(" ");
  return {
    slug: offer.slug,
    name: offer.name,
    category: offer.category,
    partnerReward: (offer.partnerReward ?? "").trim() || NOT_INDICATED,
    parrainioReward: offer.parrainioReward?.trim() || NOT_INDICATED,
    conditions: conditions || "Détails sur la fiche de l'offre.",
    color: offer.color,
    logoLetter: offer.logoLetter,
    logo: offer.logo,
  };
}

export default function ComparatifParisSportifsPage() {
  const offers = getManagedOffers();
  const rows: ParisSportifsRow[] = PARIS_SPORTIFS_SLUGS.map((slug) => {
    const offer = offers.find((o) => o.slug === slug);
    return offer ? rowOf(offer) : null;
  }).filter((row): row is ParisSportifsRow => row !== null);

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
            name: "Comparatif paris sportifs",
            item: `${SITE_URL}/comparatif/paris-sportifs`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Opérateurs de paris sportifs comparés sur Parrainio",
        url: `${SITE_URL}/comparatif/paris-sportifs`,
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
            <strong>Comparatif paris sportifs</strong>
          </nav>
          <span className={styles.kicker}>
            <span />
            Comparatif Parrainio
          </span>
          <h1>Comparatif des paris sportifs</h1>
          <p className={styles.lead}>
            Ce comparatif réunit les offres de parrainage des opérateurs de
            paris sportifs actuellement documentés sur Parrainio : Winamax,
            Betclic, Unibet, Parions Sport et Betsson. Il présente l&apos;avantage
            filleul annoncé par chaque opérateur, le reversement Parrainio et
            les conditions essentielles. Les bonus et leurs conditions peuvent
            évoluer selon les campagnes : chaque fiche reste la référence avant
            inscription.
          </p>
          <div className={styles.heroActions}>
            <a href="#comparatif" className={styles.primaryButton}>
              Voir le comparatif
            </a>
            <Link href="/categories/jeux-paris" className={styles.secondaryButton}>
              Toutes les offres Jeux & Paris →
            </Link>
          </div>
        </div>
      </section>

      {/* TRANSPARENCE */}
      <section className={styles.transparency}>
        <div className={styles.container}>
          <ul>
            <li>
              L&apos;avantage affiché est celui indiqué pour le filleul : il ne
              constitue pas un gain garanti.
            </li>
            <li>
              Un bonus ou freebet n&apos;est pas nécessairement de l&apos;argent
              retirable : seule la part éventuellement gagnée peut l&apos;être,
              selon les conditions de mise.
            </li>
            <li>
              Le reversement Parrainio correspond à la part de commission que
              Parrainio peut reverser au filleul une fois le parrainage validé
              par l&apos;opérateur.
            </li>
            <li>
              Les conditions peuvent dépendre de la campagne en cours : aucun
              montant ne doit être lu comme une promesse.
            </li>
            <li>
              Les jeux d&apos;argent sont réservés aux majeurs et comportent des
              risques.
            </li>
          </ul>
        </div>
      </section>

      {/* COMPARATEUR */}
      <section className={styles.section} id="comparatif">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Les 5 opérateurs de paris sportifs <em>documentés</em>
            </h2>
            <p>
              {rows.length} opérateurs comparés. Cliquez sur une fiche pour le
              détail complet des conditions et du fonctionnement.
            </p>
          </div>

          {/* TABLEAU — desktop / tablette */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Opérateur</th>
                  <th scope="col">Bonus / avantage filleul</th>
                  <th scope="col">Reversement Parrainio</th>
                  <th scope="col">Condition essentielle</th>
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
                    <td className={styles.reverseCol}>{row.parrainioReward}</td>
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
                    <dt>Bonus / avantage filleul</dt>
                    <dd>{row.partnerReward}</dd>
                  </div>
                  <div>
                    <dt>Reversement Parrainio</dt>
                    <dd>{row.parrainioReward}</dd>
                  </div>
                  <div>
                    <dt>Condition essentielle</dt>
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
            « Bonus / avantage filleul » : avantage annoncé par l&apos;opérateur
            pour une inscription éligible — il ne garantit aucun gain.
            « Reversement Parrainio » : part de la commission reversée par
            Parrainio une fois le parrainage validé. Les montants « Non
            indiqué » ne sont pas chiffrés dans les données actuellement
            servies.
          </p>
        </div>
      </section>

      {/* COMMENT FONCTIONNENT LES BONUS */}
      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Comment fonctionnent les bonus <em>de paris sportifs ?</em>
            </h2>
            <p>
              Les étapes générales sont les mêmes d&apos;un opérateur à
              l&apos;autre — mais chaque bonus a ses propres conditions, à
              vérifier sur la fiche.
            </p>
          </div>
          <ol className={styles.stepsList}>
            <li>
              <strong>Choisir une offre</strong>
              <span>
                Comparer le bonus annoncé, sa nature (cash, freebet) et ses
                conditions avant de vous décider.
              </span>
            </li>
            <li>
              <strong>Vérifier les conditions</strong>
              <span>
                Dépôt minimum, premier pari, délai, éligibilité : chaque
                opérateur applique ses propres règles.
              </span>
            </li>
            <li>
              <strong>Utiliser le lien ou code de parrainage</strong>
              <span>
                Le parcours doit être commencé depuis le lien ou avec le code :
                il rattache l&apos;inscription à l&apos;offre.
              </span>
            </li>
            <li>
              <strong>Créer et valider le compte</strong>
              <span>
                Inscription complète, vérification d&apos;identité et de
                domicile sont souvent demandées.
              </span>
            </li>
            <li>
              <strong>Effectuer les actions demandées</strong>
              <span>
                Premier dépôt ou premier pari dans les limites prévues par la
                campagne.
              </span>
            </li>
            <li>
              <strong>Bénéficier de l&apos;avantage si les conditions sont remplies</strong>
              <span>
                Le bonus est attribué selon le règlement de l&apos;opérateur,
                sans jamais constituer un gain garanti.
              </span>
            </li>
          </ol>
        </div>
      </section>

      {/* COMMENT COMPARER LES OFFRES */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Comment comparer <em>les offres ?</em>
            </h2>
          </div>
          <div className={styles.explainer}>
            <div>
              <h3>Le montant et la nature du bonus</h3>
              <p>
                Cash ou freebet, montant fixe ou « jusqu&apos;à » : comparez ce
                qui est réellement annoncé, sans lire un maximum comme une
                garantie.
              </p>
            </div>
            <div>
              <h3>Les conditions de dépôt</h3>
              <p>
                Un dépôt minimum est généralement requis pour activer le bonus :
                le montant et le délai diffèrent selon l&apos;opérateur.
              </p>
            </div>
            <div>
              <h3>Les conditions liées au premier pari</h3>
              <p>
                Certains bonus remboursent un premier pari perdant : cotes,
                montants et limites sont propres à chaque campagne.
              </p>
            </div>
            <div>
              <h3>Restrictions, délais et reversement</h3>
              <p>
                Vérifiez les exclusions, la durée de validité indiquée sur la
                fiche et le reversement Parrainio prévu pour l&apos;offre.
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
              <strong>Réservé aux personnes majeures (18+).</strong> Les jeux
              d&apos;argent sont interdits aux mineurs.
            </li>
            <li>
              <strong>Les jeux d&apos;argent comportent un risque de perte.</strong>{" "}
              Ils peuvent entraîner des difficultés financières ou une
              dépendance.
            </li>
            <li>
              <strong>Un bonus ou freebet ne garantit pas un gain.</strong>{" "}
              Il reste soumis aux conditions de mise de l&apos;opérateur.
            </li>
            <li>
              <strong>Vérifiez toujours les conditions de l&apos;offre</strong> avant
              de vous inscrire.
            </li>
            <li>
              <strong>Ne jouez pas au-delà de vos moyens.</strong> Fixez-vous
              des limites de temps et de budget.
            </li>
          </ul>
          <div className={styles.helpBox}>
            <strong>Besoin d&apos;aide ?</strong>
            <span>
              Jouer comporte des risques : endettement, isolement,
              dépendance. Pour être aidé, appelez le 09 74 75 13 13 (appel non
              surtaxé).
            </span>
          </div>
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
                Chaque fiche détaille les conditions exactes et le parcours de
                parrainage. Les catégories du site regroupent les univers les
                plus recherchés.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <Link href="/offres" className={styles.primaryButton}>
                Voir toutes les offres
              </Link>
              <Link href="/categories/jeux-paris" className={styles.outlineButton}>
                Jeux & Paris
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