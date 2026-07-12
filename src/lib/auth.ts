import "server-only";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ProfileRow } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

export type Viewer = {
  id: string;
  email: string;
  fullName: string;
  role: "buyer" | "creator" | "admin";
  avatarUrl: string | null;
};

export async function getViewer(): Promise<Viewer | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const userId = typeof claims?.sub === "string" ? claims.sub : null;

  if (!userId) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  const email = typeof claims?.email === "string" ? claims.email : "";
  const role = normalizeRole(profile?.role);

  return {
    id: userId,
    email,
    fullName: profile?.full_name || email.split("@")[0] || "Webbly user",
    role,
    avatarUrl: profile?.avatar_url ?? null,
  };
}

export async function requireViewer(nextPath = "/account") {
  const viewer = await getViewer();

  if (!viewer) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return viewer;
}

export async function requireVerifiedViewer(nextPath = "/account") {
  const viewer = await requireViewer(nextPath);
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  if (!data.user.email_confirmed_at) {
    redirect("/check-email");
  }

  return viewer;
}

export async function requireRole(
  roles: Viewer["role"][],
  nextPath: string,
) {
  const viewer = await requireViewer(nextPath);

  if (!roles.includes(viewer.role)) {
    return { viewer, allowed: false as const };
  }

  return { viewer, allowed: true as const };
}

export async function getProfile(userId: string): Promise<ProfileRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return data;
}

function normalizeRole(role?: string): Viewer["role"] {
  if (role === "creator" || role === "admin") {
    return role;
  }
  return "buyer";
}
