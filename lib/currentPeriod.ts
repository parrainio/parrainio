/**
 * Current-period helper for freshness indicators (« Site mis à jour en … »,
 * « Offre et conditions vérifiées en … »).
 *
 * Single source of truth for the displayed month/year. Purely presentational:
 * this must NEVER feed sitemap lastmod, dateModified/datePublished, metadata
 * or structured data — those keep their real editorial dates.
 *
 * Timezone: the site targets France, so the current month is resolved in
 * Europe/Paris regardless of the server's local timezone. Using `Intl` with
 * an explicit timeZone keeps the result identical on the server and after
 * hydration (no hydration mismatch, no UTC-vs-Paris month-boundary drift).
 */

const MONTHS_FR = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
] as const;

export const SITE_TIME_ZONE = "Europe/Paris";

/** Year part of "now" in the site timezone, e.g. 2026. */
export function getCurrentYear(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("fr-FR", { timeZone: SITE_TIME_ZONE, year: "numeric" }).format(now);
}

/**
 * Current month in French (lowercase) resolved in Europe/Paris,
 * e.g. "septembre", "février", "août".
 */
export function getCurrentMonthFr(now: Date = new Date()): string {
  const monthIndex = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: SITE_TIME_ZONE, month: "numeric" }).format(now)
  ) - 1;
  return MONTHS_FR[monthIndex];
}

/**
 * "septembre 2026" for the current instant in Europe/Paris.
 * Calendar-roll testable via the `now` parameter.
 */
export function getCurrentPeriodLabel(now: Date = new Date()): string {
  return `${getCurrentMonthFr(now)} ${getCurrentYear(now)}`;
}
