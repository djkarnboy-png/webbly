import type { Template } from "@/data/templates";

type CreatorCardProps = {
  creator: Template["creator"];
  rating?: string;
  projects?: string;
  specialty?: string;
};

export function CreatorCard({
  creator,
  rating = "4.9",
  projects = "12 projects",
  specialty,
}: CreatorCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm">
          {creator.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-slate-950">{creator.name}</p>
          <p className="truncate text-sm text-slate-600">
            {specialty ?? creator.role}
          </p>
        </div>
        <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
          {rating} / 5
        </span>
      </div>
      <div className="mt-5 grid grid-cols-2 divide-x divide-slate-200 border-y border-slate-100 py-3 text-sm">
        <div className="pr-3">
          <p className="font-semibold text-slate-900">{projects}</p>
          <p className="mt-1 text-xs text-slate-500">Marketplace work</p>
        </div>
        <div className="pl-3">
          <p className="font-semibold text-slate-900">{creator.location}</p>
          <p className="mt-1 text-xs text-slate-500">Creator location</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        {creator.responseTime}
      </div>
    </article>
  );
}
