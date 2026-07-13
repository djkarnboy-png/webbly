"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import {
  createTemplateAction,
  updateTemplateAction,
  type TemplateFormState,
} from "@/app/dashboard/actions";
import type { TemplateRow } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/client";
import { categories } from "@/data/categories";
import { Button } from "./Button";

export function TemplateForm({ template }: { template?: TemplateRow | null }) {
  const action = template
    ? updateTemplateAction.bind(null, template.id)
    : createTemplateAction;
  const [state, formAction, isPending] = useActionState(
    action,
    initialTemplateFormState,
  );
  const [previewImageUrl, setPreviewImageUrl] = useState(
    template?.preview_image_url ?? "",
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  async function uploadPreview(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadMessage("");
    if (file.size > 5 * 1024 * 1024) {
      setUploadMessage("Preview images must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setUploadMessage("Upload a PNG, JPEG, or WebP image.");
      event.target.value = "";
      return;
    }

    setIsUploading(true);
    const supabase = createClient();
    const { data } = await supabase.auth.getClaims();
    const userId = typeof data?.claims?.sub === "string" ? data.claims.sub : null;

    if (!userId) {
      setIsUploading(false);
      setUploadMessage("Your session expired. Log in again before uploading.");
      return;
    }

    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const path = `${userId}/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage
      .from("template-previews")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (error) {
      setUploadMessage("Upload failed. Check your connection and try again.");
      setIsUploading(false);
      return;
    }

    const publicUrl = supabase.storage.from("template-previews").getPublicUrl(path).data.publicUrl;
    setPreviewImageUrl(publicUrl);
    setUploadMessage("Preview uploaded successfully.");
    setIsUploading(false);
  }

  return (
    <form action={formAction} className="grid gap-7">
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

      <FormSection title="Template basics" description="The details buyers scan first.">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Title"
            name="title"
            defaultValue={template?.title ?? ""}
            placeholder="Modern florist website"
            required
          />
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-300">Category</span>
            <select
              name="category"
              defaultValue={template?.category ?? ""}
              required
              className="dark-field h-12 rounded-lg px-3 text-sm outline-none"
            >
              <option value="" disabled>Choose a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
          <FormField
            label="Starting price (USD)"
            name="price"
            type="number"
            min="0"
            step="1"
            defaultValue={String(template?.price ?? "")}
            placeholder="299"
            required
          />
          <FormField
            label="Preview type"
            name="previewType"
            defaultValue={template?.preview_type ?? ""}
            placeholder="cafe, salon, store..."
          />
        </div>
        <TextareaField
          label="Short description"
          name="shortDescription"
          defaultValue={template?.short_description ?? ""}
          rows={3}
          maxLength={180}
          placeholder="A polished booking website for independent salons and beauty studios."
          hint="20-180 characters."
          required
        />
        <TextareaField
          label="Full description"
          name="fullDescription"
          defaultValue={template?.full_description ?? ""}
          rows={6}
          placeholder="Explain the visual direction, customer journey, and what makes this template useful."
          required
        />
      </FormSection>

      <FormSection title="What is included" description="Separate items with commas or new lines.">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextareaField
            label="Tools used"
            name="tools"
            defaultValue={joinList(template?.tools)}
            rows={3}
            placeholder="Framer, Figma"
          />
          <TextareaField
            label="Tags"
            name="tags"
            defaultValue={joinList(template?.tags)}
            rows={3}
            placeholder="Booking, Mobile-first, Local business"
          />
          <TextareaField
            label="Features"
            name="features"
            defaultValue={joinList(template?.features)}
            rows={4}
            placeholder="Responsive layout, Contact form, SEO-ready pages"
          />
          <TextareaField
            label="Pages included"
            name="pagesIncluded"
            defaultValue={joinList(template?.pages_included)}
            rows={4}
            placeholder="Home, About, Services, Contact"
          />
        </div>
        <TextareaField
          label="Best for"
          name="bestFor"
          defaultValue={joinList(template?.best_for)}
          rows={3}
          placeholder="Independent salons, Beauty studios, Mobile stylists"
        />
      </FormSection>

      <FormSection title="Preview" description="Upload a clean thumbnail or provide an image URL.">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Live preview URL"
            name="livePreviewUrl"
            type="url"
            defaultValue={template?.live_preview_url ?? ""}
            placeholder="https://your-preview.com"
          />
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-300">Preview image URL</span>
            <input
              name="previewImageUrl"
              type="url"
              value={previewImageUrl}
              onChange={(event) => setPreviewImageUrl(event.target.value)}
              placeholder="https://..."
              className="dark-field h-12 rounded-lg px-4 text-sm outline-none"
            />
          </label>
        </div>
        <label className="grid gap-2 rounded-lg border border-dashed border-white/20 bg-black/20 p-5">
          <span className="text-sm font-semibold text-slate-300">Upload preview image</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={uploadPreview}
            disabled={isUploading}
            className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-md file:border file:border-white/15 file:bg-white/[0.06] file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-white/10"
          />
          <span className="text-xs text-slate-500">PNG, JPEG, or WebP. Maximum 5 MB.</span>
          {uploadMessage ? (
            <span className={`text-xs font-medium ${uploadMessage.includes("successfully") ? "text-emerald-700" : "text-rose-700"}`} role="status">
              {uploadMessage}
            </span>
          ) : null}
        </label>
      </FormSection>

      <div className="flex flex-col gap-3 rounded-lg border border-blue-400/20 bg-blue-500/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-blue-100">Your template goes live immediately</p>
          <p className="mt-1 text-sm text-blue-200/75">Submitting publishes this template to the marketplace right away.</p>
        </div>
        <Button type="submit" size="lg" disabled={isPending || isUploading} className="w-full shrink-0 sm:w-auto">
          {isUploading ? "Uploading preview..." : isPending ? "Submitting..." : template ? "Submit changes" : "Submit template"}
        </Button>
      </div>
    </form>
  );
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
  defaultValue,
  placeholder,
  type = "text",
  required = false,
  min,
  step,
}: {
  label: string;
  name: string;
  defaultValue: string;
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
        defaultValue={defaultValue}
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
  defaultValue,
  placeholder,
  rows,
  maxLength,
  hint,
  required = false,
}: {
  label: string;
  name: string;
  defaultValue: string;
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
        defaultValue={defaultValue}
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

function joinList(values?: string[] | null) {
  return values?.join(", ") ?? "";
}

const initialTemplateFormState: TemplateFormState = {
  status: "idle",
  message: "",
};
