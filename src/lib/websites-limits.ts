export const ALLOWED_WEBSITE_FILE_EXTENSIONS = [
  "html",
  "css",
  "js",
  "mjs",
  "json",
  "svg",
  "txt",
  "md",
] as const;

export const MAX_WEBSITE_FILES = 200;
export const MAX_WEBSITE_FILE_BYTES = 300 * 1024;
export const MAX_WEBSITE_TOTAL_BYTES = 5 * 1024 * 1024;
export const MAX_WEBSITE_FILE_PATH_LENGTH = 200;
export const WEBSITE_ENTRY_FILE = "index.html";

const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  html: "text/html",
  css: "text/css",
  js: "text/javascript",
  mjs: "text/javascript",
  json: "application/json",
  svg: "image/svg+xml",
  txt: "text/plain",
  md: "text/markdown",
};

export function extensionOf(path: string): string {
  const dot = path.lastIndexOf(".");
  return dot === -1 ? "" : path.slice(dot + 1).toLowerCase();
}

export function contentTypeForPath(path: string): string | null {
  return CONTENT_TYPE_BY_EXTENSION[extensionOf(path)] ?? null;
}

export function isEntryFilePath(path: string): boolean {
  return path.toLowerCase() === WEBSITE_ENTRY_FILE;
}

const JUNK_FILE_BASENAMES = new Set([".ds_store", "thumbs.db", "desktop.ini"]);

export function isJunkFilePath(path: string): boolean {
  const basename = path.split("/").pop() ?? path;
  return JUNK_FILE_BASENAMES.has(basename.toLowerCase());
}

export function isSafeWebsiteFilePath(path: string): boolean {
  if (!path || path.length > MAX_WEBSITE_FILE_PATH_LENGTH) {
    return false;
  }
  if (path.startsWith("/") || path.endsWith("/")) {
    return false;
  }
  if (path.includes("\\") || path.includes("//")) {
    return false;
  }

  const segments = path.split("/");
  return segments.every(
    (segment) =>
      segment.length > 0 &&
      segment !== "." &&
      segment !== ".." &&
      /^[A-Za-z0-9._-]+$/.test(segment),
  );
}

export type WebsiteFileManifestEntry = { path: string; size: number };

export function validateWebsiteFileManifest(
  files: WebsiteFileManifestEntry[],
): { ok: true } | { ok: false; error: string } {
  if (files.length === 0) {
    return {
      ok: false,
      error: "Upload at least one file, including a root index.html.",
    };
  }
  if (files.length > MAX_WEBSITE_FILES) {
    return { ok: false, error: `You can upload up to ${MAX_WEBSITE_FILES} files.` };
  }

  const seenPaths = new Set<string>();
  let totalBytes = 0;
  let hasEntryFile = false;

  for (const file of files) {
    if (!isSafeWebsiteFilePath(file.path)) {
      return { ok: false, error: `"${file.path}" is not a valid file path.` };
    }
    if (seenPaths.has(file.path)) {
      return { ok: false, error: `"${file.path}" was added more than once.` };
    }
    seenPaths.add(file.path);

    const extension = extensionOf(file.path);
    if (
      !ALLOWED_WEBSITE_FILE_EXTENSIONS.includes(
        extension as (typeof ALLOWED_WEBSITE_FILE_EXTENSIONS)[number],
      )
    ) {
      return {
        ok: false,
        error: `"${file.path}" has an unsupported file type. Allowed: ${ALLOWED_WEBSITE_FILE_EXTENSIONS.join(", ")}.`,
      };
    }
    if (file.size > MAX_WEBSITE_FILE_BYTES) {
      return {
        ok: false,
        error: `"${file.path}" is larger than ${Math.round(MAX_WEBSITE_FILE_BYTES / 1024)} KB.`,
      };
    }

    totalBytes += file.size;
    if (isEntryFilePath(file.path)) {
      hasEntryFile = true;
    }
  }

  if (totalBytes > MAX_WEBSITE_TOTAL_BYTES) {
    return {
      ok: false,
      error: `This bundle is larger than the ${Math.round(MAX_WEBSITE_TOTAL_BYTES / (1024 * 1024))} MB limit.`,
    };
  }
  if (!hasEntryFile) {
    return {
      ok: false,
      error: `Your upload must include a root-level ${WEBSITE_ENTRY_FILE} file.`,
    };
  }

  return { ok: true };
}
