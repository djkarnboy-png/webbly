import { contentTypeForPath, WEBSITE_ENTRY_FILE } from "@/lib/websites-limits";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const SEGMENT_PATTERN = /^[A-Za-z0-9._-]+$/;
const MAX_PATH_LENGTH = 300;

type RouteParams = {
  id: string;
  path?: string[];
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<RouteParams> },
) {
  if (!isSupabaseConfigured()) {
    return notFound();
  }

  const { id, path: segments } = await params;

  if (!isUuid(id)) {
    return notFound();
  }

  const requestedPath = resolveRequestedPath(segments);
  if (!requestedPath) {
    return notFound();
  }

  const contentType = contentTypeForPath(requestedPath);
  if (!contentType) {
    return notFound();
  }

  const supabase = await createClient();
  const { data: file } = await supabase
    .from("website_files")
    .select("content")
    .eq("website_id", id)
    .eq("path", requestedPath)
    .maybeSingle();

  if (!file) {
    return notFound();
  }

  const body =
    contentType === "text/html"
      ? injectBaseHref(file.content, id)
      : file.content;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Security-Policy":
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline'; img-src * data: blob:; " +
        "frame-ancestors 'self'; base-uri 'self'; form-action 'self'",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "Cache-Control": "private, no-store",
    },
  });
}

function resolveRequestedPath(segments: string[] | undefined): string | null {
  const parts = segments && segments.length > 0 ? segments : [WEBSITE_ENTRY_FILE];

  for (const part of parts) {
    if (!part || part === "." || part === ".." || part.includes("\\")) {
      return null;
    }
    if (!SEGMENT_PATTERN.test(part)) {
      return null;
    }
  }

  const joined = parts.join("/");
  if (joined.length > MAX_PATH_LENGTH) {
    return null;
  }

  return joined;
}

function injectBaseHref(html: string, websiteId: string) {
  const baseTag = `<base href="/marketplace/${websiteId}/preview/">`;
  const headOpenMatch = html.match(/<head[^>]*>/i);

  if (headOpenMatch) {
    const index = html.indexOf(headOpenMatch[0]) + headOpenMatch[0].length;
    return html.slice(0, index) + baseTag + html.slice(index);
  }

  return `<head>${baseTag}</head>${html}`;
}

function notFound() {
  return new Response("Not found", {
    status: 404,
    headers: { "Cache-Control": "private, no-store" },
  });
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}
