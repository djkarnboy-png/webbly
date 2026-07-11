import type { Template } from "@/data/templates";

type CreatorCardProps = {
  creator: Template["creator"];
  specialty?: string;
  showReview?: boolean;
};

export function CreatorCard({
  creator,
  specialty,
  showReview = false,
}: CreatorCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(16,24,40,0.06)]">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm">
          {creator.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-950">{creator.name}</p>
            {creator.verified ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase text-blue-700">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                Verified
              </span>
            ) : null}
          </div>
          <p className="text-sm leading-5 text-slate-600">
            {specialty ?? creator.role}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">{creator.location}</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-100 py-3 text-center text-sm">
        <div className="px-2">
          <p className="font-semibold text-slate-950">{creator.rating.toFixed(1)} / 5</p>
          <p className="mt-1 text-xs text-slate-500">Rating</p>
        </div>
        <div className="px-2">
          <p className="font-semibold text-slate-950">{creator.completedProjects}</p>
          <p className="mt-1 text-xs text-slate-500">Projects</p>
        </div>
        <div className="px-2">
          <p className="font-semibold text-slate-950">{creator.deliveryTime}</p>
          <p className="mt-1 text-xs text-slate-500">Delivery</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        {creator.responseTime}
      </div>
      {showReview ? (
        <blockquote className="mt-4 min-h-[48px] border-l-2 border-blue-200 pl-3 text-sm leading-6 text-slate-600">
          &ldquo;{creator.review}&rdquo;
        </blockquote>
      ) : null}
    </article>
  );
}
