import Link from "next/link";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/AuthForms";
import { getViewer } from "@/lib/auth";

export const metadata = { title: "Create Account | Webbly" };

export default async function SignupPage() {
  const viewer = await getViewer();
  if (viewer) redirect("/account");

  return (
    <section className="app-page px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="app-panel mx-auto max-w-3xl rounded-lg p-6 sm:p-10">
        <p className="text-sm font-semibold uppercase text-blue-400">Join Webbly</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-50">Create your Webbly account.</h1>
        <p className="mt-3 text-base leading-7 text-slate-400">Browse templates, contact creators, or publish your own work.</p>
        <div className="mt-8">
          <SignupForm />
        </div>
        <p className="mt-6 text-sm text-slate-400">Already have an account? <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300">Log in</Link></p>
      </div>
    </section>
  );
}
