import Link from "next/link";
import type { Metadata } from "next";
import CopyTextButton from "@/components/CopyTextButton";
import OfferLogo from "@/components/OfferLogo";
import PublicHeaderServer from "@/components/PublicHeaderServer";
import SiteFooter from "@/components/SiteFooter";
import { esimPromoCodes } from "@/data/esimPromoCodes";
import { getBemoveCopyTrackingUrl } from "@/lib/bemoveTracking";
import { OG_IMAGE } from "@/lib/ogImage";
import { SITE_URL } from "@/lib/siteUrl";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Comparatif eSIM de voyage : forfaits et codes promo | Parrainio",
  description:
    "Comparez Saily, Ubigi, Airalo, Esimo et Holafly : formats de forfaits, couverture, données, durée et codes promo eSIM à vérifier.",
  alternates: { canonical: `${SITE_URL}/comparatif-esim` },
  openGraph: {
    url: "/comparatif-esim",
    type: "website",
    siteName: "Parrainio",
    locale: "fr_FR",
    images: [OG_IMAGE],
  },
};

const faqs = [
  {
    question: "Qu’est-ce qu’une eSIM de voyage ?",
    answer:
      "Une eSIM est un profil SIM numérique que l’on installe sur un appareil compatible. Une eSIM de voyage donne accès à un forfait mobile destiné à être utilisé pendant un séjour à l’étranger ; le réseau, le volume inclus et la durée dépendent du forfait acheté.",
  },
  {
    question: "Mon téléphone est-il compatible avec une eSIM ?",
    answer:
      "La compatibilité dépend du modèle exact, de sa variante régionale et parfois du verrouillage opérateur. Vérifiez la liste publiée par le fabricant, puis celle du fournisseur eSIM, avant l’achat ; la présence d’un menu eSIM ne garantit pas à elle seule que tous les forfaits fonctionneront.",
  },
  {
    question: "Faut-il activer l’eSIM avant le départ ?",
    answer:
      "L’installation et le début de validité ne sont pas toujours le même événement. Consultez les instructions du forfait choisi : certains demandent une installation à l’avance, tandis que le décompte ou la connexion commence selon leurs propres règles. Gardez une connexion Wi-Fi pour l’installation si elle est requise.",
  },
  {
    question: "Quelle différence entre données illimitées et forfait avec quota ?",
    answer:
      "Un forfait avec quota indique une enveloppe de données définie ; un forfait annoncé illimité peut rester soumis à des règles d’usage, de partage de connexion ou de débit. Lisez les conditions précises, notamment la politique d’usage raisonnable, avant de comparer les offres.",
  },
  {
    question: "Comment utiliser un code promo eSIM ?",
    answer:
      "Copiez le code puis suivez le lien partenaire depuis le bouton de la carte, et renseignez le code à l’étape indiquée par le fournisseur. Les codes présentés ici proviennent du fichier Bemove : leur validité, leur période et leur cumul éventuel doivent être confirmés auprès du partenaire avant paiement.",
  },
];

