import { ButtonLink } from "@/components/Button";
import { MvpNotice } from "@/components/MvpNotice";
import { SectionHeading } from "@/components/SectionHeading";
import { getCategories } from "@/lib/marketplace";

const workflow = [
  {
    number: "01",
    title: "Publish a design direction",
    copy: "Turn a sample site, unused concept, or portfolio project into a clear marketplace listing.",
  },
  {
    number: "02",
    title: "Get discovered through style",
    copy: "Small businesses browse by category and visual direction before they decide who to contact.",
  },
  {
    number: "03",
    title: "Receive a better starting brief",
    copy: "Requests arrive with business type, budget, preferred style, and the project context you need.",
  },
];

const creatorBenefits = [
  ["Turn unused website designs into leads", "Give polished concepts another route to earn attention instead of leaving them in an archive."],
  ["Get clients who already like your style", "The template does the early visual alignment before the buyer opens a conversation."],
  ["Sell templates or receive custom requests", "One listing can support productized sales and higher-value custom work later."],
  ["No cold DMs, no blank briefs", "Buyers start with a real reference, a business type, and a rough budget."],
];

const roadmap = [
  ["Now", "Frontend listing and request preview"],
  ["Next", "Creator accounts and saved listings"],
  ["Later", "Payments, delivery, and marketplace analytics"],
];

export const metadata = {
  title: "For Website Creators | Webbly",
  description:
    "List business website concepts, get discovered through your style, and receive custom project requests from small businesses.",
};

