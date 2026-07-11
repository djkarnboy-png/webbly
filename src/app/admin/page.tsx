import { Button } from "@/components/Button";
import { ButtonLink } from "@/components/Button";
import { requireRole } from "@/lib/auth";
import type {
  CreatorRow,
  TemplateRow,
  WebsiteRequestRow,
} from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";
import { moderateTemplateAction } from "./actions";

export const metadata = {
  title: "Marketplace Admin | Webbly",
  description: "Review templates and monitor Webbly marketplace activity.",
};

export default async function AdminPage() {
  const access = await requireRole(["admin"], "/admin");

  if (!access.allowed) {
    return <AccessDenied />;
  }

  const supabase = await createClient();
  const [templatesResult, creatorsResult, requestsResult] = await Promise.all([
    supabase.from("templates").select("*").order("created_at", { ascending: false }),
    supabase.from("creators").select("*").order("created_at", { ascending: false }),
    supabase.from("website_requests").select("*").order("created_at", { ascending: false }),
  ]);

  const templates = (templatesResult.data ?? []) as TemplateRow[];
  const creators = (creatorsResult.data ?? []) as CreatorRow[];
  const requests = (requestsResult.data ?? []) as WebsiteRequestRow[];
  const creatorById = new Map(creators.map((creator) => [creator.id, creator]));
  const hasError = templatesResult.error || creatorsResult.error || requestsResult.error;
  const stats = [
    [templates.filter((template) => template.status === "pending").length, "Pending review"],
    [templates.filter((template) => template.status === "published").length, "Published"],
    [creators.length, "Creators"],
    [requests.length, "Requests"],
  ] as const;

  return (
    <section className="mx-auto w-full max-w-[1360px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-blue-700">Admin workspace</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Marketplace review</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Approve creator submissions and monitor marketplace activity.</p>
        </div>
        <ButtonLink href="/templates" variant="outline">View public marketplace</ButtonLink>
      </div>

      {hasError ? (
        <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900" role="alert">
          Some admin data could not be loaded. Refresh the page to try again.
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
        <section className="min-w-0 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-bold text-slate-950">Template moderation</h2>
            <p className="mt-1 text-sm text-slate-500">Newest submissions appear first.</p>
          </div>
          {templates.length ? (
            <div className="divide-y divide-slate-200">
              {templates.map((template) => {
                const creator = template.creator_id
                  ? creatorById.get(template.creator_id)
                  : null;
                return (
                  <article key={template.id} className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-950">{template.title}</h3>
                        <AdminStatusBadge status={template.status} />
                        {template.is_featured ? (
                          <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase text-blue-700">Featured</span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        {creator?.display_name ?? "Unknown creator"} <span className="px-1 text-slate-300">/</span> {template.category} <span className="px-1 text-slate-300">/</span> ${template.price}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{template.short_description}</p>
                    </div>
                    <form action={moderateTemplateAction} className="flex flex-wrap gap-2 lg:max-w-[260px] lg:justify-end">
                      <input type="hidden" name="templateId" value={template.id} />
                      {template.status !== "published" ? (
                        <Button type="submit" name="intent" value="approve" size="sm">Approve</Button>
                      ) : null}
                      {template.status !== "rejected" ? (
                        <Button type="submit" name="intent" value="reject" size="sm" variant="outline">Reject</Button>
                      ) : null}
                      {template.status === "published" ? (
                        <Button
                          type="submit"
                          name="intent"
                          value={template.is_featured ? "unfeature" : "feature"}
                          size="sm"
                          variant="secondary"
                        >
                          {template.is_featured ? "Unfeature" : "Feature"}
                        </Button>
                      ) : null}
                    </form>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyAdminState text="No templates have been submitted yet." />
          )}
        </section>

        <div className="space-y-7">
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-bold text-slate-950">Creators</h2>
              <p className="mt-1 text-sm text-slate-500">Recent creator profiles.</p>
            </div>
            {creators.length ? (
              <div className="divide-y divide-slate-200">
                {creators.slice(0, 8).map((creator) => (
                  <div key={creator.id} className="flex items-center gap-3 px-5 py-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-[10px] font-bold text-white">
                      {initials(creator.display_name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-950">{creator.display_name}</p>
                      <p className="mt-1 truncate text-xs text-slate-500">{creator.email || creator.role_title || "Creator profile"}</p>
                    </div>
                    <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase ${creator.is_verified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                      {creator.is_verified ? "Verified" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyAdminState text="No creator profiles yet." />
            )}
          </section>

          <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-bold text-slate-950">Request summary</h2>
              <p className="mt-1 text-sm text-slate-500">Current marketplace demand.</p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-slate-200">
              {[
                [requests.filter((item) => item.status === "new").length, "New"],
                [requests.filter((item) => item.status === "contacted").length, "Contacted"],
                [requests.filter((item) => item.status === "in_progress").length, "In progress"],
                [requests.filter((item) => item.status === "completed").length, "Completed"],
              ].map(([value, label]) => (
                <div key={label} className="bg-white p-4">
                  <p className="text-xl font-bold text-slate-950">{value}</p>
                  <p className="mt-1 text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

function AdminStatusBadge({ status }: { status: string }) {
  const classes = {
    published: "bg-emerald-50 text-emerald-700",
    pending: "bg-amber-50 text-amber-700",
    rejected: "bg-rose-50 text-rose-700",
    archived: "bg-slate-100 text-slate-600",
  }[status] ?? "bg-slate-100 text-slate-600";
  return <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase ${classes}`}>{status}</span>;
}

function EmptyAdminState({ text }: { text: string }) {
  return <p className="px-5 py-10 text-center text-sm text-slate-500">{text}</p>;
}

function AccessDenied() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-7">
        <p className="text-xs font-bold uppercase text-rose-700">Access denied</p>
        <h1 className="mt-3 text-2xl font-bold text-rose-950">Admin access is required.</h1>
        <p className="mt-3 text-sm leading-6 text-rose-900">Your account does not have permission to review marketplace submissions.</p>
        <ButtonLink href="/account" className="mt-5">Return to account</ButtonLink>
      </div>
    </section>
  );
}

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}
