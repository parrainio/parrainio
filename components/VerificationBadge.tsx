import { getCurrentPeriodLabel } from "@/lib/currentPeriod";
import styles from "./VerificationBadge.module.css";

/**
 * Automatic freshness indicator for offer pages.
 * Renders the current month/year at request time — nothing to update monthly,
 * no client JS, no hooks → SSR output and hydrated DOM are identical.
 */
export default function VerificationBadge() {
  return (
    <p className={styles.verificationBadge}>
      <span className={styles.check} aria-hidden="true">✓</span>
      Offre et conditions vérifiées en {getCurrentPeriodLabel()}
    </p>
  );
}
