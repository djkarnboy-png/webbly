export const categories = [
  "Restaurants",
  "Cafes & Bakeries",
  "Beauty & Care",
  "Fitness",
  "Education",
  "Online Stores",
  "Agencies & Services",
  "Real Estate",
] as const;

export type MarketplaceCategory = (typeof categories)[number];
