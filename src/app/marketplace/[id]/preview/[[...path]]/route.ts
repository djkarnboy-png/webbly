import {
  contentTypeForPath,
  isSafeWebsiteFilePath,
  WEBSITE_ENTRY_FILE,
} from "@/lib/websites-limits";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type RouteParams = {
  id: string;
  path?: string[];
};

export async function GET(
  request: Request,
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
    .select("content, encoding")
    .eq("website_id", id)
    .eq("path", requestedPath)
    .maybeSingle();

  if (!file) {
    return notFound();
  }

  const body =
    file.encoding === "base64"
      ? Buffer.from(file.content, "base64")
      : contentType === "text/html"
        ? rewriteAbsoluteAssetAttrs(injectBaseHref(file.content, id), id)
        : contentType === "text/css"
          ? rewriteAbsoluteCssUrls(file.content, id)
          : file.content;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Security-Policy": contentSecurityPolicy(request),
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "Cache-Control": "private, no-store",
    },
  });
}

// The buyer-facing preview is embedded via an iframe with sandbox="allow-scripts
// ..." and deliberately NO allow-same-origin, so uploaded content can't touch
// the real Webbly origin's cookies/localStorage. That forces the framed
// document's own origin to be opaque ("null"), which means the 'self' CSP
// keyword can never match anything (it resolves to the protected resource's
// origin) -- it would silently block every external <link>/<script> load.
// Using the actual explicit origin instead works the same as 'self' would,
// but isn't affected by the framed document's opaque origin.
function contentSecurityPolicy(request: Request) {
  const origin = new URL(request.url).origin;
  return (
    `default-src ${origin}; script-src ${origin} 'unsafe-inline' 'unsafe-eval'; ` +
    `style-src ${origin} 'unsafe-inline'; img-src * data: blob:; ` +
    `frame-ancestors ${origin}; base-uri ${origin}; form-action ${origin}`
  );
}

function resolveRequestedPath(segments: string[] | undefined): string | null {
  const parts = segments && segments.length > 0 ? segments : [WEBSITE_ENTRY_FILE];
  const joined = parts.join("/");

  return isSafeWebsiteFilePath(joined) ? joined : null;
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

// Root-relative asset paths (e.g. href="/css/style.css") point at the
// Webbly app's own domain, not the sandboxed file bundle, unless rewritten
// to go through this website's preview route. The <base> tag alone only
// affects relative URLs, so absolute ones need to be rewritten here.
function rewriteAbsoluteAssetAttrs(html: string, websiteId: string) {
  const prefix = `/marketplace/${websiteId}/preview`;

  const withSingleUrlAttrs = html.replace(
    /((?:href|src|action|poster)\s*=\s*)(["'])\/(?!\/)([^"']*)\2/gi,
    (_match, attrPrefix: string, quote: string, rest: string) =>
      `${attrPrefix}${quote}${prefix}/${rest}${quote}`,
  );

  return withSingleUrlAttrs.replace(
    /(srcset\s*=\s*)(["'])([^"']*)\2/gi,
    (_match, attrPrefix: string, quote: string, value: string) => {
      const rewritten = value
        .split(",")
        .map((entry) => {
          const trimmed = entry.trim();
          const spaceIndex = trimmed.indexOf(" ");
          const url = spaceIndex === -1 ? trimmed : trimmed.slice(0, spaceIndex);
          const descriptor = spaceIndex === -1 ? "" : trimmed.slice(spaceIndex);
          return url.startsWith("/") && !url.startsWith("//")
            ? `${prefix}${url}${descriptor}`
            : trimmed;
        })
        .join(", ");
      return `${attrPrefix}${quote}${rewritten}${quote}`;
    },
  );
}

function rewriteAbsoluteCssUrls(css: string, websiteId: string) {
  const prefix = `/marketplace/${websiteId}/preview`;

  return css.replace(
    /url\(\s*(["']?)\/(?!\/)([^"')]*)\1\s*\)/gi,
    (_match, quote: string, rest: string) => `url(${quote}${prefix}/${rest}${quote})`,
  );
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
