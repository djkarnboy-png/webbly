import { ButtonLink } from "@/components/Button";
import { BusinessPreview } from "@/components/BusinessPreview";
import { CategoryCard } from "@/components/CategoryCard";
import { CreatorCard } from "@/components/CreatorCard";
import { CTASection } from "@/components/CTASection";
import { RequestButton } from "@/components/RequestButton";
import { SectionHeading } from "@/components/SectionHeading";
import { TemplateCard } from "@/components/TemplateCard";
import type { Template } from "@/data/templates";
import { categories as featuredCategories } from "@/data/categories";
import { getViewer } from "@/lib/auth";
import { getPublishedTemplates, getSavedTemplateIds } from "@/lib/marketplace-server";

const browseSteps = [
  ["01", "Browse styles", "Pick a business category."],
  ["02", "Choose a direction", "Compare the preview and creator."],
  ["03", "Send a request", "Share your needs and budget."],
];

const businessBenefits = [
  {
    title: "Preview before you hire",
    copy: "Compare real page directions before you contact anyone.",
    visual: "preview" as const,
  },
  {
    title: "No blank briefs",
    copy: "Start from a style and share only the details that matter.",
    visual: "brief" as const,
  },
  {
    title: "Contact the right creator",
    copy: "See the maker, rating, and fit beside every template.",
    visual: "creator" as const,
  },
];

const audiencePanels = [
  {
    eyebrow: "For business owners",
    title: "Choose a direction in minutes.",
    copy: "See the website first, then reach out with a clear starting point.",
    points: ["Business-ready previews", "Clear starting prices", "Verified creator details"],
    href: "/templates",
    action: "Browse the marketplace",
    tone: "light" as const,
  },
  {
    eyebrow: "For creators",
    title: "Let your work start the conversation.",
    copy: "Show buyers what you make and receive briefs with real context.",
    points: ["List strong concepts", "Receive clearer requests", "Keep control of pricing"],
    href: "/creators",
    action: "See how listing works",
    tone: "dark" as const,
  },
];

