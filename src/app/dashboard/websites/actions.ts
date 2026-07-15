"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireVerifiedViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  WEBSITE_ENTRY_FILE,
  contentTypeForPath,
  extensionOf,
  isBinaryWebsiteExtension,
  isEntryFilePath,
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
    encoding: "utf8" | "base64";
  }[] = [];

  for (const entry of fileEntries) {
    const contentType = contentTypeForPath(entry.path);
    if (!contentType) {
      return {
        status: "error",
        message: `"${entry.path}" has an unsupported file type.`,
      };
    }

    const isBinary = isBinaryWebsiteExtension(extensionOf(entry.path));

    if (isBinary) {
      const buffer = Buffer.from(await entry.file.arrayBuffer());
      filesToInsert.push({
        path: entry.path,
        content: buffer.toString("base64"),
        content_type: contentType,
        size_bytes: entry.file.size,
        encoding: "base64",
      });
      continue;
    }

    const content = await entry.file.text();
    if (containsNulByte(content)) {
      return {
        status: "error",
        message: `"${entry.path}" does not look like a text file.`,
      };
    }

    filesToInsert.push({
      path: entry.path,
      content,
      content_type: contentType,
      size_bytes: entry.file.size,
      encoding: "utf8",
    });
  }

  normalizeEntryFilePath(filesToInsert);

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
  const { data, error } = await supabase
    .from("websites")
    .update({ status: "listed" })
    .eq("id", websiteId)
    .eq("owner_id", viewer.id)
    .select("id")
    .maybeSingle();

  revalidatePath("/dashboard/websites");
  revalidatePath("/marketplace");
  revalidatePath(`/marketplace/${websiteId}`);

  const success = !error && !!data;
  return {
    success,
    message: success ? "Website published." : "Could not publish this website.",
  };
}

export async function unpublishWebsiteAction(websiteId: string) {
  const viewer = await requireVerifiedViewer("/dashboard/websites");

  if (!isUuid(websiteId)) {
    return { success: false, message: "Invalid website." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("websites")
    .update({ status: "draft" })
    .eq("id", websiteId)
    .eq("owner_id", viewer.id)
    .select("id")
    .maybeSingle();

  revalidatePath("/dashboard/websites");
  revalidatePath("/marketplace");
  revalidatePath(`/marketplace/${websiteId}`);

  const success = !error && !!data;
  return {
    success,
    message: success ? "Website unpublished." : "Could not unpublish this website.",
  };
}

export async function deleteWebsiteAction(websiteId: string) {
  const viewer = await requireVerifiedViewer("/dashboard/websites");

  if (!isUuid(websiteId)) {
    return { success: false, message: "Invalid website." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("websites")
    .delete()
    .eq("id", websiteId)
    .eq("owner_id", viewer.id)
    .select("id")
    .maybeSingle();

  revalidatePath("/dashboard/websites");

  const success = !error && !!data;
  return {
    success,
    message: success ? "Website deleted." : "Could not delete this website.",
  };
}

function parseWebsiteForm(formData: FormData): {
  values: {
    title: string;
    price: number;
    shortDescription: string;
    fullDescription: string;
  };
} {
  const title = getText(formData, "title") || "Untitled website";
  const rawPrice = Number(getText(formData, "price"));
  const price = Number.isFinite(rawPrice)
    ? Math.min(100000, Math.max(0, Math.round(rawPrice)))
    : 0;
  const shortDescription = getText(formData, "shortDescription");
  const fullDescription = getText(formData, "fullDescription");

  return { values: { title, price, shortDescription, fullDescription } };
}

function normalizeEntryFilePath(files: { path: string }[]) {
  const alreadyExact = files.some((file) => file.path === WEBSITE_ENTRY_FILE);
  if (alreadyExact) {
    return;
  }

  const entry = files.find((file) => isEntryFilePath(file.path));
  if (entry) {
    entry.path = WEBSITE_ENTRY_FILE;
  }
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
