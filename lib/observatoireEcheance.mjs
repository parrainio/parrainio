/**
 * Calcul de l'échéance « au plus tard » à partir du délai publié par une banque.
 * Aucune estimation n'est produite quand le délai n'est pas chiffré.
 *
 * @typedef {{ valeur: number, unite: "jours" | "jours_ouvres" | "mois" }} DelaiStructure
 */

/**
 * @param {DelaiStructure | null | undefined} structure
 * @param {string} dateISO date de départ (AAAA-MM-JJ)
 * @returns {Date | null}
 */
export function echeanceAuPlusTard(structure, dateISO) {
  if (!structure) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateISO));
  if (!match) return null;
  const [, y, m, d] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12));
  // Rejette les dates qui débordent (2026-13-40 deviendrait avril 2027).
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;

  if (structure.unite === "mois") {
    const target = new Date(date.getTime());
    const day = target.getUTCDate();
    target.setUTCDate(1);
    target.setUTCMonth(target.getUTCMonth() + structure.valeur);
    const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
    target.setUTCDate(Math.min(day, lastDay));
    return target;
  }

  if (structure.unite === "jours") {
    return new Date(date.getTime() + structure.valeur * 86_400_000);
  }

  // Jours ouvrés : lundi à vendredi, jours fériés non pris en compte.
  let remaining = structure.valeur;
  const cursor = new Date(date.getTime());
  while (remaining > 0) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const weekday = cursor.getUTCDay();
    if (weekday !== 0 && weekday !== 6) remaining -= 1;
  }
  return cursor;
}

/**
 * @param {Date} date
 * @returns {string} date lisible en français, en UTC
 */
export function formatDateFr(date) {
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
