"use client";

import {
  useActionState,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import { createWebsiteAction, type WebsiteFormState } from "@/app/dashboard/websites/actions";
import {
  ALLOWED_WEBSITE_FILE_EXTENSIONS,
  MAX_WEBSITE_FILES,
  MAX_WEBSITE_FILE_BYTES,
  MAX_WEBSITE_TOTAL_BYTES,
  WEBSITE_ENTRY_FILE,
  isEntryFilePath,
  isJunkFilePath,
  validateWebsiteFileManifest,
} from "@/lib/websites-limits";
import { Button } from "./Button";

type ManifestEntry = { path: string; file: File };

const initialState: WebsiteFormState = { status: "idle", message: "" };

export function WebsiteUploadForm() {
  const [state, formAction, isPending] = useActionState(createWebsiteAction, initialState);
  const [files, setFiles] = useState<ManifestEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dropError, setDropError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const manifest = files.map((entry) => ({ path: entry.path, size: entry.file.size }));
  const validation = validateWebsiteFileManifest(manifest);
  const hasEntryFile = files.some((entry) => isEntryFilePath(entry.path));
  const totalBytes = files.reduce((sum, entry) => sum + entry.file.size, 0);

  function addFiles(newFiles: ManifestEntry[]) {
    setFiles((previous) => {
      const map = new Map(previous.map((entry) => [entry.path, entry]));
      for (const entry of newFiles) {
        if (isJunkFilePath(entry.path)) {
          continue;
        }
        map.set(entry.path, entry);
      }
      return Array.from(map.values());
    });
  }

  function removeFile(path: string) {
    setFiles((previous) => previous.filter((entry) => entry.path !== path));
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    setDropError("");

    try {
      const items = event.dataTransfer.items;
      const collected: ManifestEntry[] = [];
      const entryPromises: Promise<ManifestEntry[]>[] = [];

      for (let index = 0; index < items.length; index += 1) {
        const item = items[index];
        const entry = item.webkitGetAsEntry?.();
        if (entry) {
          entryPromises.push(traverseFileTree(entry));
        } else {
          const file = item.getAsFile();
          if (file) {
            collected.push({ path: file.name, file });
          }
        }
      }

      const nested = await Promise.all(entryPromises);
      const dropped = stripCommonTopFolder([...collected, ...nested.flat()]);

      if (dropped.length === 0) {
        setDropError(
          "Could not read any files from that drop. Try the \"Upload folder\" or \"Upload files\" buttons instead.",
        );
        return;
      }

      addFiles(dropped);
    } catch {
      setDropError(
        "Something went wrong reading those files. Try the \"Upload folder\" or \"Upload files\" buttons instead.",
      );
    }
  }

  function handleFolderInput(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files;
    if (!selected) {
      return;
    }

    const collected: ManifestEntry[] = [];
    for (const file of Array.from(selected)) {
      const relativePath = file.webkitRelativePath || file.name;
      const parts = relativePath.split("/");
      const path = parts.length > 1 ? parts.slice(1).join("/") : relativePath;
      collected.push({ path: path || file.name, file });
    }

    addFiles(collected);
    event.target.value = "";
  }

  function handleFilesInput(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files;
    if (!selected) {
      return;
    }

    const collected = Array.from(selected).map((file) => ({ path: file.name, file }));
    addFiles(collected);
    event.target.value = "";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validation.ok || !formRef.current) {
      return;
    }

    const formData = new FormData(formRef.current);
    for (const entry of files) {
      formData.append(`file:${entry.path}`, entry.file, entry.path);
    }

    formAction(formData);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid gap-7">
      {state.message ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm font-medium ${
            state.status === "success"
              ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-100"
              : "border-rose-400/25 bg-rose-500/10 text-rose-100"
          }`}
          role="status"
        >
          {state.message}
        </div>
      ) : null}

      <FormSection title="Website basics" description="The details buyers scan first.">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Title" name="title" placeholder="Modern florist website" />
          <FormField
            label="Price (USD)"
            name="price"
            type="number"
            min="0"
            step="1"
            placeholder="299"
          />
        </div>
        <TextareaField
          label="Short description"
          name="shortDescription"
          rows={3}
          placeholder="A polished booking website for independent salons and beauty studios."
        />
        <TextareaField
          label="Full description"
          name="fullDescription"
          rows={6}
          placeholder="Explain what's included, the visual direction, and how buyers can use it."
        />
      </FormSection>

      <FormSection
        title="Website files"
        description={`Drop a folder or select files. A root-level ${WEBSITE_ENTRY_FILE} is required.`}
      >
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`rounded-lg border border-dashed p-6 text-center transition ${
            isDragging ? "border-blue-400/60 bg-blue-500/10" : "border-white/20 bg-black/20"
          }`}
        >
          <p className="text-sm font-semibold text-slate-200">
            Drag and drop your website folder here
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Or use one of the pickers below. Allowed types: {ALLOWED_WEBSITE_FILE_EXTENSIONS.join(", ")}.
            Max {Math.round(MAX_WEBSITE_FILE_BYTES / 1024)} KB per file,{" "}
            {Math.round(MAX_WEBSITE_TOTAL_BYTES / (1024 * 1024))} MB total, {MAX_WEBSITE_FILES} files.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <label className="cursor-pointer rounded-md border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
              Upload folder
              <input
                type="file"
                multiple
                // @ts-expect-error -- webkitdirectory is a non-standard attribute not in React's file input types
                webkitdirectory=""
                onChange={handleFolderInput}
                className="hidden"
              />
            </label>
            <label className="cursor-pointer rounded-md border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
              Upload files
              <input type="file" multiple onChange={handleFilesInput} className="hidden" />
            </label>
          </div>
        </div>

        {dropError ? (
          <p className="text-sm font-medium text-rose-300" role="alert">
            {dropError}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <span
            className={`rounded-md border px-2.5 py-1.5 ${
              hasEntryFile
                ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
                : "border-amber-400/25 bg-amber-500/10 text-amber-200"
            }`}
          >
            Root {WEBSITE_ENTRY_FILE}: {hasEntryFile ? "found" : "missing"}
          </span>
          <span className="rounded-md border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-slate-300">
            {files.length} file{files.length === 1 ? "" : "s"} / {formatBytes(totalBytes)}
          </span>
        </div>

        {!validation.ok && files.length > 0 ? (
          <p className="text-sm font-medium text-rose-300" role="alert">
            {validation.error}
          </p>
        ) : null}

        {files.length > 0 ? (
          <ul className="divide-y divide-white/10 rounded-lg border border-white/10 bg-black/20">
            {files
              .slice()
              .sort((a, b) => a.path.localeCompare(b.path))
              .map((entry) => (
                <li
                  key={entry.path}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                >
                  <span className="min-w-0 truncate font-mono text-xs text-slate-300">
                    {entry.path}
                    {isEntryFilePath(entry.path) ? (
                      <span className="ml-2 rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-blue-300">
                        Entry
                      </span>
                    ) : null}
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-slate-500">{formatBytes(entry.file.size)}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(entry.path)}
                      className="text-xs font-semibold text-rose-300 hover:text-rose-200"
                    >
                      Remove
                    </button>
                  </span>
                </li>
              ))}
          </ul>
        ) : null}
      </FormSection>

      <div className="flex flex-col gap-3 rounded-lg border border-blue-400/20 bg-blue-500/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-blue-100">Your website is saved as a draft</p>
          <p className="mt-1 text-sm text-blue-200/75">
            You choose when to publish it to the marketplace.
          </p>
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={isPending || !validation.ok}
          className="w-full shrink-0 sm:w-auto"
        >
          {isPending ? "Uploading..." : "Save website"}
        </Button>
      </div>
    </form>
  );
}

function stripCommonTopFolder(entries: ManifestEntry[]): ManifestEntry[] {
  if (entries.length === 0 || !entries.every((entry) => entry.path.includes("/"))) {
    return entries;
  }

  const topFolder = entries[0].path.slice(0, entries[0].path.indexOf("/"));
  const shareTopFolder = entries.every(
    (entry) => entry.path.slice(0, entry.path.indexOf("/")) === topFolder,
  );
  if (!shareTopFolder) {
    return entries;
  }

  return entries.map((entry) => ({ ...entry, path: entry.path.slice(topFolder.length + 1) }));
}

async function traverseFileTree(entry: FileSystemEntry, path = ""): Promise<ManifestEntry[]> {
  if (entry.isFile) {
    const fileEntry = entry as FileSystemFileEntry;
    const file = await new Promise<File>((resolve, reject) => fileEntry.file(resolve, reject));
    return [{ path: `${path}${entry.name}`, file }];
  }

  if (entry.isDirectory) {
    const directoryEntry = entry as FileSystemDirectoryEntry;
    const reader = directoryEntry.createReader();
    const entries = await new Promise<FileSystemEntry[]>((resolve, reject) =>
      reader.readEntries(resolve, reject),
    );
    const nested = await Promise.all(
      entries.map((child) => traverseFileTree(child, `${path}${entry.name}/`)),
    );
    return nested.flat();
  }

  return [];
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-5 border-b border-white/10 pb-7 last:border-0 last:pb-0">
      <div>
        <h2 className="text-lg font-bold text-slate-50">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

function FormField({
  label,
  name,
  placeholder,
  type = "text",
  required = false,
  min,
  step,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  min?: string;
  step?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-300">{label}</span>
      <input
        name={name}
        placeholder={placeholder}
        type={type}
        required={required}
        min={min}
        step={step}
        className="dark-field h-12 rounded-lg px-4 text-sm outline-none"
      />
    </label>
  );
}

function TextareaField({
  label,
  name,
  placeholder,
  rows,
  maxLength,
  hint,
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  rows: number;
  maxLength?: number;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-300">{label}</span>
      <textarea
        name={name}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        required={required}
        className="dark-field w-full resize-y rounded-lg px-4 py-3 text-sm outline-none"
      />
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}
