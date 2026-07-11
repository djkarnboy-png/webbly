import {
  categories,
  priceRanges,
  templates,
  type Template,
} from "@/data/templates";

export type TemplateFilters = {
  search?: string;
  category?: string;
  price?: string;
  sort?: "best-match" | "popular" | "newest" | "budget-friendly" | "price-low" | "price-high";
};

export type WebsiteRequestInput = {
  name: string;
  email: string;
  businessType: string;
  budget: string;
  style?: string;
  message: string;
  templateName?: string;
  creatorName?: string;
  templateId?: string;
  creatorId?: string;
  requestType?: "similar" | "contact" | "general";
};

export function getAllTemplates() {
  return templates;
}

export function getTemplateBySlug(slug: string) {
  return templates.find((template) => template.slug === slug);
}

export function getCategories() {
  return categories;
}

export function getPriceRanges() {
  return priceRanges;
}

export function getSimilarTemplates(template: Template, limit = 3) {
  const similar = templates.filter(
    (item) => item.category === template.category && item.slug !== template.slug,
  );

  return (similar.length ? similar : templates).slice(0, limit);
}

export function filterTemplates(
  catalog: Template[],
  {
    search = "",
    category = "all",
    price = "all",
    sort = "best-match",
  }: TemplateFilters,
) {
  const searchValue = search.trim().toLowerCase();

  return catalog
    .filter((template) => {
      const searchableText = [
        template.name,
        template.category,
        template.creator.name,
        template.description,
        ...template.tags,
        ...template.tools,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !searchValue || searchableText.includes(searchValue);
      const matchesCategory = category === "all" || template.category === category;
      const matchesPrice =
        price === "all" ||
        (price === "under-150" && template.price < 150) ||
        (price === "150-300" && template.price >= 150 && template.price <= 300) ||
        (price === "300-plus" && template.price > 300);

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sort === "newest") {
        return Number(b.isNew) - Number(a.isNew) || b.popularity - a.popularity;
      }

      if (sort === "budget-friendly") {
        return a.price - b.price || b.popularity - a.popularity;
      }

      if (sort === "price-low") {
        return a.price - b.price;
      }

      if (sort === "price-high") {
        return b.price - a.price;
      }

      return b.popularity - a.popularity;
    });
}
