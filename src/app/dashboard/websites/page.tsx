import { ButtonLink } from "@/components/Button";
import { DashboardWebsiteActions } from "@/components/DashboardWebsiteActions";
import { requireVerifiedViewer } from "@/lib/auth";
import { getOwnedWebsites } from "@/lib/websites-server";

export const metadata = {
  title: "Your Websites | Webbly",
  description: "Manage your uploaded websites on Webbly.",
};

type DashboardWebsitesPageProps = {
  searchParams: Promise<{ created?: string }>;
};

export default async function DashboardWebsitesPage({
  searchParams,
}: DashboardWebsitesPageProps) {
  const viewer = await requireVerifiedViewer("/dashboard/websites");
  const { created } = await searchParams;
  const { data: websites, error } = await getOwnedWebsites(viewer.id);

  const stats = [
    [websites.length, "Total websites"],
    [websites.filter((website) => website.status === "listed").length, "Listed"],
    [websites.filter((website) => website.status === "draft").length, "Drafts"],
    [websites.filter((website) => website.status === "sold").length, "Sold"],
  ] as const;

  return (
    <section className="app-page mx-auto w-full max-w-[1360px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-blue-400">Your websites</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-50 sm:text-4xl">
            Uploaded websites
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Upload website source files, preview them live, and publish when ready.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/dashboard" variant="outline">
            Back to dashboard
          </ButtonLink>
          <ButtonLink href="/dashboard/websites/new" size="lg">
            Upload a website
          </ButtonLink>
        </div>
      </div>

      {created === "1" ? (
        <div
          className="mt-6 rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-100"
          role="status"
        >
          Website uploaded as a draft.
        </div>
      ) : null}
      {error ? (
        <div
          className="mt-6 rounded-lg border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
          role="alert"
        >
          Some dashboard data could not be loaded. Refresh the page to try again.
        </div>
      ) : null}

      <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className="app-panel-soft rounded-lg p-4 sm:p-5">
            <p className="text-3xl font-bold text-slate-50">{value}</p>
            <p className="mt-2 text-sm font-medium text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <section className="app-panel mt-7 overflow-hidden rounded-lg">
        <div className="border-b border-white/10 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-bold text-slate-50">My websites</h2>
          <p className="mt-1 text-sm text-slate-500">Draft, listed, and sold uploads.</p>
        </div>
        {websites.length ? (
          <div className="divide-y divide-white/10">
            {websites.map((website) => (
              <article
                key={website.id}
                className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-bold text-slate-100">{website.title}</h3>
                    <StatusBadge status={website.status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    ${website.price} <span className="px-1 text-slate-300">/</span>{" "}
                    {website.file_count} file{website.file_count === 1 ? "" : "s"}
                  </p>
                  {website.short_description ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                      {website.short_description}
                    </p>
                  ) : null}
                </div>
                <DashboardWebsiteActions websiteId={website.id} status={website.status} />
              </article>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <h3 className="font-bold text-slate-50">No websites yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Upload your first website to start selling it on Webbly.
            </p>
            <ButtonLink href="/dashboard/websites/new" className="mt-5">
              Upload a website
            </ButtonLink>
          </div>
        )}
      </section>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  const classes =
    {
      listed: "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
      draft: "border border-amber-400/20 bg-amber-500/10 text-amber-300",
      sold: "border border-blue-400/20 bg-blue-500/10 text-blue-300",
    }[status] ?? "border border-white/10 bg-white/[0.05] text-slate-400";

  return (
    <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase ${classes}`}>
      {status}
    </span>
  );
}
