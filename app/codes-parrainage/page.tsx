import Link from "next/link";
import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/ogImage";
import { SITE_URL } from "@/lib/siteUrl";
import { getManagedOffers } from "@/data/managedOffers";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Code de parrainage : comment le trouver et l'utiliser | Parrainio",
  description:
    "Code parrainage : ce que c'est, où le trouver sur Parrainio, comment le saisir correctement et ce qui peut l'invalider. Codes, liens et conditions expliqués simplement.",
  alternates: { canonical: `${SITE_URL}/codes-parrainage` },
  openGraph: {
    url: "/codes-parrainage",
    type: "website",
    siteName: "Parrainio",
    locale: "fr_FR",
    images: [OG_IMAGE],
  },
};

/**
 * Statistiques descriptives calculées sur le catalogue courant :
 * elles servent uniquement à décrire la page (aucune donnée
 * commerciale n'est inventée ni dupliquée ici).
 */
export default function CodesParrainagePage() {
  const offers = getManagedOffers();
  const withCode = offers.filter(
    (offer) => offer.referralCode && offer.referralCode.trim()
  ).length;

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
            name: "Codes de parrainage",
            item: `${SITE_URL}/codes-parrainage`,
          },
        ],
      },
      {
        "@type": "WebPage",
        name: "Code de parrainage : comment le trouver et l'utiliser",
        description:
          "Ce qu'est un code de parrainage, où le trouver sur Parrainio, comment le saisir correctement et ce qui peut l'invalider.",
        url: `${SITE_URL}/codes-parrainage`,
        inLanguage: "fr-FR",
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
            <strong>Codes de parrainage</strong>
          </nav>
          <span className={styles.kicker}>
            <span />
            Guide pratique
          </span>
          <h1>Code de parrainage : à quoi ça sert et comment l&apos;utiliser</h1>
          <p className={styles.lead}>
            Un code de parrainage est l&apos;identifiant d&apos;un parrain que
            certaines entreprises demandent au moment de l&apos;inscription.
            Saisi au bon endroit, il rattache le nouveau client à son parrain et
            déclenche la prime prévue par le programme — pour le filleul, pour
            le parrain, ou pour les deux. Voici comment l&apos;utiliser
            correctement, et ce qui peut l&apos;invalider.
          </p>
          <div className={styles.heroActions}>
            <Link href="/offres" className={styles.primaryButton}>
              Trouver une offre de parrainage
            </Link>
            <Link href="/comment-ca-marche" className={styles.secondaryButton}>
              Comment fonctionne le parrainage →
            </Link>
          </div>
        </div>
      </section>

      {/* TRANSPARENCE */}
      <section className={styles.transparency}>
        <div className={styles.container}>
          <ul>
            <li>
              Cette page explique le mécanisme des codes de parrainage de
              manière générale : chaque programme fixe ses propres règles et
              seul son Conditions générales fait foi.
            </li>
            <li>
              Sur Parrainio, chaque fiche affiche le code du partenaire
              lorsqu&apos;un code est documenté — et le lien de parrainage
              lorsqu&apos;il existe.
            </li>
            <li>
              Aucun code « magique » ni de réduction universelle : un code ne
              crée un avantage que si le programme est actif et les conditions
              remplies.
            </li>
            <li>
              Les campagnes évoluent : vérifiez toujours les conditions
              affichées au moment de l&apos;inscription.
            </li>
          </ul>
        </div>
      </section>

      {/* COMMENT UTILISER UN CODE */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Comment utiliser <em>un code de parrainage ?</em>
            </h2>
            <p>
              Le parcours est simple, mais l&apos;ordre compte : la plupart des
              codes refusés le sont parce qu&apos;ils ont été saisis trop tard
              ou au mauvais endroit.
            </p>
          </div>
          <ol className={styles.steps}>
            <li>
              <strong>Trouver le code de l&apos;offre concernée.</strong> Sur
              Parrainio, ouvrez la fiche du partenaire : le code y est affiché
              avec un bouton de copie lorsqu&apos;un code est documenté.
            </li>
            <li>
              <strong>Suivre le parcours prévu par le programme.</strong>{" "}
              Certains partenaires demandent de créer le compte via un lien de
              parrainage, d&apos;autres de saisir un code pendant
              l&apos;inscription, d&apos;autres encore les deux. Le parcours
              exact est décrit sur la fiche et dans les conditions du
              programme.
            </li>
            <li>
              <strong>Saisir le code au bon moment.</strong> Un code doit
              généralement être entré pendant la création du compte ou avant la
              première validation : rattraper un oubli après coup est rarement
              possible.
            </li>
            <li>
              <strong>Vérifier son éligibilité.</strong> Nouveau client, âge,
              résidence, première commande ou premier paiement : les conditions
              d&apos;éligibilité déterminent si la prime s&apos;applique.
            </li>
            <li>
              <strong>Attendre la validation.</strong> La prime est attribuée
              après vérification par le partenaire, selon les délais du
              programme — pas immédiatement après l&apos;inscription.
            </li>
          </ol>
        </div>
      </section>

      {/* CODE OU LIEN ? */}
      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Code, lien ou les deux ? <em>Les mécanismes utilisés</em>
            </h2>
            <p>
              Les programmes de parrainage n&apos;utilisent pas tous le même
              mécanisme. Quatre cas se rencontrent dans le catalogue
              Parrainio.
            </p>
          </div>
          <div className={styles.mechanisms}>
            <div>
              <h3>Le lien de parrainage</h3>
              <p>
                Un lien unique qui renvoie vers la page d&apos;inscription en
                rattachant automatiquement le filleul à son parrain. C&apos;est
                le mécanisme le plus courant : rien à saisir, mais le compte
                doit bien être créé depuis ce lien.
              </p>
            </div>
            <div>
              <h3>Le code à saisir</h3>
              <p>
                Un identifiant court (lettres, chiffres, parfois un e-mail) à
                entrer dans un champ dédié pendant l&apos;inscription ou avant
                la première commande. Le champ existe ou n&apos;existe pas :
                si le formulaire ne le propose pas, le code ne s&apos;applique
                pas.
              </p>
            </div>
            <div>
              <h3>Le code et le lien</h3>
              <p>
                Certains programmes combinent les deux : le lien ouvre le
                parcours et le code sécurise le rattachement. Dans ce cas, les
                deux étapes sont généralement requises pour que la prime soit
                versée.
              </p>
            </div>
            <div>
              <h3>Ni code ni lien</h3>
              <p>
                Certains partenaires utilisent d&apos;autres mécaniques
                (boutique d&apos;offres, activation dans l&apos;application,
                offre à activer depuis l&apos;espace client). La fiche indique
                alors « Voir l&apos;offre » : le parcours passe par le
                partenaire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CE QUI PEUT INVALIDER UN CODE */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Ce qui peut <em>invalider un code</em>
            </h2>
            <p>
              La plupart des primes perdues le sont pour une raison évitable.
              Les cas fréquents :
            </p>
          </div>
          <ul className={styles.pointsList}>
            <li>
              <strong>Créer le compte avant d&apos;utiliser le code.</strong>{" "}
              Un compte déjà ouvert n&apos;est plus « nouveau » : le
              rattachement à un parrain est refusé.
            </li>
            <li>
              <strong>Saisir le code trop tard.</strong> Saisi après
              l&apos;inscription ou après la première commande, le code est
              rarement pris en compte, même si le champ existe encore.
            </li>
            <li>
              <strong>Utiliser un autre appareil ou un autre parcours.</strong>{" "}
              Cookies bloqués, changement de navigateur entre le lien et
              l&apos;inscription : le rattachement peut se perdre.
            </li>
            <li>
              <strong>Ne pas remplir les conditions.</strong> Premier versement
              manquant, commande en dessous du seuil, offre non concernée : le
              code est validé mais la prime reste conditionnelle.
            </li>
            <li>
              <strong>Se parrainer soi-même.</strong> Comptes multiples,
              membres d&apos;un même foyer ou auto-parrainage : la plupart des
              programmes l&apos;excluent explicitement.
            </li>
            <li>
              <strong>Compter sur une campagne terminée.</strong> Un code lu
              dans un ancien article ne vaut que si le programme est toujours
              actif : les conditions affichées au moment de
              l&apos;inscription prévalent.
            </li>
          </ul>
        </div>
      </section>

      {/* OÙ TROUVER UN CODE */}
      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Où trouver <em>un code de parrainage ?</em>
            </h2>
            <p>
              Les parrains partagent leurs codes auprès de leurs proches, et
              certaines plateformes facilitent la rencontre entre parrains et
              filleuls. Sur Parrainio, {withCode} offres documentent
              actuellement un code dans leur fiche.
            </p>
          </div>
          <ul className={styles.pointsList}>
            <li>
              <strong>Les fiches du catalogue.</strong> Chaque fiche du site
              affiche le code du partenaire avec un bouton de copie
              lorsqu&apos;un code est documenté, à côté des conditions et de la
              date de vérification.{" "}
              <Link href="/offres">Parcourir les offres</Link>.
            </li>
            <li>
              <strong>Le classement des primes.</strong> Pour repérer les
              primes filleul les plus élevées du catalogue avant de chercher le
              code correspondant.{" "}
              <Link href="/classement-primes-parrainage">
                Voir le classement
              </Link>
              .
            </li>
            <li>
              <strong>Les catégories du site.</strong> Banque, cashback,
              énergie, crypto, télécom : chaque univers regroupe les fiches
              concernées, avec leur mécanisme de parrainage.{" "}
              <Link href="/categories/banque-finance">Banque &amp; Finance</Link>,{" "}
              <Link href="/categories/cashback">Cashback</Link>,{" "}
              <Link href="/categories/energie">Énergie</Link>.
            </li>
            <li>
              <strong>Les conditions officielles du partenaire.</strong> En cas
              de doute sur la validité d&apos;un code, les conditions du
              programme publiées par le partenaire font foi.
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
                Un code n&apos;est utile que <em>si l&apos;offre correspond.</em>
              </h2>
              <p>
                Avant de saisir un code, vérifiez que le service est réellement
                utile et que les conditions de la prime sont remplies. Les
                fiches détaillent tout, avec la date de vérification.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <Link href="/offres" className={styles.primaryButton}>
                Voir toutes les offres
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
