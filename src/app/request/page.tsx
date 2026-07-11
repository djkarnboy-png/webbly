import { RequestForm } from "@/components/RequestForm";

export const metadata = {
  title: "Request a Website | Webbly",
  description:
    "Tell a Webbly creator about your business, budget, preferred website style, and project needs.",
};

const requestTips = [
  ["Start with the business", "Explain what you sell and who the website needs to convince."],
  ["Name the style", "Reference a Webbly template or describe the visual direction you prefer."],
  ["Add useful constraints", "Share the rough budget, required pages, features, and launch timing."],
];

export default function RequestPage() {
  return (
    <section className="bg-[#f6f7fb] px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <aside className="site-grid overflow-hidden rounded-lg bg-slate-950 p-7 text-white lg:sticky lg:top-24 sm:p-9">
          <p className="text-sm font-semibold uppercase text-blue-300">Request a website</p>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.08] sm:text-5xl">
            Tell the creator what kind of website you want.
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-300">
            A clear brief helps a creator understand the business, the website
            direction you like, and the scope you may need next.
          </p>
          <div className="mt-8 hidden border-t border-white/15 lg:block">
            {requestTips.map(([title, copy], index) => (
              <div key={title} className="grid grid-cols-[32px_1fr] gap-3 border-b border-white/15 py-5">
                <span className="text-sm font-semibold text-blue-300">0{index + 1}</span>
                <div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs leading-5 text-slate-500">
            Frontend preview: submitting this form does not send or save data.
          </p>
        </aside>

        <RequestForm />
      </div>
    </section>
  );
}
