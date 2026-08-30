const blockedHosts = ["super-parrain.com", "parrainage.co"];

export function isBlockedReferralUrl(url: string | null | undefined) {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return blockedHosts.some((blocked) => host === blocked || host.endsWith(`.${blocked}`));
  } catch {
    return /super-parrain|parrainage\.co/i.test(url);
  }
}

export function getSafeReferralUrl(url: string | null | undefined) {
  if (!url || url === "#") return null;
  return isBlockedReferralUrl(url) ? null : url;
}
