import Link from "next/link";
import { BusinessPreview } from "./BusinessPreview";

const categoryMeta: Record<string, { gradient: string; accent: string; copy: string }> = {
  Restaurants: {
    gradient: "from-orange-100 via-rose-50 to-amber-100",
    accent: "bg-orange-500",
    copy: "Menus, reservations, chef stories",
  },
  Cafes: {
    gradient: "from-amber-100 via-stone-50 to-orange-100",
    accent: "bg-amber-600",
    copy: "Coffee menus, bakes, local promos",
  },
  Salons: {
    gradient: "from-fuchsia-100 via-pink-50 to-violet-100",
    accent: "bg-fuchsia-500",
    copy: "Booking, services, galleries",
  },
  Gyms: {
    gradient: "from-emerald-100 via-cyan-50 to-slate-100",
    accent: "bg-emerald-500",
    copy: "Memberships, classes, trial leads",
  },
  Tutors: {
    gradient: "from-indigo-100 via-white to-amber-100",
    accent: "bg-indigo-500",
    copy: "Courses, outcomes, parent trust",
  },
  "Online Stores": {
    gradient: "from-violet-100 via-white to-pink-100",
    accent: "bg-violet-500",
    copy: "Product grids, lookbooks, carts",
  },
  Agencies: {
    gradient: "from-blue-100 via-slate-50 to-cyan-100",
    accent: "bg-blue-600",
    copy: "Case studies, services, local leads",
  },
  "Real Estate": {
    gradient: "from-teal-100 via-white to-blue-100",
    accent: "bg-teal-500",
    copy: "Listings, neighborhoods, seller leads",
  },
};

type CategoryCardProps = {
  name: string;
  count: number;
  label?: string;
};

export function CategoryCard({ name, count, label = name }: CategoryCardProps) {
  const meta = categoryMeta[name] ?? categoryMeta.Agencies;

  return (
    <Link
      href={`/templates?category=${encodeURIComponent(name)}`}
      className={`group relative flex flex-col overflow-hidden rounded-[1.85rem] border border-white/80 bg-gradient-to-br ${meta.gradient} p-4 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-white hover:shadow-2xl hover:shadow-blue-900/10`}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/50 blur-2xl transition-transform duration-500 group-hover:scale-125" />
      <div className="relative flex flex-1 flex-col">
        <BusinessPreview category={name} variant="category" />
        <div className="mt-5 flex flex-col flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xl font-black text-slate-950">{label}</p>
            <span className={`h-2.5 w-10 shrink-0 rounded-full ${meta.accent} transition-all duration-300 group-hover:w-16`} />
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600 flex-1">{meta.copy}</p>
          <div className="mt-5 flex items-center justify-between rounded-[1rem] border border-white/70 bg-white/70 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm backdrop-blur transition-colors duration-300 group-hover:bg-white/90">
            <span>{count} templates</span>
            <span className="text-blue-600 font-black transition-transform duration-300 group-hover:translate-x-1">
              Browse →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
