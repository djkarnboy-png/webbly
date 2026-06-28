import { ButtonLink } from "@/components/Button";
import { CategoryCard } from "@/components/CategoryCard";
import { CTASection } from "@/components/CTASection";
import { RequestButton } from "@/components/RequestButton";
import { TemplateCard } from "@/components/TemplateCard";
import { TemplatePreview } from "@/components/TemplatePreview";
import { getAllTemplates } from "@/lib/marketplace";

const stats = [
  ["120+", "template directions explored"],
  ["8", "business categories"],
  ["4.8/5", "mock buyer confidence"],
  ["48h", "typical creator reply goal"],
];

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

const steps = [
  ["Browse", "Compare business-ready website directions by industry, price, creator, and platform."],
  ["Shortlist", "Open details, review included pages, and decide which style feels closest to your brand."],
  ["Request", "Contact the creator or request a similar custom website from the same visual direction."],
];

const benefits = [
  {
    title: "For business owners",
    copy: "Stop guessing from a blank canvas. Start from proven structures for menus, booking, listings, products, courses, and lead generation.",
  },
  {
    title: "For creators",
    copy: "Turn unused concepts, sample sites, and portfolio work into template listings that can create sales and custom project leads.",
  },
];

const trustCards = [
  {
    title: "Request with context",
    copy: "Send the style you like, budget range, business type, and must-have pages so creators can reply with useful next steps.",
    metric: "5 min",
  },
  {
    title: "Compare real directions",
    copy: "Every listing is framed around the actual buying journey: preview, price, tools, pages, features, and creator response time.",
    metric: "12 listings",
  },
  {
    title: "Preview the workflow",
    copy: "Payments, accounts, and delivery are clearly marked as coming soon while buyers can still understand the request journey.",
    metric: "early preview",
  },
];

const processCards = [
  ["Pick a style", "Start from a template that already feels close to the business."],
  ["Send a brief", "Share budget, pages, timeline, and the visual direction you prefer."],
  ["Creator replies", "The future workflow is built around creators responding with a practical next step."],
];

