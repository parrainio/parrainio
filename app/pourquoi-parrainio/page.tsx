import Link from "next/link";
import type { Metadata } from "next";
import type { SVGProps } from "react";
import styles from "./page.module.css";
import { OG_IMAGE } from "@/lib/ogImage";
import PublicHeader from "@/components/PublicHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Pourquoi Parrainio ? Fonctionnement, avantages et transparence | Parrainio",
  description:
    "Comment fonctionne Parrainio : les étapes d'un parrainage, le fonctionnement des offres et codes, jusqu'à 25 % de commission reversée et une information claire avant de vous lancer.",
  alternates: { canonical: "https://www.parrainio.fr/pourquoi-parrainio" },
  openGraph: { url: "/pourquoi-parrainio", type: "website", siteName: "Parrainio", locale: "fr_FR", images: [OG_IMAGE] },
};

type IconName = "arrow" | "check" | "search" | "link" | "gift" | "coin" | "eye" | "shield" | "spark" | "bank" | "paypal" | "wero";

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
  if (name === "bank") return <svg {...common}><path d="m3 10 9-5 9 5M5 10v8m4-8v8m6-8v8m4-8v8M3 20h18" /></svg>;
  if (name === "paypal") return <svg {...common}><path d="M7 20 10 4h5.1a3.9 3.9 0 0 1 .9 7.7H12l-1.5 8.3" /><path d="M8.6 16h4.3a3.8 3.8 0 0 0 3.6-2.7l.4-1.3" /></svg>;
  if (name === "wero") return <svg {...common}><path d="m4 5 3.4 14L12 8l4.6 11L20 5" /></svg>;
  return <svg {...common}><path d="m12 3 .95 5.05L18 9l-5.05.95L12 15l-.95-5.05L6 9l5.05-.95L12 3Z" /><path d="m19 15 .5 2.5L22 18l-2.5.5L19 21l-.5-2.5L16 18l2.5-.5L19 15Z" /></svg>;
}

const steps = [
  { number: "01", title: "Choisissez", text: "Parcourez les offres et repérez celle qui vous correspond.", icon: "search" as const },
  { number: "02", title: "Parrainez", text: "Utilisez le lien indiqué et suivez les conditions du partenaire.", icon: "link" as const },
  { number: "03", title: "Gagnez", text: "Votre prime, puis un reversement potentiel, sont clairement expliqués.", icon: "gift" as const },
];

const payments = [
  { title: "Virement bancaire", text: "Une option qui pourra être proposée selon les conditions de l’offre.", icon: "bank" as const },
  { title: "PayPal", text: "Un moyen de versement envisagé lorsque les modalités le permettent.", icon: "paypal" as const },
  { title: "Wero", text: "Une alternative potentielle, selon les options disponibles à terme.", icon: "wero" as const },
];

const benefits = [
  { icon: "coin" as const, title: "Une prime qui reste la vôtre", text: "La récompense proposée par le partenaire vous revient selon les conditions de son offre." },
  { icon: "spark" as const, title: "Un reversement potentiel", text: "Jusqu’à 25 % de la commission Parrainio peut compléter votre avantage." },
  { icon: "eye" as const, title: "Une information plus claire", text: "Les montants et le fonctionnement sont distingués avant que vous vous lanciez." },
];

