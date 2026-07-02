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
    <article className="group flex flex-col overflow-hidden rounded-[1.85rem] border border-slate-200 bg-white shadow-sm ring-1 ring-transparent transition-all duration-300 hover:-translate-y-2 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-900/10 hover:ring-blue-100">
      <ButtonLink
        href={`/templates/${template.slug}`}
        variant="ghost"
        className="relative block h-auto rounded-none p-1.5 hover:bg-transparent"
        aria-label={`View ${template.name} details`}
      >
        <TemplatePreview
          name={template.name}
          category={template.category}
          gradient={template.gradient}
        />
        <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-xs font-black text-slate-950 shadow-lg shadow-slate-950/10 backdrop-blur opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="truncate">View full details</span>
          <span className="rounded-full bg-blue-600 px-2.5 py-1 text-white">
            {template.popularity}% fit
          </span>
        </div>
      </ButtonLink>
      
      <div className="flex flex-1 flex-col p-5 sm:p-6 pt-2">
        <div className="mb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                  {template.category}
                </p>
                {template.isNew ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                    New
                  </span>
                ) : null}
              </div>
              <ButtonLink
                href={`/templates/${template.slug}`}
                variant="ghost"
                className="h-auto justify-start rounded-none p-0 text-left text-xl font-black text-slate-950 hover:bg-transparent hover:text-blue-700 transition-colors"
              >
                {template.name}
              </ButtonLink>
            </div>
            <p className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-black text-slate-900 shadow-sm mt-1">
              ${template.price}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-500">
            <p>Creator: <span className="font-semibold text-slate-700">{template.creator.name}</span></p>
            <p className="text-xs font-semibold bg-slate-100 px-2 py-1 rounded-md">{template.creator.responseTime}</p>
          </div>
        </div>

        {!compact ? (
          <div className="mb-6 space-y-4 flex-1">
            <div className="flex flex-wrap gap-2">
              {template.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-100"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-700 shadow-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
            <p className="line-clamp-2 text-sm leading-6 text-slate-500">
              {template.description}
            </p>
          </div>
        ) : <div className="flex-1" />}

        <div className="grid gap-2.5 sm:grid-cols-2 mt-auto">
          <ButtonLink href={`/templates/${template.slug}`} variant="secondary" className="bg-slate-950 text-white hover:bg-slate-800 shadow-md">
            View Details
          </ButtonLink>
          <RequestButton
            variant="outline"
            templateName={template.name}
            creatorName={template.creator.name}
            requestType="contact"
            className="border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          >
            Contact Creator
          </RequestButton>
        </div>
      </div>
    </article>
  );
}
