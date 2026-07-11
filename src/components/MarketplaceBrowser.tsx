"use client";

import { useMemo, useState } from "react";
import {
  filterTemplates,
  getCategories,
  getPriceRanges,
  type TemplateFilters,
} from "@/lib/marketplace";
import { TemplateCard } from "./TemplateCard";

type MarketplaceBrowserProps = {
  initialCategory?: string;
};

const categories = getCategories();
const priceRanges = getPriceRanges();

export function MarketplaceBrowser({
  initialCategory = "all",
}: MarketplaceBrowserProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    categories.includes(initialCategory) ? initialCategory : "all",
  );
  const [price, setPrice] = useState("all");
  const [sort, setSort] = useState<NonNullable<TemplateFilters["sort"]>>(
    "best-match",
  );

  const filteredTemplates = useMemo(
    () => filterTemplates({ search, category, price, sort }),
    [category, price, search, sort],
  );

  const hasActiveFilters =
    Boolean(search.trim()) || category !== "all" || price !== "all";

  function resetFilters() {
    setSearch("");
    setCategory("all");
    setPrice("all");
    setSort("best-match");
  }

  return (
    <div>
      <div className="rounded-lg border border-slate-200 bg-white shadow-[0_12px_30px_rgba(16,24,40,0.06)] lg:sticky lg:top-[84px] lg:z-20">
        <div className="grid gap-3 p-4 lg:grid-cols-[minmax(300px,1fr)_190px_180px_190px]">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase text-slate-500">
              Search marketplace
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by business type, style, or creator"
              className="h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase text-slate-500">
              Category
            </span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase text-slate-500">
              Price
            </span>
            <select
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase text-slate-500">
              Sort by
            </span>
            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as NonNullable<TemplateFilters["sort"]>)
              }
              className="h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="best-match">Best match</option>
              <option value="popular">Popular</option>
              <option value="newest">Newest</option>
              <option value="budget-friendly">Budget-friendly</option>
            </select>
          </label>
        </div>

        <div className="border-t border-slate-200 px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Template categories">
            <CategoryFilterButton
              active={category === "all"}
              onClick={() => setCategory("all")}
            >
              All templates
            </CategoryFilterButton>
            {categories.map((item) => (
              <CategoryFilterButton
                key={item}
                active={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </CategoryFilterButton>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-slate-900" aria-live="polite">
          {filteredTemplates.length} template
          {filteredTemplates.length === 1 ? "" : "s"} found
        </p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
            >
              Clear filters
            </button>
          ) : (
            <span>Curated marketplace catalog</span>
          )}
        </div>
      </div>

      {filteredTemplates.length > 0 ? (
        <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.slug} template={template} />
          ))}
        </div>
      ) : (
        <div className="mt-7 border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <p className="text-2xl font-bold text-slate-950">
            No templates match those filters.
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
            Try a broader search, choose another category, or clear the price
            filter to see more website directions.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 h-11 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Show all templates
          </button>
        </div>
      )}
    </div>
  );
}

function CategoryFilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-md border px-3 py-2 text-sm font-medium transition ${
        active
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
      }`}
    >
      {children}
    </button>
  );
}
