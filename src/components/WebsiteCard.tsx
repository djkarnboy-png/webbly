import Link from "next/link";
import type { WebsiteListItem } from "@/lib/websites-server";
import { gradientForSeed } from "@/lib/gradient";
import { ButtonLink } from "./Button";

type WebsiteCardProps = {
  website: WebsiteListItem;
  compact?: boolean;
};

export function WebsiteCard({ website, compact = false }: WebsiteCardProps) {
  const ownerName =
    website.owner?.full_name || website.owner?.username || "Webbly seller";
  const initials = ownerName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="app-panel app-panel-hover flex h-full flex-col overflow-hidden rounded-lg">
      <Link
        href={`/marketplace/${website.id}`}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        aria-label={`View ${website.title} details`}
      >
        <div className="preview-canvas aspect-[16/11] overflow-hidden border-b border-white/10 bg-[#0a0f18]">
          <div className="flex h-7 items-center gap-1.5 border-b border-white/10 bg-[#0b1018] px-3">
            <span className="h-2 w-2 rounded-full bg-rose-300" />
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            <span className="ml-2 h-3 flex-1 rounded-sm bg-white/10" />
          </div>
          <div
            className="flex h-[calc(100%-28px)] items-center justify-center text-sm font-semibold text-white/80"
            style={{ backgroundImage: gradientForSeed(website.id) }}
          >
            {website.file_count} file{website.file_count === 1 ? "" : "s"}
          </div>
        </div>
      </Link>

      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
        <div className="flex min-h-[60px] items-start justify-between gap-4">
          <Link
            href={`/marketplace/${website.id}`}
            className="min-w-0 truncate text-xl font-bold leading-7 text-slate-50 hover:text-blue-300"
          >
            {website.title}
          </Link>
          <div className="shrink-0 text-right">
            <p className="text-xs font-medium text-slate-500">Price</p>
            <p className="text-xl font-bold text-white">${website.price}</p>
          </div>
        </div>

        <p className="mt-2 min-h-[42px] text-sm leading-6 text-slate-400">
          {website.short_description || "A ready-to-preview website bundle."}
        </p>

        <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white">
            {initials}
          </span>
          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-100">
            {ownerName}
          </p>
        </div>

        <div className="mt-auto pt-5">
          <ButtonLink href={`/marketplace/${website.id}`} variant="outline" className="w-full">
            View details
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
