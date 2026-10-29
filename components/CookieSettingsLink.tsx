"use client";

import { COOKIE_SETTINGS_EVENT } from "@/lib/cookieConsent";

export default function CookieSettingsLink() {
  return (
    <a
      href="/confidentialite#cookies-traceurs"
      onClick={(event) => {
        event.preventDefault();
        window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
      }}
    >
      Gérer mes cookies
    </a>
  );
}
