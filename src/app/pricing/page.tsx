import { CTASection } from "@/components/CTASection";
import { MvpNotice } from "@/components/MvpNotice";
import { PricingCard } from "@/components/PricingCard";

const plans = [
  {
    name: "Free Creator",
    price: "$0",
    description:
      "A simple way to test Webbly and start receiving interest from small businesses.",
    features: [
      "List 3 templates",
      "Receive contact requests",
      "Basic creator profile and listing page",
    ],
  },
  {
    name: "Pro Creator",
    price: "$19/mo",
    description:
      "For creators who want more inventory, more visibility, and better marketplace insights.",
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
      "Pay only when a template sale happens, with no extra monthly commitment required.",
    features: [
      "Webbly takes a small fee when a sale happens",
      "Creator keeps control of pricing",
      "Designed for future checkout and digital delivery",
    ],
  },
];

const faqs = [
  [
    "Can creators charge custom prices?",
    "Yes. This preview shows fixed template prices, but Webbly is designed so creators can keep control of template and custom project pricing.",
  ],
  [
    "Are payments active yet?",
    "Not yet. Webbly is frontend-only in this early preview, so billing, checkout, and commission tracking are marked as coming soon.",
  ],
  [
    "Can buyers request a similar website?",
    "Yes. Buyers can use the request flow to describe the business, budget, preferred style, and message for the creator.",
  ],
];

export const metadata = {
  title: "Pricing | Webbly",
  description:
    "Simple Webbly creator pricing for listing business website templates and receiving custom website requests.",
};

export default function PricingPage() {
  return (
    <>
      <section className="bg-[radial-gradient(circle_at_top,#ede9fe,transparent_30%),linear-gradient(180deg,#fff,#f8fafc)] px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              Marketplace pricing
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
              Pricing for creators who turn design work into demand.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Webbly pricing is designed for creators who want to validate demand,
              sell templates, and win custom work without heavy setup.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <MvpNotice>
              Pricing cards are part of the early product preview. Billing,
              paid creator plans, and commission tracking are not active yet.
            </MvpNotice>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>

          <div className="mt-12 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-2xl font-black text-slate-950">
                Marketplace feature comparison
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Frontend preview for now, structured around the paid features
                Webbly could activate later.
              </p>
            </div>
            <div className="grid divide-y divide-slate-200 text-sm md:grid-cols-4 md:divide-x md:divide-y-0">
              {[
                ["Feature", "Free", "Pro", "Commission"],
                ["Template listings", "3", "Unlimited", "Sale-based"],
                ["Custom requests", "Included", "Priority", "Included"],
                ["Featured placement", "No", "Yes", "Per campaign"],
                ["Payments", "Coming soon", "Coming soon", "Coming soon"],
              ].map((row) => (
                <div key={row.join("-")} className="contents">
                  {row.map((cell, index) => (
                    <div
                      key={`${row[0]}-${index}-${cell}`}
                      className={`p-4 ${
                        index === 0 ? "font-black text-slate-950" : "text-slate-600"
                      }`}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-2xl shadow-blue-950/15 overflow-hidden">
              <div className="absolute top-0 right-0 h-64 w-64 bg-blue-500/10 blur-3xl rounded-full" />
              <div className="absolute bottom-0 left-0 h-64 w-64 bg-violet-500/10 blur-3xl rounded-full" />
              <div className="relative">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">
                  Coming soon
                </p>
                <h2 className="mt-4 text-3xl font-black tracking-tight">
                  Payments will stay clear before they go live.
                </h2>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  The preview separates creator visibility, buyer requests, and
                  future sale commissions so the business model is easy to test
                  before adding payments or backend accounts.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-2">
                  <span className="h-16 rounded-2xl bg-white/10 backdrop-blur-sm" />
                  <span className="h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-500 shadow-lg shadow-blue-500/20" />
                  <span className="h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-violet-500 shadow-lg shadow-violet-500/20" />
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                FAQ
              </p>
              <div className="mt-5 divide-y divide-slate-200">
                {faqs.map(([question, answer]) => (
                  <div key={question} className="py-5 first:pt-0 last:pb-0">
                    <h3 className="text-lg font-black text-slate-950">{question}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <CTASection
        title="Creators and business owners meet around a real design."
        description="List a template, browse the marketplace, or request a similar website when you find a style worth building from."
      />
    </>
  );
}
