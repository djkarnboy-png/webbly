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
      className={`relative overflow-hidden rounded-[2rem] border p-6 shadow-sm ${
        highlighted
          ? "border-blue-300 bg-slate-950 text-white shadow-2xl shadow-blue-950/20"
          : "border-slate-200 bg-white text-slate-950 shadow-slate-950/5"
      }`}
    >
      {highlighted ? (
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-500/30 blur-3xl" />
      ) : null}
      <div className="relative">
        <p
          className={`text-sm font-black uppercase tracking-[0.16em] ${
            highlighted ? "text-blue-300" : "text-blue-600"
          }`}
        >
          {name}
        </p>
        <p className="mt-5 text-5xl font-black">{price}</p>
        <p
          className={`mt-4 text-sm leading-6 ${
            highlighted ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {description}
        </p>
        <ul className="mt-7 space-y-3 text-sm">
          {features.map((feature) => (
            <li key={feature} className="flex gap-3">
              <span
                className={`mt-1.5 h-2 w-2 rounded-full ${
                  highlighted ? "bg-blue-300" : "bg-blue-600"
                }`}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <ButtonLink
          href="/creators"
          variant={highlighted ? "outline" : "secondary"}
          className={`mt-8 w-full ${
            highlighted
              ? "border-white/25 bg-white text-slate-950 hover:bg-blue-50"
              : ""
          }`}
        >
          Start Creator Demo
        </ButtonLink>
      </div>
    </article>
  );
}
