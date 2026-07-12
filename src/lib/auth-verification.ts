import "server-only";

import { cookies, headers } from "next/headers";

const PRODUCTION_ORIGIN = "https://webbly-chi.vercel.app";
const RESEND_AVAILABLE_COOKIE = "webbly-verification-resend-at";
const VERIFICATION_COOKIE_MAX_AGE = 60 * 60;

export const RESEND_COOLDOWN_SECONDS = 60;

export async function getEmailVerificationRedirectTo(requestedOrigin = "") {
  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_ORIGIN;
  }

  const origin = await resolveAuthOrigin(requestedOrigin);
  return origin;
}

export async function startEmailVerificationCooldown() {
  const cookieStore = await cookies();
  const resendAvailableAt = Date.now() + RESEND_COOLDOWN_SECONDS * 1000;

  cookieStore.set(
    RESEND_AVAILABLE_COOKIE,
    String(resendAvailableAt),
    verificationCookieOptions(),
  );
}

export async function getEmailVerificationState() {
  const cookieStore = await cookies();
  const resendAvailableAt = Number(
    cookieStore.get(RESEND_AVAILABLE_COOKIE)?.value ?? 0,
  );
  const normalizedResendAvailableAt = Number.isFinite(resendAvailableAt)
    ? resendAvailableAt
    : 0;

  return {
    resendAvailableAt: normalizedResendAvailableAt,
    secondsRemaining: Math.max(
      0,
      Math.ceil((normalizedResendAvailableAt - Date.now()) / 1000),
    ),
  };
}

export async function setResendAvailableAt(timestamp: number) {
  const cookieStore = await cookies();
  cookieStore.set(
    RESEND_AVAILABLE_COOKIE,
    String(timestamp),
    verificationCookieOptions(),
  );
}

export async function clearEmailVerificationState() {
  const cookieStore = await cookies();
  cookieStore.delete(RESEND_AVAILABLE_COOKIE);
}

async function resolveAuthOrigin(requestedOrigin: string) {
  const headerStore = await headers();
  const forwardedHost = headerStore.get("x-forwarded-host")?.split(",")[0]?.trim();
  const forwardedProtocol =
    headerStore.get("x-forwarded-proto")?.split(",")[0]?.trim() ?? "https";
  const headerOrigin = headerStore.get("origin") ?? "";
  const forwardedOrigin = forwardedHost
    ? `${forwardedProtocol}://${forwardedHost}`
    : "";
  const allowedOrigins = new Set([
    PRODUCTION_ORIGIN,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]);

  if (process.env.VERCEL_URL) {
    allowedOrigins.add(`https://${process.env.VERCEL_URL}`);
  }

  for (const candidate of [requestedOrigin, headerOrigin, forwardedOrigin]) {
    const normalized = normalizeOrigin(candidate);
    if (normalized && allowedOrigins.has(normalized)) {
      return normalized;
    }
  }

  return process.env.NODE_ENV === "production"
    ? PRODUCTION_ORIGIN
    : "http://localhost:3000";
}

function normalizeOrigin(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.origin
      : "";
  } catch {
    return "";
  }
}

function verificationCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: VERIFICATION_COOKIE_MAX_AGE,
  };
}
