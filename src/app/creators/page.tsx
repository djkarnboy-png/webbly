import { ButtonLink } from "@/components/Button";
import { MvpNotice } from "@/components/MvpNotice";
import { getCategories } from "@/lib/marketplace";

const workflow = [
  ["Upload your template concept", "Package a sample site, unused concept, or portfolio direction into a clear marketplace listing."],
  ["Get discovered by small businesses", "Buyers browse by industry, style, tools, and budget instead of starting from a blank brief."],
  ["Sell templates or receive custom requests", "Turn one visual direction into productized sales and higher-intent custom project leads."],
];

const creatorBenefits = [
  ["Productize portfolio work", "Reuse polished concepts that were never sold, then turn them into searchable template listings."],
  ["Win warmer leads", "Buyers contact you after already choosing a visual direction, category, and approximate budget."],
  ["Keep pricing flexible", "Show template prices now and leave room for custom website requests as Webbly grows."],
];

export const metadata = {
  title: "For Creators | Webbly",
  description:
    "List business website templates on Webbly and connect with small businesses looking for templates or custom websites.",
};

export default function CreatorsPage() {
  const categories = getCategories();

  return (
    <section className="bg-[radial-gradient(circle_at_top_right,#dbeafe,transparent_32%),linear-gradient(180deg,#fff,#f8fafc)] px-6 py-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
              For creators
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
              Turn your website concepts into a marketplace channel.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Webbly gives freelancers, designers, and agencies a polished place
              to show business-ready website directions, sell templates, and win
              custom requests from buyers who already like their style.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/pricing" size="lg">
                See Creator Pricing
              </ButtonLink>
              <ButtonLink href="/templates" size="lg" variant="outline">
                View Marketplace
              </ButtonLink>
            </div>
            <div className="mt-7">
              <MvpNotice>
                Early preview: creator accounts, dashboards, analytics, and
                live uploads are shown as frontend-only product concepts.
              </MvpNotice>
            </div>
          </div>

          <CreatorDashboardMockup />
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {workflow.map(([title, copy], index) => (
            <article
              key={title}
              className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5"
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-100 blur-2xl" />
              <p className="text-sm font-black text-blue-600">0{index + 1}</p>
              <h2 className="mt-8 text-2xl font-black text-slate-950">{title}</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">{copy}</p>
              <div className="mt-6 grid grid-cols-3 gap-2">
                <span className="h-11 rounded-2xl bg-slate-100" />
                <span className="h-11 rounded-2xl bg-blue-100" />
                <span className="h-11 rounded-2xl bg-violet-100" />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                Creator upside
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
                More than a template shelf.
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                This early preview is shaped around a future marketplace where a
                single listing can sell directly, start conversations, or become
                a custom project brief.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {creatorBenefits.map(([title, copy]) => (
                <article key={title} className="rounded-3xl bg-slate-50 p-5">
                  <span className="block h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-500" />
                  <h3 className="mt-5 text-lg font-black text-slate-950">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
              Upload flow
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
              A real product form, ready for a future backend.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              The UI captures the fields a marketplace listing needs today while
              keeping the implementation frontend-only for this preview.
            </p>
          </div>

          <form className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5">
            <div className="grid gap-5">
              <MvpNotice tone="slate" title="Frontend preview">
                Submissions are demo-only for now. The fields are structured so
                a future backend can store listings cleanly.
              </MvpNotice>
              <Field label="Template name" placeholder="Modern Cafe Website" />
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Category
                  </span>
                  <select className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <Field label="Price" placeholder="$149" />
              </div>
              <Field label="Website preview URL" placeholder="https://your-demo-site.com" />
              <Field label="Tools used" placeholder="Framer, Webflow, Shopify, Next.js..." />
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Description
                </span>
                <textarea
                  rows={5}
                  placeholder="Explain the ideal buyer, included sections, and what makes this template useful."
                  className="resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </label>
              <div className="rounded-2xl border border-dashed border-blue-200 bg-gradient-to-br from-blue-50 via-white to-violet-50 p-4">
                <div className="rounded-2xl border border-white/80 bg-white/75 p-4 shadow-sm">
                  <div className="grid grid-cols-[1.2fr_0.8fr] gap-3">
                    <span className="h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100" />
                    <div className="space-y-2">
                      <span className="block h-6 rounded-full bg-slate-200" />
                      <span className="block h-6 w-2/3 rounded-full bg-blue-200" />
                      <span className="block h-10 rounded-2xl bg-slate-950" />
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-center font-black text-slate-950">Upload preview image</p>
                <p className="mt-2 text-sm text-slate-600">
                  Homepage screenshot, mockup, or polished template cover.
                </p>
              </div>
              <button
                type="button"
                className="h-12 rounded-full bg-slate-950 px-6 text-sm font-black text-white shadow-sm shadow-slate-950/20 transition hover:bg-slate-800"
              >
                Submit Template Preview
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function CreatorDashboardMockup() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-blue-200/50 via-violet-200/50 to-cyan-100/50 blur-3xl opacity-80" />
      <div className="relative rounded-[2rem] border border-white/80 bg-white/80 p-3 shadow-2xl shadow-blue-950/15 backdrop-blur-md">
        <div className="rounded-[1.5rem] bg-slate-950 p-5 sm:p-6 text-white shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 h-64 w-64 bg-blue-500/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 h-64 w-64 bg-violet-500/10 blur-3xl rounded-full" />
          
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">
                Creator dashboard
              </p>
              <h2 className="mt-2 text-2xl font-black">Template performance</h2>
            </div>
            <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-black text-emerald-300 ring-1 ring-emerald-400/30 shadow-[inset_0_0_12px_rgba(52,211,153,0.3)]">
              Preview
            </span>
          </div>
          <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["1.8k", "views"],
              ["48", "requests"],
              ["12", "shortlists"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm transition hover:bg-white/10">
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-sm font-semibold text-slate-300">{label}</p>
              </div>
            ))}
          </div>
          <div className="relative mt-5 space-y-3">
            {["Salon booking", "Cafe menu", "Agency portfolio"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:bg-white/10">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-100">{item}</p>
                  <p className="text-xs font-semibold text-slate-400">Live concept</p>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-blue-400 to-violet-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                </div>
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
        className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}
