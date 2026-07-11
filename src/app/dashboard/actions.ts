"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCreatorByProfileId } from "@/lib/dashboard";
import { requireViewer } from "@/lib/auth";
import { categories } from "@/data/categories";
import type { TemplateRow } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

const requestStatuses = [
  "new",
  "contacted",
  "in_progress",
  "completed",
  "declined",
] as const;

export type TemplateFormState = {
  status: "idle" | "error" | "success";
  message: string;
};

export async function createTemplateAction(
  _previousState: TemplateFormState,
  formData: FormData,
): Promise<TemplateFormState> {
  const viewer = await requireCreator("/dashboard/templates/new");
  const creator = await requireCreatorProfile(viewer.id);
  const parsed = parseTemplateForm(formData);

  if (!parsed.ok) {
    return { status: "error", message: parsed.error };
  }

  const supabase = await createClient();
  const previewImage = await resolvePreviewImage(formData, viewer.id, supabase);

  if (previewImage.error) {
    return { status: "error", message: previewImage.error };
  }

  const slug = `${slugify(parsed.values.title)}-${Date.now().toString().slice(-6)}`;
  const { error } = await supabase.from("templates").insert({
    ...parsed.values,
    slug,
    creator_id: creator.id,
    preview_image_url: previewImage.url,
    status: "pending",
    is_featured: false,
  });

  if (error) {
    console.error("Failed to create Webbly template", error.code);
    return { status: "error", message: "We could not save this template. Please try again." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?submitted=1");
}

export async function updateTemplateAction(
  templateId: string,
  _previousState: TemplateFormState,
  formData: FormData,
): Promise<TemplateFormState> {
  const viewer = await requireCreator(`/dashboard/templates/${templateId}/edit`);
  const creator = await requireCreatorProfile(viewer.id);
  const parsed = parseTemplateForm(formData);

  if (!parsed.ok) {
    return { status: "error", message: parsed.error };
  }

  const supabase = await createClient();
  const { data: current } = await supabase
    .from("templates")
    .select("id, preview_image_url")
    .eq("id", templateId)
    .eq("creator_id", creator.id)
    .maybeSingle();

  if (!current) {
    return { status: "error", message: "Template not found." };
  }

  const previewImage = await resolvePreviewImage(
    formData,
    viewer.id,
    supabase,
    current.preview_image_url,
  );

  if (previewImage.error) {
    return { status: "error", message: previewImage.error };
  }

  const { error } = await supabase
    .from("templates")
    .update({
      ...parsed.values,
      preview_image_url: previewImage.url,
      status: "pending",
      is_featured: false,
    })
    .eq("id", templateId)
    .eq("creator_id", creator.id);

  if (error) {
    return { status: "error", message: "We could not update this template." };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/templates/${templateId}/edit`);
  redirect("/dashboard?submitted=1");
}

export async function archiveTemplateAction(templateId: string) {
  const viewer = await requireCreator("/dashboard");
  const creator = await requireCreatorProfile(viewer.id);
  const supabase = await createClient();
  const { error } = await supabase
    .from("templates")
    .update({ status: "archived", is_featured: false })
    .eq("id", templateId)
    .eq("creator_id", creator.id);

  revalidatePath("/dashboard");
  return { success: !error, message: error ? "Could not archive template." : "Template archived." };
}

export async function deleteTemplateAction(templateId: string) {
  const viewer = await requireCreator("/dashboard");
  const creator = await requireCreatorProfile(viewer.id);
  const supabase = await createClient();
  const { error } = await supabase
    .from("templates")
    .delete()
    .eq("id", templateId)
    .eq("creator_id", creator.id);

  revalidatePath("/dashboard");
  return { success: !error, message: error ? "Could not delete template." : "Template deleted." };
}

export async function updateRequestStatusAction(formData: FormData) {
  const viewer = await requireCreator("/dashboard");
  const creator = await requireCreatorProfile(viewer.id);
  const requestId = getText(formData, "requestId");
  const requestedStatus = getText(formData, "status");

  if (!isUuid(requestId) || !requestStatuses.includes(requestedStatus as (typeof requestStatuses)[number])) {
    return;
  }

  const supabase = await createClient();
  await supabase
    .from("website_requests")
    .update({ status: requestedStatus })
    .eq("id", requestId)
    .eq("creator_id", creator.id);

  revalidatePath("/dashboard");
}

async function requireCreator(path: string) {
  const viewer = await requireViewer(path);
  if (viewer.role !== "creator" && viewer.role !== "admin") {
    redirect("/account");
  }
  return viewer;
}

async function requireCreatorProfile(profileId: string) {
  const { data: creator } = await getCreatorByProfileId(profileId);
  if (!creator) {
    redirect("/account");
  }
  return creator;
}

function parseTemplateForm(formData: FormData):
  | { ok: false; error: string }
  | {
      ok: true;
      values: Pick<
        TemplateRow,
        | "title"
        | "category"
        | "price"
        | "short_description"
        | "full_description"
        | "tools"
        | "tags"
        | "features"
        | "pages_included"
        | "best_for"
        | "preview_type"
        | "live_preview_url"
      >;
    } {
  const title = getText(formData, "title");
  const category = getText(formData, "category");
  const price = Number(getText(formData, "price"));
  const shortDescription = getText(formData, "shortDescription");
  const fullDescription = getText(formData, "fullDescription");
  const livePreviewUrl = getText(formData, "livePreviewUrl");

  if (title.length < 3) {
    return { ok: false, error: "Enter a template title with at least 3 characters." };
  }
  if (!categories.includes(category as (typeof categories)[number])) {
    return { ok: false, error: "Choose a valid category." };
  }
  if (!Number.isInteger(price) || price < 0 || price > 100000) {
    return { ok: false, error: "Enter a valid whole-number price." };
  }
  if (shortDescription.length < 20 || shortDescription.length > 180) {
    return { ok: false, error: "Use 20-180 characters for the short description." };
  }
  if (fullDescription.length < 40) {
    return { ok: false, error: "Add at least 40 characters to the full description." };
  }
  if (livePreviewUrl && !isHttpUrl(livePreviewUrl)) {
    return { ok: false, error: "Enter a valid live preview URL." };
  }

  return {
    ok: true,
    values: {
      title,
      category,
      price,
      short_description: shortDescription,
      full_description: fullDescription,
      tools: parseList(getText(formData, "tools")),
      tags: parseList(getText(formData, "tags")),
      features: parseList(getText(formData, "features")),
      pages_included: parseList(getText(formData, "pagesIncluded")),
      best_for: parseList(getText(formData, "bestFor")),
      preview_type: getText(formData, "previewType") || previewTypeForCategory(category),
      live_preview_url: livePreviewUrl || null,
    },
  };
}

async function resolvePreviewImage(
  formData: FormData,
  userId: string,
  supabase: Awaited<ReturnType<typeof createClient>>,
  currentUrl: string | null = null,
) {
  const imageUrl = getText(formData, "previewImageUrl");
  const file = formData.get("previewImage");

  if (file instanceof File && file.size > 0) {
    if (file.size > 5 * 1024 * 1024) {
      return { url: currentUrl, error: "Preview images must be smaller than 5 MB." };
    }
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      return { url: currentUrl, error: "Upload a PNG, JPEG, or WebP image." };
    }

    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const path = `${userId}/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage
      .from("template-previews")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (error) {
      return { url: currentUrl, error: "We could not upload the preview image." };
    }

    return {
      url: supabase.storage.from("template-previews").getPublicUrl(path).data.publicUrl,
      error: null,
    };
  }

  if (imageUrl) {
    if (!isHttpUrl(imageUrl)) {
      return { url: currentUrl, error: "Enter a valid preview image URL." };
    }
    return { url: imageUrl, error: null };
  }

  return { url: currentUrl, error: null };
}

function previewTypeForCategory(category: string) {
  return {
    Restaurants: "restaurant",
    "Cafes & Bakeries": "cafe",
    "Beauty & Care": "salon",
    Fitness: "gym",
    Education: "tutor",
    "Online Stores": "store",
    "Agencies & Services": "agency",
    "Real Estate": "real-estate",
  }[category] ?? "business";
}

function parseList(value: string) {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70) || "template";
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}
