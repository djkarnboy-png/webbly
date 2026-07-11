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
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_8px_24px_rgba(16,24,40,0.07)] transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_24px_50px_rgba(16,24,40,0.14)]"
    >
      <div className="relative border-b border-slate-200 bg-slate-100 p-1.5">
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
              className="mt-1 h-auto justify-start rounded-none border-0 p-0 text-left text-xl font-bold leading-7 text-slate-950 hover:bg-transparent hover:text-blue-700 group-hover:text-blue-700"
            >
              {template.name}
            </ButtonLink>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs font-medium text-slate-500">From</p>
            <p className="text-xl font-bold text-slate-950">${template.price}</p>
          </div>
        </div>

        {!compact ? (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              {template.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                >
                  {tag}
                </span>
              ))}
              {template.tags.length > 2 ? (
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                  +{template.tags.length - 2}
                </span>
              ) : null}
            </div>
            <blockquote className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
              &ldquo;{template.creator.review}&rdquo;
            </blockquote>
          </>
        ) : null}

        <div className="mt-5 grid grid-cols-3 divide-x divide-slate-200 rounded-md border border-slate-200 bg-slate-50 py-3 text-center">
          <div className="px-2">
            <p className="text-sm font-bold text-slate-950">{template.creator.rating.toFixed(1)}</p>
            <p className="mt-0.5 text-[10px] font-medium uppercase text-slate-500">Rating</p>
          </div>
          <div className="px-2">
            <p className="text-sm font-bold text-slate-950">{template.creator.completedProjects}</p>
            <p className="mt-0.5 text-[10px] font-medium uppercase text-slate-500">Projects</p>
          </div>
          <div className="px-2">
            <p className="text-sm font-bold text-slate-950">{template.creator.deliveryTime}</p>
            <p className="mt-0.5 text-[10px] font-medium uppercase text-slate-500">Delivery</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
            {template.creator.avatar}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate text-sm font-semibold text-slate-900">
                {template.creator.name}
              </p>
              {template.creator.verified ? (
                <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-bold uppercase text-blue-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  Verified
                </span>
              ) : null}
            </div>
            <p className="truncate text-xs text-slate-500">
              {template.creator.responseTime}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <RequestButton
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
