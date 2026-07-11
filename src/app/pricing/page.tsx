import { ButtonLink } from "@/components/Button";
import { MvpNotice } from "@/components/MvpNotice";
import { PricingCard } from "@/components/PricingCard";
import { SectionHeading } from "@/components/SectionHeading";

const plans = [
  {
    name: "Free Creator",
    price: "$0",
    description:
      "A straightforward way to test your first listings and learn what small-business buyers respond to.",
    features: [
      "List up to 3 templates",
      "Receive contact requests",
      "Basic creator profile and listing pages",
    ],
  },
  {
    name: "Pro Creator",
    price: "$19/mo",
    description:
      "For active creators who want more inventory, stronger discovery, and clearer marketplace insights.",
    features: [
      "List unlimited templates",
      "Featured placement opportunities",
      "Better analytics for views and requests",
    ],
    highlighted: true,
  },
  {
    name: "Commission",
    price: "Small fee",
    description:
      "A sale-based option for creators who prefer to pay only when a future template purchase happens.",
    features: [
      "Fee applies only after a future sale",
      "Creator keeps control of pricing",
      "Designed for checkout and digital delivery later",
    ],
  },
];

const comparisonRows = [
  ["Template listings", "3", "Unlimited", "Sale-based"],
  ["Custom requests", "Included", "Priority", "Included"],
  ["Featured placement", "Not included", "Included", "Per campaign"],
  ["Analytics", "Basic", "Enhanced", "Sale reporting"],
  ["Payments", "Coming soon", "Coming soon", "Coming soon"],
];

const faqs = [
  [
    "Can creators set their own prices?",
    "Yes. Webbly is designed so creators keep control of template prices and custom project quotes.",
  ],
  [
    "Are subscriptions or payments active?",
    "No. This is a frontend preview, so billing, checkout, commissions, and paid creator plans are not active yet.",
  ],
  [
    "Can buyers request a custom version?",
    "Yes. Buyers can send a demo request with their business type, budget, preferred style, and project details.",
  ],
  [
    "What happens after a request?",
    "For now, the request flow shows a success message but sends and saves nothing. Creator messaging will come with the future account system.",
  ],
];

export const metadata = {
  title: "Creator Pricing | Webbly",
  description:
    "Compare Webbly creator plans for listing website templates, receiving custom requests, and future marketplace sales.",
};

export default function PricingPage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-white px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase text-blue-700">Creator pricing</p>
            <h1 className="mt-4 text-balance text-[42px] font-bold leading-[1.04] text-slate-950 sm:text-[56px]">
              Start small. Grow when your marketplace presence does.
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Choose a simple listing plan, test demand for your website concepts,
              and keep control of how you price templates and custom work.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <MvpNotice>
              Pricing is shown for product planning only. Payments, paid plans,
              commissions, and creator accounts are coming later.
            </MvpNotice>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f7fb] px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-[1180px] gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <SectionHeading
            eyebrow="Compare plans"
            title="The same marketplace, with different levels of visibility."
            description="The comparison below shows the intended product model. Every paid capability remains inactive in this frontend preview."
          />
          <div className="mt-9 overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-[760px] w-full border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-white">
                <tr>
                  <th className="px-5 py-4 font-semibold">Feature</th>
                  <th className="px-5 py-4 font-semibold">Free Creator</th>
                  <th className="px-5 py-4 font-semibold text-blue-300">Pro Creator</th>
                  <th className="px-5 py-4 font-semibold">Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {comparisonRows.map((row) => (
                  <tr key={row[0]} className="transition hover:bg-slate-50">
                    {row.map((cell, index) => (
                      <td
                        key={`${row[0]}-${cell}`}
                        className={`px-5 py-4 ${index === 0 ? "font-semibold text-slate-950" : "text-slate-600"}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-[#eef3ff] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <SectionHeading
            eyebrow="Pricing FAQ"
            title="Clear answers before billing exists."
            description="Webbly stays honest about what is active today and what belongs to the future marketplace experience."
          />
          <div className="border-t border-blue-200">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group border-b border-blue-200 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-950">
                  {question}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-blue-200 bg-white text-blue-700 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pt-3 text-sm leading-6 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="site-grid border-t border-slate-200 bg-white px-5 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase text-blue-700">Creator preview</p>
          <h2 className="mt-4 text-balance text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
            Shape your first listing before creator accounts go live.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Use the creator form preview to organize a template name, category,
            price, tools, description, and cover direction.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/creators#upload-preview" size="lg">Preview a listing</ButtonLink>
            <ButtonLink href="/templates" size="lg" variant="outline">Browse templates</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
