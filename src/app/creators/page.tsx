import { ButtonLink } from "@/components/Button";
import { MvpNotice } from "@/components/MvpNotice";
import { getCategories } from "@/lib/marketplace";

const workflow = [
  ["Upload your template concept", "Package a sample site, unused concept, or portfolio direction into a clear marketplace listing."],
  ["Get discovered by small businesses", "Buyers browse by industry, style, tools, and budget instead of starting from a blank brief."],
  ["Sell templates or receive custom requests", "Turn one visual direction into productized sales and higher-intent custom project leads."],
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
                MVP demo: creator accounts, dashboards, analytics, and live
                uploads are mocked in the frontend only.
              </MvpNotice>
            </div>
          </div>

          <CreatorDashboardMockup />
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {workflow.map(([title, copy], index) => (
            <article
              key={title}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5"
            >
              <p className="text-sm font-black text-blue-600">0{index + 1}</p>
              <h2 className="mt-8 text-2xl font-black text-slate-950">{title}</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">{copy}</p>
            </article>
          ))}
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
              keeping the implementation frontend-only for this prototype.
            </p>
          </div>

          <form className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5">
            <div className="grid gap-5">
              <MvpNotice tone="slate" title="Prototype form">
                Submissions are not saved yet. This is designed to map cleanly
                to a future Supabase template table.
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
              <div className="rounded-2xl border border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-violet-50 p-6 text-center">
                <p className="font-black text-slate-950">Upload preview image</p>
                <p className="mt-2 text-sm text-slate-600">
                  Homepage screenshot, mockup, or polished template cover.
                </p>
              </div>
              <button
                type="button"
                className="h-12 rounded-full bg-slate-950 px-6 text-sm font-black text-white shadow-sm shadow-slate-950/20 transition hover:bg-slate-800"
              >
                Submit Template Demo
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
    <div className="rounded-[2rem] border border-white/80 bg-white/75 p-3 shadow-2xl shadow-blue-950/10 backdrop-blur">
      <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">
              Creator dashboard
            </p>
            <h2 className="mt-2 text-2xl font-black">Template performance</h2>
          </div>
          <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-black text-slate-950">
            Demo
          </span>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ["1.8k", "views"],
            ["48", "requests"],
            ["12", "shortlists"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl font-black">{value}</p>
              <p className="text-sm text-slate-300">{label}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-3">
          {["Salon booking", "Cafe menu", "Agency portfolio"].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/8 p-4">
              <div className="flex items-center justify-between">
                <p className="font-bold">{item}</p>
                <p className="text-xs text-slate-400">Live concept</p>
              </div>
              <div className="mt-4 h-2 rounded-full bg-white/10">
                <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-blue-400 to-violet-400" />
              </div>
            </div>
          ))}
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
