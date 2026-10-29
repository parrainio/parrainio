export const COOKIE_CONSENT_KEY = "parrainio_cookie_consent";
export const COOKIE_CONSENT_VERSION = 1;
export const COOKIE_CONSENT_DURATION_MS = 180 * 24 * 60 * 60 * 1000;
export const COOKIE_SETTINGS_EVENT = "parrainio:open-cookie-settings";
export const COOKIE_CONSENT_UPDATED_EVENT = "parrainio:cookie-consent-updated";
export const COOKIE_STORAGE_ERROR = "__parrainio_cookie_storage_error__";

export type CookieConsentDecision = "accepted" | "refused";

export type CookieConsentRecord = {
  version: typeof COOKIE_CONSENT_VERSION;
  decision: CookieConsentDecision;
  decidedAt: number;
  expiresAt: number;
};

export function subscribeToCookieConsent(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, onChange);
  };
}

export function getCookieConsentSnapshot() {
  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY) ?? "";
    return stored && !parseCookieConsentRecord(stored) ? `${stored}__expired_or_invalid` : stored;
  } catch {
    return COOKIE_STORAGE_ERROR;
  }
}

export function getServerCookieConsentSnapshot() {
  return null;
}

export function createCookieConsentRecord(
  decision: CookieConsentDecision,
  now = Date.now(),
): CookieConsentRecord {
  return {
    version: COOKIE_CONSENT_VERSION,
    decision,
    decidedAt: now,
    expiresAt: now + COOKIE_CONSENT_DURATION_MS,
  };
}

export function parseCookieConsentRecord(
  value: string | null,
  now = Date.now(),
): CookieConsentRecord | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") return null;

    const record = parsed as Partial<CookieConsentRecord>;
    if (
      record.version !== COOKIE_CONSENT_VERSION ||
      (record.decision !== "accepted" && record.decision !== "refused") ||
      typeof record.decidedAt !== "number" ||
      !Number.isFinite(record.decidedAt) ||
      typeof record.expiresAt !== "number" ||
      !Number.isFinite(record.expiresAt) ||
      record.expiresAt <= now ||
      record.expiresAt <= record.decidedAt ||
      record.expiresAt - record.decidedAt > COOKIE_CONSENT_DURATION_MS
    ) {
      return null;
    }

    return record as CookieConsentRecord;
  } catch {
    return null;
  }
}
