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
  const responseTime = template.creator.responseTime.replace(/^Usually\s+/i, "");

  return (
    <article
      data-template-card={template.slug}
      className="app-panel app-panel-hover group flex h-full flex-col overflow-hidden rounded-lg"
    >
      <div className="relative border-b border-white/10 bg-[#070b12] p-2.5">
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
          <span className="rounded-md border border-white/15 bg-[#070b12]/88 px-2.5 py-1.5 text-xs font-semibold text-slate-100 shadow-lg backdrop-blur">
            {template.popularity}% fit
          </span>
          {template.isNew ? (
            <span className="rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm">
              New
            </span>
          ) : (
            <span className="rounded-md border border-white/10 bg-[#070b12]/90 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur">
              Popular
            </span>
          )}
        </div>
      </div>

      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
        <div className="flex min-h-[70px] items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-blue-400">
              {template.category}
            </p>
            <ButtonLink
              href={`/templates/${template.slug}`}
              variant="ghost"
              className="mt-1 h-auto justify-start rounded-none border-0 p-0 text-left text-xl font-bold leading-7 text-slate-50 group-hover:text-blue-300 hover:bg-transparent hover:text-blue-300"
            >
              {template.name}
            </ButtonLink>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs font-medium text-slate-500">From</p>
            <p className="text-xl font-bold text-white">${template.price}</p>
          </div>
        </div>

        <p className="mt-2 min-h-[42px] text-sm leading-6 text-slate-400">
          {template.summary}
        </p>

        <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white shadow-[0_8px_18px_rgba(37,99,235,0.22)]">
            {template.creator.avatar}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-5 text-slate-100">
              {template.creator.name}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              {template.creator.verified ? (
                <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-bold uppercase text-blue-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  Verified
                </span>
              ) : null}
              <span className="truncate text-xs text-slate-500">
                {template.tools.slice(0, 2).join(" / ")}
              </span>
            </div>
          </div>
          <span className="shrink-0 rounded-md border border-amber-300/15 bg-amber-400/10 px-2 py-1 text-xs font-semibold text-amber-200">
            {template.creator.rating.toFixed(1)} / 5
          </span>
        </div>

        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-white/[0.07] bg-black/20 px-3 py-2 text-[11px] font-semibold text-slate-400">
          <span className="truncate" title={template.creator.responseTime}>
            {responseTime}
          </span>
          <span
            className="shrink-0"
            title={`${template.creator.completedProjects} completed projects`}
          >
            {template.creator.completedProjects} projects
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
