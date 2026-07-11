import { ButtonLink } from "@/components/Button";
import { CategoryCard } from "@/components/CategoryCard";
import { CreatorCard } from "@/components/CreatorCard";
import { CTASection } from "@/components/CTASection";
import { RequestButton } from "@/components/RequestButton";
import { SectionHeading } from "@/components/SectionHeading";
import { TemplateCard } from "@/components/TemplateCard";
import { TemplatePreview } from "@/components/TemplatePreview";
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
  ["01", "Browse templates", "Filter by business type, budget, or creator."],
  ["02", "Choose a style", "Compare previews, pages, tools, and fit."],
  ["03", "Request a website", "Send the creator a useful project brief."],
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
  const heroTemplate =
    templates.find((template) => template.slug === "online-clothing-store") ??
    templates[0];
  const featuredCreators = [templates[0], templates[1], templates[7]].filter(
    (template) => template !== undefined,
  );

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-slate-200 bg-white">
        <HeroMarketplaceScene
          name={heroTemplate.name}
          category={heroTemplate.category}
          gradient={heroTemplate.gradient}
          popularity={heroTemplate.popularity}
          creator={heroTemplate.creator}
        />
        <div className="relative mx-auto flex min-h-[450px] max-w-[1280px] items-center px-5 py-12 sm:min-h-[520px] sm:px-6 sm:py-16 lg:min-h-[570px] lg:px-8">
          <div className="max-w-[760px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-3 py-2 text-sm font-semibold text-blue-800 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Website inspiration with a creator attached
            </div>
            <h1 className="mt-5 max-w-[740px] text-balance text-[44px] font-bold leading-[1.02] text-slate-950 sm:text-[56px] lg:text-[64px]">
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

      <section className="overflow-x-auto border-b border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto grid min-w-[720px] max-w-[1280px] grid-cols-3 divide-x divide-white/10 px-4 sm:px-6 lg:px-8">
          {browseSteps.map(([number, title, copy]) => (
            <div key={title} className="flex items-center gap-4 px-5 py-5 first:pl-0 last:pr-0">
              <span className="text-sm font-semibold text-blue-300">{number}</span>
              <div>
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-1 text-xs text-slate-400">{copy}</p>
              </div>
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

      <section id="how-it-works" className="bg-slate-950 px-5 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <SectionHeading
            eyebrow="How it works"
            title="From browsing to a useful creator brief."
            description="Choose a direction first, then share the context a creator needs."
            inverse
          />
          <ol className="border-t border-white/15">
            {browseSteps.map(([number, title, copy]) => (
              <li
                key={title}
                className="grid gap-3 border-b border-white/15 py-6 sm:grid-cols-[72px_220px_1fr] sm:items-start"
              >
                <span className="text-sm font-semibold text-blue-300">{number}</span>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <p className="text-sm leading-6 text-slate-400">{copy}</p>
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

function HeroMarketplaceScene({
  name,
  category,
  gradient,
  popularity,
  creator,
}: {
  name: string;
  category: string;
  gradient: string;
  popularity: number;
  creator: Template["creator"];
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="site-grid absolute inset-0 opacity-50" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_48%,rgba(255,255,255,0.92)_62%,rgba(255,255,255,0.25)_100%)]" />
      <div className="absolute -bottom-24 -right-40 w-[430px] opacity-25 sm:-right-28 sm:w-[560px] lg:-bottom-28 lg:right-[-5%] lg:w-[56%] lg:opacity-100">
        <TemplatePreview
          name={name}
          category={category}
          gradient={gradient}
          size="hero"
        />
        <div className="absolute -left-10 top-20 hidden w-56 rounded-lg border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(16,24,40,0.14)] xl:block">
          <p className="text-xs font-semibold uppercase text-blue-700">Style match</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-950">Online store</span>
            <span className="text-sm font-bold text-emerald-600">{popularity}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <span
              className="block h-full rounded-full bg-blue-600"
              style={{ width: `${popularity}%` }}
            />
          </div>
        </div>
        <div className="absolute -left-16 bottom-24 hidden w-64 rounded-lg border border-slate-200 bg-slate-950 p-4 text-white shadow-[0_18px_50px_rgba(16,24,40,0.2)] xl:block">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Verified creator</p>
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-400">
            {creator.responseTime}. {creator.rating.toFixed(1)} rating across {creator.completedProjects} completed projects.
          </p>
        </div>
      </div>
    </div>
  );
}
