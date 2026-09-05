import Link from "next/link";
import type { SVGProps } from "react";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { OG_IMAGE } from "@/lib/ogImage";
import PublicHeader from "@/components/PublicHeader";

export const metadata: Metadata = {
  title: "Nos avantages : jusqu'à 25 % de commission reversée | Parrainio",
  description:
    "Ce que Parrainio ajoute aux offres de parrainage : jusqu'à 25 % de notre commission reversée, des fiches transparentes et un suivi clair de votre avantage.",
  alternates: { canonical: "https://www.parrainio.fr/nos-avantages" },
  openGraph: { url: "/nos-avantages", type: "website", siteName: "Parrainio", locale: "fr_FR", images: [OG_IMAGE] },
};

type IconName = "arrow" | "check" | "eye" | "coin" | "shield" | "spark";

function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const common: SVGProps<SVGSVGElement> = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  if (name === "arrow") return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
  if (name === "check") return <svg {...common}><path d="m5 12 4.2 4.2L19 6.5" /></svg>;
  if (name === "eye") return <svg {...common}><path d="M2.5 12s3.3-6 9.5-6 9.5 6 9.5 6-3.3 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.4" /></svg>;
  if (name === "coin") return <svg {...common}><circle cx="12" cy="12" r="8" /><path d="M12 8v8m-2.5-6.2c.4-1 1.3-1.5 2.5-1.5 1.4 0 2.4.7 2.4 1.8 0 2.8-5 1.4-5 4 0 1.1 1 1.8 2.6 1.8 1.2 0 2.2-.5 2.7-1.3" /></svg>;
  if (name === "shield") return <svg {...common}><path d="M12 3.5 19 6v5.4c0 4.3-2.8 7.8-7 9.1-4.2-1.3-7-4.8-7-9.1V6l7-2.5Z" /><path d="m8.5 12 2.3 2.3 4.7-4.8" /></svg>;
  return <svg {...common}><path d="m12 3 .95 5.05L18 9l-5.05.95L12 15l-.95-5.05L6 9l5.05-.95L12 3Z" /><path d="m19 15 .5 2.5L22 18l-2.5.5L19 21l-.5-2.5L16 18l2.5-.5L19 15Z" /></svg>;
}

const benefits = [
  { icon: "coin" as const, title: "Une prime qui reste la vôtre", text: "La récompense proposée par le partenaire vous revient selon les conditions de son offre." },
  { icon: "spark" as const, title: "Un reversement potentiel", text: "Jusqu’à 25 % de la commission Parrainio peut compléter votre avantage." },
  { icon: "eye" as const, title: "Une information plus claire", text: "Les montants et le fonctionnement sont distingués avant que vous vous lanciez." },
];

