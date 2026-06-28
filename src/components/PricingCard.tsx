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
      className={`relative overflow-hidden rounded-[2rem] border p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        highlighted
          ? "border-blue-300 bg-slate-950 text-white shadow-2xl shadow-blue-950/20"
          : "border-slate-200 bg-white text-slate-950 shadow-slate-950/5"
      }`}
    >
      {highlighted ? (
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-500/30 blur-3xl" />
      ) : (
        <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-blue-50 blur-2xl" />
      )}
      <div className="relative">
        {highlighted ? (
          <span className="mb-5 inline-flex rounded-full bg-blue-400 px-3 py-1 text-xs font-black uppercase text-slate-950">
            Most creator-ready
          </span>
        ) : null}
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
        <div
          className={`mt-6 rounded-2xl border p-3 ${
            highlighted
              ? "border-white/10 bg-white/8"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="grid grid-cols-3 gap-2">
            <span className={highlighted ? "h-12 rounded-xl bg-white/12" : "h-12 rounded-xl bg-white"} />
            <span className={highlighted ? "h-12 rounded-xl bg-blue-400" : "h-12 rounded-xl bg-blue-100"} />
            <span className={highlighted ? "h-12 rounded-xl bg-violet-400" : "h-12 rounded-xl bg-violet-100"} />
          </div>
        </div>
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
