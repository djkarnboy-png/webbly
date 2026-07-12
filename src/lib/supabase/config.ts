export function getSupabaseConfig() {
  const { url, publishableKey } = readSupabaseEnvironment();

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and a publishable or anon key.",
    );
  }

  return { url, publishableKey };
}

export function getSupabaseConfigStatus() {
  const { url, publishableKey } = readSupabaseEnvironment();

  return {
    hasUrl: Boolean(url),
    hasPublishableKey: Boolean(publishableKey),
  };
}

export function isSupabaseConfigured() {
  const { hasUrl, hasPublishableKey } = getSupabaseConfigStatus();
  return hasUrl && hasPublishableKey;
}

function readSupabaseEnvironment() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();

  return { url, publishableKey };
}
