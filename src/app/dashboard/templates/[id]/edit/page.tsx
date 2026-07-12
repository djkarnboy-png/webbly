import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/Button";
import { TemplateForm } from "@/components/TemplateForm";
import { requireVerifiedViewer } from "@/lib/auth";
import { getOwnedTemplate } from "@/lib/dashboard";

export const metadata = {
  title: "Edit Template | Webbly",
};

type EditTemplatePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTemplatePage({ params }: EditTemplatePageProps) {
  const { id } = await params;
  const viewer = await requireVerifiedViewer(`/dashboard/templates/${id}/edit`);
  const template = await getOwnedTemplate(viewer.id, id);
  if (!template) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-7 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-blue-700">Marketplace submission</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Edit template</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Changes return the template to pending review.</p>
        </div>
        <ButtonLink href="/dashboard" variant="outline">Back to dashboard</ButtonLink>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <TemplateForm template={template} />
      </div>
    </section>
  );
}
