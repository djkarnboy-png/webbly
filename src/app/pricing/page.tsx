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
              Pricing cards are part of the prototype. Billing, paid creator
              plans, and commission tracking are not active yet.
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
                Frontend-only for now, structured around the paid features Webbly
                could activate later.
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
        </div>
      </section>
      <CTASection
        title="Creators and business owners meet around a real design."
        description="List a template, browse the marketplace, or request a similar website when you find a style worth building from."
      />
    </>
  );
}
