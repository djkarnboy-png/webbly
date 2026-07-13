import { ButtonLink } from "@/components/Button";
import { TemplateCard } from "@/components/TemplateCard";
import { requireViewer } from "@/lib/auth";
import { getSavedTemplates } from "@/lib/marketplace-server";

export const metadata = {
  title: "Saved Templates | Webbly",
  description: "Review the Webbly website templates you saved.",
};

export default async function SavedTemplatesPage() {
  const viewer = await requireViewer("/saved");
  const { data: templates, error } = await getSavedTemplates(viewer.id);

  return (
    <section className="app-page mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-blue-400">Your shortlist</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-50">Saved templates</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">
            Keep promising website directions together while you compare creators and styles.
          </p>
        </div>
        <ButtonLink href="/templates" variant="outline">
          Browse more templates
        </ButtonLink>
      </div>

      {error ? (
        <div className="mt-8 rounded-lg border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900">
          We could not load your saved templates. Please refresh and try again.
        </div>
      ) : templates.length ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard
              key={template.slug}
              template={template}
              canSave
              isSaved
            />
          ))}
        </div>
      ) : (
        <div className="app-panel-soft mt-8 rounded-lg border-dashed px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-slate-50">Your shortlist is empty</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
            Save templates that feel close to your business so you can compare them here.
          </p>
          <ButtonLink href="/templates" className="mt-6">
            Browse templates
          </ButtonLink>
        </div>
      )}
    </section>
  );
}
