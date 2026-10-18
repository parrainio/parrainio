"use client";

import { useState } from "react";
import { saveBoostedCampaignAction } from "@/app/admin/actions";
import type { BoostedCampaignConfig } from "@/data/boostedCampaign";

function localDateValue(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function CampaignSettings({ config }: { config: BoostedCampaignConfig }) {
  const [active, setActive] = useState(config.active);
  const [startAt, setStartAt] = useState(localDateValue(config.startAt));
  const [endAt, setEndAt] = useState(localDateValue(config.endAt));
  const [title, setTitle] = useState(config.title);
  const [headline, setHeadline] = useState(config.headline);
  const [durationLabel, setDurationLabel] = useState(config.durationLabel);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      await saveBoostedCampaignAction({
        ...config,
        active,
        startAt: startAt ? new Date(startAt).toISOString() : new Date().toISOString(),
        endAt: endAt ? new Date(endAt).toISOString() : null,
        title,
        headline,
        durationLabel,
      });
      setMessage("Paramètres de campagne enregistrés.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Enregistrement impossible.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section style={{ maxWidth: 900, margin: "0 auto 28px", padding: 20, border: "1px solid #d8e3db", borderRadius: 18, background: "#fff" }}>
      <h2 style={{ marginTop: 0, color: "#075846" }}>Campagne « Offres boostées du moment »</h2>
      <p>Les montants des cinq offres restent centralisés dans la configuration de campagne.</p>
      <label style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0" }}>
        <input checked={active} onChange={(event) => setActive(event.target.checked)} type="checkbox" />
        Campagne activée (la désactivation restaure immédiatement les reversements habituels)
      </label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>Nom de la campagne<input onChange={(event) => setTitle(event.target.value)} value={title} /></label>
        <label style={{ display: "grid", gap: 6 }}>Mention de commission<input onChange={(event) => setHeadline(event.target.value)} value={headline} /></label>
        <label style={{ display: "grid", gap: 6 }}>Mention de durée<input onChange={(event) => setDurationLabel(event.target.value)} value={durationLabel} /></label>
        <label style={{ display: "grid", gap: 6 }}>Début de campagne<input onChange={(event) => setStartAt(event.target.value)} type="datetime-local" value={startAt} /></label>
        <label style={{ display: "grid", gap: 6 }}>Fin de campagne (facultatif)<input onChange={(event) => setEndAt(event.target.value)} type="datetime-local" value={endAt} /></label>
      </div>
      <p style={{ color: "#71807d", fontSize: ".82rem" }}>Sans date de fin, la campagne reste active jusqu’à sa désactivation manuelle. Les reversements habituels sont conservés et rétablis en désactivant la campagne.</p>
      <button disabled={saving} onClick={save} style={{ minHeight: 42, marginTop: 8, padding: "0 18px", border: 0, borderRadius: 999, background: "#075846", color: "#fff", fontWeight: 800 }} type="button">{saving ? "Enregistrement…" : "Enregistrer la campagne"}</button>
      {message ? <p role="status">{message}</p> : null}
    </section>
  );
}
