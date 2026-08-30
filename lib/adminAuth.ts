import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "parrainio_admin";

function secret() {
  return process.env.PARRAINIO_ADMIN_SESSION_SECRET ?? process.env.PARRAINIO_ADMIN_PASSWORD ?? "";
}

function tokenFor(password: string) {
  return createHmac("sha256", secret()).update(password).digest("hex");
}

export function adminAuthConfigured() {
  return Boolean(process.env.PARRAINIO_ADMIN_PASSWORD && secret());
}

export function validAdminPassword(password: string) {
  const configured = process.env.PARRAINIO_ADMIN_PASSWORD;
  if (!configured || !secret()) return false;
  const supplied = Buffer.from(password);
  const expected = Buffer.from(configured);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export async function isAdminAuthenticated() {
  if (!adminAuthConfigured()) return false;
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return false;
  const expected = tokenFor(process.env.PARRAINIO_ADMIN_PASSWORD!);
  return token.length === expected.length && timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export async function setAdminSession() {
  (await cookies()).set(cookieName, tokenFor(process.env.PARRAINIO_ADMIN_PASSWORD!), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSession() {
  (await cookies()).delete({
    name: cookieName,
    path: "/admin",
  });
}

export { cookieName as adminCookieName };
