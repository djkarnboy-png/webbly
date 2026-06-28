import { notFound } from "next/navigation";
import { Button, ButtonLink } from "@/components/Button";
import { CreatorCard } from "@/components/CreatorCard";
import { MvpNotice } from "@/components/MvpNotice";
import { RequestButton } from "@/components/RequestButton";
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
    `${template.category} owners who need a polished launch direction`,
    `Teams that want ${template.tools.slice(0, 2).join(" or ")} as a starting point`,
    "Businesses that may want a creator to customize the template",
  ];

  return (
    <section className="bg-[linear-gradient(180deg,#fff,#f8fafc)] px-6 py-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
              {template.category} template
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
              {template.name}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              {template.description}
            </p>
            <div className="mt-8 rounded-[2rem] border border-white/80 bg-white p-3 shadow-2xl shadow-blue-950/10">
              <TemplatePreview
                name={template.name}
                category={template.category}
                gradient={template.gradient}
                size="hero"
              />
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/5">
              <p className="text-sm font-semibold text-slate-500">Template price</p>
              <p className="mt-1 text-4xl font-black text-slate-950">
                ${template.price}
              </p>
              <div className="mt-5 grid gap-3">
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
                  variant="outline"
                  templateName={template.name}
                  creatorName={template.creator.name}
                  requestType="contact"
                >
                  Contact Creator
                </RequestButton>
                <Button size="lg" variant="secondary" disabled>
                  Buy Template
                </Button>
              </div>
              <div className="mt-4">
                <MvpNotice tone="slate" title="Buying coming soon">
                  Checkout and downloadable template purchases are not active in
                  this early preview yet.
                </MvpNotice>
              </div>
            </div>

            <CreatorCard creator={template.creator} />
          </aside>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-4">
          <InfoBlock title="Features included" items={template.features} />
          <InfoBlock title="Pages included" items={template.pages} />
          <InfoBlock title="Tools used" items={template.tools} />
          <InfoBlock title="Best for" items={bestFor} />
        </div>

        <div className="mt-16">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
                Similar templates
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                More {template.category.toLowerCase()} options.
              </h2>
            </div>
            <ButtonLink href="/templates" variant="outline">
              Browse All
            </ButtonLink>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {similar.map((item) => (
              <TemplateCard key={item.slug} template={item} compact />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-slate-950">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
            <span className="mt-2 h-2 w-2 rounded-full bg-blue-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
