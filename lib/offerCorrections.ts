import corrections from "@/data/verified-offer-corrections.json";

/**
 * Corrections vérifiées appliquées après la fusion des sources (dont le KV
 * d'administration, qui prime normalement sur les fichiers Git).
 *
 * Chaque correction est conditionnée à la valeur publiée : elle ne s'applique
 * que si le champ contient encore exactement l'ancienne valeur obsolète. Dès
 * qu'un administrateur publie une autre valeur, la correction ne fait plus
 * rien — aucune donnée de gestion n'est figée dans le code.
 */
type Correction = { from: string | null; to: string | null };
type Corrections = Record<string, Record<string, Correction> | string>;

const CORRECTIONS = corrections as unknown as Corrections;

/**
 * Un code de parrainage ne peut pas être une adresse e-mail ni une consigne
 * du type « écrivez à … » : ces valeurs proviennent d'anciennes saisies
 * d'administration et ne doivent jamais être rendues comme un code, ni
 * sérialisées dans les pages publiques.
 */
const EMAIL_LIKE_CODE = /@|mail\s*:/i;

export function applyVerifiedCorrections<T extends { slug: string }>(offer: T): T {
  const rules = CORRECTIONS[String(offer.slug)];
  let changed = false;
  const next: Record<string, unknown> = { ...offer };

  // Le garde-fou s'applique à toutes les offres, y compris celles qui n'ont
  // plus de règle de correction : une valeur saisie dans l'admin ne doit
  // jamais être publiée comme un code si c'est une adresse ou une consigne.
  const code = next.referralCode;
  if (typeof code === "string" && EMAIL_LIKE_CODE.test(code)) {
    next.referralCode = null;
    changed = true;
  }

  if (!rules || typeof rules !== "object") {
    return changed ? (next as unknown as T) : offer;
  }

  for (const [field, rule] of Object.entries(rules)) {
    if (!rule || typeof rule !== "object" || !("from" in rule)) continue;
    if (next[field] === rule.from) {
      next[field] = rule.to;
      changed = true;
    }
  }
  return changed ? (next as unknown as T) : offer;
}
