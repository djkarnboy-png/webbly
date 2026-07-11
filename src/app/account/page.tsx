import { AccountForm } from "@/components/AccountForm";
import { ButtonLink } from "@/components/Button";
import { getProfile, requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Your Account | Webbly",
  description: "Manage your Webbly profile and marketplace activity.",
};

export default async function AccountPage() {
  const viewer = await requireViewer("/account");
  const profile = await getProfile(viewer.id);
  const supabase = await createClient();
  const { data: sentRequests } = await supabase
    .from("website_requests")
    .select("id, business_type, website_style, status, created_at")
    .eq("buyer_id", viewer.id)
    .order("created_at", { ascending: false })
    .limit(5);

  if (!profile) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-rose-900">
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

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
            {initials || "W"}
          </span>
          <h1 className="mt-4 text-xl font-bold text-slate-950">{viewer.fullName}</h1>
          <p className="mt-1 break-all text-sm text-slate-500">{viewer.email}</p>
          <span className="mt-4 inline-flex rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase text-blue-700">
            {viewer.role}
          </span>

          <div className="mt-6 grid gap-2 border-t border-slate-200 pt-5">
            <ButtonLink href="/saved" variant="outline" className="w-full">
              Saved templates
            </ButtonLink>
            {viewer.role === "creator" || viewer.role === "admin" ? (
              <ButtonLink href="/dashboard" className="w-full">
                Creator dashboard
              </ButtonLink>
            ) : null}
            {viewer.role === "admin" ? (
              <ButtonLink href="/admin" variant="secondary" className="w-full">
                Admin review
              </ButtonLink>
            ) : null}
          </div>
        </aside>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-7 border-b border-slate-200 pb-5">
            <p className="text-xs font-bold uppercase text-blue-700">Account settings</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Your profile</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Keep your details current so marketplace conversations start with the right context.
            </p>
          </div>
          <AccountForm profile={profile} />
          <div className="mt-8 border-t border-slate-200 pt-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">Requests sent</h2>
                <p className="mt-1 text-sm text-slate-500">Your latest website briefs.</p>
              </div>
              <ButtonLink href="/request" size="sm" variant="outline">New request</ButtonLink>
            </div>
            {sentRequests?.length ? (
              <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
                {sentRequests.map((request) => (
                  <div key={request.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {request.website_style || request.business_type || "Website request"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(request.created_at))}
                      </p>
                    </div>
                    <span className="w-fit rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-600">
                      {request.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                No signed-in requests yet. You can still contact any creator from a template page.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
