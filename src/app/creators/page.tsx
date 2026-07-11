import { ButtonLink } from "@/components/Button";
import { BusinessPreview } from "@/components/BusinessPreview";
import { MvpNotice } from "@/components/MvpNotice";
import { SectionHeading } from "@/components/SectionHeading";
import { getCategories } from "@/lib/marketplace";

const workflow = [
  {
    number: "01",
    title: "Upload a design",
    copy: "Turn a concept into a polished listing.",
  },
  {
    number: "02",
    title: "Get discovered",
    copy: "Buyers find it by business type and style.",
  },
  {
    number: "03",
    title: "Receive requests",
    copy: "Get a brief with budget and scope.",
  },
];

const creatorBenefits = [
  ["Turn concepts into leads", "Give strong portfolio work another way to be found."],
  ["Meet style-matched buyers", "Buyers contact you after seeing a direction they like."],
  ["Sell or customize", "Use one listing for templates and custom requests."],
  ["Start with a real brief", "Receive a reference, business type, and budget."],
];

const roadmap = [
  ["Now", "Creator accounts, uploads, and request inbox"],
  ["Next", "Payments and template delivery"],
  ["Later", "Deeper marketplace analytics"],
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
        <CreatorWorkflowScene />
        <div className="relative mx-auto flex min-h-[500px] max-w-[1280px] items-center px-5 py-14 sm:px-6 sm:py-16 lg:min-h-[560px] lg:px-8">
          <div className="max-w-[620px]">
            <p className="text-sm font-semibold uppercase text-blue-700">For creators</p>
            <h1 className="mt-4 text-balance text-[42px] font-bold leading-[1.03] text-slate-950 sm:text-[54px] lg:text-[58px]">
              Turn your best website concepts into warmer leads.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Upload website concepts, get discovered by style, and receive
              clearer project requests.
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
                Creator accounts and uploads are live. Payments are coming soon.
              </MvpNotice>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-950 px-5 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] grid-cols-3 divide-x divide-white/10">
          {[
            ["Upload designs", "Show your style"],
            ["Set your price", "Keep control"],
            ["Receive requests", "Start with context"],
          ].map(([title, label]) => (
            <div key={title} className="px-2 py-5 text-center sm:py-6">
              <p className="text-xs font-semibold text-white sm:text-base">{title}</p>
              <p className="mt-1 hidden text-sm text-slate-400 sm:block">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f6f7fb] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeading
            eyebrow="How creators use Webbly"
            title="Let the design start the conversation."
            description="Upload, get discovered, and receive a useful brief."
          />
          <div className="mt-10 grid gap-7 md:grid-cols-3">
            {workflow.map((step, index) => (
              <article key={step.number} className="border-t-2 border-slate-200 pt-5">
                <CreatorStepVisual step={index} />
                <div className="mt-5 flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">
                    {step.number}
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">{step.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{step.copy}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-blue-200 bg-[#eef3ff] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionHeading
            eyebrow="Why list on Webbly"
            title="Make your portfolio easier to discover."
            description="Buyers choose a direction before they ask for a quote."
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
              description="Preview the details buyers use to compare your work."
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

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(16,24,40,0.08)] sm:p-7">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-950">New template listing</p>
                <p className="mt-1 text-sm text-slate-500">Creator listing preview</p>
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
              <Field label="Website preview URL" placeholder="https://your-preview-site.com" />
              <Field label="Tools used" placeholder="Framer, Webflow, Shopify, Next.js..." />
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Description</span>
                <textarea
                  rows={5}
                  placeholder="Who is this for, and what is included?"
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
                <p className="mt-1 text-sm text-slate-600">PNG, JPEG, or WebP preview up to 5 MB.</p>
              </div>
              <ButtonLink href="/dashboard/templates/new" size="lg" className="w-full">
                Open Template Uploader
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="site-grid border-t border-slate-200 bg-[#f6f7fb] px-5 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1080px] flex-col gap-7 text-center sm:items-center">
          <p className="text-sm font-semibold uppercase text-blue-700">Build your marketplace presence</p>
          <h2 className="text-balance text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
            Show buyers the work you want to be hired for.
          </h2>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            Create a creator account, submit your work, and start receiving qualified website requests.
          </p>
          <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href="/signup" size="lg">Create a creator account</ButtonLink>
            <ButtonLink href="/templates" size="lg" variant="outline">Browse the marketplace</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

function CreatorWorkflowScene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="site-grid absolute inset-0 opacity-35" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_54%,rgba(255,255,255,0.92)_68%,rgba(255,255,255,0.2)_100%)]" />
      <div className="absolute right-4 top-1/2 hidden h-[500px] w-[560px] -translate-y-1/2 lg:block lg:opacity-50 xl:right-[calc((100vw-1280px)/2+96px)] xl:opacity-100">
        <div className="absolute left-32 top-16 z-10 w-[340px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_24px_60px_rgba(16,24,40,0.16)]">
          <div className="flex items-center justify-end gap-3 border-b border-slate-200 px-4 py-3">
            <p className="text-xs font-bold uppercase text-blue-700">Template upload</p>
            <span className="rounded-md bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-800">
              Draft
            </span>
          </div>
          <div className="bg-slate-50 p-1.5">
            <BusinessPreview category="Cafes & Bakeries" variant="category" />
          </div>
        </div>

        <div className="absolute left-0 top-5 z-20 w-[250px] rounded-lg border border-slate-200 bg-white p-4 shadow-[0_18px_45px_rgba(16,24,40,0.12)]">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-bold text-white">
              MS
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-950">Maya Studio</p>
                <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />
              </div>
              <p className="mt-0.5 text-xs text-slate-500">Cafe websites</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 divide-x divide-slate-200 border-t border-slate-100 pt-3 text-center">
            <div>
              <p className="text-sm font-bold text-slate-950">4.9 / 5</p>
              <p className="mt-1 text-[10px] uppercase text-slate-500">Rating</p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-950">18</p>
              <p className="mt-1 text-[10px] uppercase text-slate-500">Projects</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-1 left-4 z-30 w-[300px] rounded-lg border border-blue-200 bg-white p-4 shadow-[0_20px_50px_rgba(36,87,245,0.14)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-blue-700">New request</p>
              <p className="mt-1 text-sm font-bold text-slate-950">Cafe website customization</p>
            </div>
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <p className="text-xs font-medium text-slate-500">$2.5k-$5k budget</p>
            <span className="rounded-md bg-blue-600 px-3 py-1.5 text-[10px] font-bold text-white">
              Review brief
            </span>
          </div>
        </div>

        <div className="absolute bottom-4 right-0 z-40 w-[210px] rounded-lg bg-slate-950 p-4 text-white shadow-[0_20px_50px_rgba(16,24,40,0.2)]">
          <p className="text-xs font-semibold text-blue-300">Qualified leads</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <p className="text-3xl font-bold">12</p>
            <div className="flex items-end gap-1">
              {["h-3", "h-5", "h-7", "h-9"].map((height) => (
                <span key={height} className={`w-3 rounded-t bg-blue-400 ${height}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreatorStepVisual({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="h-36 rounded-md border border-slate-200 bg-[#eef3ff] p-4">
        <div className="grid h-full grid-cols-[1.15fr_0.85fr] gap-3 rounded-md border border-blue-100 bg-white p-3">
          <span className="rounded-md bg-gradient-to-br from-amber-100 to-orange-200" />
          <span className="grid gap-2">
            <span className="rounded-md bg-slate-100" />
            <span className="rounded-md bg-blue-100" />
            <span className="rounded-md bg-blue-600" />
          </span>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="h-36 rounded-md border border-slate-200 bg-[#f6f7fb] p-4">
        <span className="block h-8 rounded-md border border-slate-200 bg-white" />
        <div className="mt-3 grid grid-cols-3 gap-2">
          {["bg-amber-200", "bg-pink-200", "bg-blue-200"].map((color) => (
            <span key={color} className={`h-16 rounded-md ${color}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-36 rounded-md border border-slate-800 bg-slate-950 p-4 text-white">
      <div className="flex items-start justify-between">
        <div>
          <span className="block h-2 w-16 rounded-full bg-blue-400" />
          <span className="mt-3 block h-3 w-32 rounded-full bg-white/80" />
        </div>
        <span className="h-3 w-3 rounded-full bg-emerald-400" />
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="h-2 w-24 rounded-full bg-white/20" />
        <span className="h-8 w-24 rounded-md bg-blue-500" />
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
