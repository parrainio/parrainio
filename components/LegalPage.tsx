import Link from "next/link";
import type { ReactNode } from "react";
import PublicHeader from "./PublicHeader";
import styles from "./LegalPage.module.css";

type LegalPageProps = {
  kicker: string;
  title: string;
  intro: string;
  children: ReactNode;
};

export default function LegalPage({ kicker, title, intro, children }: LegalPageProps) {
  return (
    <main className={styles.page}>
      <PublicHeader />

      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}><span />{kicker}</p>
          <h1>{title}</h1>
          <p className={styles.intro}>{intro}</p>
        </div>
      </section>

      <section className={styles.body}>
        <div className={styles.container}>
          <div className={styles.card}>{children}</div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div><Link href="/" className={styles.footerLogo}><span className={styles.logoMark}>P</span>Parrainio</Link><p>Le nouveau réflexe pour découvrir et profiter des offres de parrainage.</p></div>
            <div><h3>Découvrir</h3><Link href="/offres">Les offres</Link><Link href="/classement-primes-parrainage">Classement des primes</Link><Link href="/comment-ca-marche">Comment ça marche</Link></div>
            <div><h3>Parrainio</h3><Link href="/nos-avantages">Nos avantages</Link><a href="mailto:parrainage@parrainio.fr">Contact</a></div>
            <div><h3>Informations légales</h3><Link href="/mentions-legales">Mentions légales</Link><Link href="/confidentialite">Politique de confidentialité</Link><Link href="/cgu">Conditions générales</Link></div>
          </div>
          <div className={styles.footerBottom}>© 2026 Parrainio. Tous droits réservés.</div>
        </div>
      </footer>
    </main>
  );
}