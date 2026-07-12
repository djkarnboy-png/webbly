"use server";

import { friendlyAuthError, logAuthError } from "@/lib/auth-errors";
import {
  getEmailVerificationRedirectTo,
  getEmailVerificationState,
  RESEND_COOLDOWN_SECONDS,
  setResendAvailableAt,
} from "@/lib/auth-verification";
import { createClient } from "@/lib/supabase/server";

export type ResendVerificationState = {
  status: "idle" | "error" | "success";
  message: string;
  cooldownUntil: number;
  secondsRemaining: number;
};

export async function resendVerificationAction(
  _previousState: ResendVerificationState,
  _formData: FormData,
): Promise<ResendVerificationState> {
  void _previousState;
  void _formData;

  const { email, resendAvailableAt } = await getEmailVerificationState();
  const now = Date.now();

  if (!isEmail(email)) {
    return {
      status: "error",
      message: "Start signup again so we know where to send the verification email.",
      cooldownUntil: 0,
      secondsRemaining: 0,
    };
  }

  if (resendAvailableAt > now) {
    return {
      status: "error",
      message: "Please wait for the resend countdown to finish.",
      cooldownUntil: resendAvailableAt,
      secondsRemaining: Math.ceil((resendAvailableAt - now) / 1000),
    };
  }

  const emailRedirectTo = await getEmailVerificationRedirectTo();
  const cooldownUntil = now + RESEND_COOLDOWN_SECONDS * 1000;
  await setResendAvailableAt(cooldownUntil);

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo },
  });

  if (error) {
    logAuthError("resendVerificationAction", error);
    return {
      status: "error",
      message: friendlyAuthError(error),
      cooldownUntil,
      secondsRemaining: secondsUntil(cooldownUntil),
    };
  }

  return {
    status: "success",
    message: "A new verification email is on its way.",
    cooldownUntil,
    secondsRemaining: secondsUntil(cooldownUntil),
  };
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function secondsUntil(timestamp: number) {
  return Math.max(0, Math.ceil((timestamp - Date.now()) / 1000));
}