export default function NosAvantagesPage() {
  return (
    <main className={styles.page}>
      <PublicHeader active="advantages" />

      <section className={styles.hero}><div className={styles.container}><div className={styles.heroGrid}>
        <div className={styles.heroCopy}><p className={styles.eyebrow}><span />L&apos;avantage Parrainio</p><h1>Plus transparent. <em>Plus avantageux.</em></h1><p>Parrainio fait une place claire à votre avantage : la prime du partenaire, et un reversement potentiel de notre commission.</p><div className={styles.heroActions}><Link href="/offres" className={styles.primaryButton}>Découvrir les offres <Icon name="arrow" size={18} /></Link><Link href="/comment-ca-marche" className={styles.secondaryButton}>Comment ça marche</Link></div></div>
        <div className={styles.heroVisual} aria-label="Jusqu'à 25 % de commission Parrainio peut être reversée"><div className={styles.heroRing} aria-hidden="true" /><div className={styles.benefitCard}><div className={styles.benefitCardTop}><span>Votre avantage Parrainio</span><span className={styles.cardMark}>P</span></div><div className={styles.percent}><strong>25</strong><span>%</span></div><p>Jusqu&apos;à 25 % de notre commission peut vous être reversée.</p><div className={styles.cardBottom}><span><Icon name="check" size={16} /> Selon les conditions de l&apos;offre</span><Icon name="spark" size={18} /></div></div><span className={styles.coinOne} aria-hidden="true">€</span><span className={styles.coinTwo} aria-hidden="true">€</span></div>
      </div></div></section>

      <section className={styles.benefitsSection}><div className={styles.container}><div className={styles.sectionHead}><p className={styles.kicker}>Ce qui vous avantage</p><h2>Le parrainage, <em>avec plus de clarté.</em></h2><p>Notre rôle est simple : vous aider à identifier une bonne opportunité et rendre votre gain potentiel plus lisible.</p></div><div className={styles.benefitsGrid}>{benefits.map((benefit, index) => <article className={styles.benefit} key={benefit.title}><span className={styles.benefitNumber}>0{index + 1}</span><div className={styles.benefitIcon}><Icon name={benefit.icon} size={26} /></div><h3>{benefit.title}</h3><p>{benefit.text}</p></article>)}</div></div></section>

      <section className={styles.formulaSection}><div className={styles.container}><div className={styles.formulaLayout}>
        <div><p className={styles.kicker}>En un coup d&apos;œil</p><h2>Votre gain potentiel, <em>mieux détaillé.</em></h2><p>Une offre peut réunir deux éléments distincts : la prime proposée par le partenaire et, lorsque cela s&apos;applique, une part de la commission Parrainio.</p><Link href="/comment-ca-marche" className={styles.textLink}>Voir le parcours complet <Icon name="arrow" size={16} /></Link></div>
        <div className={styles.formulaCard}><p>Un exemple simple</p><div className={styles.formulaValues}><div><span>Prime partenaire</span><strong>200 €</strong></div><b>+</b><div><span>Reversement potentiel</span><strong>+50 €</strong></div></div><div className={styles.formulaTotal}><span>Votre avantage potentiel</span><strong>250 €</strong></div><small><Icon name="shield" size={15} /> Les conditions applicables sont toujours à consulter avant de participer.</small></div>
      </div></div></section>

      <section className={styles.commitments}><div className={styles.container}><div className={styles.commitmentsGrid}>
        <div><p className={styles.kicker}>Nos engagements</p><h2>Le bon réflexe, <em>sans promesse floue.</em></h2></div><div className={styles.commitmentsList}><p><Icon name="check" size={18} /><span><strong>Pas de frais pour consulter les offres</strong><small>Vous accédez aux informations essentielles sans contrepartie.</small></span></p><p><Icon name="check" size={18} /><span><strong>Des montants présentés séparément</strong><small>La prime partenaire et le reversement potentiel ne sont pas confondus.</small></span></p><p><Icon name="check" size={18} /><span><strong>Les conditions restent déterminantes</strong><small>Chaque offre est soumise à ses propres règles d&apos;éligibilité.</small></span></p></div></div></div></section>

      <section className={styles.ctaSection}><div className={styles.container}><div className={styles.ctaCard}><span className={styles.ctaCoin} aria-hidden="true">€</span><div><p className={styles.kicker}>Prêt à en profiter ?</p><h2>Découvrez les offres qui <em>peuvent vous rapporter plus.</em></h2><p>Comparez les opportunités disponibles, simplement : <Link href="/offres">toutes les offres</Link>, <Link href="/offres?category=Cashback#offres">Cashback</Link> ou <Link href="/offres/boursobank">BoursoBank</Link>.</p></div><Link href="/offres" className={styles.ctaButton}>Explorer les offres <Icon name="arrow" size={18} /></Link></div></div></section>

      <footer className={styles.footer}><div className={styles.container}><div className={styles.footerGrid}><div><Link href="/" className={styles.footerLogo}><span className={styles.logoMark}>P</span>Parrainio</Link><p>Le nouveau réflexe pour découvrir et profiter des offres de parrainage.</p></div><div><h3>Découvrir</h3><Link href="/offres">Les offres</Link><Link href="/comment-ca-marche">Comment ça marche</Link></div><div><h3>Parrainio</h3><Link href="/nos-avantages">Nos avantages</Link><a href="mailto:parrainage@parrainio.fr">Contact</a></div><div><h3>Informations légales</h3><Link href="/mentions-legales">Mentions légales</Link><Link href="/confidentialite">Politique de confidentialité</Link><Link href="/cgu">Conditions générales</Link></div></div><div className={styles.footerBottom}>© 2026 Parrainio. Tous droits réservés.</div></div></footer>
    </main>
  );
}
