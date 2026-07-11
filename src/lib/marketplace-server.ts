import "server-only";

import { templates as mockTemplates, type Template } from "@/data/templates";
import type {
  CreatorRow,
  TemplateRow,
} from "@/lib/supabase/database.types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

type ReviewSummary = {
  reviewer_name: string | null;
  rating: number;
  comment: string | null;
};

type TemplateRecord = TemplateRow & {
  creator: CreatorRow | null;
  reviews: ReviewSummary[] | null;
};

export type MarketplaceQueryResult<T> = {
  data: T;
  error: string | null;
  usingFallback: boolean;
};

const templateSelect = `
  *,
  creator:creators(*),
  reviews:template_reviews(reviewer_name, rating, comment)
`;

export async function getPublishedTemplates(): Promise<
  MarketplaceQueryResult<Template[]>
> {
  if (!isSupabaseConfigured()) {
    return {
      data: mockTemplates,
      error: "Supabase environment variables are missing.",
      usingFallback: true,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("templates")
    .select(templateSelect)
    .eq("status", "published")
    .order("is_featured", { ascending: false })
    .order("fit_score", { ascending: false });

  if (error) {
    return { data: [], error: error.message, usingFallback: false };
  }

  return {
    data: (data as TemplateRecord[]).map(mapTemplateRecord),
    error: null,
    usingFallback: false,
  };
}

export async function getPublishedTemplateBySlug(
  slug: string,
): Promise<MarketplaceQueryResult<Template | null>> {
  if (!isSupabaseConfigured()) {
    return {
      data: mockTemplates.find((template) => template.slug === slug) ?? null,
      error: "Supabase environment variables are missing.",
      usingFallback: true,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("templates")
    .select(templateSelect)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message, usingFallback: false };
  }

  return {
    data: data ? mapTemplateRecord(data as TemplateRecord) : null,
    error: null,
    usingFallback: false,
  };
}

export async function getSavedTemplateIds(userId?: string) {
  if (!userId || !isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("saved_templates")
    .select("template_id")
    .eq("user_id", userId);

  return data?.map((item) => item.template_id) ?? [];
}

export async function getSavedTemplates(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saved_templates")
    .select(`template:templates(${templateSelect})`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [] as Template[], error: error.message };
  }

  const rows = (data ?? []) as unknown as Array<{
    template: TemplateRecord | null;
  }>;

  return {
    data: rows
      .map((row) => (row.template ? mapTemplateRecord(row.template) : null))
      .filter((template): template is Template => template !== null),
    error: null,
  };
}

export function mapTemplateRecord(record: TemplateRecord): Template {
  const mock = mockTemplates.find((template) => template.slug === record.slug);
  const creator = record.creator;
  const review = record.reviews?.[0];
  const displayName = creator?.display_name ?? "Webbly Creator";
  const avatar = displayName
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    id: record.id,
    slug: record.slug,
    name: record.title,
    category: record.category,
    creator: {
      id: creator?.id,
      profileId: creator?.profile_id,
      name: displayName,
      role: creator?.role_title ?? "Website creator",
      location: "Remote",
      avatar,
      responseTime: creator?.response_time ?? "Replies in 1-2 days",
      verified: creator?.is_verified ?? false,
      rating: Number(creator?.rating ?? record.rating),
      completedProjects: creator?.completed_projects ?? 0,
      deliveryTime: "7-10 days",
      review: review?.comment ?? "Clear work and a thoughtful process.",
    },
    price: record.price,
    popularity: record.fit_score,
    isNew: mock?.isNew ?? isWithinDays(record.created_at, 30),
    tags: record.tags,
    tools: record.tools,
    summary: record.short_description ?? "A polished small-business website direction.",
    description: record.full_description ?? record.short_description ?? "",
    features: record.features,
    pages: record.pages_included,
    gradient:
      mock?.gradient ??
      "linear-gradient(135deg, #e0e7ff 0%, #dbeafe 48%, #fce7f3 100%)",
    bestFor: record.best_for,
    previewImageUrl: record.preview_image_url,
    livePreviewUrl: record.live_preview_url,
    status: record.status,
    isFeatured: record.is_featured,
    createdAt: record.created_at,
  };
}

function isWithinDays(value: string, days: number) {
  const date = new Date(value).getTime();
  return Date.now() - date <= days * 24 * 60 * 60 * 1000;
}
