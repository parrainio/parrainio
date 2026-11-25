/**
 * Échéances des campagnes partenaires affichées sur le site.
 *
 * Chaque campagne est décrite par sa date de fin (incluse, heure de Paris) et
 * par les formulations publiques à remplacer une fois l'échéance passée. Le
 * texte de remplacement se contente de constater la fin de la campagne : il
 * n'invente ni nouvelle date ni nouveau montant.
 *
 * Les règles sont appliquées à la lecture (offres gérées et profils SEO), donc
 * aucune page ne peut continuer à présenter une date dépassée comme active.
 */
type CampaignRule = {
  /** Date de fin incluse, au format AAAA-MM-JJ (heure de Paris). */
  end: string;
  replacements: { from: string; to: string }[];
};

const RULES: Record<string, CampaignRule> = {
  bnp: {
    end: "2026-11-26",
    replacements: [
      {
        from: "L'annonce indique une validité jusqu'au 26 novembre 2026.",
        to: "L'annonce indiquait une validité jusqu'au 26 novembre 2026 ; cette campagne est terminée, vérifiez la campagne en cours avant de vous inscrire.",
      },
      {
        from: "L'annonce du parrain indique une validité jusqu'au 26 novembre 2026.",
        to: "L'annonce du parrain indiquait une validité jusqu'au 26 novembre 2026 ; cette campagne est terminée, vérifiez la campagne en cours avant de vous inscrire.",
      },
    ],
  },
  fortuneo: {
    end: "2026-11-30",
    replacements: [
      { from: " — campagne du 1er au 30/11/2026", to: "" },
      {
        from: "campagne cartes en cours du 1er au 30 novembre 2026",
        to: "campagne cartes du 1er au 30 novembre 2026, désormais terminée",
      },
      {
        from: "La campagne cartes de novembre est valable jusqu’au 30 novembre 2026",
        to: "La campagne cartes de novembre était valable jusqu’au 30 novembre 2026",
      },
      {
        from: "pendant la campagne du 1er au 30 novembre 2026",
        to: "pendant la campagne du 1er au 30 novembre 2026, désormais terminée",
      },
      {
        from: "La campagne court jusqu'au 30 novembre 2026",
        to: "La campagne a couru jusqu'au 30 novembre 2026",
      },
    ],
  },
  "maisons-pierre": {
    end: "2026-11-30",
    replacements: [
      {
        from: "L'annonce indique une période d'enregistrement du 23 octobre au 30 novembre 2026.",
        to: "L'annonce indiquait une période d'enregistrement du 23 octobre au 30 novembre 2026 ; cette période est terminée, vérifiez la campagne en cours avant de vous inscrire.",
      },
    ],
  },
};

/** Vrai lorsque la campagne est terminée (fin incluse). */
export function isCampaignOver(slug: string, now: number = Date.now()): boolean {
  const rule = RULES[slug];
  if (!rule) return false;
  return now >= Date.parse(`${rule.end}T23:59:59+01:00`);
}

/** Remplace les formulations devenues fausses après l'échéance. */
export function adaptCampaignText(
  text: string,
  slug: string,
  now: number = Date.now(),
): string {
  const rule = RULES[slug];
  if (!rule || !isCampaignOver(slug, now)) return text;
  return rule.replacements.reduce(
    (value, { from, to }) => value.split(from).join(to),
    text,
  );
}

/**
 * Applique la même adaptation à une structure de données publique (profil SEO,
 * conditions, étapes…) sans en modifier les autres champs.
 */
export function adaptCampaignDeep<T>(value: T, slug: string, now: number = Date.now()): T {
  if (!isCampaignOver(slug, now)) return value;
  const walk = (node: unknown): unknown => {
    if (typeof node === "string") return adaptCampaignText(node, slug, now);
    if (Array.isArray(node)) return node.map(walk);
    if (node && typeof node === "object") {
      return Object.fromEntries(
        Object.entries(node as Record<string, unknown>).map(([key, child]) => [key, walk(child)]),
      );
    }
    return node;
  };
  return walk(value) as T;
}
