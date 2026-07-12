import { NextResponse } from "next/server";
import { logAuthError } from "@/lib/auth-errors";
import { clearEmailVerificationState } from "@/lib/auth-verification";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash")?.trim() ?? "";
  const type = url.searchParams.get("type");

  if (!isValidTokenHash(tokenHash) || type !== "email") {
    return verificationResult(url.origin, false);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: "email",
  });

  if (error || !data.session || !data.user) {
    if (error) {
      logAuthError("authConfirm.verifyOtp", error);
    }
    return verificationResult(url.origin, false);
  }

  await clearEmailVerificationState();
  return verificationResult(url.origin, true);
}

function isValidTokenHash(value: string) {
  return (
    value.length >= 32 &&
    value.length <= 512 &&
    /^[A-Za-z0-9_-]+$/.test(value)
  );
}

function verificationResult(origin: string, success: boolean) {
  const destination = new URL("/verified", origin);

  if (success) {
    destination.searchParams.set("success", "true");
  } else {
    destination.searchParams.set("error", "invalid_or_expired");
  }

  return NextResponse.redirect(destination);
}
