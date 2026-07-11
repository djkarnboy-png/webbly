import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/AuthForms";
import { getViewer } from "@/lib/auth";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export const metadata = { title: "Log In | Webbly" };

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const viewer = await getViewer();
  if (viewer) redirect("/account");
  const { next, error } = await searchParams;

  return (
    <section className="site-grid bg-[#f6f7fb] px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-[980px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_24px_60px_rgba(16,24,40,0.1)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-slate-950 p-7 text-white sm:p-10">
          <p className="text-sm font-semibold uppercase text-blue-300">Welcome back</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight">Continue your Webbly work.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">Save website directions, manage listings, and keep creator requests in one place.</p>
          <div className="mt-8 grid gap-3 text-sm text-slate-200">
            {["Saved template library", "Creator request inbox", "Secure role-based access"].map((item) => (
              <p key={item} className="border-t border-white/10 pt-3">{item}</p>
            ))}
          </div>
        </div>
        <div className="p-7 sm:p-10">
          <h2 className="text-2xl font-bold text-slate-950">Log in to Webbly</h2>
          <p className="mt-2 text-sm text-slate-600">Use the email and password connected to your account.</p>
          <div className="mt-7">
            <LoginForm next={next} initialMessage={error} />
          </div>
          <p className="mt-6 text-sm text-slate-600">New to Webbly? <Link href="/signup" className="font-semibold text-blue-700 hover:text-blue-800">Create an account</Link></p>
        </div>
      </div>
    </section>
  );
}
