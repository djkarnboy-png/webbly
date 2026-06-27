import type { Template } from "@/data/templates";

type CreatorCardProps = {
  creator: Template["creator"];
};

export function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
          {creator.avatar}
        </div>
        <div>
          <p className="font-bold text-slate-950">{creator.name}</p>
          <p className="text-sm text-slate-600">{creator.role}</p>
        </div>
      </div>
      <div className="mt-5 space-y-2 text-sm text-slate-600">
        <p>{creator.location}</p>
        <p>{creator.responseTime}</p>
      </div>
    </div>
  );
}
