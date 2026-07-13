import Link from "next/link";
import { AccountForm } from "@/components/AccountForm";
import { ButtonLink } from "@/components/Button";
import { getProfile, requireViewer } from "@/lib/auth";
import { getCreatorByProfileId } from "@/lib/dashboard";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Your Account | Webbly",
  description: "Manage your Webbly profile and marketplace activity.",
};

type AccountPageProps = {
  searchParams: Promise<{ listing?: string }>;
};

type SavedRow = {
  id: string;
  template: {
    id: string;
    slug: string;
    title: string;
    category: string;
  } | null;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const viewer = await requireViewer("/account");
  const profile = await getProfile(viewer.id);
  const { listing } = await searchParams;
  const supabase = await createClient();
  const { data: listingProfile } = await getCreatorByProfileId(viewer.id);

  const [savedResult, sentResult] = await Promise.all([
    supabase
      .from("saved_templates")
      .select("id, template:templates(id, slug, title, category)", {
        count: "exact",
      })
      .eq("user_id", viewer.id)
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("website_requests")
      .select("id, business_type, website_style, status, created_at", {
        count: "exact",
      })
      .eq("buyer_id", viewer.id)
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  const [listingsResult, receivedResult] = listingProfile
    ? await Promise.all([
        supabase
          .from("templates")
          .select("id, title, category, status, created_at", { count: "exact" })
          .eq("creator_id", listingProfile.id)
          .order("created_at", { ascending: false })
          .limit(4),
        supabase
          .from("website_requests")
          .select("id, name, business_type, status, created_at", {
            count: "exact",
          })
          .eq("creator_id", listingProfile.id)
          .order("created_at", { ascending: false })
          .limit(4),
      ])
    : [null, null];

  if (!profile) {
    return (
      <section className="app-page mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="rounded-lg border border-rose-400/25 bg-rose-500/10 p-6 text-rose-100">
          We could not load your profile. Please sign out and sign in again.
        </div>
      </section>
    );
  }

  const initials = viewer.fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const savedRows = (savedResult.data ?? []) as unknown as SavedRow[];
  const sentRequests = sentResult.data ?? [];
  const listings = listingsResult?.data ?? [];
  const receivedRequests = receivedResult?.data ?? [];

  return (
    <section className="app-page mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {listing === "submitted" ? (
        <div
          className="mb-6 rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-100"
          role="status"
        >
          Your template was submitted for review.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="app-panel h-fit rounded-lg p-5 lg:sticky lg:top-24">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white shadow-[0_10px_24px_rgba(37,99,235,0.25)]">
            {initials || "W"}
          </span>
          <h1 className="mt-4 text-xl font-bold text-slate-50">{viewer.fullName}</h1>
          <p className="mt-1 break-all text-sm text-slate-500">{viewer.email}</p>

          <div className="mt-6 grid gap-2 border-t border-white/10 pt-5">
            <ButtonLink href="/templates/new" className="w-full">
              List your work
            </ButtonLink>
            <ButtonLink href="/dashboard" variant="outline" className="w-full">
              Listings &amp; requests
            </ButtonLink>
            <ButtonLink href="/saved" variant="ghost" className="w-full">
              Saved templates
            </ButtonLink>
            {viewer.role === "admin" ? (
              <ButtonLink href="/admin" variant="secondary" className="w-full">
                Admin review
              </ButtonLink>
            ) : null}
          </div>
        </aside>

        <div className="min-w-0 space-y-6">
          <section className="app-panel rounded-lg p-5 sm:p-7">
            <div className="mb-7 border-b border-white/10 pb-5">
              <p className="text-xs font-bold uppercase text-blue-400">Account settings</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-50">Your profile</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Keep your name, username, location, and short bio up to date.
              </p>
            </div>
            <AccountForm profile={profile} />
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            <ActivityPanel
              title="Saved templates"
              count={savedResult.count ?? 0}
              href="/saved"
              action="View saved"
              empty="No saved templates yet."
            >
              {savedRows.map((row) =>
                row.template ? (
                  <ActivityRow
                    key={row.id}
                    title={row.template.title}
                    meta={row.template.category}
                    href={`/templates/${row.template.slug}`}
                  />
                ) : null,
              )}
            </ActivityPanel>

            <ActivityPanel
              title="Requests sent"
              count={sentResult.count ?? 0}
              href="/request"
              action="New request"
              empty="No requests sent yet."
            >
              {sentRequests.map((request) => (
                <ActivityRow
                  key={request.id}
                  title={request.website_style || request.business_type || "Website request"}
                  meta={formatDate(request.created_at)}
                  status={request.status}
                />
              ))}
            </ActivityPanel>

            <ActivityPanel
              title="My listings"
              count={listingsResult?.count ?? 0}
              href="/templates/new"
              action="List your work"
              empty="No listings yet."
            >
              {listings.map((template) => (
                <ActivityRow
                  key={template.id}
                  title={template.title}
                  meta={template.category}
                  status={template.status}
                  href={`/dashboard/templates/${template.id}/edit`}
                />
              ))}
            </ActivityPanel>

            <ActivityPanel
              title="Requests received"
              count={receivedResult?.count ?? 0}
              href="/dashboard"
              action="Open inbox"
              empty="Requests connected to your listings will appear here."
            >
              {receivedRequests.map((request) => (
                <ActivityRow
                  key={request.id}
                  title={request.name}
                  meta={request.business_type || formatDate(request.created_at)}
                  status={request.status}
                />
              ))}
            </ActivityPanel>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActivityPanel({
  title,
  count,
  href,
  action,
  empty,
  children,
}: {
  title: string;
  count: number;
  href: string;
  action: string;
  empty: string;
  children: React.ReactNode;
}) {
  const hasItems = count > 0;

  return (
    <section className="app-panel-soft overflow-hidden rounded-lg">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
        <div>
          <h2 className="font-bold text-slate-50">{title}</h2>
          <p className="mt-1 text-xs text-slate-500">{count} total</p>
        </div>
        <ButtonLink href={href} size="sm" variant="ghost">
          {action}
        </ButtonLink>
      </div>
      {hasItems ? (
        <div className="divide-y divide-white/10 px-5">{children}</div>
      ) : (
        <p className="px-5 py-8 text-center text-sm leading-6 text-slate-500">{empty}</p>
      )}
    </section>
  );
}

function ActivityRow({
  title,
  meta,
  status,
  href,
}: {
  title: string;
  meta: string;
  status?: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-100">{title}</p>
        <p className="mt-1 truncate text-xs text-slate-500">{meta}</p>
      </div>
      {status ? <StatusBadge status={status} /> : null}
    </>
  );

  return href ? (
    <Link href={href} className="flex items-center justify-between gap-3 py-4 hover:text-blue-300">
      {content}
    </Link>
  ) : (
    <div className="flex items-center justify-between gap-3 py-4">{content}</div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="w-fit shrink-0 rounded-md border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] font-bold uppercase text-slate-400">
      {status.replace("_", " ")}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
    new Date(value),
  );
}
