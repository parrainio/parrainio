import Link from "next/link";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { OG_IMAGE } from "@/lib/ogImage";
import PublicHeaderServer from "@/components/PublicHeaderServer";
import SiteFooter from "@/components/SiteFooter";
import { computeStats, dateDuJourParis, observatoire } from "@/lib/observatoireConditions";
import Echeancier from "./Echeancier";

export const metadata: Metadata = {
  title: "Quand vais-je toucher ma prime de parrainage ?",
  description:
    "Choisissez une offre et une date : l’outil applique le délai de versement publié par la banque, ou affiche qu’aucun délai n’est publié. Sources citées.",
  alternates: { canonical: "https://www.parrainio.fr/echeancier-prime-parrainage" },
  openGraph: {
    url: "/echeancier-prime-parrainage",
    type: "website",
    siteName: "Parrainio",
    locale: "fr_FR",
    images: [OG_IMAGE],
  },
};

// Les campagnes datées doivent pouvoir basculer en « terminée » sans redéploiement.
export const revalidate = 3600;

const stats = computeStats();

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Échéancier de versement des primes de parrainage",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  inLanguage: "fr-FR",
  isAccessibleForFree: true,
  description:
    "Outil qui applique le délai de versement publié par onze banques à une date de souscription, sans estimer les délais non publiés, et affiche séparément le délai constaté sur le terrain.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  creator: { "@type": "Organization", name: "Parrainio", url: "https://www.parrainio.fr" },
  isBasedOn: "https://www.parrainio.fr/observatoire-conditions-prime",
};

const calculables = observatoire.offres.filter((offre) => offre.delaiStructure).length;

export default function EcheancierPage() {
  return (
    <main className={styles.page}>
      <PublicHeaderServer active="how" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}><span />Outil — observatoire Parrainio</p>
          <h1>Quand vais-je toucher <em>ma prime</em> ?</h1>
          <p className={styles.lead}>
            Les banques publient rarement une date, presque toujours un délai. Cet outil applique ce
            délai à votre date de souscription, et refuse de calculer quand la banque ne publie rien :{" "}
            <strong>{calculables} offres sur {stats.total}</strong> permettent un calcul, les autres
            affichent leur absence de délai. À côté de la date, le délai constaté par le responsable de
            Parrainio est affiché séparément, avec son déclencheur : ce n’est pas une condition de la
            banque, et aucune date n’en est déduite quand le point de départ n’est pas écrit.
          </p>
        </div>
      </section>

      <section className={styles.toolSection}>
        <div className={styles.container}>
          <Echeancier
            offres={observatoire.offres}
            reversementDelai={observatoire.reversement.delai}
            today={dateDuJourParis()}
          />
        </div>
      </section>

      <section className={styles.explainSection}>
        <div className={styles.container}>
          <h2>Ce que l’outil fait — et ce qu’il ne fait pas</h2>
          <div className={styles.columns}>
            <article>
              <h3>Il applique une règle publiée</h3>
              <p>
                Le délai utilisé est celui écrit sur la page officielle de la banque, dans son unité :
                jours, jours ouvrés ou mois. Les mois sont ajoutés au calendrier (le 31 janvier + 1 mois
                donne le 28 ou 29 février), et les jours ouvrés excluent les week-ends, pas les jours
                fériés.
              </p>
            </article>
            <article>
              <h3>Il montre aussi le délai constaté</h3>
              <p>
                Sous la date, l’outil rappelle la durée observée par le responsable de Parrainio et
                l’opération qui la déclenche. Ce retour terrain est plus court que le plafond publié
                sur plusieurs offres ; il reste une observation, jamais une échéance.
              </p>
            </article>
            <article>
              <h3>Il ne promet aucune date</h3>
              <p>
                Une date « au plus tard » n’est pas une date de versement garantie. La banque peut
                valider le parrainage plus tard, contester une condition ou verser après l’échéance.
                L’outil ne simule aucun intérêt ni aucun manque à gagner.
              </p>
            </article>
            <article>
              <h3>Il ajoute le reversement Parrainio</h3>
              <p>
                La date affichée est celle de la prime bancaire. Le reversement Parrainio intervient
                ensuite, {observatoire.reversement.delai} après réception de sa commission — un
                engagement de Parrainio, pas une condition de la banque.
              </p>
            </article>
            <article>
              <h3>Il signale les campagnes datées</h3>
              <p>
                Deux offres du relevé portent une opération avec une date de fin. L’outil l’indique :
                souscrire après la fin change le montant de la prime, pas le délai publié.
              </p>
            </article>
            <article>
              <h3>Il ne collecte rien</h3>
              <p>
                Aucune donnée n’est envoyée : le calcul se fait dans votre navigateur, la date saisie
                n’est ni stockée ni transmise. Aucun compte n’est nécessaire.
              </p>
            </article>
          </div>
          <p className={styles.note}>
            Les onze conditions sont lisibles, datées et citées dans{" "}
            <Link href="/observatoire-conditions-prime">l’observatoire des conditions de versement</Link>.
            Pour comprendre qui paie quoi, voir{" "}
            <Link href="/comprendre-prime-parrain-filleul-commission">les trois montants d’un parrainage</Link>.
            Si la date est passée et que rien n’arrive,{" "}
            <Link href="/blog/prime-parrainage-pas-encore-versee">ce guide passe en revue les causes possibles</Link>.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
