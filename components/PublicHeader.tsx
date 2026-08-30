import Link from "next/link";
import { offers } from "@/data/offers";
import CategoryMenu from "./CategoryMenu";
import styles from "./PublicHeader.module.css";

type PublicHeaderProps = { active?: "home" | "offers" | "how" | "faq" | "advantages" };

export default function PublicHeader({ active }: PublicHeaderProps) {
  const categories = Array.from(new Set(offers.map((offer) => offer.categoryGroup)));
  const links = [
    ["home", "Accueil", "/"],
    ["offers", "Offres", "/offres"],
    ["how", "Comment ça marche", "/comment-ca-marche"],
    ["faq", "FAQ", "/#faq"],
    ["advantages", "Nos avantages", "/nos-avantages"],
  ] as const;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <Link href="/" className={styles.logo} aria-label="Parrainio, accueil"><span className={styles.logoMark}>P</span><span>Parrainio</span></Link>
          <nav className={styles.nav} aria-label="Navigation principale">
            {links.slice(0, 1).map(([key, label, href]) => <Link key={key} href={href} className={active === key ? styles.active : ""}>{label}</Link>)}
            <CategoryMenu categories={categories} />
            {links.slice(1).map(([key, label, href]) => <Link key={key} href={href} className={active === key ? styles.active : ""}>{label}</Link>)}
          </nav>
          <Link href="/offres" className={styles.cta}>Voir les offres <span>→</span></Link>
        </div>

      </div>
    </header>
  );
}
