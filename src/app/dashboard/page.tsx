import { Button } from "@/components/Button";
import { ButtonLink } from "@/components/Button";
import { DashboardTemplateActions } from "@/components/DashboardTemplateActions";
import { requireViewer } from "@/lib/auth";
import { getCreatorDashboardData } from "@/lib/dashboard";
import { updateRequestStatusAction } from "./actions";

export const metadata = {
  title: "Your Work | Webbly",
  description: "Manage your Webbly templates and website requests.",
};

type DashboardPageProps = {
  searchParams: Promise<{ submitted?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const viewer = await requireViewer("/dashboard");
  const { submitted } = await searchParams;
  const data = await getCreatorDashboardData(viewer.id);

  if (!data.creator) {
    return (
      <section className="app-page mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="rounded-lg border border-amber-400/25 bg-amber-500/10 p-7">
          <p className="text-xs font-bold uppercase text-amber-300">Your work</p>
          <h1 className="mt-3 text-2xl font-bold text-amber-100">Start your first listing</h1>
          <p className="mt-3 text-sm leading-6 text-amber-200">
            Add a template to create your public listing profile and submit the work for review.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href="/templates/new">List your work</ButtonLink>
            <ButtonLink href="/dashboard/websites" variant="outline">
              Manage websites
            </ButtonLink>
          </div>
        </div>
      </section>
    );
  }

  const stats = [
    [data.templates.length, "Total templates"],
    [data.requests.length, "Total requests"],
    [data.templates.filter((item) => item.status === "published").length, "Published"],
    [data.templates.filter((item) => item.status === "pending").length, "Pending review"],
  ] as const;

  return (
    <section className="app-page mx-auto w-full max-w-[1360px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-blue-400">Your work</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-50 sm:text-4xl">
            Welcome, {data.creator.display_name}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Publish your work, review new briefs, and keep every lead moving.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/dashboard/websites" variant="outline" size="lg">
            Manage websites
          </ButtonLink>
          <ButtonLink href="/templates/new" size="lg">
            List your work
          </ButtonLink>
        </div>
      </div>

      {submitted === "1" ? (
        <div className="mt-6 rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-100" role="status">
          Template submitted for review.
        </div>
      ) : null}
      {data.error ? (
        <div className="mt-6 rounded-lg border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100" role="alert">
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

      <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.75fr)]">
        <div className="min-w-0 space-y-7">
          <section className="app-panel overflow-hidden rounded-lg">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-slate-50">My templates</h2>
                <p className="mt-1 text-sm text-slate-500">Published, pending, and archived work.</p>
              </div>
              <ButtonLink href="/templates/new" size="sm" variant="outline">
                Add template
              </ButtonLink>
            </div>
            {data.templates.length ? (
              <div className="divide-y divide-white/10">
                {data.templates.map((template) => (
                  <article key={template.id} className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-bold text-slate-100">{template.title}</h3>
                        <StatusBadge status={template.status} />
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        {template.category} <span className="px-1 text-slate-300">/</span> ${template.price}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                        {template.short_description}
                      </p>
                    </div>
                    <DashboardTemplateActions templateId={template.id} />
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No templates yet"
                copy="Add your first template to start the review process."
                href="/templates/new"
                action="Add a template"
              />
            )}
          </section>

          <section className="app-panel overflow-hidden rounded-lg">
            <div className="border-b border-white/10 px-5 py-4 sm:px-6">
              <h2 className="text-lg font-bold text-slate-50">Requests received</h2>
              <p className="mt-1 text-sm text-slate-500">Customer briefs connected to your templates.</p>
            </div>
            {data.requests.length ? (
              <div className="divide-y divide-white/10">
                {data.requests.map((request) => (
                  <article key={request.id} className="grid gap-5 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_190px]">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-100">{request.name}</h3>
                        <span className="rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 text-[11px] font-bold uppercase text-slate-400">
                          {request.request_type}
                        </span>
                      </div>
                      <p className="mt-1 break-all text-sm text-blue-400">{request.email}</p>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                        <span>{request.business_type || "Business type not provided"}</span>
                        <span>{request.budget || "Budget not provided"}</span>
                        {request.templateTitle ? <span>{request.templateTitle}</span> : null}
                      </div>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">{request.message}</p>
                    </div>
                    <form action={updateRequestStatusAction} className="h-fit rounded-lg border border-white/[0.07] bg-black/20 p-3">
                      <input type="hidden" name="requestId" value={request.id} />
                      <label className="grid gap-2">
                        <span className="text-xs font-bold uppercase text-slate-500">Request status</span>
                        <select
                          name="status"
                          defaultValue={request.status}
                          className="dark-field h-10 rounded-md px-2 text-sm font-medium outline-none"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="in_progress">In progress</option>
                          <option value="completed">Completed</option>
                          <option value="declined">Declined</option>
                        </select>
                      </label>
                      <Button type="submit" size="sm" className="mt-3 w-full">Update</Button>
                    </form>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No requests yet"
                copy="Requests linked to your templates will appear here."
              />
            )}
          </section>
        </div>

        <aside className="app-panel h-fit rounded-lg p-5 sm:p-6 xl:sticky xl:top-24">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white">
              {initials(data.creator.display_name)}
            </span>
            <div className="min-w-0">
              <h2 className="truncate font-bold text-slate-50">{data.creator.display_name}</h2>
              <p className="mt-1 text-sm text-slate-500">{data.creator.role_title || "Website designer"}</p>
              {data.creator.is_verified ? (
                <span className="mt-2 inline-flex rounded-md border border-blue-400/20 bg-blue-500/10 px-2 py-1 text-[10px] font-bold uppercase text-blue-300">Verified profile</span>
              ) : (
                <span className="mt-2 inline-flex rounded-md border border-amber-400/20 bg-amber-500/10 px-2 py-1 text-[10px] font-bold uppercase text-amber-300">Verification pending</span>
              )}
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            {data.creator.bio || "Add a short profile bio so customers understand your specialty."}
          </p>
          <div className="mt-5 grid grid-cols-2 divide-x divide-white/10 border-y border-white/10 py-4 text-center">
            <div>
              <p className="font-bold text-slate-100">{Number(data.creator.rating).toFixed(1)}</p>
              <p className="mt-1 text-xs text-slate-500">Rating</p>
            </div>
            <div>
              <p className="font-bold text-slate-100">{data.creator.response_time}</p>
              <p className="mt-1 text-xs text-slate-500">Response</p>
            </div>
          </div>
          <ButtonLink href="/account" variant="outline" className="mt-5 w-full">Edit profile</ButtonLink>
        </aside>
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  const classes = {
    published: "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
    pending: "border border-amber-400/20 bg-amber-500/10 text-amber-300",
    rejected: "border border-rose-400/20 bg-rose-500/10 text-rose-300",
    archived: "border border-white/10 bg-white/[0.05] text-slate-400",
  }[status] ?? "border border-white/10 bg-white/[0.05] text-slate-400";

  return (
    <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase ${classes}`}>
      {status}
    </span>
  );
}

function EmptyState({
  title,
  copy,
  href,
  action,
}: {
  title: string;
  copy: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="px-6 py-12 text-center">
      <h3 className="font-bold text-slate-50">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{copy}</p>
      {href && action ? <ButtonLink href={href} className="mt-5">{action}</ButtonLink> : null}
    </div>
  );
}

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}
