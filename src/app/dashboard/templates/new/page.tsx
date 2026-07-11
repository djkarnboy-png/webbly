import { ButtonLink } from "@/components/Button";
import { TemplateForm } from "@/components/TemplateForm";
import { requireRole } from "@/lib/auth";

export const metadata = {
  title: "Add a Template | Webbly",
  description: "Submit a website template to the Webbly marketplace.",
};

export default async function NewTemplatePage() {
  const access = await requireRole(["creator", "admin"], "/dashboard/templates/new");

  if (!access.allowed) {
    return <AccessDenied />;
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-7 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-blue-700">Creator submission</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Add a template</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Give buyers a clear preview of what you can build.</p>
        </div>
        <ButtonLink href="/dashboard" variant="outline">Back to dashboard</ButtonLink>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <TemplateForm />
      </div>
    </section>
  );
}

function AccessDenied() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <h1 className="text-2xl font-bold text-slate-950">Creator access required</h1>
      <ButtonLink href="/account" className="mt-5">Return to account</ButtonLink>
    </section>
  );
}