export default function CreatorsPage() {
  const categories = getCategories();

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-slate-200 bg-white">
        <CreatorDashboardScene />
        <div className="relative mx-auto flex min-h-[500px] max-w-[1280px] items-center px-5 py-14 sm:px-6 sm:py-16 lg:min-h-[560px] lg:px-8">
          <div className="max-w-[720px]">
            <p className="text-sm font-semibold uppercase text-blue-700">For creators</p>
            <h1 className="mt-4 text-balance text-[42px] font-bold leading-[1.03] text-slate-950 sm:text-[56px] lg:text-[62px]">
              Turn your best website concepts into warmer leads.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Show small businesses the kind of work you want to make more of,
              sell templates later, and receive custom requests from buyers who
              already understand your style.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#upload-preview" size="lg">
                Preview a listing
              </ButtonLink>
              <ButtonLink href="/pricing" size="lg" variant="outline">
                View creator pricing
              </ButtonLink>
            </div>
            <div className="mt-7 max-w-xl">
              <MvpNotice>
                Creator accounts and live uploads are not active yet. This page
                previews how the future listing workflow will feel.
              </MvpNotice>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-950 px-5 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] grid-cols-3 divide-x divide-white/10">
          {[
            ["Unlimited", "future Pro listings"],
            ["48h", "reply-time goal"],
            ["100%", "creator-controlled pricing"],
          ].map(([value, label]) => (
            <div key={label} className="py-5 text-center sm:py-6">
              <p className="text-xl font-bold sm:text-2xl">{value}</p>
              <p className="mt-1 text-[11px] text-slate-400 sm:text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f6f7fb] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeading
            eyebrow="How creators use Webbly"
            title="Let the design start the conversation."
            description="The workflow is deliberately simple: publish a visual direction, get found by the right business type, and receive a request with useful context."
          />
          <div className="mt-10 grid border-y border-slate-200 md:grid-cols-3 md:divide-x md:divide-slate-200">
            {workflow.map((step) => (
              <article key={step.number} className="border-b border-slate-200 py-7 last:border-b-0 md:border-b-0 md:px-7 md:first:pl-0 md:last:pr-0">
                <p className="text-sm font-semibold text-blue-700">{step.number}</p>
                <h2 className="mt-5 text-2xl font-bold leading-tight text-slate-950">
                  {step.title}
                </h2>
                <p className="mt-4 text-sm leading-6 text-slate-600">{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-blue-200 bg-[#eef3ff] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionHeading
            eyebrow="Why list on Webbly"
            title="Make portfolio work easier to discover and easier to buy."
            description="Webbly is built around higher-intent discovery, where buyers choose a direction before asking a creator to scope the work."
          />
          <div className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
            {creatorBenefits.map(([title, copy]) => (
              <article key={title} className="border-t border-blue-200 py-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white">
                  +
                </div>
                <h3 className="mt-4 text-xl font-bold leading-tight text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="upload-preview" className="bg-white px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <SectionHeading
              eyebrow="Listing preview"
              title="Package your work like a marketplace product."
              description="Use the fields below to see how a future Webbly listing will capture the information buyers need to compare your template."
            />
            <div className="mt-8 border-y border-slate-200">
              {roadmap.map(([phase, item]) => (
                <div key={phase} className="grid grid-cols-[72px_1fr] gap-4 border-b border-slate-200 py-4 last:border-b-0">
                  <span className="text-sm font-semibold text-blue-700">{phase}</span>
                  <span className="text-sm text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(16,24,40,0.08)] sm:p-7">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-950">New template listing</p>
                <p className="mt-1 text-sm text-slate-500">Frontend preview only</p>
              </div>
              <span className="w-fit rounded-md bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
                Draft
              </span>
            </div>

            <div className="mt-6 grid gap-5">
              <Field label="Template name" placeholder="Modern Cafe Website" />
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">Category</span>
                  <select className="h-12 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <Field label="Starting price" placeholder="$149" />
              </div>
              <Field label="Website preview URL" placeholder="https://your-demo-site.com" />
              <Field label="Tools used" placeholder="Framer, Webflow, Shopify, Next.js..." />
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Description</span>
                <textarea
                  rows={5}
                  placeholder="Explain the ideal buyer, included sections, and what makes this template useful."
                  className="resize-none rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>
              <div className="rounded-lg border border-dashed border-blue-300 bg-blue-50 px-5 py-8 text-center">
                <div className="mx-auto grid h-28 max-w-xs grid-cols-[1.2fr_0.8fr] gap-2 rounded-md border border-blue-200 bg-white p-2 shadow-sm">
                  <span className="rounded bg-gradient-to-br from-blue-100 to-violet-100" />
                  <span className="grid gap-2">
                    <span className="rounded bg-slate-100" />
                    <span className="rounded bg-blue-100" />
                    <span className="rounded bg-slate-950" />
                  </span>
                </div>
                <p className="mt-4 font-semibold text-slate-950">Upload a template cover</p>
                <p className="mt-1 text-sm text-slate-600">PNG or JPG preview. Uploads are not active yet.</p>
              </div>
              <button
                type="button"
                className="h-12 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(36,87,245,0.18)] transition hover:bg-blue-700"
              >
                Preview Template Listing
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="site-grid border-t border-slate-200 bg-[#f6f7fb] px-5 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1080px] flex-col gap-7 text-center sm:items-center">
          <p className="text-sm font-semibold uppercase text-blue-700">Build your marketplace presence</p>
          <h2 className="text-balance text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
            Show buyers the work you want to be hired for.
          </h2>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            Explore the creator plans, then use this frontend preview to shape the listing you want to publish later.
          </p>
          <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href="/pricing" size="lg">View creator pricing</ButtonLink>
            <ButtonLink href="/templates" size="lg" variant="outline">Browse the marketplace</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

function CreatorDashboardScene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="site-grid absolute inset-0 opacity-45" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_51%,rgba(255,255,255,0.9)_68%,rgba(255,255,255,0.2)_100%)]" />
      <div className="absolute -bottom-16 -right-28 w-[430px] opacity-20 sm:w-[560px] lg:bottom-10 lg:right-[2%] lg:w-[46%] lg:opacity-100">
        <div className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-white shadow-[0_24px_70px_rgba(16,24,40,0.24)] sm:p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-blue-300">Creator workspace</p>
              <p className="mt-1 text-xl font-bold">Listing performance</p>
            </div>
            <span className="rounded-md bg-emerald-400/15 px-2 py-1 text-xs font-semibold text-emerald-300">Preview</span>
          </div>
          <div className="grid grid-cols-3 divide-x divide-white/10 border-b border-white/10 py-5">
            {[["1.8k", "views"], ["48", "requests"], ["12", "shortlists"]].map(([value, label]) => (
              <div key={label} className="px-4 first:pl-0">
                <p className="text-2xl font-bold">{value}</p>
                <p className="mt-1 text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {["Salon booking", "Cafe menu", "Agency portfolio"].map((item, index) => (
              <div key={item} className="grid grid-cols-[42px_1fr_auto] items-center gap-3 border-b border-white/10 pb-3 last:border-b-0">
                <span className={`h-9 rounded ${["bg-pink-300", "bg-amber-300", "bg-blue-300"][index]}`} />
                <div>
                  <p className="text-sm font-semibold">{item}</p>
                  <div className="mt-2 h-1.5 rounded-full bg-white/10">
                    <span className="block h-full rounded-full bg-blue-400" style={{ width: `${82 - index * 9}%` }} />
                  </div>
                </div>
                <span className="text-xs text-slate-400">Live</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        placeholder={placeholder}
        className="h-12 rounded-md border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}
