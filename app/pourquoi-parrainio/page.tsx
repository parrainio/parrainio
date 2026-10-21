import Link from "next/link";
import type { Metadata } from "next";
import type { SVGProps } from "react";
import styles from "./page.module.css";
import { OG_IMAGE } from "@/lib/ogImage";
import PublicHeaderServer from "@/components/PublicHeaderServer";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Pourquoi Parrainio ? Fonctionnement et transparence",
  description:
    "Comment fonctionne Parrainio : les étapes d'un parrainage, les offres et codes, jusqu'à 50 % de commission reversée et une information claire.",
  alternates: { canonical: "https://www.parrainio.fr/pourquoi-parrainio" },
  openGraph: { url: "/pourquoi-parrainio", type: "website", siteName: "Parrainio", locale: "fr_FR", images: [OG_IMAGE] },
};

type IconName = "arrow" | "check" | "search" | "link" | "gift" | "coin" | "eye" | "shield" | "spark";

function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const common: SVGProps<SVGSVGElement> = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  if (name === "arrow") return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
  if (name === "check") return <svg {...common}><path d="m5 12 4.2 4.2L19 6.5" /></svg>;
  if (name === "search") return <svg {...common}><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>;
  if (name === "link") return <svg {...common}><path d="M10.5 13.5a4.2 4.2 0 0 0 6 0l2-2a4.2 4.2 0 0 0-6-6l-1.15 1.15" /><path d="M13.5 10.5a4.2 4.2 0 0 0-6 0l-2 2a4.2 4.2 0 0 0 6 6l1.15-1.15" /></svg>;
  if (name === "gift") return <svg {...common}><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M12 8v13M3 12h18M12 8H8.4a2.4 2.4 0 1 1 2.4-2.4V8Zm0 0h3.6A2.4 2.4 0 1 0 13.2 5.6V8Z" /></svg>;
  if (name === "coin") return <svg {...common}><circle cx="12" cy="12" r="8" /><path d="M12 8v8m-2.5-6.2c.4-1 1.3-1.5 2.5-1.5 1.4 0 2.4.7 2.4 1.8 0 2.8-5 1.4-5 4 0 1.1 1 1.8 2.6 1.8 1.2 0 2.2-.5 2.7-1.3" /></svg>;
  if (name === "eye") return <svg {...common}><path d="M2.5 12s3.3-6 9.5-6 9.5 6 9.5 6-3.3 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.4" /></svg>;
  if (name === "shield") return <svg {...common}><path d="M12 3.5 19 6v5.4c0 4.3-2.8 7.8-7 9.1-4.2-1.3-7-4.8-7-9.1V6l7-2.5Z" /><path d="m8.5 12 2.3 2.3 4.7-4.8" /></svg>;
  return <svg {...common}><path d="m12 3 .95 5.05L18 9l-5.05.95L12 15l-.95-5.05L6 9l5.05-.95L12 3Z" /><path d="m19 15 .5 2.5L22 18l-2.5.5L19 21l-.5-2.5L16 18l2.5-.5L19 15Z" /></svg>;
}

const steps = [
  { number: "01", title: "Choisissez une offre", text: "Lisez sa fiche avant de commencer : elle précise l’éligibilité, le lien ou code à utiliser et les actions demandées.", icon: "search" as const },
  { number: "02", title: "Utilisez le lien ou le code de parrainage", text: "Suivez le lien ou saisissez le code au moment indiqué sur la fiche, souvent avant l’ouverture du compte ou la commande.", icon: "link" as const },
  { number: "03", title: "Effectuez les actions demandées", text: "Réalisez les étapes et opérations prévues dans le délai de l’offre. Le partenaire vérifie ensuite que les conditions sont remplies.", icon: "gift" as const },
];

const infoBlocks = [
  {
    icon: "gift" as const,
    title: "Avantage filleul",
    text: "Ce que vous recevez en vous inscrivant via le lien ou le code : la prime du partenaire, telle qu’affichée sur la fiche.",
  },
  {
    icon: "spark" as const,
    title: "Parrain",
    text: "Ce que reçoit la personne qui parraine, lorsque l’offre affiche cette information. Elle n’est indiquée que lorsqu’elle est confirmée.",
  },
  {
    icon: "coin" as const,
    title: "Parrainio reverse",
    text: "La part de la commission Parrainio qui peut s’ajouter à votre prime, lorsque l’offre le prévoit. Affichée sur la fiche quand elle existe.",
  },
  {
    icon: "shield" as const,
    title: "Conditions",
    text: "Dépôt, premier achat, montant minimum, durée : les conditions du parrainage sont listées avant l’inscription, avec les seuils chiffrés lorsqu’ils sont connus.",
  },
];

