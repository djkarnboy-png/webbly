import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, ButtonLink } from "@/components/Button";
import { CreatorCard } from "@/components/CreatorCard";
import { MvpNotice } from "@/components/MvpNotice";
import { RequestButton } from "@/components/RequestButton";
import { SectionHeading } from "@/components/SectionHeading";
import { TemplateCard } from "@/components/TemplateCard";
import { TemplatePreview } from "@/components/TemplatePreview";
import {
  getAllTemplates,
  getSimilarTemplates,
  getTemplateBySlug,
} from "@/lib/marketplace";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllTemplates().map((template) => ({ slug: template.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);

  if (!template) {
    return { title: "Template Not Found | Webbly" };
  }

  return {
    title: `${template.name} | Webbly`,
    description: template.description,
  };
}

export default async function TemplateDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);

  if (!template) {
    notFound();
  }

  const similar = getSimilarTemplates(template);
  const bestFor = [
    `${template.category} owners who want a credible launch direction`,
    `Teams that prefer ${template.tools.slice(0, 2).join(" or ")}`,
    "Businesses that want a creator to customize the starting point",
  ];

  return (
    <>
      <section className="border-b border-slate-200 bg-white px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/templates" className="font-medium transition hover:text-blue-700">
              Templates
            </Link>
            <span>/</span>
            <span>{template.category}</span>
            <span>/</span>
            <span className="text-slate-900">{template.name}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  {template.category}
                </span>
                {template.isNew ? (
                  <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    New listing
                  </span>
                ) : (
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    Popular direction
                  </span>
                )}
              </div>
              <h1 className="mt-4 text-balance text-[40px] font-bold leading-[1.05] text-slate-950 sm:text-[54px]">
                {template.name}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                {template.description}
              </p>

              <div className="mt-8 rounded-lg border border-slate-200 bg-slate-100 p-2 shadow-[0_18px_45px_rgba(16,24,40,0.09)] sm:p-3">
                <TemplatePreview
                  name={template.name}
                  category={template.category}
                  gradient={template.gradient}
                  size="hero"
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <span key={tag} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-[92px]">
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(16,24,40,0.08)] sm:p-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Template price</p>
                    <p className="mt-1 text-4xl font-bold text-slate-950">${template.price}</p>
                  </div>
                  <span className="pb-1 text-sm text-slate-500">starting template price</span>
                </div>

                <div className="mt-6 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200 py-4">
                  <div className="pr-3">
                    <p className="text-lg font-bold text-slate-950">{template.creator.rating.toFixed(1)}</p>
                    <p className="mt-1 text-xs text-slate-500">creator rating</p>
                  </div>
                  <div className="px-3">
                    <p className="text-lg font-bold text-slate-950">{template.creator.completedProjects}</p>
                    <p className="mt-1 text-xs text-slate-500">projects</p>
                  </div>
                  <div className="pl-3">
                    <p className="text-sm font-bold text-slate-950">{template.creator.deliveryTime}</p>
                    <p className="mt-1 text-xs text-slate-500">typical delivery</p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-slate-600">
                  Start a conversation with the creator. You are not buying or committing to a project yet.
                </p>
                <div className="mt-6 grid gap-3">
                  <RequestButton
                    size="lg"
                    templateName={template.name}
                    creatorName={template.creator.name}
                    requestType="similar"
                  >
                    Request Similar Website
                  </RequestButton>
                  <RequestButton
                    size="lg"
                    variant="secondary"
                    templateName={template.name}
                    creatorName={template.creator.name}
                    requestType="contact"
                  >
                    Contact Creator
                  </RequestButton>
                  <Button size="lg" variant="outline" disabled>
                    Template purchase coming soon
                  </Button>
                </div>
                <div className="mt-5">
                  <MvpNotice tone="slate" title="Payments and accounts coming soon">
                    Preview templates and contact creators now. Checkout and downloads will be added later.
                  </MvpNotice>
                </div>
              </div>

              <CreatorCard creator={template.creator} showReview />
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f7fb] px-5 py-14 sm:px-6 sm:py-18 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <InfoBlock title="Features included" items={template.features} />
            <InfoBlock title="Pages included" items={template.pages} />
            <InfoBlock title="Tools used" items={template.tools} />
            <InfoBlock title="Best for" items={bestFor} />
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white px-5 py-14 sm:px-6 sm:py-18 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Similar templates"
              title={`More ${template.category.toLowerCase()} directions.`}
              description="Compare another style before choosing a creator."
            />
            <ButtonLink href="/templates" variant="outline">
              Browse all templates
            </ButtonLink>
          </div>
          <div className="mt-9 grid gap-6 md:grid-cols-3">
            {similar.map((item) => (
              <TemplateCard key={item.slug} template={item} compact />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      <ul className="mt-4 divide-y divide-slate-100">
        {items.map((item) => (
          <li key={item} className="flex gap-3 py-3 text-sm leading-6 text-slate-600 first:pt-0 last:pb-0">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
