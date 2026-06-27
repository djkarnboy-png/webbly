import { RequestForm } from "@/components/RequestForm";

export const metadata = {
  title: "Request a Similar Website | Webbly",
  description:
    "Send a website request to a Webbly creator and describe the business, budget, style, and project needs.",
};

export default function RequestPage() {
  return (
    <section className="bg-slate-50 px-6 py-14">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            Request form
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Request a similar custom website.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Tell the creator what kind of business you run, which style you like,
            and what you need included. This MVP form is UI-only for now, ready
            for a backend later.
          </p>
          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <p className="font-bold text-slate-950">What to include</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Mention your preferred launch timeline, required pages, booking or
              ecommerce needs, and whether you already have branding or photos.
            </p>
          </div>
        </div>
        <RequestForm />
      </div>
    </section>
  );
}