const trustItems = [
  { icon: "shield" as const, text: "Des conditions détaillées sur chaque fiche — dépôt, premier achat, minimums, durée." },
  { icon: "eye" as const, text: "Avantage filleul et reversement Parrainio affichés séparément, sans confusion." },
  { icon: "spark" as const, text: "Des offres surveillées et actualisées — la date de vérification est indiquée.", href: "/chiffres-parrainio-2026", linkLabel: "Découvrez les chiffres Parrainio 2026" },
  { icon: "check" as const, text: "Des avis de la communauté, publiés après modération.", href: "/avis-clients", linkLabel: "Lire les avis clients" },
  { icon: "search" as const, text: "Un classement des primes comparé offre par offre, trié par montant.", href: "/classement-primes-parrainage", linkLabel: "Voir le classement" },
  { icon: "coin" as const, text: "Gratuit et sans inscription pour consulter les offres." },
  { icon: "check" as const, text: "Les conditions du partenaire restent déterminantes : chaque offre suit ses propres règles." },
];

export default function PourquoiParrainioPage() {
  return (
    <main className={styles.page}>
      <PublicHeaderServer active="how" />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}><span />Offres &amp; codes de parrainage</p>
              <h1>Pourquoi Parrainio&nbsp;?</h1>
              <p className={styles.heroLead}>
                Chercher un code de parrainage soi-même, c&apos;est comparer des forums, des codes
                parfois obsolètes et des conditions dispersées. Parrainio réunit les offres et
                affiche avant l&apos;inscription : ce que le filleul reçoit, ce que le parrain
                reçoit, ce que Parrainio reverse et les conditions réellement nécessaires.
              </p>
              <div className={styles.heroActions}>
                <Link href="/offres" className={styles.primaryButton}>Découvrir les offres <Icon name="arrow" size={18} /></Link>
              </div>
            </div>
            <div className={styles.heroVisual} aria-label="Aperçu de l'avantage Parrainio">
              <div className={styles.heroRing} aria-hidden="true" />
              <div className={styles.benefitCard}>
                <div className={styles.benefitCardTop}><span>Votre avantage Parrainio</span><span className={styles.cardMark}>P</span></div>
                <div className={styles.percent}><strong>50</strong><span>%</span></div>
                <p className={styles.benefitMain}>Jusqu&apos;à 50 % de notre commission reversée</p>
                <p className={styles.benefitSub}>Votre bonus + jusqu&apos;à 50 % de notre commission</p>
                <div className={styles.cardBottom}><span><Icon name="check" size={16} /> Selon les conditions de l&apos;offre</span><Icon name="spark" size={18} /></div>
              </div>
              <span className={styles.coinOne} aria-hidden="true">€</span>
              <span className={styles.coinTwo} aria-hidden="true">€</span>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Ce que vous voyez avant de vous inscrire */}
      <section id="avant-inscription" className={styles.infoSection}>
        <div className={styles.container}>
          <h2 className={styles.infoTitle}>Tout ce que vous devez savoir avant de vous inscrire</h2>
          <div className={styles.infoGrid}>
            {infoBlocks.map((block) => (
              <article className={styles.infoCard} key={block.title}>
                <div className={styles.infoIcon}><Icon name={block.icon} size={26} /></div>
                <h3>{block.title}</h3>
                <p>{block.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Comment ça marche ? */}
      <section id="etapes" className={styles.stepsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>Le parcours</p>
            <h2>Comment ça marche&nbsp;?</h2>
          </div>
          <div className={styles.stepsGrid}>
            {steps.map((step) => (
              <article className={styles.stepCard} key={step.number}>
                <div className={styles.stepTop}><span>{step.number}</span><div className={styles.stepIcon}><Icon name={step.icon} size={27} /></div></div>
                <h3>{step.title}</h3>
                <p>{step.text}{step.number === "02" ? <> Pour savoir comment <Link href="/codes-parrainage">utiliser un code au bon moment</Link>, consultez notre guide.</> : null}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Pourquoi faire confiance à Parrainio ? */}
      <section id="confiance" className={styles.trustSection}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>Ce qui fait la différence</p>
            <h2>Pourquoi faire confiance <em>à Parrainio&nbsp;?</em></h2>
          </div>
          <ul className={styles.trustList}>
            {trustItems.map((item) => (
              <li key={item.text}>
                <span className={styles.trustIcon}><Icon name={item.icon} size={18} /></span>
                <span>
                  {item.text}
                  {item.href ? (
                    <> <Link href={item.href}>{item.linkLabel} →</Link></>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Comment Parrainio se rémunère ? */}
      <section id="remuneration" className={styles.remunerationSection}>
        <div className={styles.container}>
          <div className={styles.remunerationCard}>
            <p className={styles.kicker}>Transparence</p>
            <h2>Comment Parrainio <em>se rémunère&nbsp;?</em></h2>
            <p>
              Lorsqu&apos;un parrainage passe par Parrainio, le partenaire peut nous verser une
              commission.
            </p>
            <p>
              Selon l&apos;offre, nous vous reversons une partie de cette commission en complément
              de votre avantage filleul.
            </p>
            <p>
              C&apos;est ce que nous appelons le «&nbsp;Parrainio reverse&nbsp;».
            </p>
            <p>
              Jusqu&apos;à <strong>50&nbsp;%</strong> de notre commission peut ainsi vous être
              reversée, selon les conditions de l&apos;offre.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Comment demander le reversement et quand arrive-t-il ? */}
      <section id="reversement" className={styles.reversalSection}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>Le reversement</p>
            <h2>Comment demander <em>votre reversement&nbsp;?</em></h2>
            <p>
              Le reversement s’ajoute à la prime du partenaire uniquement lorsque la fiche de l’offre
              le prévoit. La fiche indique les conditions à remplir ; le délai de versement dépend ensuite
              du calendrier de cette offre. Dans la majorité des cas, le filleul reçoit sa prime au moment
              où le parrain reçoit la sienne, et le partenaire envoie une notification à ce moment-là.
            </p>
          </div>
          <ol className={styles.reversalSteps}>
            <li>
              <span>1</span>
              <div>
                <h3>Suivez les conditions de l’offre</h3>
                <p>
                  Utilisez le lien ou le code au moment indiqué, puis effectuez les actions requises
                  (par exemple un dépôt, un achat ou des opérations). Consultez les{" "}
                  <Link href="/offres">fiches d’offres et leurs conditions</Link> avant de vous inscrire :
                  chaque partenaire fixe ses propres étapes et délais.
                </p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <h3>Demandez le reversement après votre parcours</h3>
                <p>
                  Depuis la fiche de l’offre, ouvrez « Demander ma reverse » une fois les étapes du
                  partenaire effectuées. Le formulaire demande votre prénom, votre nom et votre adresse
                  e-mail. La référence du contrat est facultative ; le mode de paiement est à choisir,
                  et ses coordonnées peuvent être transmises plus tard si nécessaire.
                </p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <h3>Ajoutez les précisions utiles, si l’offre le demande</h3>
                <p>
                  Il n’y a pas de justificatif à joindre systématiquement. Si la fiche précise que le
                  partenaire identifie l’ouverture du compte avec un numéro de téléphone, indiquez le
                  même numéro dans le champ « Message » facultatif du formulaire. Aucun justificatif n’est
                  à joindre par défaut ; transmettez-en un uniquement si la fiche le prévoit ou si
                  Parrainio vous le demande pour vérifier le dossier.
                </p>
              </div>
            </li>
            <li>
              <span>4</span>
              <div>
                <h3>Parrainio vérifie la demande</h3>
                <p>
                  Parrainio vérifie que le parrainage et les conditions de l’offre sont validés. Pour les
                  offres où le reversement dépend de la commission du partenaire, il faut aussi que cette
                  commission ait été reçue par Parrainio. La prime du filleul et la commission sont deux
                  paiements distincts et leurs calendriers peuvent différer.
                </p>
              </div>
            </li>
            <li>
              <span>5</span>
              <div>
                <h3>Comptez habituellement 24 à 72 h après la commission</h3>
                <p>
                  Pour les offres concernées, le responsable de Parrainio indique un délai de traitement
                  habituel de 24 à 72 heures à partir de la réception de la commission par Parrainio.
                  Ce délai n’est pas garanti et ne commence donc pas nécessairement à l’ouverture du compte
                  ni à la réception de votre prime partenaire.
                </p>
              </div>
            </li>
          </ol>
          <p className={styles.reversalNote}>
            <strong>Une exception documentée : Assurancevie.com.</strong> Le retour de terrain du responsable
            distingue environ 30 jours pour la prime du filleul et environ 90 jours pour la récompense liée
            au parrainage ; ce décalage peut permettre un reversement avant que Parrainio reçoive sa
            commission. C’est une observation de terrain, pas un calendrier officiel du partenaire : le
            délai de 24 à 72 h après commission ne doit pas être appliqué automatiquement à ce cas. Consultez
            les <Link href="/offres/assurancevie-com">conditions de l’offre Assurancevie.com</Link> et le{" "}
            <Link href="/observatoire-conditions-prime#delai-pratique">détail de l’observatoire</Link>.
            {" "}Autre cas à connaître : chez BNP Paribas, la prime du filleul ne se déclenche qu’après dix
            paiements réalisés dans les trois mois suivant l’ouverture — le compte à rebours ne part donc
            pas de l’ouverture. Les durées constatées, offre par offre, sont détaillées dans{" "}
            <Link href="/blog/delai-versement-prime-parrainage-comment-lire">le guide des délais de versement</Link>.
            Pour les autres questions, retrouvez la{" "}
            <Link href="/#faq">FAQ</Link> ou les{" "}
            <Link href="/blog/prime-parrainage-pas-encore-versee">causes possibles d’un versement retardé</Link>.
          </p>
        </div>
      </section>

      {/* CTA final */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <span className={styles.ctaCoin} aria-hidden="true">€</span>
            <div>
              <h2>Trouvez votre prochain <em>parrainage avantageux.</em></h2>
              <p>Comparez les opportunités disponibles : <Link href="/offres">toutes les offres</Link>, <Link href="/offres?category=Cashback#offres">Cashback</Link> ou <Link href="/offres/boursobank">BoursoBank</Link>.</p>
            </div>
            <Link href="/offres" className={styles.ctaButton}>Voir les offres <Icon name="arrow" size={18} /></Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
