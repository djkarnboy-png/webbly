import "server-only";

type SupabaseErrorLike = {
  code?: unknown;
  message?: unknown;
  details?: unknown;
  hint?: unknown;
};

const MAX_LOG_VALUE_LENGTH = 500;

export function logSupabaseConfigurationError(
  operation: string,
  status: { hasUrl: boolean; hasPublishableKey: boolean },
) {
  console.error("[Webbly Supabase]", {
    operation,
    code: "SUPABASE_CONFIG_MISSING",
    message: "Required Supabase environment variables are not configured.",
    ...status,
  });
}

export function logSupabaseQueryError(operation: string, error: unknown) {
  const candidate = (error ?? {}) as SupabaseErrorLike;

  console.error("[Webbly Supabase]", {
    operation,
    code: safeLogValue(candidate.code) ?? "SUPABASE_QUERY_FAILED",
    message: safeLogValue(candidate.message) ?? "Unknown Supabase query error.",
    details: safeLogValue(candidate.details),
    hint: safeLogValue(candidate.hint),
  });
}

function safeLogValue(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }

  return value
    .replace(/sb_(?:publishable|secret)_[A-Za-z0-9._-]+/gi, "[redacted]")
    .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, "[redacted]")
    .replace(/(apikey|authorization)\s*[=:]\s*\S+/gi, "$1=[redacted]")
    .slice(0, MAX_LOG_VALUE_LENGTH);
}
