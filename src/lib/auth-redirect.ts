const INTERNAL_ORIGIN = "https://webbly.internal";

export const AUTH_REQUIRED_REASON = "auth_required";
export const AUTH_REQUIRED_MESSAGE =
  "Please log in or create an account to continue.";
export const AUTH_ACTION_PARAM = "authAction";

export type AuthAction = "request" | "save";

export function safeNextPath(value: string | null | undefined, fallback = "") {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return fallback;
  }

  try {
    const url = new URL(value, INTERNAL_ORIGIN);
    if (url.origin !== INTERNAL_ORIGIN) {
      return fallback;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function loginPathFor(nextPath: string) {
  const next = safeNextPath(nextPath, "/account");
  const search = new URLSearchParams({
    reason: AUTH_REQUIRED_REASON,
    next,
  });
  return `/login?${search.toString()}`;
}

export function verificationPathFor(nextPath: string) {
  const next = safeNextPath(nextPath, "/account");
  return `/check-email?next=${encodeURIComponent(next)}`;
}

export function withAuthAction(
  currentPath: string,
  action: AuthAction,
  values: Record<string, string | undefined> = {},
) {
  const url = new URL(safeNextPath(currentPath, "/"), INTERNAL_ORIGIN);
  url.searchParams.set(AUTH_ACTION_PARAM, action);

  for (const [key, value] of Object.entries(values)) {
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

export function withoutAuthAction(currentPath: string) {
  const url = new URL(safeNextPath(currentPath, "/"), INTERNAL_ORIGIN);
  const action = url.searchParams.get(AUTH_ACTION_PARAM);
  url.searchParams.delete(AUTH_ACTION_PARAM);

  if (action === "request") {
    for (const key of [
      "requestType",
      "templateName",
      "creatorName",
      "templateId",
      "creatorId",
    ]) {
      url.searchParams.delete(key);
    }
  } else if (action === "save") {
    url.searchParams.delete("templateId");
  }

  return `${url.pathname}${url.search}${url.hash}`;
}
