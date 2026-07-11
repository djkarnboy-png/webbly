import Link from "next/link";
import type { Template } from "@/data/templates";
import { ButtonLink } from "./Button";
import { RequestButton } from "./RequestButton";
import { TemplatePreview } from "./TemplatePreview";

type TemplateCardProps = {
  template: Template;
  compact?: boolean;
};

export function TemplateCard({ template, compact = false }: TemplateCardProps) {
  return (
    <article
      data-template-card={template.slug}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_20px_45px_rgba(16,24,40,0.12)]"
    >
      <div className="relative border-b border-slate-200 bg-slate-50 p-2">
        <Link
          href={`/templates/${template.slug}`}
          className="block w-full rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          aria-label={`View ${template.name} details`}
        >
          <TemplatePreview
            name={template.name}
            category={template.category}
            gradient={template.gradient}
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

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-blue-700">
              {template.category}
            </p>
            <ButtonLink
              href={`/templates/${template.slug}`}
              variant="ghost"
              className="mt-1 h-auto justify-start rounded-none border-0 p-0 text-left text-xl font-bold leading-7 text-slate-950 hover:bg-transparent hover:text-blue-700"
            >
              {template.name}
            </ButtonLink>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-slate-500">From</p>
            <p className="text-xl font-bold text-slate-950">${template.price}</p>
          </div>
        </div>

        {!compact ? (
          <>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
              {template.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {template.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        ) : null}

        <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
            {template.creator.avatar}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {template.creator.name}
            </p>
            <p className="truncate text-xs text-slate-500">
              {template.creator.responseTime}
            </p>
          </div>
          <div className="hidden flex-wrap justify-end gap-1 sm:flex">
            {template.tools.slice(0, 2).map((tool) => (
              <span
                key={tool}
                className="rounded border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-600"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <ButtonLink href={`/templates/${template.slug}`} variant="secondary">
            View Details
          </ButtonLink>
          <RequestButton
            variant="outline"
            templateName={template.name}
            creatorName={template.creator.name}
            requestType="contact"
          >
            Contact Creator
          </RequestButton>
        </div>
      </div>
    </article>
  );
}
