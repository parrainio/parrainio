import nodemailer, { type Transporter } from "nodemailer";

export const PARRAINIO_CONTACT_EMAIL = "parrainage@parrainio.fr";

type ParrainioMailer = { from: string; transporter: Transporter };

let cachedMailer: { signature: string; value: ParrainioMailer } | null = null;

/** Shared SMTP transport for Parrainio's existing contact mail flows. */
export function createParrainioMailer() {
  const { SMTP_HOST: host, SMTP_PORT: rawPort, SMTP_USER: user, SMTP_PASSWORD: password } = process.env;
  const port = Number(rawPort);

  if (!host || !rawPort || !Number.isInteger(port) || port < 1 || port > 65535 || !user || !password) {
    return null;
  }

  const signature = JSON.stringify([host, port, user, password]);
  if (cachedMailer?.signature === signature) return cachedMailer.value;

  cachedMailer?.value.transporter.close();
  const value: ParrainioMailer = {
    from: user,
    transporter: nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass: password },
      pool: true,
      maxConnections: 2,
      maxMessages: 100,
    }),
  };
  cachedMailer = { signature, value };
  return value;
}
