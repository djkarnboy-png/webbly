"use client";

import { useMemo, useState } from "react";
import {
  filterTemplates,
  getCategories,
  getPriceRanges,
  type TemplateFilters,
} from "@/lib/marketplace";
import type { Template } from "@/data/templates";
import { TemplateCard } from "./TemplateCard";

type MarketplaceBrowserProps = {
  templates: Template[];
  initialCategory?: string;
  loadError?: string | null;
  savedTemplateIds?: string[];
  canSave?: boolean;
};

const categories = getCategories();
const priceRanges = getPriceRanges();

export function MarketplaceBrowser({
  templates,
  initialCategory = "all",
  loadError,
  savedTemplateIds = [],
  canSave = false,
}: MarketplaceBrowserProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    categories.some((item) => item === initialCategory) ? initialCategory : "all",
  );
  const [price, setPrice] = useState("all");
  const [sort, setSort] = useState<NonNullable<TemplateFilters["sort"]>>(
    "best-match",
  );

  const filteredTemplates = useMemo(
    () => filterTemplates(templates, { search, category, price, sort }),
    [category, price, search, sort, templates],
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
      {loadError ? (
        <div className="mb-5 rounded-lg border border-rose-400/25 bg-rose-500/10 p-4 text-sm text-rose-100" role="alert">
          The marketplace could not load right now. Refresh the page or try again shortly.
        </div>
      ) : null}
      <div className="app-panel rounded-lg lg:sticky lg:top-[84px] lg:z-20">
        <div className="grid gap-3 p-4 lg:grid-cols-[minmax(300px,1fr)_190px_180px_190px]">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase text-slate-400">
              Search marketplace
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search templates or creators"
              className="dark-field h-12 w-full rounded-md px-4 text-sm outline-none transition"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase text-slate-400">
              Category
            </span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="dark-field h-12 w-full rounded-md px-3 text-sm font-medium outline-none transition"
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
            <span className="mb-2 block text-xs font-semibold uppercase text-slate-400">
              Price
            </span>
            <select
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="dark-field h-12 w-full rounded-md px-3 text-sm font-medium outline-none transition"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase text-slate-400">
              Sort by
            </span>
            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as NonNullable<TemplateFilters["sort"]>)
              }
              className="dark-field h-12 w-full rounded-md px-3 text-sm font-medium outline-none transition"
            >
              <option value="best-match">Best match</option>
              <option value="popular">Popular</option>
              <option value="newest">Newest</option>
              <option value="budget-friendly">Budget-friendly</option>
            </select>
          </label>
        </div>

        <div className="border-t border-white/10 px-4 py-3">
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

      <div className="mt-7 flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-slate-100" aria-live="polite">
          {filteredTemplates.length} template
          {filteredTemplates.length === 1 ? "" : "s"} found
        </p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-md border border-white/15 bg-white/[0.035] px-3 py-2 font-semibold text-slate-300 transition hover:border-blue-400/60 hover:text-blue-300"
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
            <TemplateCard
              key={template.slug}
              template={template}
              canSave={canSave}
              isSaved={Boolean(template.id && savedTemplateIds.includes(template.id))}
            />
          ))}
        </div>
      ) : (
        <div className="app-panel-soft mt-7 rounded-lg border-dashed px-6 py-16 text-center">
          <p className="text-2xl font-bold text-slate-50">
            No templates match those filters.
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
            Try a broader search, choose another category, or clear the price
            filter to see more website directions.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 h-11 rounded-lg border border-blue-500 bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500"
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
          ? "border-blue-500 bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.2)]"
          : "border-white/12 bg-white/[0.035] text-slate-400 hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-blue-200"
      }`}
    >
      {children}
    </button>
  );
}
