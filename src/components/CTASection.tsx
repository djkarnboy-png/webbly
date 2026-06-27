import { ButtonLink } from "./Button";

type CTASectionProps = {
  title?: string;
  description?: string;
};

export function CTASection({
  title = "Ready to find a website your customers will trust?",
  description = "Browse polished business templates or connect with a creator who can shape one around your brand, services, and goals.",
}: CTASectionProps) {
  return (
    <section className="bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
            Build faster with Webbly
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            {title}
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">{description}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <ButtonLink href="/templates" size="lg" className="bg-white text-slate-950 hover:bg-blue-50">
            Browse Templates
          </ButtonLink>
          <ButtonLink href="/creators" size="lg" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
            List Your Template
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
