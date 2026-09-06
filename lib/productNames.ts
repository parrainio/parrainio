/**
 * Libellés d'affichage des noms de produits — TRANSFORMATION D'AFFICHAGE
 * UNIQUEMENT. Les valeurs internes (offer-overrides.json, scripts métier)
 * restent inchangées (« FOSFO », « GOLD ») : aucune clé, slug, condition,
 * calcul ou donnée métier n'est modifié.
 */

/** Token interne → libellé public. Étendre au besoin (BoursoBank FREE…). */
const PRODUCT_DISPLAY_LABELS: Record<string, string> = {
  FOSFO: "Fosfo",
  GOLD: "Gold",
};

/**
 * Met en forme une chaîne de reversement pour l'affichage public :
 * « FOSFO : 17,50 € ; GOLD : 27 € » → « Fosfo : 17,50 € ; Gold : 27 € ».
 * Les montants sont recopiés tels quels depuis la source de vérité.
 */
export function formatProductNames(text: string | null | undefined): string {
  if (!text) return "";
  return text.replace(/\b(FOSFO|GOLD)\b/g, (token) => PRODUCT_DISPLAY_LABELS[token] ?? token);
}

export type ProductReverse = { label: string; amount: string };

/**
 * Parse strict d'une donnée reversement multi-produits :
 * « FOSFO : 17,50 € ; GOLD : 27 € » → [{ label: "Fosfo", amount: "17,50 €" },
 * { label: "Gold", amount: "27 €" }].
 *
 * AUCUN calcul, fusion ou invention : les montants sont recopiés verbatim.
 * Retourne `null` si la donnée ne correspond pas à ce format (les autres
 * affichages utiliseront alors la chaîne source formatée via
 * formatProductNames). Les libellés internes restent inchangés.
 */
export function parseProductReverses(text: string): ProductReverse[] | null {
  const parts = text.split(";").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) return null;
  const products: ProductReverse[] = [];
  for (const part of parts) {
    const match = part.match(/^\s*([A-ZÀ-Ü]{2,}[A-ZÀ-Ü\s'-]*?)\s*:\s*(.+?)\s*$/);
    if (!match) return null;
    const token = match[1].trim();
    products.push({
      label: PRODUCT_DISPLAY_LABELS[token] ?? token,
      amount: match[2],
    });
  }
  return products.length >= 2 ? products : null;
}
