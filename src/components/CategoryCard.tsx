import Link from "next/link";
import { BusinessPreview } from "./BusinessPreview";

const categoryMeta: Record<string, { accent: string; copy: string }> = {
  Restaurants: {
    accent: "bg-orange-500",
    copy: "Menus, reservations, chef stories",
  },
  "Cafes & Bakeries": {
    accent: "bg-amber-600",
    copy: "Coffee menus, bakes, local promos",
  },
  "Beauty & Care": {
    accent: "bg-fuchsia-500",
    copy: "Booking, services, elegant galleries",
  },
  Fitness: {
    accent: "bg-emerald-500",
    copy: "Memberships, classes, trial leads",
  },
  Education: {
    accent: "bg-indigo-500",
    copy: "Courses, outcomes, student progress",
  },
  "Online Stores": {
    accent: "bg-violet-500",
    copy: "Product grids, lookbooks, checkout",
  },
  "Agencies & Services": {
    accent: "bg-blue-600",
    copy: "Case studies, services, qualified leads",
  },
  "Real Estate": {
    accent: "bg-teal-500",
    copy: "Listings, neighborhoods, agent leads",
  },
};

type CategoryCardProps = {
  name: string;
  count: number;
  label?: string;
};

export function CategoryCard({ name, count, label = name }: CategoryCardProps) {
  const meta = categoryMeta[name] ?? categoryMeta["Agencies & Services"];

  return (
    <Link
      href={`/templates?category=${encodeURIComponent(name)}`}
      className="app-panel app-panel-hover group flex h-full flex-col overflow-hidden rounded-lg"
    >
      <div className="border-b border-white/10 bg-[#070b12] p-2.5">
        <BusinessPreview category={name} variant="category" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-3">
          <span className={`h-8 w-1 rounded-full ${meta.accent}`} />
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-slate-50">{label}</h3>
            <p className="mt-1 text-sm text-slate-400">{meta.copy}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-sm">
          <span className="font-medium text-slate-500">
            {count} {count === 1 ? "template" : "templates"}
          </span>
          <span className="font-semibold text-blue-400 transition group-hover:translate-x-0.5 group-hover:text-blue-300">
            Browse -&gt;
          </span>
        </div>
      </div>
    </Link>
  );
}
