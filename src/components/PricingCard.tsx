import { ButtonLink } from "./Button";

type PricingCardProps = {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export function PricingCard({
  name,
  price,
  description,
  features,
  highlighted = false,
}: PricingCardProps) {
  return (
    <article
      className={`relative flex h-full flex-col rounded-lg border p-6 transition duration-300 hover:-translate-y-1 ${
        highlighted
          ? "border-blue-400/45 bg-[linear-gradient(180deg,#111a2a,#0a0f18)] text-white shadow-[0_24px_65px_rgba(0,0,0,0.42),0_0_38px_rgba(37,99,235,0.1)]"
          : "border-white/14 bg-[#0b1018] text-slate-100 shadow-[0_18px_48px_rgba(0,0,0,0.3)] hover:border-blue-400/35"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className={`text-sm font-semibold uppercase ${highlighted ? "text-blue-300" : "text-blue-400"}`}>
          {name}
        </p>
        {highlighted ? (
          <span className="rounded-md bg-blue-500 px-2.5 py-1 text-xs font-semibold text-white">
            Most flexible
          </span>
        ) : null}
      </div>
      <p className="mt-6 text-4xl font-bold">{price}</p>
      <p className={`mt-4 min-h-12 text-sm leading-6 ${highlighted ? "text-slate-300" : "text-slate-400"}`}>
        {description}
      </p>

      <div className="mt-6 border-y border-white/10 py-5">
        <ul className="space-y-3 text-sm">
          {features.map((feature) => (
            <li key={feature} className="flex gap-3 leading-6">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-[11px] font-bold text-blue-300">
                +
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <ButtonLink
        href="/creators#upload-preview"
        variant={highlighted ? "outline" : "secondary"}
        className={`mt-6 w-full ${
          highlighted
            ? "border-white bg-white text-slate-950 hover:border-blue-50 hover:bg-blue-50"
            : ""
        }`}
      >
        Start with this plan
      </ButtonLink>
    </article>
  );
}
