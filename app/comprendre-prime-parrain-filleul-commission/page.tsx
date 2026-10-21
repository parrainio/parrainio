import Link from "next/link";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { OG_IMAGE } from "@/lib/ogImage";
import PublicHeaderServer from "@/components/PublicHeaderServer";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Prime parrain, prime filleul, commission : qui paie quoi ?",
  description:
    "Trois montants circulent dans un parrainage : la prime du filleul, celle du parrain et la commission de la plateforme. Voici qui paie quoi, avec des exemples.",
  alternates: { canonical: "https://www.parrainio.fr/comprendre-prime-parrain-filleul-commission" },
  openGraph: {
    url: "/comprendre-prime-parrain-filleul-commission",
    type: "article",
    siteName: "Parrainio",
    locale: "fr_FR",
    images: [OG_IMAGE],
  },
};

const exemples = [
  {
    offre: "BoursoBank",
    primeFilleul: "Jusqu’à 150 €",
    primePartenaire: "Jusqu’à 160 € annoncés pour le parrain",
    reversement: "15 € — 40 € pendant la campagne boostée en cours",
  },
  {
    offre: "Fortuneo",
    primeFilleul: "70 € (Fosfo) à 130 € (Gold)",
    primePartenaire: "70 € à 110 € pour le parrain, selon la carte",
    reversement: "17,50 € (Fosfo) à 27 € (Gold)",
  },
  {
    offre: "Hello bank!",
    primeFilleul: "Jusqu’à 130 € (Hello Prime)",
    primePartenaire: "Prime parrain de l’opération en cours",
    reversement: "5 €",
  },
];

const confusions = [
  {
    titre: "« 50 % de la prime »",
    texte:
      "Le site ne reverse pas 50 % de la prime. Il reverse jusqu’à 50 % de la commission qu’il perçoit du partenaire. Sur une prime de 160 €, 50 % feraient 80 € : le reversement réel peut être inférieur, parce que l’assiette est la commission, pas la prime.",
  },
  {
    titre: "Confondre prime du parrain et prime du filleul",
    texte:
      "Ce sont deux versements distincts, parfois de montants très différents. Le filleul reçoit l’avantage d’ouverture ; le parrain reçoit une récompense de recommandation. Une fiche qui affiche un seul montant ne dit pas lequel.",
  },
  {
    titre: "Lire « jusqu’à » comme un montant garanti",
    texte:
      "« Jusqu’à 160 € » est un plafond de campagne, souvent composé de plusieurs paliers (ouverture, premier versement, opérations). Le montant réel dépend des paliers atteints.",
  },
  {
    titre: "Croire que le reversement arrive avec la prime",
    texte:
      "Le partenaire valide d’abord le parrainage, puis verse la prime ; Parrainio reverse ensuite sa part. D’où un décalage, documenté offre par offre dans l’observatoire.",
  },
];

const calendriers = [
  {
    offre: "BoursoBank",
    observation: "24 à 48 h après le dépôt et la validation",
    simultaneite: "Prime filleul et prime parrain généralement ensemble",
  },
  {
    offre: "Assurancevie.com",
    observation: "Prime filleul vers 30 jours, prime parrain vers 90 jours",
    simultaneite: "Exception : les deux primes ne sont pas simultanées",
  },
  {
    offre: "BNP Paribas",
    observation: "Déclenchement après dix paiements dans les trois mois",
    simultaneite: "Le délai ne court pas à l’ouverture du compte",
  },
];

const faq = [
  {
    question: "La commission de Parrainio est-elle prélevée sur la prime du filleul ?",
    reponse:
      "Non. La commission est versée par le partenaire à Parrainio pour un client apporté ; elle ne réduit pas la prime affichée au filleul. Le reversement à l’utilisateur qui passe par Parrainio est calculé sur cette commission.",
  },
  {
    question: "Pourquoi le reversement n’est-il pas de 50 % du montant affiché ?",
    reponse:
      "Parce que le pourcentage s’applique à la commission perçue, pas à la prime. Une prime de 160 € et un reversement de 15 € ne sont pas incohérents : ils ne portent pas sur la même base.",
  },
  {
    question: "Le parrain peut-il toucher la prime du filleul ?",
    reponse:
      "Non. Chaque partie reçoit son propre avantage, selon les conditions de l’offre. Certaines campagnes ne prévoient d’ailleurs aucune prime pour le parrain.",
  },
  {
    question: "Les deux primes arrivent-elles toujours en même temps ?",
    reponse:
      "Le plus souvent, d’après notre retour terrain, mais ce n’est pas une règle publiée. Assurancevie.com fait exception : la prime du filleul arrive vers 30 jours et celle du parrain vers 90 jours. Chez BNP Paribas, c’est la condition des dix paiements dans les trois mois qui décale le déclenchement.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.reponse },
  })),
};

