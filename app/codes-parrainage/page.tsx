import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/ogImage";
import { SITE_URL } from "@/lib/siteUrl";
import { getManagedOffers } from "@/data/managedOffers";
import { getOfferReferralUrl } from "@/data/offers";
import { esimPromoCodes } from "@/data/esimPromoCodes";
import { getCurrentPeriodLabel } from "@/lib/currentPeriod";
import { classifyReferralMechanism, MECHANISM_LABEL } from "@/lib/referralMechanism";
import CodesCatalog, { type HubItem } from "@/components/CodesCatalog";
import PublicHeaderServer from "@/components/PublicHeaderServer";
import FavoritesDock from "@/components/FavoritesDock";
import styles from "./page.module.css";
import CookieSettingsLink from "@/components/CookieSettingsLink";

// ISR : le hub lit les overrides via le fetch tagué 60 s (lib/adminKv.ts) —
// compatible rendu statique, aucun fetch no-store au rendu. Les écritures
// admin invalident le tag (revalidateTag) → régénération à la requête suivante.
// Le TTL est aligné sur CACHE_REVALIDATE_SECONDS, même contrat que /offres.
// getCurrentPeriodLabel se rafraîchit à chaque revalidation.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Codes promo / parrainage : les trouver et les utiliser | Parrainio",
  description:
    "Retrouvez des codes promo eSIM et des codes ou liens de parrainage. Consultez les mécanismes et vérifiez les conditions auprès de chaque partenaire.",
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
    question: "Où trouver un code promo ou de parrainage ?",
    answer:
      "Cette page rassemble les offres du catalogue Parrainio qui documentent un code ou une invitation, ainsi que des codes promo eSIM issus du fichier Bemove. Les codes et remises eSIM peuvent évoluer et leur disponibilité doit être vérifiée auprès du partenaire.",
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

  const referralItems: HubItem[] = offers
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

  const esimItems: HubItem[] = esimPromoCodes.map((promo) => ({
    slug: promo.slug,
    name: promo.name,
    category: "eSIM",
    mechanism: "CODE_PROMO",
    mechanismLabel: "Code promo",
    code: promo.code,
    reward: `${promo.discountPercent} % de remise annoncés`,
    reverse: null,
    color: promo.color,
    logo: promo.logo,
    logoLetter: promo.name.slice(0, 1),
    showOfferLink: false,
    sourceNote: promo.description,
  }));
  const hubItems = [...referralItems, ...esimItems];

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
            name: "Codes promo / parrainage",
            item: `${SITE_URL}/codes-parrainage`,
          },
        ],
      },
      {
        "@type": "WebPage",
        name: "Codes promo / parrainage : trouvez et utilisez le code de votre offre",
        description:
          "Listing des codes promo eSIM et des offres Parrainio qui documentent un code de parrainage, un numéro d'invitation ou une invitation par lien.",
        url: `${SITE_URL}/codes-parrainage`,
        inLanguage: "fr-FR",
      },
      {
        "@type": "ItemList",
        name: "Codes promo et de parrainage par offre",
        itemListElement: referralItems.map((item, index) => ({
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

      <PublicHeaderServer />
      <FavoritesDock />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">→</span>
            <Link href="/offres">Offres</Link>
            <span aria-hidden="true">→</span>
            <strong>Codes promo / parrainage</strong>
          </nav>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <span className={styles.kicker}>
                <span />
                Guide pratique
              </span>
              <h1>Codes promo / parrainage : trouvez et utilisez le code de votre offre</h1>
              <p className={styles.lead}>
                Un code de parrainage rattache un nouveau client à son parrain : il peut prendre
                la forme d&apos;un code, d&apos;un numéro ou d&apos;un lien. Les conditions affichées
                lors de l&apos;inscription font foi.
              </p>
              <div className={styles.heroActions}>
                <Link href="#codes" className={styles.primaryButton}>
                  Voir les codes promo / parrainage
                </Link>
                <Link href="/pourquoi-parrainio" className={styles.secondaryButton}>
                  Comment fonctionne le parrainage →
                </Link>
              </div>
            </div>
            <div className={styles.heroArtwork}>
              <Image
                src="/images/illustrations/codes-parrainage-hero.webp"
                alt="Deux personnes partagent une invitation, illustrée par un code, un lien et un numéro de téléphone."
                width={1536}
                height={1024}
                priority
                sizes="(max-width: 680px) 100vw, (max-width: 1199px) 50vw, 560px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* LISTING DES CODES */}
      <section className={styles.listingSection} id="codes" aria-label="Codes promo et de parrainage">
        <div className={styles.container}>
          <div className={styles.listingHead}>
            <h2>
              Les codes du catalogue <em>offre par offre</em>
            </h2>
            <p>
              {referralItems.length} offres du catalogue documentent un code ou une invitation,
              vérifiés en {getCurrentPeriodLabel()}. Les cadres eSIM reprennent des codes et remises
              indiqués dans le fichier Bemove ; leur disponibilité actuelle n&apos;est pas garantie.
            </p>
            <Link href="/comparatif-esim" className={styles.comparisonLink}>
              Comparer les forfaits eSIM →
            </Link>
          </div>
          <CodesCatalog items={hubItems} categories={categories} />
        </div>
      </section>

      {/* TRANSPARENCE */}
      <section className={styles.transparency} aria-label="Transparence sur les codes">
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
          <details className={styles.accordion}>
            <summary className={styles.accordionSummary}>
              <h2>
                Comment utiliser <em>un code de parrainage ?</em>
              </h2>
              <span aria-hidden="true" />
            </summary>
            <div className={styles.accordionContent}>
              <div className={styles.sectionHead}>
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
          </details>
        </div>
      </section>

      {/* CODE OU LIEN ? */}
      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <details className={styles.accordion}>
            <summary className={styles.accordionSummary}>
              <h2>
                Code, lien ou les deux ? <em>Les mécanismes utilisés</em>
              </h2>
              <span aria-hidden="true" />
            </summary>
            <div className={styles.accordionContent}>
              <div className={styles.sectionHead}>
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
              <p>
                Avant de vous inscrire, consultez aussi notre guide pour{" "}
                <Link href="/blog/comment-trouver-code-parrainage-fiable">
                  trouver un code de parrainage fiable et vérifier ses conditions
                </Link>
                , notamment la validité de la campagne et le bon moment pour utiliser
                un lien ou un code.
              </p>
            </div>
          </details>
        </div>
      </section>

      {/* CE QUI PEUT INVALIDER UN CODE */}
      <section className={styles.section}>
        <div className={styles.container}>
          <details className={styles.accordion}>
            <summary className={styles.accordionSummary}>
              <h2>
                Ce qui peut <em>invalider un code</em>
              </h2>
              <span aria-hidden="true" />
            </summary>
            <div className={styles.accordionContent}>
              <div className={styles.sectionHead}>
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
          </details>
        </div>
      </section>

      {/* OÙ TROUVER UN CODE */}
      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <details className={styles.accordion}>
            <summary className={styles.accordionSummary}>
              <h2>Où trouver un code de parrainage ?</h2>
              <span aria-hidden="true" />
            </summary>
            <div className={styles.accordionContent}>
              <p>
                Le listing rassemble les offres du catalogue Parrainio qui documentent un code,
                un numéro d&apos;invitation ou une invitation par lien. Le code est également
                visible sur la fiche de chaque offre, à côté des conditions et de la date de
                vérification.
              </p>
            </div>
          </details>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <details className={styles.accordion}>
            <summary className={styles.accordionSummary}>
              <h2>
                Questions fréquentes sur <em>les codes de parrainage</em>
              </h2>
              <span aria-hidden="true" />
            </summary>
            <div className={styles.accordionContent}>
              <div className={styles.hubFaq}>
                {FAQ.map((entry) => (
                  <details key={entry.question}>
                    <summary>{entry.question}</summary>
                    <p>{entry.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </details>
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
                Choisissez une offre et vérifiez ses conditions avant de vous inscrire.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <Link href="/offres" className={styles.primaryButton}>
                Explorer toutes les offres
              </Link>
              <Link
                href="/classement-primes-parrainage"
                className={styles.outlineButton}
              >
                Comparer les primes
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
            </div>
            <div>
              <h3>À propos et aide</h3>
              <Link href="/pourquoi-parrainio">Pourquoi Parrainio ?</Link>
              <Link href="/#faq">FAQ</Link>
              <a href="mailto:parrainage@parrainio.fr">Contact</a>
            </div>
            <div>
              <h3>Informations légales</h3>
              <Link href="/mentions-legales">Mentions légales</Link>
              <Link href="/confidentialite">Politique de confidentialité</Link>
              <Link href="/cgu">Conditions générales</Link>
              <CookieSettingsLink />
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