export default function Home() {
  const templates = getAllTemplates();
  const featured = [
    templates.find((template) => template.slug === "restaurant-menu-website"),
    templates.find((template) => template.slug === "premium-salon-booking-site"),
    templates.find((template) => template.slug === "fitness-gym-landing-page"),
    templates.find((template) => template.slug === "online-clothing-store"),
    templates.find((template) => template.slug === "tutor-course-website"),
    templates.find((template) => template.slug === "creative-agency-portfolio"),
  ].filter(Boolean);

  const heroTemplate = templates[4] ?? templates[0];

  return (
    <>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_32%),linear-gradient(180deg,#fff,#f8fafc)] px-6 py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/75 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Early preview of the Webbly marketplace
            </div>
            <h1 className="mt-6 max-w-5xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Find a business website you love. Hire the creator behind it.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Webbly helps small businesses discover ready-made website
              templates, compare styles, and request custom websites from real
              creators.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/templates" size="lg">
                Browse Templates
              </ButtonLink>
              <RequestButton size="lg" variant="outline" requestType="general">
                Request a Website
              </RequestButton>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-sm font-semibold text-slate-600">
              {["Browse styles first", "Contact the creator", "Request a similar build"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-white/75 px-3 py-1.5 shadow-sm backdrop-blur"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur"
                >
                  <p className="text-2xl font-black text-slate-950">{value}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <MarketplaceMockup templateName={heroTemplate.name} />
        </div>
      </section>

      <section id="categories" className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Featured categories"
            title="Start with the kind of business you are building."
            copy="Each category is shaped around a real small-business workflow, not a generic website layout."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <SectionIntro
              eyebrow="Featured templates"
              title="Different businesses need different visual systems."
              copy="Restaurant menus, salon booking, gym conversion pages, ecommerce product grids, course pages, and agency portfolios all get distinct preview language."
            />
            <ButtonLink href="/templates" variant="outline">
              View marketplace
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((template) =>
              template ? <TemplateCard key={template.slug} template={template} /> : null,
            )}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-300">
                How it works
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                A marketplace flow for buyers and creators.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {steps.map(([title, copy], index) => (
                <article
                  key={title}
                  className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur"
                >
                  <p className="text-sm font-black text-blue-300">0{index + 1}</p>
                  <h3 className="mt-8 text-2xl font-black">{title}</h3>
                  <p className="mt-4 text-sm leading-6 text-slate-300">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm"
            >
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-blue-100/70 blur-2xl" />
              <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                {benefit.title}
              </p>
              <p className="relative mt-5 text-2xl font-black leading-tight text-slate-950 md:text-3xl">
                {benefit.copy}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Built for confidence"
            title="A marketplace preview that explains the next step."
            copy="Webbly now shows more of the real buying flow: what a buyer requests, what a creator sees, and which features are clearly marked as coming soon."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {trustCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-black text-slate-950">{card.title}</h3>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black uppercase text-blue-700">
                    {card.metric}
                  </span>
                </div>
                <p className="mt-5 text-sm leading-6 text-slate-600">{card.copy}</p>
                <div className="mt-6 grid grid-cols-3 gap-2">
                  <span className="h-12 rounded-2xl bg-slate-100" />
                  <span className="h-12 rounded-2xl bg-blue-100" />
                  <span className="h-12 rounded-2xl bg-violet-100" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <SectionIntro
            eyebrow="After you find a style"
            title="The request flow is built around real project context."
            copy="Business owners are not just browsing pictures. Webbly nudges them toward the details a creator needs to price and scope a useful next step."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {processCards.map(([title, copy], index) => (
              <article
                key={title}
                className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-xl font-black text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Browse a direction. Then request the website your business actually needs."
        description="Webbly is an early frontend preview, but the browsing and request journey is shaped around the premium marketplace it is meant to become."
      />
    </>
  );
}

function SectionIntro({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-lg leading-8 text-slate-600">{copy}</p>
    </div>
  );
}

function MarketplaceMockup({ templateName }: { templateName: string }) {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-blue-200 via-violet-200 to-cyan-100 blur-3xl" />
      <div className="relative rounded-[2rem] border border-white/80 bg-white/80 p-3 shadow-2xl shadow-blue-950/15 backdrop-blur">
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-4 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                Marketplace preview
              </p>
              <h3 className="mt-2 text-xl font-black">Style match board</h3>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-950">
              97% fit
            </span>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
            <TemplatePreview
              name={templateName}
              category="Online Stores"
              gradient="linear-gradient(135deg,#dbeafe,#ede9fe 45%,#fce7f3)"
              size="hero"
            />
            <div className="grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Request snapshot</span>
                  <span className="rounded-full bg-emerald-300 px-2 py-1 text-[10px] font-black text-slate-950">
                    Ready
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  <span className="block h-8 rounded-xl bg-white/12" />
                  <span className="block h-8 rounded-xl bg-white/10" />
                  <span className="block h-10 rounded-xl bg-gradient-to-r from-blue-400 to-violet-400" />
                </div>
              </div>
              {["Salon booking", "Cafe menu"].map((item, index) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/8 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{item}</span>
                    <span className="text-xs text-slate-400">{96 - index * 5}%</span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <span className="h-10 rounded-xl bg-white/15" />
                    <span className="h-10 rounded-xl bg-white/10" />
                    <span className="h-10 rounded-xl bg-blue-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 grid gap-3 rounded-2xl border border-white/10 bg-white/8 p-3 text-xs font-semibold text-slate-300 sm:grid-cols-3">
            <span>Browse styles before hiring</span>
            <span>See creator response time</span>
            <span>Request similar builds</span>
          </div>
        </div>
      </div>
    </div>
  );
}
