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
      className={`relative flex h-full flex-col rounded-lg border p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(16,24,40,0.11)] ${
        highlighted
          ? "border-blue-500 bg-slate-950 text-white shadow-[0_18px_45px_rgba(16,24,40,0.16)]"
          : "border-slate-200 bg-white text-slate-950 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className={`text-sm font-semibold uppercase ${highlighted ? "text-blue-300" : "text-blue-700"}`}>
          {name}
        </p>
        {highlighted ? (
          <span className="rounded-md bg-blue-500 px-2.5 py-1 text-xs font-semibold text-white">
            Most flexible
          </span>
        ) : null}
      </div>
      <p className="mt-6 text-4xl font-bold">{price}</p>
      <p className={`mt-4 min-h-18 text-sm leading-6 ${highlighted ? "text-slate-300" : "text-slate-600"}`}>
        {description}
      </p>

      <div className={`mt-6 border-y py-5 ${highlighted ? "border-white/12" : "border-slate-200"}`}>
        <p className={`text-xs font-semibold uppercase ${highlighted ? "text-slate-400" : "text-slate-500"}`}>
          What is included
        </p>
        <ul className="mt-4 space-y-3 text-sm">
          {features.map((feature) => (
            <li key={feature} className="flex gap-3 leading-6">
              <span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${highlighted ? "bg-blue-500 text-white" : "bg-blue-50 text-blue-700"}`}>
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
        Preview this plan
      </ButtonLink>
      <p className={`mt-3 text-center text-xs ${highlighted ? "text-slate-400" : "text-slate-500"}`}>
        No payment is collected in this preview.
      </p>
    </article>
  );
}
