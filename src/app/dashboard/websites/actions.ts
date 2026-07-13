"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireVerifiedViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  contentTypeForPath,
  validateWebsiteFileManifest,
} from "@/lib/websites-limits";

export type WebsiteFormState = {
  status: "idle" | "error" | "success";
  message: string;
};

const FILE_FIELD_PREFIX = "file:";
const NUL_CHAR_CODE = 0;

export async function createWebsiteAction(
  _previousState: WebsiteFormState,
  formData: FormData,
): Promise<WebsiteFormState> {
  const viewer = await requireVerifiedViewer("/dashboard/websites/new");

  const parsed = parseWebsiteForm(formData);
  if (!parsed.ok) {
    return { status: "error", message: parsed.error };
  }

  const fileEntries: { path: string; file: File }[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith(FILE_FIELD_PREFIX) && value instanceof File) {
      fileEntries.push({ path: key.slice(FILE_FIELD_PREFIX.length), file: value });
    }
  }

  const manifestCheck = validateWebsiteFileManifest(
    fileEntries.map((entry) => ({ path: entry.path, size: entry.file.size })),
  );
  if (!manifestCheck.ok) {
    return { status: "error", message: manifestCheck.error };
  }

  const filesToInsert: {
    path: string;
    content: string;
    content_type: string;
    size_bytes: number;
  }[] = [];

  for (const entry of fileEntries) {
    const content = await entry.file.text();
    if (containsNulByte(content)) {
      return {
        status: "error",
        message: `"${entry.path}" does not look like a text file.`,
      };
    }

    const contentType = contentTypeForPath(entry.path);
    if (!contentType) {
      return {
        status: "error",
        message: `"${entry.path}" has an unsupported file type.`,
      };
    }

    filesToInsert.push({
      path: entry.path,
      content,
      content_type: contentType,
      size_bytes: entry.file.size,
    });
  }

  const totalBytes = filesToInsert.reduce((sum, file) => sum + file.size_bytes, 0);
  const supabase = await createClient();

  const { data: website, error: websiteError } = await supabase
    .from("websites")
    .insert({
      owner_id: viewer.id,
      title: parsed.values.title,
      price: parsed.values.price,
      short_description: parsed.values.shortDescription || null,
      full_description: parsed.values.fullDescription || null,
      tags: [],
      file_count: filesToInsert.length,
      total_bytes: totalBytes,
      status: "draft",
    })
    .select("id")
    .single();

  if (websiteError || !website) {
    console.error("Failed to create Webbly website", websiteError?.code);
    return {
      status: "error",
      message: "We could not save this website. Please try again.",
    };
  }

  const { error: filesError } = await supabase.from("website_files").insert(
    filesToInsert.map((file) => ({ website_id: website.id, ...file })),
  );

  if (filesError) {
    console.error("Failed to save Webbly website files", filesError.code);
    await supabase.from("websites").delete().eq("id", website.id);
    return {
      status: "error",
      message: "We could not save the uploaded files. Please try again.",
    };
  }

  revalidatePath("/dashboard/websites");
  redirect("/dashboard/websites?created=1");
}

export async function publishWebsiteAction(websiteId: string) {
  const viewer = await requireVerifiedViewer("/dashboard/websites");

  if (!isUuid(websiteId)) {
    return { success: false, message: "Invalid website." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("websites")
    .update({ status: "listed" })
    .eq("id", websiteId)
    .eq("owner_id", viewer.id);

  revalidatePath("/dashboard/websites");
  revalidatePath("/marketplace");
  revalidatePath(`/marketplace/${websiteId}`);

  return {
    success: !error,
    message: error ? "Could not publish this website." : "Website published.",
  };
}

export async function unpublishWebsiteAction(websiteId: string) {
  const viewer = await requireVerifiedViewer("/dashboard/websites");

  if (!isUuid(websiteId)) {
    return { success: false, message: "Invalid website." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("websites")
    .update({ status: "draft" })
    .eq("id", websiteId)
    .eq("owner_id", viewer.id);

  revalidatePath("/dashboard/websites");
  revalidatePath("/marketplace");
  revalidatePath(`/marketplace/${websiteId}`);

  return {
    success: !error,
    message: error ? "Could not unpublish this website." : "Website unpublished.",
  };
}

export async function deleteWebsiteAction(websiteId: string) {
  const viewer = await requireVerifiedViewer("/dashboard/websites");

  if (!isUuid(websiteId)) {
    return { success: false, message: "Invalid website." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("websites")
    .delete()
    .eq("id", websiteId)
    .eq("owner_id", viewer.id);

  revalidatePath("/dashboard/websites");

  return {
    success: !error,
    message: error ? "Could not delete this website." : "Website deleted.",
  };
}

function parseWebsiteForm(formData: FormData):
  | { ok: false; error: string }
  | {
      ok: true;
      values: {
        title: string;
        price: number;
        shortDescription: string;
        fullDescription: string;
      };
    } {
  const title = getText(formData, "title");
  const price = Number(getText(formData, "price"));
  const shortDescription = getText(formData, "shortDescription");
  const fullDescription = getText(formData, "fullDescription");

  if (title.length < 3 || title.length > 120) {
    return {
      ok: false,
      error: "Enter a website title between 3 and 120 characters.",
    };
  }
  if (!Number.isInteger(price) || price < 0 || price > 100000) {
    return { ok: false, error: "Enter a valid whole-number price." };
  }
  if (shortDescription.length > 180) {
    return {
      ok: false,
      error: "Keep the short description under 180 characters.",
    };
  }

  return {
    ok: true,
    values: { title, price, shortDescription, fullDescription },
  };
}

function containsNulByte(value: string) {
  return value.split("").some((char) => char.charCodeAt(0) === NUL_CHAR_CODE);
}

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}
