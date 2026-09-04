import Link from "next/link";
import type { SVGProps } from "react";
import type { Metadata } from "next";
import PublicHeader from "@/components/PublicHeader";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Comment ça marche : les étapes d'un parrainage | Parrainio",
  description:
    "Les 3 étapes d'un parrainage réussi : choisir une offre, utiliser le lien ou code du parrain, valider les conditions puis demander votre reverse Parrainio.",
  alternates: { canonical: "https://www.parrainio.fr/comment-ca-marche" },
  openGraph: { url: "/comment-ca-marche", type: "website", siteName: "Parrainio", locale: "fr_FR" },
};

type IconName =
  | "search"
  | "link"
  | "gift"
  | "bank"
  | "paypal"
  | "wero"
  | "check";

type Step = {
  number: string;
  title: string;
  text: string;
  icon: IconName;
  color: "cream" | "green" | "orange";
};

type Payment = {
  title: string;
  text: string;
  icon: IconName;
  className: "bank" | "paypal" | "wero";
};

function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const common: SVGProps<SVGSVGElement> = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "search") return <svg {...common}><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>;
  if (name === "link") return <svg {...common}><path d="M10.5 13.5a4.2 4.2 0 0 0 6 0l2-2a4.2 4.2 0 0 0-6-6l-1.15 1.15" /><path d="M13.5 10.5a4.2 4.2 0 0 0-6 0l-2 2a4.2 4.2 0 0 0 6 6l1.15-1.15" /></svg>;
  if (name === "gift") return <svg {...common}><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M12 8v13M3 12h18M12 8H8.4a2.4 2.4 0 1 1 2.4-2.4V8Zm0 0h3.6A2.4 2.4 0 1 0 13.2 5.6V8Z" /></svg>;
  if (name === "bank") return <svg {...common}><path d="m3 10 9-5 9 5M5 10v8m4-8v8m6-8v8m4-8v8M3 20h18" /></svg>;
  if (name === "paypal") return <svg {...common}><path d="M7 20 10 4h5.1a3.9 3.9 0 0 1 .9 7.7H12l-1.5 8.3" /><path d="M8.6 16h4.3a3.8 3.8 0 0 0 3.6-2.7l.4-1.3" /></svg>;
  if (name === "wero") return <svg {...common}><path d="m4 5 3.4 14L12 8l4.6 11L20 5" /></svg>;
  if (name === "check") return <svg {...common}><path d="m5 12 4.2 4.2L19 6.5" /></svg>;
  return <svg {...common}><circle cx="12" cy="12" r="8" /><path d="M12 8v8m-2.5-6.2c.4-1 1.3-1.5 2.5-1.5 1.4 0 2.4.7 2.4 1.8 0 2.8-5 1.4-5 4 0 1.1 1 1.8 2.6 1.8 1.2 0 2.2-.5 2.7-1.3" /></svg>;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Choisissez",
    text: "Parcourez les offres et repérez celle qui vous correspond.",
    icon: "search",
    color: "cream",
  },
  {
    number: "02",
    title: "Parrainez",
    text: "Utilisez le lien indiqué et suivez les conditions du partenaire.",
    icon: "link",
    color: "green",
  },
  {
    number: "03",
    title: "Gagnez",
    text: "Votre prime, puis un reversement potentiel, sont clairement expliqués.",
    icon: "gift",
    color: "orange",
  },
];

const payments: Payment[] = [
  {
    title: "Virement bancaire",
    text: "Une option qui pourra être proposée selon les conditions de l’offre.",
    icon: "bank",
    className: "bank",
  },
  {
    title: "PayPal",
    text: "Un moyen de versement envisagé lorsque les modalités le permettent.",
    icon: "paypal",
    className: "paypal",
  },
  {
    title: "Wero",
    text: "Une alternative potentielle, selon les options disponibles à terme.",
    icon: "wero",
    className: "wero",
  },
];

