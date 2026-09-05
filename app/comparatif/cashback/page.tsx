import Link from "next/link";
import type { Metadata } from "next";
import OfferLogo from "@/components/OfferLogo";
import { OG_IMAGE } from "@/lib/ogImage";
import { SITE_URL } from "@/lib/siteUrl";
import { getManagedOffers, type ManagedOffer } from "@/data/managedOffers";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title:
    "Comparatif cashback : iGraal, Poulpeo, eBuyClub, Widilo… | Parrainio",
  description:
    "Comparatif des plateformes de cashback actuellement documentées sur Parrainio : iGraal, Poulpeo, eBuyClub, Widilo et TopCashback. Bonus de parrainage filleul, reversement Parrainio et conditions essentielles, sans inventer de taux de cashback.",
  alternates: {
    canonical: `${SITE_URL}/comparatif/cashback`,
  },
  openGraph: {
    url: "/comparatif/cashback",
    type: "website",
    siteName: "Parrainio",
    locale: "fr_FR",
    images: [OG_IMAGE],
  },
};

/**
 * Configuration du comparateur : uniquement les slugs des 5 plateformes de
 * cashback réellement comparables. Aucun montant, bonus, reversement, seuil,
 * délai ou condition n'est copié ici : toutes les valeurs affichées
 * proviennent de getManagedOffers().
 */
const CASHBACK_COMPARATOR_SLUGS = [
  "igraal",
  "poulpeo",
  "ebuyclub",
  "widilo",
  "topcashback",
];

const NOT_INDICATED = "Non indiqué";

