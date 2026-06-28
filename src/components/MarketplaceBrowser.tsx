"use client";

import { useMemo, useState } from "react";
import {
  filterTemplates,
  getCategories,
  getPriceRanges,
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
  const [sort, setSort] = useState("best-match");

  const filteredTemplates = useMemo(() => {
    return filterTemplates({
      search,
      category,
      price,
      sort: sort as "best-match" | "popular" | "newest" | "budget-friendly",
    });
  }, [category, price, search, sort]);

  const hasActiveFilters = Boolean(search.trim()) || category !== "all" || price !== "all";

  function resetFilters() {
    setSearch("");
    setCategory("all");
    setPrice("all");
    setSort("best-match");
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-950/5 sm:p-5">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-slate-950">
              Find a template faster
            </p>
            <p className="text-sm text-slate-500">
              Search and filters update this curated preview instantly.
            </p>
          </div>
          <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
            Early preview
          </span>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_190px]">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Search
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by business type, creator, or tag"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Category
            </span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
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
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Price
            </span>
            <select
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Sort
            </span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            >
              <option value="best-match">Best match</option>
              <option value="popular">Popular</option>
              <option value="newest">Sort: Newest</option>
              <option value="budget-friendly">Budget-friendly</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
              category === "all"
                ? "bg-slate-950 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                category === item
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {hasActiveFilters ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {search.trim() ? (
              <FilterPill label={`Search: ${search.trim()}`} />
            ) : null}
            {category !== "all" ? <FilterPill label={category} /> : null}
            {price !== "all" ? (
              <FilterPill
                label={
                  priceRanges.find((range) => range.value === price)?.label ??
                  "Price filter"
                }
              />
            ) : null}
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full px-3 py-1 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
            >
              Reset filters
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-600">
          Showing {filteredTemplates.length} premium template matches
        </p>
        <p className="text-sm text-slate-500">
          Payments, accounts, and digital delivery are coming soon.
        </p>
      </div>

      {filteredTemplates.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.slug} template={template} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-xl font-black text-slate-950">
            No templates match those filters.
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
            Try a broader business type, remove the price filter, or sort by
            popular templates to browse the full preview catalog.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 h-11 rounded-full bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

function FilterPill({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
      {label}
    </span>
  );
}
