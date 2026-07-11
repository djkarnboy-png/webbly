import { ButtonLink } from "@/components/Button";
import { BusinessPreview } from "@/components/BusinessPreview";
import { CategoryCard } from "@/components/CategoryCard";
import { CreatorCard } from "@/components/CreatorCard";
import { CTASection } from "@/components/CTASection";
import { RequestButton } from "@/components/RequestButton";
import { SectionHeading } from "@/components/SectionHeading";
import { TemplateCard } from "@/components/TemplateCard";
import type { Template } from "@/data/templates";
import { getAllTemplates } from "@/lib/marketplace";

const featuredCategories = [
  "Restaurants",
  "Cafes",
  "Salons",
  "Gyms",
  "Tutors",
  "Online Stores",
  "Agencies",
  "Real Estate",
];

const browseSteps = [
  ["01", "Browse styles", "Pick a business category."],
  ["02", "Choose a direction", "Compare the preview and creator."],
  ["03", "Send a request", "Share your needs and budget."],
];

const businessBenefits = [
  {
    label: "Preview before you hire",
    title: "Start with something concrete.",
    copy: "Choose the layout and mood before the first conversation.",
    metric: "4.9/5",
    metricLabel: "average creator rating",
  },
  {
    label: "Built for small businesses",
    title: "See what the website needs to do.",
    copy: "Menus, bookings, products, courses, and listings are visible at a glance.",
    metric: "8",
    metricLabel: "business categories",
  },
  {
    label: "No blank briefs",
    title: "Send useful context from the start.",
    copy: "Share your business, budget, preferred style, and project needs in one brief.",
    metric: "5 min",
    metricLabel: "to share a brief",
  },
];

const audiencePanels = [
  {
    eyebrow: "For business owners",
    title: "Find the look before committing to the build.",
    copy: "Compare clear website directions and contact a creator whose work already fits.",
    points: ["Industry-specific previews", "Clear starting prices", "Creator response details"],
    href: "/templates",
    action: "Browse the marketplace",
    tone: "light" as const,
  },
  {
    eyebrow: "For creators",
    title: "Turn portfolio work into warmer leads.",
    copy: "Let buyers discover your style through the kind of website they already need.",
    points: ["Productize unused concepts", "Receive clearer briefs", "Keep control of pricing"],
    href: "/creators",
    action: "See how listing works",
    tone: "dark" as const,
  },
];

export default function Home() {
  const templates = getAllTemplates();
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
      <section className="relative isolate overflow-hidden border-b border-slate-200 bg-white">
        <HeroTemplateStack templates={heroTemplates} />
        <div className="relative mx-auto flex min-h-[450px] max-w-[1280px] items-center px-5 py-12 sm:min-h-[520px] sm:px-6 sm:py-16 lg:min-h-[570px] lg:px-8">
          <div className="max-w-[660px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-3 py-2 text-sm font-semibold text-blue-800 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Website inspiration with a creator attached
            </div>
            <h1 className="mt-5 text-balance text-[44px] font-bold leading-[1.02] text-slate-950 sm:text-[56px] lg:text-[60px]">
              Find a website style you love. Hire the creator behind it.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
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
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-slate-600">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                Preview before you hire
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
                Verified creators
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                No blank briefs
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto grid max-w-[1280px] grid-cols-3 divide-x divide-white/10 px-4 sm:px-6 lg:px-8">
          {browseSteps.map(([number, title]) => (
            <div key={title} className="flex items-center justify-center gap-2 px-2 py-4 sm:gap-4 sm:px-5 sm:py-5">
              <span className="text-sm font-semibold text-blue-300">{number}</span>
              <p className="text-xs font-semibold text-white sm:text-base">{title}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="categories" className="bg-[#f6f7fb] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
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

      <section className="border-y border-slate-200 bg-white px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Featured templates"
              title="Website directions you can judge at a glance."
              description="Compare the preview, price, and creator before you send a request."
            />
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              12 curated concepts in this preview
            </div>
          </div>
          <div className="mt-9 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((template) => (
              <TemplateCard key={template.slug} template={template} />
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-slate-200 bg-white px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
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
                className="border-t-2 border-slate-200 pt-5"
              >
                <HowStepVisual step={index} />
                <div className="mt-5 flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">
                    {number}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-slate-950">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#eef3ff] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeading
            eyebrow="Why businesses use Webbly"
            title="Choose with more confidence."
            description="See the direction, creator track record, and next step before reaching out."
          />
          <div className="mt-10 grid border-y border-blue-200 lg:grid-cols-3 lg:divide-x lg:divide-blue-200">
            {businessBenefits.map((benefit) => (
              <article key={benefit.title} className="border-b border-blue-200 py-7 last:border-b-0 lg:border-b-0 lg:px-7 lg:first:pl-0 lg:last:pr-0">
                <p className="text-sm font-semibold text-blue-700">{benefit.label}</p>
                <h3 className="mt-3 text-2xl font-bold leading-tight text-slate-950">
                  {benefit.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-slate-600">{benefit.copy}</p>
                <div className="mt-7 flex items-end gap-3">
                  <span className="text-3xl font-bold text-slate-950">{benefit.metric}</span>
                  <span className="pb-1 text-sm text-slate-500">{benefit.metricLabel}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] overflow-hidden rounded-lg border border-slate-200 lg:grid-cols-2">
          {audiencePanels.map((panel) => (
            <article
              key={panel.eyebrow}
              className={`p-7 sm:p-10 ${
                panel.tone === "dark"
                  ? "bg-slate-950 text-white"
                  : "bg-white text-slate-950"
              }`}
            >
              <p className={`text-sm font-semibold uppercase ${panel.tone === "dark" ? "text-blue-300" : "text-blue-700"}`}>
                {panel.eyebrow}
              </p>
              <h2 className="mt-4 text-balance text-3xl font-bold leading-tight">
                {panel.title}
              </h2>
              <p className={`mt-4 text-base leading-7 ${panel.tone === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                {panel.copy}
              </p>
              <ul className={`mt-7 divide-y ${panel.tone === "dark" ? "divide-white/10" : "divide-slate-200"}`}>
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
                className={`mt-7 ${panel.tone === "dark" ? "border-white/25 bg-white text-slate-950 hover:bg-blue-50" : ""}`}
              >
                {panel.action}
              </ButtonLink>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-[#f6f7fb] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
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
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_54%,rgba(255,255,255,0.92)_68%,rgba(255,255,255,0.25)_100%)]" />
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
      className={`absolute overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_24px_60px_rgba(16,24,40,0.16)] ${className}`}
    >
      <div className="relative border-b border-slate-200 bg-slate-50 p-1.5">
        <BusinessPreview category={template.category} variant="category" />
        {!featured ? (
          <>
            <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2 py-1 text-[10px] font-bold uppercase text-slate-900 shadow-sm">
              {template.category}
            </span>
            <span className="absolute bottom-3 right-3 rounded-md bg-slate-950 px-2 py-1 text-xs font-bold text-white shadow-sm">
              ${template.price}
            </span>
          </>
        ) : null}
      </div>
      {featured ? (
        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase text-blue-700">
                {template.category}
              </span>
              <p className="mt-1 text-base font-bold text-slate-950">
                {template.name}
              </p>
            </div>
            <p className="shrink-0 text-lg font-bold text-slate-950">
              ${template.price}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-[9px] font-bold text-white">
                {template.creator.avatar}
              </span>
              <p className="text-xs font-semibold text-slate-700">
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
