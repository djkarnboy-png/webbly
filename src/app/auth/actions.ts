"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { friendlyAuthError, logAuthError } from "@/lib/auth-errors";
import { isStrongPassword } from "@/lib/auth-password";
import { safeNextPath } from "@/lib/auth-redirect";
import {
  clearEmailVerificationState,
  getEmailVerificationRedirectTo,
  RESEND_COOLDOWN_SECONDS,
  startEmailVerificationCooldown,
} from "@/lib/auth-verification";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  status: "idle" | "error" | "success";
  message: string;
  verification?: {
    email: string;
    resendCooldownSeconds: number;
  };
};

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getText(formData, "email").toLowerCase();
  const password = getRawText(formData, "password");
  const next = safeNextPath(getText(formData, "next"), "/account");

  if (!isEmail(email) || !password) {
    return { status: "error", message: "Enter a valid email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (isEmailNotConfirmedError(error)) {
      redirect(`/check-email?next=${encodeURIComponent(next)}`);
    }
    logAuthError("loginAction", error);
    return { status: "error", message: friendlyAuthError(error) };
  }

  await clearEmailVerificationState();
  revalidatePath("/", "layout");
  redirect(next);
}

export async function signupAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const fullName = getText(formData, "fullName");
  const email = getText(formData, "email").toLowerCase();
  const password = getRawText(formData, "password");
  const confirmPassword = getRawText(formData, "confirmPassword");
  const next = safeNextPath(getText(formData, "next"), "/account");

  if (fullName.length < 2) {
    return { status: "error", message: "Enter your full name." };
  }
  if (!isEmail(email)) {
    return { status: "error", message: "Enter a valid email address." };
  }
  if (!isStrongPassword(password)) {
    return {
      status: "error",
      message:
        "Use 8 or more characters with uppercase, lowercase, number, and special characters.",
    };
  }
  if (password !== confirmPassword) {
    return { status: "error", message: "Passwords do not match." };
  }

  const emailRedirectTo = await getEmailVerificationRedirectTo();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      data: { full_name: fullName, next },
    },
  });

  if (error) {
    logAuthError("signupAction", error);
    return { status: "error", message: friendlyAuthError(error) };
  }

  if (data.session) {
    await clearEmailVerificationState();
    revalidatePath("/", "layout");
    redirect(next);
  }

  await startEmailVerificationCooldown();

  return {
    status: "success",
    message: "Check your email to activate your account.",
    verification: {
      email,
      resendCooldownSeconds: RESEND_COOLDOWN_SECONDS,
    },
  };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getRawText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isEmailNotConfirmedError(error: { code?: string; message: string }) {
  return (
    error.code?.toLowerCase() === "email_not_confirmed" ||
    error.message.toLowerCase().includes("email not confirmed")
  );
}
