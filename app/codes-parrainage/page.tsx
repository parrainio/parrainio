import Link from "next/link";
import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/ogImage";
import { SITE_URL } from "@/lib/siteUrl";
import { getManagedOffers } from "@/data/managedOffers";
import { getOfferReferralUrl } from "@/data/offers";
import { getCurrentPeriodLabel } from "@/lib/currentPeriod";
import { classifyReferralMechanism, MECHANISM_LABEL } from "@/lib/referralMechanism";
import CodesCatalog, { type HubItem } from "@/components/CodesCatalog";
import PublicHeader from "@/components/PublicHeader";
import FavoritesDock from "@/components/FavoritesDock";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

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

const FAQ = [
  {
    question: "Où trouver un code de parrainage ?",
    answer:
      "Sur cette page : le listing rassemble les offres du catalogue Parrainio qui documentent un code, un numéro d'invitation ou une invitation par lien. Le code est également visible sur la fiche de chaque offre, à côté des conditions et de la date de vérification.",
  },
  {
    question: "Quelle est la différence entre un code et un lien d'invitation ?",
    answer:
      "Le lien d'invitation rattache automatiquement le filleul au parrain lorsqu'il est utilisé pour créer le compte. Le code doit être saisi manuellement dans un champ dédié, généralement pendant l'inscription ou avant la première commande. Certains programmes combinent les deux.",
  },
  {
    question: "Peut-on utiliser le code d'un parrain ?",
    answer:
      "Oui. Plusieurs offres du catalogue affichent le code d'un parrain qui le partage publiquement. Il ne s'agit pas d'un code « officiel » de la marque : il rattache simplement le nouveau client à ce parrain, et l'avantage reste celui du programme actif.",
  },
  {
    question: "Pourquoi certaines offres n'ont-elles pas de code ?",
    answer:
      "Parce que leur mécanisme repose sur un lien d'invitation, une activation dans l'application ou une campagne ciblée depuis l'espace client. Dans ce cas il n'existe aucun code à saisir : la fiche de l'offre décrit le parcours réel à suivre.",
  },
  {
    question: "Que faire si un code ne fonctionne plus ?",
    answer:
      "Vérifier d'abord les conditions de la fiche et la période de la campagne. Les programmes évoluent : si le champ de saisie n'existe plus ou que l'offre est terminée, le code ne peut plus s'appliquer. Les conditions publiées par le partenaire font foi.",
  },
  {
    question: "Comment savoir quelle offre donne réellement une réduction ?",
    answer:
      "Chaque carte du listing affiche l'avantage documenté et le mécanisme utilisé. Pour le détail — seuils, exclusions, délai de versement, reversement Parrainio — la fiche de l'offre reprend les conditions vérifiées.",
  },
];