export default function ComprendreTroisMontantsPage() {
  return (
    <main className={styles.page}>
      <PublicHeaderServer active="how" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}><span />Comprendre le parrainage</p>
          <h1>Prime du parrain, prime du filleul, commission : <em>qui paie quoi</em> ?</h1>
          <p className={styles.heroLead}>
            Trois montants circulent dans un parrainage, et ils ne sortent pas de la même poche.
            Les confondre fait croire à des gains qui n’existent pas — ou à des arnaques qui n’en
            sont pas.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.flowGrid}>
            <article className={styles.flowCard}>
              <p className={styles.flowStep}>1</p>
              <h2>La banque paie deux primes</h2>
              <p>
                Une pour le <strong>filleul</strong> qui ouvre un compte, une pour le{" "}
                <strong>parrain</strong> qui l’a recommandé. Elles sont fixées par le règlement de
                l’offre, pas par la plateforme.
              </p>
            </article>
            <article className={styles.flowCard}>
              <p className={styles.flowStep}>2</p>
              <h2>Le partenaire verse une commission</h2>
              <p>
                Pour un client apporté, la banque verse une commission au site de parrainage. C’est
                un <strong>coût d’acquisition</strong>, distinct des primes versées aux particuliers.
              </p>
            </article>
            <article className={styles.flowCard}>
              <p className={styles.flowStep}>3</p>
              <h2>La plateforme en reverse une part</h2>
              <p>
                Parrainio reverse <strong>jusqu’à 50 % de cette commission</strong>, selon les
                conditions de l’offre. La base de calcul est la commission, pas la prime.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>Exemples réels</p>
            <h2>Trois offres, trois montants <em>qui ne se comparent pas</em></h2>
            <p>
              Montants affichés sur nos fiches au 20 octobre 2026. Ils ne s’additionnent pas : chaque
              colonne répond à une question différente.
            </p>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.srOnly}>
                Exemples de primes et de reversements pour trois offres de parrainage
              </caption>
              <thead>
                <tr>
                  <th scope="col">Offre</th>
                  <th scope="col">Prime filleul</th>
                  <th scope="col">Prime parrain</th>
                  <th scope="col">Reversement Parrainio</th>
                </tr>
              </thead>
              <tbody>
                {exemples.map((e) => (
                  <tr key={e.offre}>
                    <th scope="row">{e.offre}</th>
                    <td data-label="Prime filleul">{e.primeFilleul}</td>
                    <td data-label="Prime parrain">{e.primePartenaire}</td>
                    <td data-label="Reversement Parrainio">{e.reversement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.note}>
            Les primes partenaires sont des plafonds de campagne. Le reversement Parrainio, lui, est
            un montant fixé sur la fiche, calculé sur la commission : BoursoBank fait partie des cinq
            offres temporairement boostées, d’où l’écart entre les deux montants indiqués.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>Le calcul</p>
            <h2>Pourquoi « 50 % » ne fait pas <em>50 % de la prime</em></h2>
          </div>
          <div className={styles.mathCard}>
            <p>
              Prenons une offre à <strong>160 €</strong> de prime annoncée et un reversement de{" "}
              <strong>15 €</strong>.
            </p>
            <ul>
              <li>50 % de 160 € feraient <strong>80 €</strong> : ce n’est pas ce qui est versé.</li>
              <li>
                15 € correspond à une part de la <strong>commission</strong> versée par le partenaire
                à Parrainio — une assiette plus petite que la prime, et non publiée offre par offre.
              </li>
              <li>
                Les deux montants coexistent donc sans se contredire : l’un est un plafond
                commercial, l’autre un pourcentage d’une rémunération.
              </li>
            </ul>
            <p className={styles.mathNote}>
              C’est exactement le genre de raccourci qu’un site de parrainage peut exploiter. Le
              nôtre affiche les deux montants séparément sur chaque fiche, et les CGU précisent
              l’assiette.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>Les pièges</p>
            <h2>Quatre confusions qui coûtent <em>de l’argent</em></h2>
          </div>
          <div className={styles.confusionGrid}>
            {confusions.map((c) => (
              <article key={c.titre} className={styles.confusionCard}>
                <h3>{c.titre}</h3>
                <p>{c.texte}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>Quand arrive l’argent</p>
            <h2>Trois montants, mais <em>pas toujours un seul calendrier</em></h2>
            <p>
              Savoir qui paie quoi ne dit pas quand. Le responsable de Parrainio suit ses versements
              depuis environ sept mois : dans la majorité des offres, la prime du filleul et celle du
              parrain arrivent ensemble, puis le reversement part sous 24 à 72 h. Deux cas sortent de
              ce schéma.
            </p>
          </div>
          <div className={styles.confusionGrid}>
            {calendriers.map((c) => (
              <article key={c.offre} className={styles.confusionCard}>
                <h3>{c.offre}</h3>
                <p>{c.observation}</p>
                <p>{c.simultaneite}</p>
              </article>
            ))}
          </div>
          <p className={styles.note}>
            Ces observations ne sont pas des conditions officielles. Elles sont affichées à côté du
            délai publié sur chaque fiche et dans{" "}
            <Link href="/observatoire-conditions-prime#retours-experience">l’observatoire des
            conditions de versement</Link>.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>Questions fréquentes</p>
            <h2>Ce qu’on nous demande <em>le plus souvent</em></h2>
          </div>
          <div className={styles.faqList}>
            {faq.map((f) => (
              <details key={f.question} className={styles.faqItem}>
                <summary>{f.question}</summary>
                <p>{f.reponse}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div>
              <h2>Passer des montants aux <em>conditions réelles</em></h2>
              <p>
                L’<Link href="/observatoire-conditions-prime">observatoire des conditions de versement</Link>{" "}
                indique, offre par offre, quand la prime arrive et ce qui peut la faire perdre ;{" "}
                l’<Link href="/echeancier-prime-parrainage">échéancier</Link> applique ce délai à une date de
                souscription. Le{" "}
                <Link href="/classement-primes-parrainage">classement des primes</Link> donne les
                montants, et l’<Link href="/chiffres-parrainio-2026">étude 2026</Link> les replace dans
                l’ensemble du catalogue.
              </p>
            </div>
            <Link href="/offres" className={styles.ctaButton}>Voir les offres →</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
