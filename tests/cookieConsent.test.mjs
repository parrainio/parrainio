import assert from "node:assert/strict";
import test from "node:test";
import {
  COOKIE_CONSENT_DURATION_MS,
  COOKIE_CONSENT_VERSION,
  createCookieConsentRecord,
  parseCookieConsentRecord,
} from "../lib/cookieConsent.ts";

test("records acceptance and refusal for the same exact 180-day duration", () => {
  const now = 1_800_000_000_000;
  const accepted = createCookieConsentRecord("accepted", now);
  const refused = createCookieConsentRecord("refused", now);

  for (const [decision, record] of [
    ["accepted", accepted],
    ["refused", refused],
  ]) {
    assert.equal(record.version, COOKIE_CONSENT_VERSION);
    assert.equal(record.decision, decision);
    assert.equal(record.decidedAt, now);
    assert.equal(record.expiresAt, now + 180 * 24 * 60 * 60 * 1000);
    assert.equal(record.expiresAt - record.decidedAt, COOKIE_CONSENT_DURATION_MS);
    assert.deepEqual(parseCookieConsentRecord(JSON.stringify(record), now), record);
  }
});

test("rejects expired, malformed, and outdated consent records", () => {
  const now = 1_800_000_000_000;
  const valid = createCookieConsentRecord("accepted", now);

  assert.equal(parseCookieConsentRecord(null, now), null);
  assert.equal(parseCookieConsentRecord("not-json", now), null);
  assert.equal(parseCookieConsentRecord(JSON.stringify(valid), valid.expiresAt), null);
  assert.equal(
    parseCookieConsentRecord(JSON.stringify({ ...valid, version: COOKIE_CONSENT_VERSION - 1 }), now),
    null,
  );
  assert.equal(parseCookieConsentRecord(JSON.stringify({ ...valid, decision: "maybe" }), now), null);
});

test("rejects records with invalid or excessive retention periods", () => {
  const now = 1_800_000_000_000;
  const valid = createCookieConsentRecord("refused", now);

  assert.equal(parseCookieConsentRecord(JSON.stringify({ ...valid, expiresAt: now }), now), null);
  assert.equal(
    parseCookieConsentRecord(
      JSON.stringify({ ...valid, expiresAt: now + COOKIE_CONSENT_DURATION_MS + 1 }),
      now,
    ),
    null,
  );
});