export default async function CodesParrainagePage() {
  const offers = await getManagedOffers();

  const hubItems: HubItem[] = offers
    .map((offer): HubItem | null => {
      const mechanism = classifyReferralMechanism(offer.slug, offer.referralCode);
      if (!mechanism) return null;
      const reverse =
        offer.parrainioReward && offer.parrainioReward !== "0 €" ? offer.parrainioReward : null;
      return {
        slug: offer.slug,
        name: offer.name,
        category: offer.categoryGroup,
        mechanism,
        mechanismLabel: MECHANISM_LABEL[mechanism],
        code: mechanism === "LIEN_EMAIL" ? undefined : offer.referralCode?.trim(),
        invitationHref:
          mechanism === "LIEN_EMAIL" ? getOfferReferralUrl(offer) ?? undefined : undefined,
        reward: offer.partnerReward,
        reverse,
        color: offer.color,
        logo: offer.logo,
        logoLetter: offer.logoLetter,
        } satisfies HubItem;
    })
    .filter((item): item is HubItem => item !== null);

  const categories = Array.from(new Set(hubItems.map((item) => item.category))).sort((a, b) =>
    a.localeCompare(b, "fr"),
  );

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
        name: "Codes de parrainage : trouvez et utilisez le code de votre offre",
        description:
          "Listing des offres Parrainio qui documentent un code de parrainage, un numéro d'invitation ou une invitation par lien, avec le mécanisme de chacune.",
        url: `${SITE_URL}/codes-parrainage`,
        inLanguage: "fr-FR",
      },
      {
        "@type": "ItemList",
        name: "Codes de parrainage par offre",
        itemListElement: hubItems.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          url: `${SITE_URL}/offres/${item.slug}`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((entry) => ({
          "@type": "Question",
          name: entry.question,
          acceptedAnswer: { "@type": "Answer", text: entry.answer },
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

      <PublicHeader />
      <FavoritesDock />

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
          <h1>Codes de parrainage : trouvez et utilisez le code de votre offre</h1>
          <p className={styles.lead}>
            Un code de parrainage est l&apos;identifiant d&apos;un parrain que certaines
            entreprises demandent au moment de l&apos;inscription. Saisi au bon endroit, il
            rattache le nouveau client à son parrain et déclenche la prime prévue par le
            programme — pour le filleul, pour le parrain, ou pour les deux. Le listing
            ci-dessous rassemble les offres du catalogue qui documentent un code, un numéro
            d&apos;invitation ou une invitation par lien ; les conditions peuvent évoluer,
            celles affichées au moment de l&apos;inscription font foi.
          </p>
          <div className={styles.heroActions}>
            <Link href="#codes" className={styles.primaryButton}>
              Voir les codes
            </Link>
            <Link href="/pourquoi-parrainio" className={styles.secondaryButton}>
              Comment fonctionne le parrainage →
            </Link>
          </div>
        </div>
      </section>

      {/* LISTING DES CODES */}
      <section className={styles.listingSection} id="codes" aria-label="Codes de parrainage par offre">
        <div className={styles.container}>
          <div className={styles.listingHead}>
            <h2>
              Les codes du catalogue <em>offre par offre</em>
            </h2>
            <p>
              {hubItems.length} offres documentent actuellement un code ou une invitation,
              avec leur mécanisme réel : code public, code d&apos;un parrain, numéro
              d&apos;invitation ou invitation par lien. Vérifié en {getCurrentPeriodLabel()}.
            </p>
          </div>
          <CodesCatalog items={hubItems} categories={categories} />
        </div>
      </section>

      {/* TRANSPARENCE */}
      <section className={styles.transparency}>
        <div className={styles.container}>
          <ul>
            <li>
              Cette page explique le mécanisme des codes de parrainage de manière générale :
              chaque programme fixe ses propres règles et seul son Conditions générales fait
              foi.
            </li>
            <li>
              Sur Parrainio, chaque fiche affiche le code du partenaire lorsqu&apos;un code est
              documenté — et le lien de parrainage lorsqu&apos;il existe.
            </li>
            <li>
              Aucun code « magique » ni de réduction universelle : un code ne crée un avantage
              que si le programme est actif et les conditions remplies.
            </li>
            <li>
              Les campagnes évoluent : vérifiez toujours les conditions affichées au moment de
              l&apos;inscription.
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
              Le parcours est simple, mais l&apos;ordre compte : la plupart des codes refusés le
              sont parce qu&apos;ils ont été saisis trop tard ou au mauvais endroit.
            </p>
          </div>
          <ol className={styles.steps}>
            <li>
              <strong>Trouver le code de l&apos;offre concernée.</strong> Sur Parrainio, ouvrez
              la fiche du partenaire : le code y est affiché avec un bouton de copie
              lorsqu&apos;un code est documenté.
            </li>
            <li>
              <strong>Suivre le parcours prévu par le programme.</strong>{" "}
              Certains partenaires demandent de créer le compte via un lien de parrainage,
              d&apos;autres de saisir un code pendant l&apos;inscription, d&apos;autres encore
              les deux. Le parcours exact est décrit sur la fiche et dans les conditions du
              programme.
            </li>
            <li>
              <strong>Saisir le code au bon moment.</strong> Un code doit généralement être
              entré pendant la création du compte ou avant la première validation : rattraper
              un oubli après coup est rarement possible.
            </li>
            <li>
              <strong>Vérifier son éligibilité.</strong> Nouveau client, âge, résidence,
              première commande ou premier paiement : les conditions d&apos;éligibilité
              déterminent si la prime s&apos;applique.
            </li>
            <li>
              <strong>Attendre la validation.</strong> La prime est attribuée après
              vérification par le partenaire, selon les délais du programme — pas immédiatement
              après l&apos;inscription.
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
              Les programmes de parrainage n&apos;utilisent pas tous le même mécanisme. Quatre
              cas se rencontrent dans le catalogue Parrainio.
            </p>
          </div>
          <div className={styles.mechanisms}>
            <div>
              <h3>Le lien de parrainage</h3>
              <p>
                Un lien unique qui renvoie vers la page d&apos;inscription en rattachant
                automatiquement le filleul à son parrain. C&apos;est le mécanisme le plus
                courant : rien à saisir, mais le compte doit bien être créé depuis ce lien.
              </p>
            </div>
            <div>
              <h3>Le code à saisir</h3>
              <p>
                Un identifiant court (lettres, chiffres, parfois un e-mail) à entrer dans un
                champ dédié pendant l&apos;inscription ou avant la première commande. Le champ
                existe ou n&apos;existe pas : si le formulaire ne le propose pas, le code ne
                s&apos;applique pas.
              </p>
            </div>
            <div>
              <h3>Le code et le lien</h3>
              <p>
                Certains programmes combinent les deux : le lien ouvre le parcours et le code
                sécurise le rattachement. Dans ce cas, les deux étapes sont généralement
                requises pour que la prime soit versée.
              </p>
            </div>
            <div>
              <h3>Ni code ni lien</h3>
              <p>
                Certains partenaires utilisent d&apos;autres mécaniques (boutique
                d&apos;offres, activation dans l&apos;application, offre à activer depuis
                l&apos;espace client). La fiche indique alors « Voir l&apos;offre » : le
                parcours passe par le partenaire.
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
              La plupart des primes perdues le sont pour une raison évitable. Les cas
              fréquents :
            </p>
          </div>
          <ul className={styles.pointsList}>
            <li>
              <strong>Créer le compte avant d&apos;utiliser le code.</strong> Un compte déjà
              ouvert n&apos;est plus « nouveau » : le rattachement à un parrain est refusé.
            </li>
            <li>
              <strong>Saisir le code trop tard.</strong> Saisi après l&apos;inscription ou
              après la première commande, le code est rarement pris en compte, même si le champ
              existe encore.
            </li>
            <li>
              <strong>Utiliser un autre appareil ou un autre parcours.</strong> Cookies
              bloqués, changement de navigateur entre le lien et l&apos;inscription : le
              rattachement peut se perdre.
            </li>
            <li>
              <strong>Ne pas remplir les conditions.</strong> Premier versement manquant,
              commande en dessous du seuil, offre non concernée : le code est validé mais la
              prime reste conditionnelle.
            </li>
            <li>
              <strong>Se parrainer soi-même.</strong> Comptes multiples, membres d&apos;un même
              foyer ou auto-parrainage : la plupart des programmes l&apos;excluent
              explicitement.
            </li>
            <li>
              <strong>Compter sur une campagne terminée.</strong> Un code lu dans un ancien
              article ne vaut que si le programme est toujours actif : les conditions affichées
              au moment de l&apos;inscription prévalent.
            </li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Questions fréquentes sur <em>les codes de parrainage</em>
            </h2>
          </div>
          <div className={styles.hubFaq}>
            {FAQ.map((entry) => (
              <details key={entry.question}>
                <summary>{entry.question}</summary>
                <p>{entry.answer}</p>
              </details>
            ))}
          </div>
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
                Avant de saisir un code, vérifiez que le service est réellement utile et que
                les conditions de la prime sont remplies. Les fiches détaillent tout, avec la
                date de vérification.
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
              <Link href="/pourquoi-parrainio" className={styles.secondaryButton}>
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
                Le nouveau réflexe pour découvrir et profiter des offres de parrainage.
              </p>
            </div>
            <div>
              <h3>Découvrir</h3>
              <Link href="/offres">Les offres</Link>
              <Link href="/pourquoi-parrainio">Comment ça marche</Link>
            </div>
            <div>
              <h3>Parrainio</h3>
              <Link href="/pourquoi-parrainio">Nos avantages</Link>
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
