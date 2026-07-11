import Link from "next/link";
import type { Template } from "@/data/templates";
import { ButtonLink } from "./Button";
import { RequestButton } from "./RequestButton";
import { SaveTemplateButton } from "./SaveTemplateButton";
import { TemplatePreview } from "./TemplatePreview";

type TemplateCardProps = {
  template: Template;
  compact?: boolean;
  isSaved?: boolean;
  canSave?: boolean;
};

export function TemplateCard({
  template,
  compact = false,
  isSaved = false,
  canSave = false,
}: TemplateCardProps) {
  return (
    <article
      data-template-card={template.slug}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_8px_24px_rgba(16,24,40,0.07)] transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_24px_50px_rgba(16,24,40,0.14)]"
    >
      <div className="relative border-b border-slate-200 bg-slate-100 p-2">
        {template.id ? (
          <div className="absolute right-4 top-4 z-10">
            <SaveTemplateButton
              templateId={template.id}
              initialSaved={isSaved}
              canSave={canSave}
              compact
            />
          </div>
        ) : null}
        <Link
          href={`/templates/${template.slug}`}
          className="block w-full rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          aria-label={`View ${template.name} details`}
        >
          <TemplatePreview
            name={template.name}
            category={template.category}
            gradient={template.gradient}
            previewImageUrl={template.previewImageUrl}
          />
        </Link>
        <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
          <span className="rounded-md border border-white/70 bg-white/92 px-2.5 py-1.5 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur">
            {template.popularity}% fit
          </span>
          {template.isNew ? (
            <span className="rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm">
              New
            </span>
          ) : (
            <span className="rounded-md bg-slate-950/90 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur">
              Popular
            </span>
          )}
        </div>
      </div>

      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
        <div className="flex min-h-[70px] items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-blue-700">
              {template.category}
            </p>
            <ButtonLink
              href={`/templates/${template.slug}`}
              variant="ghost"
              className="mt-1 h-auto justify-start rounded-none border-0 p-0 text-left text-xl font-bold leading-7 text-slate-950 group-hover:text-blue-700 hover:bg-transparent hover:text-blue-700"
            >
              {template.name}
            </ButtonLink>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs font-medium text-slate-500">From</p>
            <p className="text-xl font-bold text-slate-950">${template.price}</p>
          </div>
        </div>

        <p className="mt-2 min-h-[42px] text-sm leading-6 text-slate-600">
          {template.summary}
        </p>

        <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
            {template.creator.avatar}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-5 text-slate-900">
              {template.creator.name}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              {template.creator.verified ? (
                <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-bold uppercase text-blue-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  Verified
                </span>
              ) : null}
              <span className="truncate text-xs text-slate-500">
                {template.tools.slice(0, 2).join(" / ")}
              </span>
            </div>
          </div>
          <span className="shrink-0 rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
            {template.creator.rating.toFixed(1)} / 5
          </span>
        </div>

        <div className="mt-auto grid gap-2 pt-5 sm:grid-cols-2">
          <RequestButton
            templateId={template.id}
            creatorId={template.creator.id}
            templateName={template.name}
            creatorName={template.creator.name}
            requestType="contact"
          >
            Contact Creator
          </RequestButton>
          <ButtonLink href={`/templates/${template.slug}`} variant="outline">
            View Details
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
