import Link from "next/link";
import styles from "./ParrainioReverseRequest.module.css";

function CheckIcon() {
  return <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4.2 4.2L19 6.5" /></svg>;
}

export default function ParrainioReverseRequest({ offerSlug }: { offerSlug: string }) {
  return (
    <section className={styles.section} aria-labelledby={`reverse-request-${offerSlug}`}>
      <h2 id={`reverse-request-${offerSlug}`}><CheckIcon />Parrainage terminé ?</h2>
      <p>Vous avez finalisé votre inscription chez le partenaire ? Envoyez-nous votre demande de reverse.</p>
      <Link href={`/demander-ma-reverse/${offerSlug}`} className={styles.button}>Demander ma reverse →</Link>
      <small>Une fois votre parrainage validé, nous vérifions votre demande avant le versement de votre reverse.</small>
    </section>
  );
}
