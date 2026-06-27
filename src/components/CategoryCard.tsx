import Link from "next/link";
import { BusinessPreview } from "./BusinessPreview";

const categoryMeta: Record<string, { gradient: string; accent: string; copy: string }> = {
  Restaurants: {
    gradient: "from-orange-100 via-rose-50 to-amber-100",
    accent: "bg-orange-500",
    copy: "Menus, reservations, chef stories",
  },
  Cafes: {
    gradient: "from-sky-100 via-white to-fuchsia-100",
    accent: "bg-sky-500",
    copy: "Menus, hours, local promotions",
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
      className={`group relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br ${meta.gradient} p-4 shadow-sm shadow-slate-950/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-950/10`}
    >
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/45 blur-2xl" />
      <div className="relative">
        <BusinessPreview category={name} variant="category" />
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-lg font-black text-slate-950">{label}</p>
          <span className={`h-2.5 w-10 shrink-0 rounded-full ${meta.accent}`} />
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-600">{meta.copy}</p>
        <p className="mt-5 text-sm font-bold text-slate-950">
          {count} matching templates
        </p>
      </div>
    </Link>
  );
}
