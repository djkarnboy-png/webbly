import { MarketplaceBrowser } from "@/components/MarketplaceBrowser";
import { getAllTemplates, getCategories } from "@/lib/marketplace";

export const metadata = {
  title: "Browse Website Templates | Webbly",
  description:
    "Search business website templates by category, style, creator, and price, then request a similar custom website.",
};

type TemplatesPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function TemplatesPage({ searchParams }: TemplatesPageProps) {
  const { category } = await searchParams;
  const templates = getAllTemplates();
  const categories = getCategories();

  return (
    <>
      <section className="border-b border-slate-200 bg-white px-5 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase text-blue-700">
              Template marketplace
            </p>
            <h1 className="mt-4 text-balance text-[38px] font-bold leading-[1.04] text-slate-950 sm:text-[54px]">
              Find a website direction that already fits your business.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Search by business type, compare realistic previews, and contact a
              creator when a layout feels close to what you want to build.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200 sm:mt-10">
            {[
              [String(templates.length), "curated template concepts"],
              [String(categories.length), "small-business categories"],
              ["1 request", "to start a creator conversation"],
            ].map(([value, label]) => (
              <div key={label} className="px-3 py-4 first:pl-0 last:pr-0 sm:px-6 sm:first:pl-0">
                <p className="text-xl font-bold text-slate-950 sm:text-2xl">{value}</p>
                <p className="mt-1 text-[11px] leading-4 text-slate-500 sm:text-sm sm:leading-5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6f7fb] px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <MarketplaceBrowser initialCategory={category} />
        </div>
      </section>
    </>
  );
}
