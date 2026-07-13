import Link from "next/link";
import { WebsiteCard } from "@/components/WebsiteCard";
import { getListedWebsites, type WebsiteSort } from "@/lib/websites-server";

export const metadata = {
  title: "Website Marketplace | Webbly",
  description: "Browse uploaded websites and preview them live before buying.",
};

const SORT_OPTIONS: { value: WebsiteSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

type MarketplacePageProps = {
  searchParams: Promise<{ sort?: string }>;
};

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const { sort: rawSort } = await searchParams;
  const sort: WebsiteSort = SORT_OPTIONS.some((option) => option.value === rawSort)
    ? (rawSort as WebsiteSort)
    : "newest";

  const { data: websites, error } = await getListedWebsites(sort);

  return (
    <section className="app-page px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-blue-400">Website marketplace</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-50 sm:text-4xl">
              Ready-made websites you can preview live.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Every listing is a real, working site. Open it, click around, then decide.
            </p>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-2">
          {SORT_OPTIONS.map((option) => (
            <Link
              key={option.value}
              href={`/marketplace?sort=${option.value}`}
              className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                sort === option.value
                  ? "border-blue-400/50 bg-blue-500/15 text-blue-200"
                  : "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>

        {error ? (
          <div
            className="mt-7 rounded-lg border border-rose-400/25 bg-rose-500/10 p-4 text-sm text-rose-100"
            role="alert"
          >
            Live listings are temporarily unavailable. Please try again shortly.
          </div>
        ) : null}

        {websites.length ? (
          <div className="mt-9 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {websites.map((website) => (
              <WebsiteCard key={website.id} website={website} />
            ))}
          </div>
        ) : (
          <div className="app-panel-soft mt-9 rounded-lg p-12 text-center">
            <h2 className="font-bold text-slate-50">No websites listed yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Check back soon, or upload your own from the dashboard.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