export default async function Home() {
  const { data: templates, error: marketplaceError } =
    await getPublishedTemplates();
  const viewer = await getViewer();
  const savedTemplateIds = await getSavedTemplateIds(
    viewer?.emailVerified ? viewer.id : undefined,
  );
  const featured = [
    "restaurant-menu-website",
    "premium-salon-booking-site",
    "fitness-gym-landing-page",
    "online-clothing-store",
    "tutor-course-website",
    "creative-agency-portfolio",
  ]
    .map((slug) => templates.find((template) => template.slug === slug))
    .filter((template) => template !== undefined);
  const heroTemplates = [
    "modern-cafe-website",
    "premium-salon-booking-site",
    "online-clothing-store",
  ]
    .map((slug) => templates.find((template) => template.slug === slug))
    .filter((template) => template !== undefined);
  const featuredCreators = [templates[0], templates[1], templates[7]].filter(
    (template) => template !== undefined,
  );

  return (
    <>
      <section className="app-page relative isolate overflow-hidden border-b border-white/10">
        <HeroTemplateStack templates={heroTemplates} />
        <div className="relative mx-auto flex min-h-[450px] max-w-[1280px] items-center px-5 py-12 sm:min-h-[520px] sm:px-6 sm:py-16 lg:min-h-[570px] lg:px-8">
          <div className="max-w-[660px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-2 text-sm font-semibold text-blue-200 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
              Website inspiration with a creator attached
            </div>
            <h1 className="mt-5 text-balance text-[44px] font-bold leading-[1.02] text-white sm:text-[56px] lg:text-[60px]">
              Find a website style you love. Hire the creator behind it.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              Browse real website directions, then contact the creator to adapt
              one for your business.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/templates" size="lg">
                Browse Templates
              </ButtonLink>
              <RequestButton size="lg" variant="outline" requestType="general">
                Request a Website
              </RequestButton>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-slate-400">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Preview before you hire
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                Verified creators
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                No blank briefs
              </span>
            </div>
            {heroTemplates[0] ? (
              <div className="app-panel mt-8 overflow-hidden rounded-lg p-2 lg:hidden">
                <BusinessPreview
                  category={heroTemplates[0].category}
                  name={heroTemplates[0].name}
                  gradient={heroTemplates[0].gradient}
                  variant="stack"
                />
                <div className="flex items-center justify-between gap-4 px-2 pb-1 pt-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase text-blue-400">
                      {heroTemplates[0].category}
                    </p>
                    <p className="mt-1 truncate text-sm font-bold text-slate-100">
                      {heroTemplates[0].name}
                    </p>
                  </div>
                  <p className="shrink-0 text-base font-bold text-white">
                    ${heroTemplates[0].price}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#070b12] text-white">
        <div className="mx-auto grid max-w-[1280px] grid-cols-3 divide-x divide-white/10 px-4 sm:px-6 lg:px-8">
          {browseSteps.map(([number, title]) => (
            <div key={title} className="flex items-center justify-center gap-2 px-2 py-4 sm:gap-4 sm:px-5 sm:py-5">
              <span className="text-sm font-semibold text-blue-300">{number}</span>
              <p className="text-xs font-semibold text-white sm:text-base">{title}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="categories" className="app-section px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          {marketplaceError ? (
            <div className="mb-7 rounded-lg border border-rose-400/25 bg-rose-500/10 p-4 text-sm text-rose-100" role="alert">
              Live templates are temporarily unavailable. Please try again shortly.
            </div>
          ) : null}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Featured categories"
              title="Start with the kind of business you are building."
              description="Each preview reflects a different business and customer journey."
            />
            <ButtonLink href="/templates" variant="outline">
              View all templates
            </ButtonLink>
          </div>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCategories.map((category) => (
              <CategoryCard
                key={category}
                name={category}
                count={templates.filter((template) => template.category === category).length}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="app-section-raised border-y border-white/10 px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Featured templates"
              title="Website directions you can judge at a glance."
              description="Compare the preview, price, and creator before you send a request."
            />
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              12 curated concepts in this preview
            </div>
          </div>
          <div className="mt-9 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((template) => (
              <TemplateCard
                key={template.slug}
                template={template}
                canSave={Boolean(viewer)}
                verified={Boolean(viewer?.emailVerified)}
                isSaved={Boolean(template.id && savedTemplateIds.includes(template.id))}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="app-section border-y border-white/10 px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeading
            eyebrow="How it works"
            title="Browse. Choose. Request."
            description="Three simple steps from inspiration to a creator conversation."
          />
          <ol className="mt-10 grid gap-7 lg:grid-cols-3">
            {browseSteps.map(([number, title, copy], index) => (
              <li
                key={title}
                className="border-t-2 border-white/12 pt-5"
              >
                <HowStepVisual step={index} />
                <div className="mt-5 flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">
                    {number}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-slate-50">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-blue-400/10 bg-[linear-gradient(180deg,#0b111c_0%,#080c13_100%)] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeading
            eyebrow="Why businesses use Webbly"
            title="Less guessing. Better conversations."
            description="A clear path from website inspiration to the right creator."
          />
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {businessBenefits.map((benefit) => (
              <article
                key={benefit.title}
                className="app-panel-soft rounded-lg p-5"
              >
                <BusinessBenefitVisual kind={benefit.visual} />
                <h3 className="mt-5 text-xl font-bold leading-tight text-slate-50">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{benefit.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="app-section px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="edge-glow mx-auto grid max-w-[1280px] overflow-hidden rounded-lg border border-white/12 lg:grid-cols-2">
          {audiencePanels.map((panel) => (
            <article
              key={panel.eyebrow}
              className={`p-7 sm:p-10 ${
                panel.tone === "dark"
                  ? "bg-[#080d15] text-white"
                  : "bg-[#0e1520] text-white"
              }`}
            >
              <AudienceVisual tone={panel.tone} />
              <p className="text-sm font-semibold uppercase text-blue-300">
                {panel.eyebrow}
              </p>
              <h2 className="mt-4 text-balance text-3xl font-bold leading-tight">
                {panel.title}
              </h2>
              <p className={`mt-4 text-base leading-7 ${panel.tone === "dark" ? "text-slate-300" : "text-slate-400"}`}>
                {panel.copy}
              </p>
              <ul className="mt-7 divide-y divide-white/10">
                {panel.points.map((point) => (
                  <li key={point} className="flex items-center gap-3 py-3 text-sm font-medium">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                      +
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <ButtonLink
                href={panel.href}
                variant={panel.tone === "dark" ? "outline" : "secondary"}
                className="mt-7"
              >
                {panel.action}
              </ButtonLink>
            </article>
          ))}
        </div>
      </section>

      <section className="app-section-raised border-t border-white/10 px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Featured creators"
              title="Meet creators through the work they want to make more of."
              description="Compare ratings, delivery windows, reviews, and response times."
            />
            <ButtonLink href="/creators" variant="outline">
              For creators
            </ButtonLink>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {featuredCreators.map((template) => (
              <CreatorCard
                key={template.creator.name}
                creator={template.creator}
                specialty={template.category + " websites"}
                showReview
              />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Find the style first. Make the next conversation count."
        description="Browse real website directions and contact the creator when one feels right."
      />
    </>
  );
}

function HeroTemplateStack({ templates }: { templates: Template[] }) {
  const positions = [
    "left-0 top-24 z-10 w-[300px] -rotate-2 opacity-90",
    "right-0 top-2 z-20 w-[315px] rotate-2",
    "bottom-0 left-24 z-30 w-[360px]",
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="site-grid absolute inset-0 opacity-35" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#05070b_0%,#05070b_52%,rgba(5,7,11,0.92)_67%,rgba(5,7,11,0.18)_100%)]" />
      <div className="absolute inset-y-0 right-0 w-[58%] bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.14),rgba(109,40,217,0.06)_42%,transparent_72%)]" />
      <div className="absolute right-4 top-1/2 hidden h-[520px] w-[560px] -translate-y-1/2 lg:block lg:opacity-50 xl:right-[calc((100vw-1280px)/2+96px)] xl:opacity-100">
        {templates.map((template, index) => (
          <HeroStackCard
            key={template.slug}
            template={template}
            className={positions[index] ?? positions[0]}
            featured={index === templates.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function HeroStackCard({
  template,
  className,
  featured,
}: {
  template: Template;
  className: string;
  featured: boolean;
}) {
  return (
    <article
      className={`absolute overflow-hidden rounded-lg border border-white/15 bg-[#0b1018] shadow-[0_30px_80px_rgba(0,0,0,0.52),0_0_40px_rgba(37,99,235,0.08)] ${className}`}
    >
      <div className="relative border-b border-white/10 bg-[#070b12] p-1.5">
        <BusinessPreview
          category={template.category}
          name={template.name}
          gradient={template.gradient}
          variant="stack"
        />
        {!featured ? (
          <span className="absolute bottom-3 right-3 rounded-md bg-slate-950 px-2 py-1 text-xs font-bold text-white shadow-sm">
            ${template.price}
          </span>
        ) : null}
      </div>
      {featured ? (
        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase text-blue-400">
                {template.category}
              </span>
              <p className="mt-1 text-base font-bold text-slate-50">
                {template.name}
              </p>
            </div>
            <p className="shrink-0 text-lg font-bold text-white">
              ${template.price}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-[9px] font-bold text-white">
                {template.creator.avatar}
              </span>
              <p className="text-xs font-semibold text-slate-300">
                {template.creator.name} / {template.creator.rating.toFixed(1)}
              </p>
            </div>
            <span className="shrink-0 rounded-md bg-blue-600 px-2.5 py-1.5 text-[10px] font-bold text-white">
              View style
            </span>
          </div>
        </div>
      ) : null}
    </article>
  );
}

function HowStepVisual({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="h-36 rounded-md border border-slate-200 bg-[#f6f7fb] p-4">
        <div className="flex items-center gap-2">
          <span className="h-7 flex-1 rounded-md border border-slate-200 bg-white" />
          <span className="h-7 w-16 rounded-md bg-slate-950" />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {["bg-amber-200", "bg-pink-200", "bg-emerald-300", "bg-indigo-200", "bg-violet-200", "bg-sky-200"].map(
            (color) => (
              <span key={color} className={`h-8 rounded-md ${color}`} />
            ),
          )}
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="relative h-36 overflow-hidden rounded-md border border-slate-200 bg-[#eef3ff]">
        <div className="absolute left-5 top-5 h-24 w-[54%] rounded-md border border-slate-200 bg-white p-2 shadow-sm">
          <span className="block h-12 rounded bg-amber-100" />
          <span className="mt-2 block h-2 w-2/3 rounded-full bg-slate-200" />
        </div>
        <div className="absolute bottom-4 right-5 h-24 w-[54%] rounded-md border-2 border-blue-500 bg-white p-2 shadow-md">
          <span className="block h-12 rounded bg-violet-100" />
          <div className="mt-2 flex items-center justify-between">
            <span className="block h-2 w-1/2 rounded-full bg-slate-200" />
            <span className="h-4 w-4 rounded-full bg-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-36 rounded-md border border-slate-200 bg-slate-950 p-4">
      <div className="grid grid-cols-2 gap-2">
        <span className="h-8 rounded-md bg-white/10" />
        <span className="h-8 rounded-md bg-white/10" />
      </div>
      <span className="mt-2 block h-8 rounded-md bg-white/10" />
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="h-2 flex-1 rounded-full bg-white/15" />
        <span className="h-8 w-24 rounded-md bg-blue-500" />
      </div>
    </div>
  );
}

function BusinessBenefitVisual({
  kind,
}: {
  kind: (typeof businessBenefits)[number]["visual"];
}) {
  if (kind === "preview") {
    return (
      <div className="relative h-28 overflow-hidden rounded-md bg-[#f6f7fb] p-3">
        <div className="absolute left-4 top-5 h-20 w-[62%] -rotate-2 rounded-md border border-slate-200 bg-white p-2 shadow-sm">
          <span className="block h-7 rounded bg-amber-100" />
          <span className="mt-2 block h-1.5 w-3/4 rounded-full bg-slate-200" />
        </div>
        <div className="absolute bottom-3 right-4 h-20 w-[62%] rotate-2 rounded-md border-2 border-blue-500 bg-white p-2 shadow-md">
          <span className="block h-7 rounded bg-violet-100" />
          <div className="mt-2 flex items-center justify-between">
            <span className="h-1.5 w-1/2 rounded-full bg-slate-200" />
            <span className="h-4 w-4 rounded-full bg-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  if (kind === "brief") {
    return (
      <div className="h-28 rounded-md bg-slate-950 p-4">
        <div className="grid grid-cols-2 gap-2">
          <span className="h-7 rounded bg-white/10" />
          <span className="h-7 rounded bg-white/10" />
        </div>
        <span className="mt-2 block h-7 rounded bg-white/10" />
        <div className="mt-3 flex items-center gap-3">
          <span className="h-1.5 flex-1 rounded-full bg-white/15" />
          <span className="h-6 w-20 rounded bg-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-28 items-center justify-center rounded-md bg-blue-50 p-4">
      <div className="flex w-full items-center gap-3 rounded-md border border-blue-200 bg-white p-3 shadow-sm">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-[10px] font-bold text-white">
          MS
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold text-slate-950">Maya Studio</p>
          <p className="mt-1 text-[8px] text-slate-500">Verified cafe specialist</p>
          <span className="mt-2 block h-1.5 w-3/4 rounded-full bg-blue-100" />
        </div>
        <span className="rounded bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-800">4.9</span>
      </div>
    </div>
  );
}

function AudienceVisual({ tone }: { tone: "light" | "dark" }) {
  if (tone === "light") {
    return (
      <div className="relative mb-8 h-40 overflow-hidden rounded-md bg-[#eef3ff]">
        <div className="absolute left-5 top-5 h-24 w-[48%] -rotate-3 rounded-md border border-slate-200 bg-white p-2 shadow-sm">
          <span className="block h-12 rounded bg-amber-100" />
          <span className="mt-2 block h-1.5 w-3/4 rounded bg-slate-200" />
        </div>
        <div className="absolute right-5 top-8 h-24 w-[48%] rotate-3 rounded-md border border-slate-200 bg-white p-2 shadow-md">
          <span className="block h-12 rounded bg-pink-100" />
          <div className="mt-2 flex items-center justify-between">
            <span className="h-1.5 w-1/2 rounded bg-slate-200" />
            <span className="h-4 w-4 rounded-full bg-blue-600" />
          </div>
        </div>
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-slate-950 px-3 py-1.5 text-[9px] font-bold text-white shadow">
          Style selected
        </span>
      </div>
    );
  }

  return (
    <div className="relative mb-8 h-40 overflow-hidden rounded-md border border-white/10 bg-white/[0.04] p-4">
      <div className="w-[58%] rounded-md border border-white/10 bg-slate-900 p-3">
        <div className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-full bg-blue-500" />
          <div>
            <p className="text-[9px] font-bold text-white">Orbit Works</p>
            <p className="mt-1 text-[7px] text-slate-400">3 templates live</p>
          </div>
        </div>
        <span className="mt-3 block h-8 rounded bg-blue-500/20" />
      </div>
      <div className="absolute bottom-4 right-4 w-[58%] rounded-md border border-blue-400/30 bg-blue-500 p-3 shadow-lg">
        <p className="text-[8px] font-bold text-white">New website request</p>
        <p className="mt-1 text-[7px] text-blue-100">Cafe / $1,500-$3,000</p>
        <span className="mt-2 block h-1.5 w-2/3 rounded bg-white/30" />
      </div>
    </div>
  );
}
