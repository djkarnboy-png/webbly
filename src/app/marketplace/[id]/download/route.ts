import JSZip from "jszip";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSupabaseConfigured()) {
    return notFound();
  }

  const { id } = await params;
  if (!isUuid(id)) {
    return notFound();
  }

  const supabase = await createClient();

  const { data: website } = await supabase
    .from("websites")
    .select("id, title")
    .eq("id", id)
    .maybeSingle();

  if (!website) {
    return notFound();
  }

  const { data: files } = await supabase
    .from("website_files")
    .select("path, content")
    .eq("website_id", id);

  if (!files || files.length === 0) {
    return notFound();
  }

  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.path, file.content);
  }

  const archive = await zip.generateAsync({
    type: "arraybuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  const filename = `${slugify(website.title)}.zip`;

  return new Response(archive, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

function notFound() {
  return new Response("Not found", {
    status: 404,
    headers: { "Cache-Control": "private, no-store" },
  });
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 70) || "website"
  );
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}
