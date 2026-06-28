import type { Template } from "@/data/templates";
import { ButtonLink } from "./Button";
import { RequestButton } from "./RequestButton";
import { TemplatePreview } from "./TemplatePreview";

type TemplateCardProps = {
  template: Template;
  compact?: boolean;
};

export function TemplateCard({ template, compact = false }: TemplateCardProps) {
  const tools = template.tools.slice(0, compact ? 2 : 3);

  return (
    <article className="group overflow-hidden rounded-[1.85rem] border border-slate-200/80 bg-white shadow-sm shadow-slate-950/5 ring-1 ring-transparent transition duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-950/14 hover:ring-blue-100">
      <ButtonLink
        href={`/templates/${template.slug}`}
        variant="ghost"
        className="relative block h-auto rounded-none p-0 hover:bg-transparent"
        aria-label={`View ${template.name} details`}
      >
        <TemplatePreview
          name={template.name}
          category={template.category}
          gradient={template.gradient}
        />
        <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/88 px-3 py-2 text-xs font-black text-slate-950 shadow-lg shadow-slate-950/10 backdrop-blur">
          <span className="truncate">Live preview mockup</span>
          <span className="rounded-full bg-blue-600 px-2.5 py-1 text-white">
            {template.popularity}% fit
          </span>
        </div>
      </ButtonLink>
      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold text-blue-600">
                  {template.category}
                </p>
                {template.isNew ? (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    New
                  </span>
                ) : null}
              </div>
              <ButtonLink
                href={`/templates/${template.slug}`}
                variant="ghost"
                className="mt-1 h-auto justify-start rounded-none p-0 text-left text-lg font-black text-slate-950 hover:bg-transparent hover:text-blue-700"
              >
                {template.name}
              </ButtonLink>
            </div>
            <p className="rounded-full border border-slate-200 bg-slate-950 px-3 py-1 text-sm font-black text-white shadow-sm">
              ${template.price}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-600">
            <p>by {template.creator.name}</p>
            <p className="font-semibold text-slate-500">{template.creator.responseTime}</p>
          </div>
        </div>

        {!compact ? (
          <>
            <div className="flex flex-wrap gap-2">
              {template.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
            <p className="line-clamp-2 text-sm leading-6 text-slate-600">
              {template.description}
            </p>
          </>
        ) : null}

        <div className="grid gap-2 sm:grid-cols-2">
          <ButtonLink href={`/templates/${template.slug}`} variant="secondary" className="shadow-md shadow-slate-950/15">
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
