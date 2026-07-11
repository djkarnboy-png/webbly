import { ButtonLink } from "./Button";
import { RequestButton } from "./RequestButton";

type CTASectionProps = {
  title?: string;
  description?: string;
};

export function CTASection({
  title = "Ready to find a website your customers will trust?",
  description = "Browse polished business templates or connect with a creator who can shape one around your brand, services, and goals.",
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 py-20 text-white">
      <div className="site-grid absolute inset-0 opacity-20" />
      <div className="relative mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase text-blue-300">
            Your next website starts with a style
          </p>
          <h2 className="mt-4 text-balance text-3xl font-bold leading-[1.08] sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            {description}
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <ButtonLink
            href="/templates"
            size="lg"
            variant="inverse"
          >
            Browse templates
          </ButtonLink>
          <RequestButton
            size="lg"
            variant="inverseOutline"
            requestType="general"
          >
            Request a website
          </RequestButton>
        </div>
      </div>
    </section>
  );
}
