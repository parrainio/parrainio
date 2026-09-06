import Link from "next/link";
import FavoritesCount from "./FavoritesCount";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          <div>
            <Link href="/" className={styles.footerLogo}>
              <span className={styles.logoMark}>P</span>
              Parrainio
            </Link>
            <p>Le nouveau réflexe pour découvrir et profiter des offres de parrainage.</p>
          </div>

          <div>
            <h3>Découvrir</h3>
            <Link href="/offres">Les offres</Link>
            <Link href="/classement-primes-parrainage">Classement des primes</Link>
            <Link href="/avis-clients">Avis clients</Link>
            <Link href="/pourquoi-parrainio">Comment ça marche</Link>
            <Link href="/blog">Le blog</Link>
          </div>

          <div>
            <h3>Parrainio</h3>
            <Link href="/pourquoi-parrainio">Nos avantages</Link>
            <FavoritesCount />
            <a href="mailto:parrainage@parrainio.fr">Contact</a>
          </div>

          <div>
            <h3>Informations légales</h3>
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/confidentialite">Politique de confidentialité</Link>
            <Link href="/cgu">Conditions générales</Link>
          </div>
        </div>

        <div className={styles.footerBottom}>© 2026 Parrainio. Tous droits réservés.</div>
      </div>
    </footer>
  );
}