import { ButtonLink } from "@/components/Button";
import { TemplateForm } from "@/components/TemplateForm";
import { requireVerifiedViewer } from "@/lib/auth";
import { ensureCreatorByProfile } from "@/lib/dashboard";

export const metadata = {
  title: "List Your Work | Webbly",
  description: "Submit a website template to the Webbly marketplace.",
};

export default async function NewTemplatePage() {
  const viewer = await requireVerifiedViewer("/templates/new");
  const { data: listingProfile } = await ensureCreatorByProfile(viewer);

  if (!listingProfile) {
    return (
      <section className="app-page mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="rounded-lg border border-rose-400/25 bg-rose-500/10 p-7 text-rose-100">
          <h1 className="text-2xl font-bold">We could not prepare your listing.</h1>
          <p className="mt-3 text-sm leading-6">
            Refresh the page and try again. Your account and existing work are safe.
          </p>
          <ButtonLink href="/account" className="mt-5">
            Return to account
          </ButtonLink>
        </div>
      </section>
    );
  }

  return (
    <section className="app-page mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-7 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-blue-400">Marketplace submission</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-50 sm:text-4xl">List your work</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Add a clear preview, price, and project details. Your listing goes live immediately.
          </p>
        </div>
        <ButtonLink href="/account" variant="outline">
          Back to account
        </ButtonLink>
      </div>
      <div className="app-panel rounded-lg p-5 sm:p-8">
        <TemplateForm />
      </div>
    </section>
  );
}
