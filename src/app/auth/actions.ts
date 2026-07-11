"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  status: "idle" | "error" | "success";
  message: string;
};

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getText(formData, "email").toLowerCase();
  const password = getText(formData, "password");
  const next = safeNextPath(getText(formData, "next"));

  if (!isEmail(email) || !password) {
    return { status: "error", message: "Enter a valid email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { status: "error", message: friendlyAuthError(error.message) };
  }

  revalidatePath("/", "layout");
  redirect(next || "/account");
}

export async function signupAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const fullName = getText(formData, "fullName");
  const email = getText(formData, "email").toLowerCase();
  const password = getText(formData, "password");
  const confirmPassword = getText(formData, "confirmPassword");
  const role = getText(formData, "role") === "creator" ? "creator" : "buyer";

  if (fullName.length < 2) {
    return { status: "error", message: "Enter your full name." };
  }
  if (!isEmail(email)) {
    return { status: "error", message: "Enter a valid email address." };
  }
  if (password.length < 8) {
    return { status: "error", message: "Use at least 8 characters for your password." };
  }
  if (password !== confirmPassword) {
    return { status: "error", message: "Passwords do not match." };
  }

  const headerStore = await headers();
  const origin =
    headerStore.get("origin") ??
    `${headerStore.get("x-forwarded-proto") ?? "https"}://${headerStore.get("host")}`;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: { full_name: fullName, role },
    },
  });

  if (error) {
    return { status: "error", message: friendlyAuthError(error.message) };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect(role === "creator" ? "/dashboard" : "/account");
  }

  return {
    status: "success",
    message: "Account created. Check your email to confirm your address, then log in.",
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

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function safeNextPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : "";
}

function friendlyAuthError(message: string) {
  if (message.toLowerCase().includes("invalid login")) {
    return "Email or password is incorrect.";
  }
  if (message.toLowerCase().includes("already registered")) {
    return "An account already exists for this email.";
  }
  return message;
}