export default function CommentCaMarchePage() {
  return (
    <main className={styles.page}>
      <PublicHeader active="how" />

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}><span />Le parrainage simplifié</p>
              <h1>Le parrainage, <em>en beaucoup plus simple.</em></h1>
              <p className={styles.heroText}>
                Trouvez une offre, suivez les étapes et découvrez clairement ce que vous pouvez gagner.
              </p>
              <div className={styles.heroActions}>
                <Link href="/offres" className={styles.primaryButton}>Découvrir les offres <span>→</span></Link>
                <a href="#etapes" className={styles.secondaryButton}>Voir les 3 étapes</a>
              </div>
              <p className={styles.smallPromise}><span><Icon name="check" size={15} /></span>Simple, clair et sans frais pour consulter les offres.</p>
            </div>

            <div className={styles.heroVisual} aria-label="Les trois étapes du parrainage">
              <div className={styles.leafOne} aria-hidden="true" />
              <div className={styles.leafTwo} aria-hidden="true" />
              <div className={styles.visualHead}>
                <span>Votre parcours Parrainio</span>
                <span className={styles.visualPill}>3 étapes</span>
              </div>
              <div className={styles.visualSteps}>
                {steps.map((step, index) => (
                  <div className={styles.visualStep} key={step.title}>
                    <div className={`${styles.visualIcon} ${styles[step.color]}`}><Icon name={step.icon} size={22} /></div>
                    <div><strong>{step.title}</strong><span>{index === 0 ? "Une offre" : index === 1 ? "Votre lien" : "Votre avantage"}</span></div>
                    {index < 2 && <b className={styles.visualArrow}>→</b>}
                  </div>
                ))}
              </div>
              <div className={styles.visualFooter}>
                <span className={styles.spark}>✦</span>
                <span>Un parcours facile à comprendre, du début à la récompense.</span>
              </div>
              <span className={styles.coinTop} aria-hidden="true">€</span>
              <span className={styles.coinBottom} aria-hidden="true">€</span>
            </div>
          </div>
        </div>
      </section>

      <section id="etapes" className={styles.stepsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <p className={styles.kicker}>Comment ça marche</p>
            <h2>Trois étapes. <em>Un avantage en plus.</em></h2>
            <p>Pas de jargon : on vous explique le parcours en quelques instants.</p>
          </div>
          <div className={styles.stepsGrid}>
            {steps.map((step) => (
              <article className={`${styles.stepCard} ${styles[`${step.color}Card`]}`} key={step.title}>
                <div className={styles.stepTop}><span>{step.number}</span><div className={styles.stepIcon}><Icon name={step.icon} size={27} /></div></div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <span className={styles.cardLine} />
                <span className={styles.cardBottom}>{step.title === "Choisissez" ? "Explorer les offres" : step.title === "Parrainez" ? "Suivre le lien" : "Profiter de l’avantage"}<b>→</b></span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.commissionSection}>
        <div className={styles.container}>
          <div className={styles.commissionCard}>
            <div className={styles.commissionCopy}>
              <p className={styles.kicker}>Le principe Parrainio</p>
              <h2>Jusqu&apos;à <strong>25 %</strong> de notre commission peut vous être reversée.</h2>
              <p>Lorsque Parrainio est rémunéré par un partenaire, une partie de cette commission peut compléter votre prime, selon les conditions de l’offre.</p>
              <Link href="/nos-avantages" className={styles.textLink}>Comprendre notre différence <span>→</span></Link>
            </div>
            <div className={styles.commissionGraphic} aria-label="Exemple de répartition d'une commission">
              <span className={styles.graphicCoinOne} aria-hidden="true">€</span>
              <div className={styles.commissionBadge}>25<small>%</small></div>
              <div className={styles.graphicCard}>
                <span className={styles.graphicLabel}>Exemple de reversement</span>
                <div className={styles.graphicAmount}><span>Commission partenaire</span><strong>120 €</strong></div>
                <div className={styles.graphicBar}><span /></div>
                <div className={styles.graphicRows}>
                  <div><span>Partie Parrainio</span><b>90 €</b></div>
                  <div><span>Votre reversement potentiel</span><b>+30 €</b></div>
                </div>
                <div className={styles.graphicTotal}><span>Votre avantage potentiel</span><strong>150 €</strong></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.flowSection}>
        <div className={styles.container}>
          <div className={`${styles.sectionHeading} ${styles.centered}`}>
            <p className={styles.kicker}>En pratique</p>
            <h2>Votre avantage, <em>en un coup d’œil.</em></h2>
          </div>
          <div className={styles.flow}>
            <div><span className={styles.flowNumber}>1</span><strong>Vous choisissez</strong><small>Une offre qui vous intéresse.</small></div>
            <b>→</b>
            <div><span className={styles.flowNumber}>2</span><strong>Vous réalisez l’offre</strong><small>En respectant ses conditions.</small></div>
            <b>→</b>
            <div className={styles.flowReward}><span className={styles.flowNumber}>3</span><strong>Vous recevez</strong><small>Votre prime et, le cas échéant, votre reversement.</small></div>
          </div>
        </div>
      </section>

      <section className={styles.paymentSection}>
        <div className={styles.container}>
          <div className={styles.paymentIntro}>
            <div>
              <p className={styles.kicker}>Votre avantage, simplement versé</p>
              <h2>Des options pensées <em>pour vous simplifier la vie.</em></h2>
            </div>
            <p>Les modalités de versement dépendront des offres et des fonctionnalités disponibles. Ces options sont présentées à titre indicatif.</p>
          </div>
          <div className={styles.paymentGrid}>
            {payments.map((payment) => (
              <article className={styles.paymentCard} key={payment.title}>
                <div className={`${styles.paymentIcon} ${styles[payment.className]}`}><Icon name={payment.icon} size={29} /></div>
                <h3>{payment.title}</h3>
                <p>{payment.text}</p>
                <span className={styles.comingSoon}>Selon disponibilité</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaLeaf} aria-hidden="true" />
            <span className={styles.ctaCoin} aria-hidden="true">€</span>
            <div>
              <p className={styles.kicker}>Prêt à commencer ?</p>
              <h2>Votre prochaine récompense <em>est peut-être déjà là.</em></h2>
              <p>Découvrez les offres et trouvez celle qui vous convient : <Link href="/offres">toutes les offres</Link>, <Link href="/offres?category=Banque%20%26%20Finance#offres">Banque &amp; Finance</Link> ou <Link href="/offres?category=%C3%89nergie#offres">Énergie</Link>.</p>
            </div>
            <Link href="/offres" className={styles.ctaButton}>Explorer les offres <span>→</span></Link>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div><Link href="/" className={styles.footerLogo}><span className={styles.logoMark}>P</span>Parrainio</Link><p>Le nouveau réflexe pour découvrir et profiter des offres de parrainage.</p></div>
            <div><h3>Navigation</h3><Link href="/">Accueil</Link><Link href="/offres">Offres</Link><Link href="/comment-ca-marche">Comment ça marche</Link></div>
            <div><h3>Parrainio</h3><Link href="/nos-avantages">Nos avantages</Link><a href="mailto:contact@parrainio.fr">Contact</a></div>
          </div>
          <div className={styles.footerBottom}>© 2026 Parrainio. Tous droits réservés.</div>
        </div>
      </footer>
    </main>
  );
}