export default function PourquoiParrainioPage() {
  return (
    <main className={styles.page}>
      <PublicHeader active="how" />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}><span />Pourquoi Parrainio ?</p>
              <h1>Pourquoi Parrainio ? <em>La clarté, avant tout.</em></h1>
              <p>
                Parrainio réunit les meilleures offres de parrainage et vous aide à comprendre
                votre gain potentiel : la prime du partenaire, et un reversement potentiel de
                notre commission. Trouvez une offre, suivez les étapes, profitez.
              </p>
              <div className={styles.heroActions}>
                <Link href="/offres" className={styles.primaryButton}>Découvrir les offres <Icon name="arrow" size={18} /></Link>
                <a href="#etapes" className={styles.secondaryButton}>Voir les étapes</a>
              </div>
            </div>
            <div className={styles.heroVisual} aria-label="Aperçu de l'avantage Parrainio">
              <div className={styles.heroRing} aria-hidden="true" />
              <div className={styles.benefitCard}>
                <div className={styles.benefitCardTop}><span>Votre avantage Parrainio</span><span className={styles.cardMark}>P</span></div>
                <div className={styles.percent}><strong>25</strong><span>%</span></div>
                <p>Jusqu&apos;à 25 % de notre commission peut être reversée.</p>
                <div className={styles.cardBottom}><span><Icon name="check" size={16} /> Selon les conditions de l&apos;offre</span><Icon name="spark" size={18} /></div>
              </div>
              <span className={styles.coinOne} aria-hidden="true">€</span>
              <span className={styles.coinTwo} aria-hidden="true">€</span>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Comment fonctionne Parrainio ? — les 3 étapes (ex « Comment ça marche ») */}
      <section id="etapes" className={styles.stepsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <p className={styles.kicker}>Comment fonctionne Parrainio ?</p>
            <h2>Trois étapes. <em>Un avantage en plus.</em></h2>
            <p>Pas de jargon : on vous explique le parcours en quelques instants.</p>
          </div>
          <div className={styles.stepsGrid}>
            {steps.map((step) => (
              <article className={styles.stepCard} key={step.title}>
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

      {/* 2. La commission / reversement */}
      <section className={styles.commissionSection}>
        <div className={styles.container}>
          <div className={styles.commissionCard}>
            <div className={styles.commissionCopy}>
              <p className={styles.kicker}>Le principe Parrainio</p>
              <h2>Jusqu&apos;à <strong>25 %</strong> de notre commission peut vous être reversée.</h2>
              <p>Lorsque Parrainio est rémunéré par un partenaire, une partie de cette commission peut compléter votre prime, selon les conditions de l’offre.</p>
              <a href="#avantages" className={styles.textLink}>Comprendre notre différence <span>→</span></a>
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

      {/* 3. En pratique */}
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

      {/* 4. Versements */}
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
                <div className={styles.paymentIcon}><Icon name={payment.icon} size={29} /></div>
                <h3>{payment.title}</h3>
                <p>{payment.text}</p>
                <span className={styles.comingSoon}>Selon disponibilité</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Les avantages de Parrainio (ex « Nos avantages ») */}
      <section id="avantages" className={styles.benefitsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>Les avantages de Parrainio</p>
            <h2>Le parrainage, <em>avec plus de clarté.</em></h2>
            <p>Notre rôle est simple : vous aider à identifier une bonne opportunité et rendre votre gain potentiel plus lisible.</p>
          </div>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <article className={styles.benefit} key={benefit.title}>
                <span className={styles.benefitNumber}>0{index + 1}</span>
                <div className={styles.benefitIcon}><Icon name={benefit.icon} size={26} /></div>
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Votre gain en un coup d'œil (formule) */}
      <section className={styles.formulaSection}>
        <div className={styles.container}>
          <div className={styles.formulaLayout}>
            <div>
              <p className={styles.kicker}>En un coup d’œil</p>
              <h2>Votre gain potentiel, <em>mieux détaillé.</em></h2>
              <p>Une offre peut réunir deux éléments distincts : la prime proposée par le partenaire et, lorsque cela s’applique, une part de la commission Parrainio.</p>
              <Link href="/offres" className={styles.textLink}>Voir les offres <Icon name="arrow" size={16} /></Link>
            </div>
            <div className={styles.formulaCard}>
              <p>Un exemple simple</p>
              <div className={styles.formulaValues}>
                <div><span>Prime partenaire</span><strong>200 €</strong></div>
                <b>+</b>
                <div><span>Reversement potentiel</span><strong>+50 €</strong></div>
              </div>
              <div className={styles.formulaTotal}><span>Votre avantage potentiel</span><strong>250 €</strong></div>
              <small><Icon name="shield" size={15} /> Les conditions applicables sont toujours à consulter avant de participer.</small>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Nos engagements (transparence) */}
      <section className={styles.commitments}>
        <div className={styles.container}>
          <div className={styles.commitmentsGrid}>
            <div>
              <p className={styles.kicker}>Nos engagements</p>
              <h2>Le bon réflexe, <em>sans promesse floue.</em></h2>
            </div>
            <div className={styles.commitmentsList}>
              <p><Icon name="check" size={18} /><span><strong>Pas de frais pour consulter les offres</strong><small>Vous accédez aux informations essentielles sans contrepartie.</small></span></p>
              <p><Icon name="check" size={18} /><span><strong>Des montants présentés séparément</strong><small>La prime partenaire et le reversement potentiel ne sont pas confondus.</small></span></p>
              <p><Icon name="check" size={18} /><span><strong>Les conditions restent déterminantes</strong><small>Chaque offre est soumise à ses propres règles d’éligibilité.</small></span></p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <span className={styles.ctaCoin} aria-hidden="true">€</span>
            <div>
              <p className={styles.kicker}>Prêt à commencer ?</p>
              <h2>Découvrez les offres qui <em>peuvent vous rapporter plus.</em></h2>
              <p>Comparez les opportunités disponibles, simplement : <Link href="/offres">toutes les offres</Link>, <Link href="/offres?category=Cashback#offres">Cashback</Link> ou <Link href="/offres/boursobank">BoursoBank</Link>.</p>
            </div>
            <Link href="/offres" className={styles.ctaButton}>Explorer les offres <Icon name="arrow" size={18} /></Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
