import Link from "next/link";
import type { ReactNode } from "react";
import PublicHeaderServer from "./PublicHeaderServer";
import CookieSettingsLink from "./CookieSettingsLink";
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
      <PublicHeaderServer />

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
            <div><h3>Découvrir</h3><Link href="/offres">Les offres</Link><Link href="/classement-primes-parrainage">Classement des primes</Link><Link href="/codes-parrainage">Codes promo / parrainage</Link></div>
            <div><h3>À propos et aide</h3><Link href="/pourquoi-parrainio">Pourquoi Parrainio ?</Link><Link href="/#faq">FAQ</Link><a href="mailto:parrainage@parrainio.fr">Contact</a></div>
            <div><h3>Informations légales</h3><Link href="/mentions-legales">Mentions légales</Link><Link href="/confidentialite">Politique de confidentialité</Link><Link href="/cgu">Conditions générales</Link><CookieSettingsLink /></div>
          </div>
          <div className={styles.footerBottom}>© 2026 Parrainio. Tous droits réservés.</div>
        </div>
      </footer>
    </main>
  );
}
