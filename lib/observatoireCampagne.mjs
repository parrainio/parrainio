/**
 * Statut des campagnes datées de l'observatoire.
 *
 * Une campagne reste ouverte jusqu'à la fin de sa journée de clôture. Passé
 * cette date, elle est annoncée comme terminée : aucune prolongation n'est
 * déduite d'une nouvelle lecture de la page officielle. Sans date de fin, on ne
 * conclut ni à une clôture ni à une reconduction.
 *
 * @typedef {{ libelle: string, finLe: string }} Campagne
 */

/**
 * Date du jour à Paris (AAAA-MM-JJ), comparable aux dates du JSON.
 *
 * @param {Date} [now]
 * @returns {string}
 */
export function dateDuJourParis(now = new Date()) {
  return new Intl.DateTimeFormat("fr-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/**
 * @param {Campagne | null | undefined} campagne
 * @param {string} [today] date ISO de référence
 * @returns {boolean} vrai tant que la fin de campagne n'est pas dépassée
 */
export function campagneActive(campagne, today = dateDuJourParis()) {
  if (!campagne || !campagne.finLe) return true;
  return today <= campagne.finLe;
}

/**
 * Libellé affichable : la date de fin est toujours écrite, jamais implicite.
 *
 * @param {Campagne} campagne
 * @param {string} [today] date ISO de référence
 * @returns {string}
 */
export function campagneLabel(campagne, today = dateDuJourParis()) {
  const fin = campagne.finLe.split("-").reverse().join("/");
  return campagneActive(campagne, today) ? `Campagne jusqu’au ${fin}` : `Campagne terminée le ${fin}`;
}
