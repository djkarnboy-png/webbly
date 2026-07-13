import { ButtonLink } from "@/components/Button";
import { WebsiteUploadForm } from "@/components/WebsiteUploadForm";
import { requireVerifiedViewer } from "@/lib/auth";

export const metadata = {
  title: "Upload a Website | Webbly",
  description: "Upload website source files to list on the Webbly marketplace.",
};

export default async function NewWebsitePage() {
  await requireVerifiedViewer("/dashboard/websites/new");

  return (
    <section className="app-page mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-7 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-blue-400">Website upload</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-50 sm:text-4xl">
            Upload a website
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Drop your HTML, CSS, and JS files. Buyers can preview it live before purchase.
          </p>
        </div>
        <ButtonLink href="/dashboard/websites" variant="outline">
          Back to websites
        </ButtonLink>
      </div>
      <div className="app-panel rounded-lg p-5 sm:p-8">
        <WebsiteUploadForm />
      </div>
    </section>
  );
}
