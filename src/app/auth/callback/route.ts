import { NextResponse } from "next/server";
import { logAuthError } from "@/lib/auth-errors";
import { clearEmailVerificationState } from "@/lib/auth-verification";
import { safeNextPath } from "@/lib/auth-redirect";
import { logSupabaseQueryError } from "@/lib/supabase/diagnostics";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNextPath(url.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      logAuthError("authCallback.exchangeCodeForSession", error);
      return verificationFailure(url.origin);
    }

    if (!data.session || !data.user) {
      console.error("[Webbly Auth]", {
        operation: "authCallback.exchangeCodeForSession",
        code: "SESSION_NOT_CREATED",
      });
      return verificationFailure(url.origin);
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      if (userError) {
        logAuthError("authCallback.getUser", userError);
      }
      return verificationFailure(url.origin);
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (profileError) {
      logSupabaseQueryError("authCallback.getProfileRole", profileError);
    }

    await clearEmailVerificationState();

    const destination = next || (profile?.role === "admin" ? "/admin" : "/account");

    return NextResponse.redirect(new URL(destination, url.origin));
  }

  return verificationFailure(url.origin);
}

function verificationFailure(origin: string) {
  const loginUrl = new URL("/login", origin);
  loginUrl.searchParams.set("error", "verification_failed");
  return NextResponse.redirect(loginUrl);
}
