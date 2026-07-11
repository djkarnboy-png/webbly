import { Button } from "@/components/Button";
import { ButtonLink } from "@/components/Button";
import { DashboardTemplateActions } from "@/components/DashboardTemplateActions";
import { requireRole } from "@/lib/auth";
import { getCreatorDashboardData } from "@/lib/dashboard";
import { updateRequestStatusAction } from "./actions";

export const metadata = {
  title: "Creator Dashboard | Webbly",
  description: "Manage Webbly templates and respond to customer website requests.",
};

type DashboardPageProps = {
  searchParams: Promise<{ submitted?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const access = await requireRole(["creator", "admin"], "/dashboard");
  const { submitted } = await searchParams;

  if (!access.allowed) {
    return <AccessDenied />;
  }

  const data = await getCreatorDashboardData(access.viewer.id);

  if (!data.creator) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-7">
          <p className="text-xs font-bold uppercase text-amber-700">Creator setup</p>
          <h1 className="mt-3 text-2xl font-bold text-amber-950">Complete your creator profile</h1>
          <p className="mt-3 text-sm leading-6 text-amber-900">
            This account does not have a creator profile yet. Sign up with the creator option or contact an admin to update the account role.
          </p>
          <ButtonLink href="/account" className="mt-5">Open account</ButtonLink>
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
    <section className="mx-auto w-full max-w-[1360px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-blue-700">Creator workspace</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            Welcome, {data.creator.display_name}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Publish your work, review new briefs, and keep every lead moving.
          </p>
        </div>
        <ButtonLink href="/dashboard/templates/new" size="lg">
          Add new template
        </ButtonLink>
      </div>

      {submitted === "1" ? (
        <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900" role="status">
          Template submitted for review.
        </div>
      ) : null}
      {data.error ? (
        <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900" role="alert">
          Some dashboard data could not be loaded. Refresh the page to try again.
        </div>
      ) : null}

      <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-3xl font-bold text-slate-950">{value}</p>
            <p className="mt-2 text-sm font-medium text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.75fr)]">
        <div className="min-w-0 space-y-7">
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-slate-950">My templates</h2>
                <p className="mt-1 text-sm text-slate-500">Published, pending, and archived work.</p>
              </div>
              <ButtonLink href="/dashboard/templates/new" size="sm" variant="outline">
                Add template
              </ButtonLink>
            </div>
            {data.templates.length ? (
              <div className="divide-y divide-slate-200">
                {data.templates.map((template) => (
                  <article key={template.id} className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-bold text-slate-950">{template.title}</h3>
                        <StatusBadge status={template.status} />
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        {template.category} <span className="px-1 text-slate-300">/</span> ${template.price}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
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
                href="/dashboard/templates/new"
                action="Add a template"
              />
            )}
          </section>

          <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <h2 className="text-lg font-bold text-slate-950">Requests received</h2>
              <p className="mt-1 text-sm text-slate-500">Customer briefs connected to your templates.</p>
            </div>
            {data.requests.length ? (
              <div className="divide-y divide-slate-200">
                {data.requests.map((request) => (
                  <article key={request.id} className="grid gap-5 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_190px]">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-950">{request.name}</h3>
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold uppercase text-slate-600">
                          {request.request_type}
                        </span>
                      </div>
                      <p className="mt-1 break-all text-sm text-blue-700">{request.email}</p>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                        <span>{request.business_type || "Business type not provided"}</span>
                        <span>{request.budget || "Budget not provided"}</span>
                        {request.templateTitle ? <span>{request.templateTitle}</span> : null}
                      </div>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{request.message}</p>
                    </div>
                    <form action={updateRequestStatusAction} className="h-fit rounded-lg bg-slate-50 p-3">
                      <input type="hidden" name="requestId" value={request.id} />
                      <label className="grid gap-2">
                        <span className="text-xs font-bold uppercase text-slate-500">Request status</span>
                        <select
                          name="status"
                          defaultValue={request.status}
                          className="h-10 rounded-md border border-slate-300 bg-white px-2 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:sticky xl:top-24">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
              {initials(data.creator.display_name)}
            </span>
            <div className="min-w-0">
              <h2 className="truncate font-bold text-slate-950">{data.creator.display_name}</h2>
              <p className="mt-1 text-sm text-slate-500">{data.creator.role_title || "Website creator"}</p>
              {data.creator.is_verified ? (
                <span className="mt-2 inline-flex rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase text-blue-700">Verified creator</span>
              ) : (
                <span className="mt-2 inline-flex rounded-md bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase text-amber-700">Verification pending</span>
              )}
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-600">
            {data.creator.bio || "Add a short profile bio so customers understand your specialty."}
          </p>
          <div className="mt-5 grid grid-cols-2 divide-x divide-slate-200 border-y border-slate-200 py-4 text-center">
            <div>
              <p className="font-bold text-slate-950">{Number(data.creator.rating).toFixed(1)}</p>
              <p className="mt-1 text-xs text-slate-500">Rating</p>
            </div>
            <div>
              <p className="font-bold text-slate-950">{data.creator.response_time}</p>
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
    published: "bg-emerald-50 text-emerald-700",
    pending: "bg-amber-50 text-amber-700",
    rejected: "bg-rose-50 text-rose-700",
    archived: "bg-slate-100 text-slate-600",
  }[status] ?? "bg-slate-100 text-slate-600";

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
      <h3 className="font-bold text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{copy}</p>
      {href && action ? <ButtonLink href={href} className="mt-5">{action}</ButtonLink> : null}
    </div>
  );
}

function AccessDenied() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm">
        <p className="text-xs font-bold uppercase text-rose-700">Creator access required</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-950">This dashboard is for creator accounts.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Your buyer account can browse, save templates, and send website requests.</p>
        <ButtonLink href="/account" className="mt-5">Return to account</ButtonLink>
      </div>
    </section>
  );
}

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}
