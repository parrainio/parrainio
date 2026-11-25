import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import PublicHeaderServer from "@/components/PublicHeaderServer";
import SiteFooter from "@/components/SiteFooter";
import { PARCOURS_LIST } from "@/data/parcoursGagner1000";
import { SITE_URL } from "@/lib/siteUrl";
import styles from "@/components/ParcoursGagner1000Pages.module.css";

const TITLE = "Gagner 1 000 € avec le parrainage : deux parcours | Parrainio";
const DESCRIPTION =
  "Comment gagner 1 000 euros avec le parrainage : deux parcours détaillés pour cumuler les primes de bienvenue des banques en ligne, courtiers et applications.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/gagner-1000-euros` },
  openGraph: {
    title: "Gagner 1 000 euros avec le parrainage : deux parcours détaillés",
    description: DESCRIPTION,
    url: "/gagner-1000-euros",
    type: "website",
    siteName: "Parrainio",
    locale: "fr_FR",
    images: [PARCOURS_LIST[0].image],
  },
};

const FAQ = [
  {
    question: "Comment gagner 1 000 euros avec le parrainage ?",
    answer:
      "Le principe consiste à cumuler les primes de bienvenue de plusieurs offres de parrainage : banques en ligne, courtiers, applications de cashback ou de récompenses. Chaque prime est versée séparément par son partenaire. En conservant les gains plutôt qu’en les dépensant, vous financez les dépôts demandés par les offres suivantes et faites progresser le cumul jusqu’à 1 000 € et plus.",
  },
  {
    question: "Peut-on gagner 1 000 euros rapidement ?",
    answer:
      "Les deux parcours présentés dépassent 1 000 € au terme de 9 mois environ, avec un premier palier autour de 400 € après 7 ou 8 étapes. Certaines primes arrivent en quelques jours, d’autres après plusieurs semaines ou plusieurs mois. Il n’existe pas de versement instantané : le rythme dépend de la validation de chaque dossier et des délais de chaque partenaire.",
  },
  {
    question: "Faut-il investir beaucoup d’argent pour commencer ?",
    answer:
      "Non. Les deux parcours commencent par une offre sans dépôt, puis alternent avec des étapes à faible dépôt. Les sommes demandées ensuite sont des dépôts sur des comptes ou des applications, pas des frais définitifs : leur retrait dépend toutefois des conditions de chaque partenaire. Ne mobilisez que de l’argent dont vous n’avez pas besoin à court terme.",
  },
  {
    question: "Peut-on cumuler plusieurs offres de parrainage ?",
    answer:
      "Oui, à condition de souscrire chaque offre séparément et de respecter ses conditions d’éligibilité. Les programmes sont indépendants : une prime validée chez une banque n’empêche pas de profiter d’une autre offre. Vérifiez simplement que vous n’êtes pas déjà client du partenaire et que vous pouvez réaliser les opérations demandées.",
  },
  {
    question: "Quelles banques offrent des primes de bienvenue ?",
    answer:
      "De nombreuses banques en ligne proposent un bonus d’inscription ou une prime de parrainage : Hello bank!, BoursoBank, Fortuneo, Monabanq, N26, BNP Paribas ou encore L by LCL. Les montants et les conditions évoluent souvent : consultez notre catégorie banque et finance et l’observatoire des conditions de prime avant de vous engager.",
  },
  {
    question: "Les gains présentés sont-ils garantis ?",
    answer:
      "Non. Les totaux de 1 017,50 € et 1 052,01 € proviennent de scénarios illustrés : ils additionnent des primes annoncées à une date donnée. Chaque montant reste soumis à l’éligibilité, aux dépôts demandés, aux opérations à réaliser et à la validation du partenaire. Les fiches Parrainio liées dans chaque parcours donnent les conditions publiées.",
  },
  {
    question: "Peut-on gagner de l’argent sur Internet avec des applications ?",
    answer:
      "Oui, mais les montants sont généralement plus modestes que ceux des offres bancaires. Les applications de cashback, de récompenses ou de micro-tâches permettent d’ajouter quelques euros à un parcours de parrainage. Elles sont plus utiles pour compléter un cumul que pour atteindre 1 000 € à elles seules.",
  },
  {
    question: "Que faire si une offre du parcours n’est plus disponible ?",
    answer:
      "Remplacez-la par une offre équivalente du catalogue Parrainio. L’ordre des étapes est indicatif : l’important est de conserver les primes reçues et de les réutiliser pour débloquer d’autres offres. Comparez les montants, les dépôts et les délais avant de choisir la remplaçante.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      name: "Gagner 1 000 euros avec le parrainage : deux parcours détaillés",
      url: `${SITE_URL}/gagner-1000-euros`,
      description: DESCRIPTION,
      hasPart: PARCOURS_LIST.map((parcours) => ({
        "@type": "WebPage",
        name: parcours.title,
        url: `${SITE_URL}${parcours.href}`,
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Gagner 1 000 €", item: `${SITE_URL}/gagner-1000-euros` },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

export default function Gagner1000Page() {
  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PublicHeaderServer active="gains" />

      <section className={styles.hero}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link><span aria-hidden="true">→</span><strong>Gagner 1 000 €</strong>
          </nav>
          <p className={styles.eyebrow}>Deux parcours détaillés</p>
          <h1>Gagner 1 000 euros avec le parrainage : deux parcours détaillés</h1>
          <p className={styles.lead}>
            Gagner de l’argent grâce au parrainage ne repose pas sur un seul bonus, mais sur un enchaînement
            d’offres rémunérées : primes de bienvenue des banques en ligne, bonus d’inscription des courtiers et
            récompenses des applications. Les deux parcours ci-dessous expliquent comment cumuler ces primes,
            étape par étape, en partant de 0 € et sans investissement important.
          </p>
          <p className={styles.lead}>
            Chaque parcours détaille les offres, l’ordre des inscriptions, les dépôts demandés, les délais de
            versement et les gains cumulés. Les montants proviennent de scénarios illustrés : ils ne sont pas
            garantis et doivent être vérifiés sur la fiche de chaque offre avant toute souscription.
          </p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="choisir-parcours">
        <div className={styles.container}>
          <h2 id="choisir-parcours" className={styles.sectionHeading}>Deux parcours pour cumuler les primes de bienvenue</h2>
          <p className={styles.sectionLead}>
            Le parcours A privilégie les banques en ligne et les applications grand public. Le parcours B ajoute
            des étapes chez un courtier et une banque traditionnelle. Les deux visent le même objectif : dépasser
            1 000 € de primes cumulées.
          </p>
          <div className={styles.cards}>
            {PARCOURS_LIST.map((parcours) => (
              <Link className={styles.pathCard} href={parcours.href} key={parcours.key} prefetch={false}>
                <span className={styles.cardVisual}>
                  <Image
                    src={parcours.image}
                    alt={parcours.imageAlt}
                    fill
                    sizes="(max-width: 620px) 100vw, (max-width: 850px) 50vw, 560px"
                    unoptimized
                  />
                </span>
                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <span className={styles.chip}>Jusqu’à {parcours.total}</span>
                    <span className={styles.chip}>{parcours.totalDelay}</span>
                  </div>
                  <h2>{parcours.title}</h2>
                  <p>{parcours.summary}</p>
                  <span className={styles.cardButton}>Découvrir le parcours {parcours.key.toUpperCase()} <span aria-hidden="true">→</span></span>
                </div>
              </Link>
            ))}
          </div>
          <p className={styles.simulationNote}>
            <strong>Montants indicatifs :</strong> les totaux présentés sont des estimations. Une marge de variation
            d’environ 3 à 4 % peut exister sur certaines opérations, selon les frais des applications, les frais de
            transaction, le prix d’achat des actions ou actifs, les frais de retrait et les conditions commerciales
            des partenaires.
          </p>
          <p className={styles.indexNote}>
            Les visuels reprennent les montants et délais de leur scénario. Pour le parcours B, le visuel affiche 440,01 € après huit étapes ; après déduction des 7,99 € de frais Revolut qu’il mentionne, le cumul net est de 432,01 €. Les primes et conditions des annonces peuvent aussi évoluer : les fiches Parrainio liées dans chaque parcours donnent les informations publiées pour chaque offre.
          </p>
        </div>
      </section>

      <section className={styles.contentSection} aria-labelledby="comment-gagner-1000">
        <div className={styles.container}>
          <h2 id="comment-gagner-1000" className={styles.sectionHeading}>Comment gagner 1 000 euros avec le parrainage ?</h2>
          <div className={styles.contentGrid}>
            <article className={styles.contentCard}>
              <h3>Commencer par les offres sans dépôt</h3>
              <p>
                Les deux parcours débutent par une offre dont le dépôt indiqué est de 0 €. Cette première prime
                constitue le capital de départ : elle n’est pas dépensée, elle sert à financer les dépôts des
                étapes suivantes. Cette mécanique permet de gagner de l’argent sans investissement important au
                démarrage.
              </p>
            </article>
            <article className={styles.contentCard}>
              <h3>Cumuler les primes dans le bon ordre</h3>
              <p>
                Les étapes à faible dépôt viennent avant celles qui demandent plusieurs centaines d’euros. En
                respectant cet ordre, chaque prime reçue allège l’effort demandé pour l’offre suivante. C’est ce
                qui distingue un cumul organisé d’une simple collection de codes de parrainage utilisés au hasard.
              </p>
            </article>
            <article className={styles.contentCard}>
              <h3>Réutiliser ses gains plutôt que d’investir</h3>
              <p>
                Le parcours ne demande pas de placer de l’argent en bourse : les sommes mobilisées sont des
                dépôts sur des comptes bancaires ou des applications, puis des primes. Vous restez libre de
                retirer vos dépôts selon les conditions de chaque partenaire, et vous ne réengagez que les primes
                déjà reçues.
              </p>
            </article>
            <article className={styles.contentCard}>
              <h3>Suivre les montants réellement versés</h3>
              <p>
                Un cumul de scénario n’est pas un solde disponible. Entre l’inscription et le versement, il y a
                une validation de dossier, parfois des opérations à réaliser et un délai de traitement. Notez
                chaque prime attendue et sa date pour savoir où vous en êtes réellement.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.contentSection} aria-labelledby="offres-parrainage">
        <div className={styles.container}>
          <h2 id="offres-parrainage" className={styles.sectionHeading}>Quelles offres permettent de gagner beaucoup d’argent avec le parrainage ?</h2>
          <p className={styles.sectionLead}>
            Les offres de parrainage rémunérées se répartissent en trois familles. Les comparer permet de choisir
            les meilleurs sites et applications pour votre situation, plutôt que de suivre une liste figée.
          </p>
          <div className={styles.contentGrid}>
            <article className={styles.contentCard}>
              <h3>Les banques qui offrent des primes de bienvenue</h3>
              <p>
                Le parrainage bancaire reste la source de primes la plus élevée : plusieurs dizaines ou centaines
                d’euros par ouverture de compte, parfois complétées par un bonus d’inscription lié à un dépôt ou à
                une mobilité bancaire. Retrouvez ces offres dans la catégorie{" "}
                <Link href="/categories/banque-finance">banque et finance</Link> et dans le{" "}
                <Link href="/comparatif/parrainage-bancaire">comparatif du parrainage bancaire</Link>.
              </p>
            </article>
            <article className={styles.contentCard}>
              <h3>Les courtiers et l’épargne</h3>
              <p>
                Les courtiers en ligne et les plateformes d’épargne proposent des primes de parrainage souvent
                conditionnées à un premier dépôt. Ces offres complètent bien un parcours bancaire, à condition de
                lire les conditions de retrait et d’accepter le risque propre aux placements :{" "}
                <Link href="/categories/investissement-crypto">voir les offres d’investissement</Link>.
              </p>
            </article>
            <article className={styles.contentCard}>
              <h3>Les applications qui rapportent de l’argent</h3>
              <p>
                Cashback, récompenses, micro-tâches : ces applications versent des montants plus modestes, mais
                elles sont faciles à activer et peuvent compléter un cumul. Parcourez les{" "}
                <Link href="/categories/cashback">offres de cashback</Link> et les{" "}
                <Link href="/categories/recompenses-applications">applications de récompenses</Link> pour trouver
                celles qui correspondent à vos usages.
              </p>
            </article>
            <article className={styles.contentCard}>
              <h3>Comparer avant de choisir</h3>
              <p>
                Le <Link href="/classement-primes-parrainage">classement des primes</Link> donne un ordre de
                grandeur, la page <Link href="/codes-parrainage">codes et liens de parrainage</Link> explique
                comment utiliser une invitation, et l’
                <Link href="/observatoire-conditions-prime">observatoire des conditions de prime</Link> détaille
                les délais et les clauses de reprise. Ces ressources évitent de choisir une offre sur le seul
                montant annoncé.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.contentSection} aria-labelledby="temps-et-precautions">
        <div className={styles.container}>
          <h2 id="temps-et-precautions" className={styles.sectionHeading}>Combien de temps faut-il, et quelles précautions prendre ?</h2>
          <p className={styles.sectionLead}>
            Les deux parcours s’étalent sur environ neuf mois dans leurs scénarios. Ce délai s’explique par les
            périodes de validation et de conservation propres à chaque partenaire. Avant de commencer, vérifiez les
            points suivants.
          </p>
          <ul className={styles.disclaimerList}>
            <li>Lisez la fiche Parrainio de chaque offre : montant, dépôt, opérations demandées, délai et clause de reprise.</li>
            <li>Vérifiez votre éligibilité : être nouveau client, majeur, résident fiscal français selon les cas.</li>
            <li>Ne mobilisez que de l’argent dont vous n’avez pas besoin pendant la durée de conservation exigée.</li>
            <li>Conservez les justificatifs d’inscription et de dépôt, utiles en cas de relance du partenaire.</li>
            <li>Considérez le total comme un objectif de scénario, jamais comme une promesse de gain garanti.</li>
          </ul>
          <p className={styles.contentNote}>
            Pour estimer la date d’arrivée d’une prime selon son délai annoncé, utilisez l’
            <Link href="/echeancier-prime-parrainage">échéancier des primes de parrainage</Link>. Pour comprendre
            la différence entre prime partenaire, commission du parrain et reversement Parrainio, consultez la
            page <Link href="/pourquoi-parrainio">pourquoi Parrainio</Link>.
          </p>
        </div>
      </section>

      <section className={styles.faqSection} aria-labelledby="faq-1000">
        <div className={styles.container}>
          <h2 id="faq-1000" className={styles.sectionHeading}>Questions fréquentes pour gagner 1 000 euros</h2>
          <div className={styles.faqList}>
            {FAQ.map((item) => (
              <details className={styles.faqItem} key={item.question}>
                <summary><h3>{item.question}</h3></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.conclusion}>
        <div className={`${styles.container} ${styles.conclusionCard}`}>
          <div>
            <h2>Prêt à choisir votre parcours ?</h2>
            <p>Commencez par celui qui correspond aux offres que vous n’avez pas encore utilisées, puis adaptez les étapes à votre situation.</p>
            <p>Les deux pages détaillent chaque offre, les dépôts et les délais pour vous permettre d’avancer sans mauvaise surprise.</p>
          </div>
          <div className={styles.conclusionActions}>
            <Link className={styles.primaryButton} href="/parcours-a">Voir le parcours A</Link>
            <Link className={styles.secondaryButton} href="/parcours-b">Voir le parcours B</Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
