import nodemailer, { type Transporter } from "nodemailer";

export const PARRAINIO_CONTACT_EMAIL = "parrainage@parrainio.fr";

type ParrainioMailer = { from: string; transporter: Transporter };

let cachedMailer: { signature: string; value: ParrainioMailer } | null = null;

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

/**
 * Shared SMTP transport for Parrainio's existing contact mail flows.
 *
 * Production values (boîte OVHcloud `parrainage@parrainio.fr`) :
 *   SMTP_HOST=ssl0.ovh.net  SMTP_PORT=465  SMTP_USER=<adresse complète>
 *   SMTP_PASSWORD=<mot de passe de la boîte>
 *
 * Sécurité : le certificat TLS est toujours vérifié (jamais de
 * `rejectUnauthorized: false`) ; hors port 465, STARTTLS est exigé pour
 * qu'un mot de passe ne circule jamais en clair (sauf serveur de test local).
 * `debug`/`logger` restent désactivés : la transcription SMTP contient les
 * échanges AUTH.
 */
export function createParrainioMailer() {
  const { SMTP_HOST: host, SMTP_PORT: rawPort, SMTP_USER: user, SMTP_PASSWORD: password } = process.env;
  const port = Number(rawPort);

  if (!host || !rawPort || !Number.isInteger(port) || port < 1 || port > 65535 || !user || !password) {
    return null;
  }

  const signature = JSON.stringify([host, port, user, password]);
  if (cachedMailer?.signature === signature) return cachedMailer.value;

  cachedMailer?.value.transporter.close();
  const implicitTls = port === 465;
  const local = LOOPBACK_HOSTS.has(host.toLowerCase());
  const value: ParrainioMailer = {
    from: user,
    transporter: nodemailer.createTransport({
      host,
      port,
      secure: implicitTls,
      requireTLS: !implicitTls && !local,
      tls: { minVersion: "TLSv1.2" },
      auth: { user, pass: password },
      pool: true,
      maxConnections: 2,
      maxMessages: 100,
      logger: false,
      debug: false,
    }),
  };
  cachedMailer = { signature, value };
  return value;
}
