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
    <article className="group overflow-hidden rounded-[1.7rem] border border-slate-200/80 bg-white shadow-sm shadow-slate-950/5 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-950/12">
      <ButtonLink
        href={`/templates/${template.slug}`}
        variant="ghost"
        className="block h-auto rounded-none p-0 hover:bg-transparent"
        aria-label={`View ${template.name} details`}
      >
        <TemplatePreview
          name={template.name}
          category={template.category}
          gradient={template.gradient}
        />
      </ButtonLink>
      <div className="space-y-5 p-5">
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
            <p className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-black text-slate-950 shadow-sm">
              ${template.price}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-600">
            <p>by {template.creator.name}</p>
            <p className="font-semibold text-slate-500">{template.popularity}% fit</p>
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
