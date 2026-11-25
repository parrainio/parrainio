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

export function applyVerifiedCorrections<T extends { slug: string }>(offer: T): T {
  const rules = CORRECTIONS[String(offer.slug)];
  if (!rules || typeof rules !== "object") return offer;

  let changed = false;
  const next: Record<string, unknown> = { ...offer };
  for (const [field, rule] of Object.entries(rules)) {
    if (!rule || typeof rule !== "object" || !("from" in rule)) continue;
    if (next[field] === rule.from) {
      next[field] = rule.to;
      changed = true;
    }
  }
  return changed ? (next as unknown as T) : offer;
}