export default function ComparatifEsimPage() {
  return (
    <main className={styles.page}>
      <PublicHeaderServer />

      <section className={styles.hero}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">→</span>
            <Link href="/codes-parrainage">Codes promo / parrainage</Link>
            <span aria-hidden="true">→</span>
            <strong>Comparatif eSIM</strong>
          </nav>
          <p className={styles.kicker}>Guide pratique · eSIM de voyage</p>
          <h1>Comparatif des eSIM de voyage : Saily, Ubigi, Airalo, Esimo et Holafly</h1>
          <p className={styles.lead}>
            Une eSIM de voyage peut fournir un forfait Internet à l’étranger sans carte SIM
            physique. Comparez la couverture réelle, le volume de données, la durée, la compatibilité
            et les règles d’activation avant de choisir : les détails varient d’un forfait à l’autre.
          </p>
          <div className={styles.heroActions}>
            <a href="#comparatif" className={styles.primaryButton}>
              Voir le comparatif
            </a>
            <Link href="/codes-parrainage" className={styles.secondaryButton}>
              Voir les codes promo / parrainage →
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section} id="comparatif" aria-labelledby="comparison-heading">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2 id="comparison-heading">
              Cinq services eSIM, <em>à comparer selon votre voyage</em>
            </h2>
            <p>
              Les informations ci-dessous proviennent des présentations des fournisseurs. Elles ne
              remplacent pas les détails du forfait au moment de l’achat ; les tarifs ne sont pas
              comparés car aucun prix actuel et daté n’a été vérifié.
            </p>
          </div>

          <div className={styles.tableWrap} role="region" aria-label="Comparatif des services eSIM" tabIndex={0}>
            <table className={styles.table}>
              <caption className={styles.srOnly}>
                Comparaison des forfaits eSIM et codes promo annoncés pour cinq fournisseurs.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Service</th>
                  <th scope="col">Type de forfaits</th>
                  <th scope="col">Destinations</th>
                  <th scope="col">Données</th>
                  <th scope="col">Durée</th>
                  <th scope="col">Prix</th>
                  <th scope="col">Code promo Bemove</th>
                  <th scope="col">À vérifier</th>
                </tr>
              </thead>
              <tbody>
                {esimPromoCodes.map((offer) => (
                  <tr key={offer.slug}>
                    <th scope="row">
                      <Link
                        href={offer.officialUrl}
                        className={styles.brand}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <OfferLogo
                          name={offer.name}
                          logo={offer.logo}
                          color={offer.color}
                          logoLetter={offer.name.slice(0, 1)}
                          size={36}
                        />
                        {offer.name} <span aria-hidden="true">↗</span>
                      </Link>
                      <small className={styles.brandDescription}>{offer.description}</small>
                    </th>
                    <td>{offer.packageModel}</td>
                    <td>{offer.coverage}</td>
                    <td>{offer.dataAllowance}</td>
                    <td>{offer.validity}</td>
                    <td>{offer.price}</td>
                    <td>
                      <div className={styles.promoCell}>
                        <code>{offer.code}</code>
                        <span>{offer.discountPercent} % annoncés*</span>
                        <CopyTextButton
                          value={offer.code}
                          label="Copier"
                          copiedLabel="Copié ✓"
                          openUrlOnClick={getBemoveCopyTrackingUrl(offer.slug)}
                        />
                      </div>
                    </td>
                    <td>{offer.conditions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className={styles.mobileCards}>
            {esimPromoCodes.map((offer) => (
              <li key={offer.slug} className={styles.mobileCard}>
                <div className={styles.mobileCardBrand}>
                  <OfferLogo
                    name={offer.name}
                    logo={offer.logo}
                    color={offer.color}
                    logoLetter={offer.name.slice(0, 1)}
                    size={42}
                  />
                  <div>
                    <Link href={offer.officialUrl} target="_blank" rel="noreferrer">
                      {offer.name} ↗
                    </Link>
                    <p>{offer.description}</p>
                  </div>
                </div>
                <dl>
                  <div><dt>Type de forfaits</dt><dd>{offer.packageModel}</dd></div>
                  <div><dt>Destinations</dt><dd>{offer.coverage}</dd></div>
                  <div><dt>Données</dt><dd>{offer.dataAllowance}</dd></div>
                  <div><dt>Durée</dt><dd>{offer.validity}</dd></div>
                  <div><dt>Prix</dt><dd>{offer.price}</dd></div>
                  <div><dt>À vérifier</dt><dd>{offer.conditions}</dd></div>
                </dl>
                <div className={styles.mobilePromo}>
                  <span>
                    Code promo Bemove : <code>{offer.code}</code> · {offer.discountPercent} % annoncés*
                  </span>
                  <CopyTextButton
                    value={offer.code}
                    label="Copier"
                    copiedLabel="Copié ✓"
                    openUrlOnClick={getBemoveCopyTrackingUrl(offer.slug)}
                  />
                </div>
              </li>
            ))}
          </ul>

          <p className={styles.note}>
            * Codes et remises transcrits du fichier partenaire Bemove ; cela ne confirme pas leur
            validité actuelle. Vérifiez l’éligibilité, la date, les exclusions et le prix final sur
            le parcours officiel avant de payer.
          </p>
        </div>
      </section>

      <section className={styles.sectionAlt} aria-labelledby="choosing-heading">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2 id="choosing-heading">
              Comment choisir une eSIM <em>adaptée à votre séjour ?</em>
            </h2>
            <p>
              Une offre n’est intéressante que si elle couvre le bon pays et correspond à votre
              usage. Vérifiez ces points avant de comparer uniquement le prix.
            </p>
          </div>
          <div className={styles.adviceGrid}>
            <article>
              <h3>Destination et réseaux</h3>
              <p>
                Vérifiez le pays exact, les territoires inclus et les réseaux partenaires. Une
                formule régionale ou mondiale ne couvre pas nécessairement chaque étape de votre
                itinéraire.
              </p>
            </article>
            <article>
              <h3>Volume de données</h3>
              <p>
                Cartes, messagerie et navigation consomment moins que la vidéo ou le partage de
                connexion. Estimez votre usage et lisez les règles de débit réduit ou d’usage
                raisonnable pour les forfaits annoncés illimités.
              </p>
            </article>
            <article>
              <h3>Durée et activation</h3>
              <p>
                Comparez le nombre de jours inclus et le moment où la validité commence. Distinguez
                l’installation du profil de l’activation du forfait et suivez les instructions du
                fournisseur.
              </p>
            </article>
            <article>
              <h3>Téléphone et SIM existante</h3>
              <p>
                Confirmez que votre modèle précis accepte l’eSIM et n’est pas bloqué sur un
                opérateur. Vérifiez aussi comment conserver votre ligne habituelle et éviter les
                frais d’itinérance.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="faq-heading">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2 id="faq-heading">Questions fréquentes sur les eSIM de voyage</h2>
          </div>
          <div className={styles.faq}>
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.cta}>
            <div>
              <h2>Retrouvez les codes promo eSIM</h2>
              <p>Les codes Bemove sont à vérifier auprès de chaque fournisseur avant utilisation.</p>
            </div>
            <Link href="/codes-parrainage">Voir les codes promo / parrainage →</Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
