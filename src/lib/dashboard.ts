import "server-only";

import type {
  CreatorRow,
  TemplateRow,
  WebsiteRequestRow,
} from "@/lib/supabase/database.types";
import type { Viewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type DashboardRequest = WebsiteRequestRow & {
  templateTitle: string | null;
};

export type CreatorDashboardData = {
  creator: CreatorRow | null;
  templates: TemplateRow[];
  requests: DashboardRequest[];
  error: string | null;
};

export async function getCreatorByProfileId(profileId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("creators")
    .select("*")
    .eq("profile_id", profileId)
    .maybeSingle();

  return { data, error: error?.message ?? null };
}

export async function ensureCreatorByProfile(viewer: Viewer) {
  const existing = await getCreatorByProfileId(viewer.id);

  if (existing.data) {
    return existing;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("creators")
    .insert({
      profile_id: viewer.id,
      display_name: viewer.fullName,
      email: viewer.email || null,
      role_title: "Website designer",
      bio: null,
    })
    .select("*")
    .single();

  if (!error) {
    return { data, error: null };
  }

  if (error.code === "23505") {
    return getCreatorByProfileId(viewer.id);
  }

  console.error("[Webbly Listing Setup]", { code: error.code });
  return { data: null, error: "Could not prepare your listing profile." };
}

export async function getCreatorDashboardData(
  profileId: string,
): Promise<CreatorDashboardData> {
  const supabase = await createClient();
  const { data: creator, error: creatorError } = await supabase
    .from("creators")
    .select("*")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (creatorError || !creator) {
    return {
      creator: creator ?? null,
      templates: [],
      requests: [],
      error: creatorError?.message ?? null,
    };
  }

  const { data: templates, error: templatesError } = await supabase
    .from("templates")
    .select("*")
    .eq("creator_id", creator.id)
    .order("updated_at", { ascending: false });

  const { data: requests, error: requestsError } = await supabase
    .from("website_requests")
    .select("*")
    .eq("creator_id", creator.id)
    .order("created_at", { ascending: false });

  const templateTitleById = new Map(
    (templates ?? []).map((template) => [template.id, template.title]),
  );

  return {
    creator,
    templates: templates ?? [],
    requests: (requests ?? []).map((request) => ({
      ...request,
      templateTitle: request.template_id
        ? templateTitleById.get(request.template_id) ?? null
        : null,
    })),
    error: templatesError?.message ?? requestsError?.message ?? null,
  };
}

export async function getOwnedTemplate(profileId: string, templateId: string) {
  const { data: creator } = await getCreatorByProfileId(profileId);

  if (!creator) {
    return null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("templates")
    .select("*")
    .eq("id", templateId)
    .eq("creator_id", creator.id)
    .maybeSingle();

  return data;
}
