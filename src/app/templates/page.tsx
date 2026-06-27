import { MarketplaceBrowser } from "@/components/MarketplaceBrowser";

export const metadata = {
  title: "Browse Templates | Webbly",
  description:
    "Browse business website templates for cafes, restaurants, salons, gyms, tutors, stores, agencies, and real estate professionals.",
};

type TemplatesPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function TemplatesPage({ searchParams }: TemplatesPageProps) {
  const { category } = await searchParams;

  return (
    <section className="bg-[radial-gradient(circle_at_top_right,#ede9fe,transparent_30%),linear-gradient(180deg,#fff,#f8fafc)] px-6 py-14 sm:py-18">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
              Template marketplace
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
              Browse real business website directions.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Search by industry, compare prices, and contact creators when a
              template feels close to what your business needs.
            </p>
          </div>
          <div className="grid gap-3 rounded-[2rem] border border-white/80 bg-white/70 p-4 shadow-xl shadow-blue-950/5 backdrop-blur sm:grid-cols-3">
            {[
              ["Best match", "Sort by fit and usefulness"],
              ["Popular", "Prioritize high-interest concepts"],
              ["Budget-friendly", "Find lower-cost starting points"],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-2xl bg-slate-950 p-4 text-white">
                <p className="font-black">{title}</p>
                <p className="mt-2 text-xs leading-5 text-slate-300">{copy}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10">
          <MarketplaceBrowser initialCategory={category} />
        </div>
      </div>
    </section>
  );
}
