import "server-only";

import type {
  ProfileRow,
  WebsiteFileRow,
  WebsiteRow,
} from "@/lib/supabase/database.types";
import {
  getSupabaseConfigStatus,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import {
  logSupabaseConfigurationError,
  logSupabaseQueryError,
} from "@/lib/supabase/diagnostics";
import { createClient } from "@/lib/supabase/server";

export type WebsiteQueryResult<T> = {
  data: T;
  error: string | null;
  usingFallback: boolean;
};

export type WebsiteSort = "newest" | "price_asc" | "price_desc";

export type WebsiteOwner = Pick<
  ProfileRow,
  "full_name" | "avatar_url" | "username"
>;

export type WebsiteListItem = WebsiteRow & {
  owner: WebsiteOwner | null;
};

export type WebsiteDetails = WebsiteListItem & {
  files: Pick<WebsiteFileRow, "path" | "size_bytes">[];
};

const ownerSelect = "owner:profiles(full_name, avatar_url, username)";

export async function getListedWebsites(
  sort: WebsiteSort = "newest",
): Promise<WebsiteQueryResult<WebsiteListItem[]>> {
  if (!isSupabaseConfigured()) {
    logSupabaseConfigurationError("getListedWebsites", getSupabaseConfigStatus());
    return {
      data: [],
      error: "The websites marketplace is not configured.",
      usingFallback: true,
    };
  }

  const supabase = await createClient();

  try {
    let query = supabase
      .from("websites")
      .select(`*, ${ownerSelect}`)
      .eq("status", "listed");

    if (sort === "price_asc") {
      query = query.order("price", { ascending: true });
    } else if (sort === "price_desc") {
      query = query.order("price", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      logSupabaseQueryError("getListedWebsites", error);
      return {
        data: [],
        error: "The marketplace data request failed.",
        usingFallback: false,
      };
    }

    return {
      data: (data ?? []) as unknown as WebsiteListItem[],
      error: null,
      usingFallback: false,
    };
  } catch (error) {
    logSupabaseQueryError("getListedWebsites", error);
    return {
      data: [],
      error: "The marketplace data request failed.",
      usingFallback: false,
    };
  }
}

export async function getWebsiteForDetailsPage(
  id: string,
): Promise<WebsiteQueryResult<WebsiteDetails | null>> {
  if (!isSupabaseConfigured()) {
    logSupabaseConfigurationError(
      "getWebsiteForDetailsPage",
      getSupabaseConfigStatus(),
    );
    return {
      data: null,
      error: "The websites marketplace is not configured.",
      usingFallback: true,
    };
  }

  const supabase = await createClient();

  try {
    const { data: website, error } = await supabase
      .from("websites")
      .select(`*, ${ownerSelect}`)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      logSupabaseQueryError("getWebsiteForDetailsPage", error);
      return {
        data: null,
        error: "The website data request failed.",
        usingFallback: false,
      };
    }

    if (!website) {
      return { data: null, error: null, usingFallback: false };
    }

    const { data: files, error: filesError } = await supabase
      .from("website_files")
      .select("path, size_bytes")
      .eq("website_id", id);

    if (filesError) {
      logSupabaseQueryError("getWebsiteForDetailsPage.files", filesError);
    }

    return {
      data: {
        ...(website as unknown as WebsiteListItem),
        files: files ?? [],
      },
      error: null,
      usingFallback: false,
    };
  } catch (error) {
    logSupabaseQueryError("getWebsiteForDetailsPage", error);
    return {
      data: null,
      error: "The website data request failed.",
      usingFallback: false,
    };
  }
}

export async function getOwnedWebsites(
  ownerId: string,
): Promise<{ data: WebsiteRow[]; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { data: [], error: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("websites")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseQueryError("getOwnedWebsites", error);
    return { data: [], error: "Could not load your websites." };
  }

  return { data: data ?? [], error: null };
}