type CashbackRow = {
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

function rowOf(offer: ManagedOffer): CashbackRow {
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

export default function ComparatifCashbackPage() {
  const offers = getManagedOffers();
  const rows: CashbackRow[] = CASHBACK_COMPARATOR_SLUGS.map((slug) => {
    const offer = offers.find((o) => o.slug === slug);
    return offer ? rowOf(offer) : null;
  }).filter((row): row is CashbackRow => row !== null);

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
            name: "Comparatif cashback",
            item: `${SITE_URL}/comparatif/cashback`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Plateformes de cashback comparées sur Parrainio",
        url: `${SITE_URL}/comparatif/cashback`,
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
            <strong>Comparatif cashback</strong>
          </nav>
          <span className={styles.kicker}>
            <span />
            Comparatif Parrainio
          </span>
          <h1>Comparatif des plateformes de cashback</h1>
          <p className={styles.lead}>
            Les plateformes de cashback remboursent une partie de vos dépenses
            effectuées chez leurs marchands partenaires. Ce comparatif réunit
            les 5 plateformes actuellement documentées sur Parrainio — iGraal,
            Poulpeo, eBuyClub, Widilo et TopCashback — avec leur bonus de
            parrainage, le reversement Parrainio et les conditions essentielles.
            Les bonus et leurs conditions peuvent évoluer : chaque fiche reste
            la référence avant inscription.
          </p>
          <div className={styles.heroActions}>
            <a href="#comparatif" className={styles.primaryButton}>
              Voir le comparatif
            </a>
            <Link href="/categories/cashback" className={styles.secondaryButton}>
              Toutes les offres Cashback →
            </Link>
          </div>
        </div>
      </section>

      {/* TRANSPARENCE */}
      <section className={styles.transparency}>
        <div className={styles.container}>
          <ul>
            <li>
              Ce comparateur réunit uniquement les plateformes de cashback
              réellement comparables, actuellement documentées sur Parrainio.
            </li>
            <li>
              Le bonus de parrainage n&apos;est pas un taux de cashback : c&apos;est
              un avantage d&apos;inscription, distinct du remboursement obtenu sur
              les achats chez les marchands.
            </li>
            <li>
              Les taux de cashback des marchands ne sont pas documentés ici —
              ils varient par plateforme, par marchand et par période.
            </li>
            <li>
              Le reversement Parrainio est une part de la commission reversée
              une fois le parrainage validé par la plateforme.
            </li>
          </ul>
        </div>
      </section>

      {/* COMPARATEUR */}
      <section className={styles.section} id="comparatif">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Les 5 plateformes de cashback <em>documentées</em>
            </h2>
            <p>
              {rows.length} plateformes comparées. Cliquez sur une fiche pour
              le détail complet des conditions et du fonctionnement.
            </p>
          </div>

          {/* TABLEAU — desktop / tablette */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Plateforme</th>
                  <th scope="col">Avantage filleul</th>
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
                    <dt>Avantage filleul</dt>
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
            « Avantage filleul » : bonus de parrainage annoncé par la
            plateforme pour une inscription éligible — distinct du cashback
            obtenu sur les achats. « Reversement Parrainio » : part de la
            commission reversée par Parrainio une fois le parrainage validé.
            Les montants « Non indiqué » ne sont pas chiffrés dans les données
            actuellement servies.
          </p>
        </div>
      </section>

      {/* COMMENT FONCTIONNE LE CASHBACK */}
      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Comment fonctionne <em>le cashback ?</em>
            </h2>
            <p>
              Le principe est le même sur l&apos;essentiel des plateformes :
              un remboursement d&apos;une partie de l&apos;achat, versé après
              validation par le marchand partenaire.
            </p>
          </div>
          <ol className={styles.stepsList}>
            <li>
              <strong>Inscription sur la plateforme</strong>
              <span>
                Créer un compte — idéalement via un lien ou code de parrainage
                pour ouvrir le droit au bonus d&apos;inscription.
              </span>
            </li>
            <li>
              <strong>Activation du cashback</strong>
              <span>
                Passer par la plateforme (extension, application ou lien) avant
                d&apos;acheter chez un marchand partenaire.
              </span>
            </li>
            <li>
              <strong>Achat chez le marchand</strong>
              <span>
                Payer normalement chez le marchand : le prix n&apos;est pas
                modifié par le passage par la plateforme.
              </span>
            </li>
            <li>
              <strong>Validation de l&apos;achat</strong>
              <span>
                Le marchand confirme la transaction éligible — un retour ou une
                annulation peut la faire annuler.
              </span>
            </li>
            <li>
              <strong>Crédit du cashback</strong>
              <span>
                Le remboursement est crédité sur la cagnotte de la plateforme,
                puis devient retirable selon ses règles.
              </span>
            </li>
          </ol>
        </div>
      </section>

      {/* COMMENT COMPARER */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Comment comparer <em>les plateformes ?</em>
            </h2>
          </div>
          <div className={styles.explainer}>
            <div>
              <h3>Le bonus de bienvenue</h3>
              <p>
                Comparez le bonus de parrainage annoncé et ses conditions :
                premier achat éligible, montant minimum ou délai sont souvent
                requis.
              </p>
            </div>
            <div>
              <h3>Les conditions d&apos;obtention</h3>
              <p>
                Seuil de commande, type de cashback (en ligne, bon d&apos;achat,
                magasin) et délai de validation changent d&apos;une plateforme
                à l&apos;autre.
              </p>
            </div>
            <div>
              <h3>Les marchands partenaires</h3>
              <p>
                Une plateforme ne vaut que par son réseau : privilégiez celle
                qui couvre vos enseignes habituelles. Le détail se consulte sur
                chaque site.
              </p>
            </div>
            <div>
              <h3>La simplicité d&apos;utilisation</h3>
              <p>
                Extension de navigateur, application ou site : le déclencheur
                du cashback doit correspondre à votre façon d&apos;acheter.
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
              <strong>Le bonus de parrainage a des conditions.</strong> Premier
              achat éligible, montant minimum ou délai : lisez la condition
              propre à chaque offre.
            </li>
            <li>
              <strong>Certains achats peuvent être exclus.</strong> Retours,
              annulations ou produits exclus par le marchand peuvent annuler le
              remboursement.
            </li>
            <li>
              <strong>Le cashback doit être validé.</strong> Le remboursement
              n&apos;est définitivement acquis qu&apos;après confirmation par le
              marchand.
            </li>
            <li>
              <strong>Les campagnes évoluent.</strong> Bonus et conditions
              peuvent changer : vérifiez l&apos;offre au moment de votre
              inscription.
            </li>
            <li>
              <strong>Consultez la fiche avant de vous lancer.</strong> Chaque
              fiche détaille les conditions exactes propres à la plateforme.
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
                Chaque fiche détaille les conditions exactes, les seuils et le
                fonctionnement de la plateforme. Les catégories du site
                regroupent les univers les plus recherchés.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <Link href="/offres" className={styles.primaryButton}>
                Voir toutes les offres
              </Link>
              <Link href="/categories/cashback" className={styles.outlineButton}>
                Cashback
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