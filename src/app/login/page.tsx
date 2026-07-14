import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/AuthForms";
import { getViewer } from "@/lib/auth";
import {
  AUTH_REQUIRED_MESSAGE,
  AUTH_REQUIRED_REASON,
  safeNextPath,
} from "@/lib/auth-redirect";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string; reason?: string }>;
};

export const metadata = { title: "Log In | Webbly" };

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next: requestedNext, error, reason } = await searchParams;
  const next = safeNextPath(requestedNext, "/account");
  const viewer = await getViewer();
  if (viewer) {
    if (!viewer.emailVerified) {
      redirect(`/check-email?next=${encodeURIComponent(next)}`);
    }
    redirect(next);
  }
  const initialMessage =
    error === "verification_failed"
      ? "We could not verify that email link. Request a new link or try again."
      : reason === AUTH_REQUIRED_REASON
        ? AUTH_REQUIRED_MESSAGE
      : "";
  const signupHref = `/signup?next=${encodeURIComponent(next)}`;

  return (
    <section className="app-page px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="app-panel mx-auto grid max-w-[980px] overflow-hidden rounded-lg lg:grid-cols-[0.9fr_1.1fr]">
        <div className="site-grid border-b border-white/10 bg-[#080d15] p-7 text-white sm:p-10 lg:border-b-0 lg:border-r">
          <p className="text-sm font-semibold uppercase text-blue-300">Welcome back</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight">Continue your Webbly work.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">Save website directions, manage listings, and keep creator requests in one place.</p>
          <div className="mt-8 grid gap-3 text-sm text-slate-200">
            {["Saved template library", "Listing request inbox", "One account for everything"].map((item) => (
              <p key={item} className="border-t border-white/10 pt-3">{item}</p>
            ))}
          </div>
        </div>
        <div className="p-7 sm:p-10">
          <h2 className="text-2xl font-bold text-slate-50">Log in to Webbly</h2>
          <p className="mt-2 text-sm text-slate-400">Use the email and password connected to your account.</p>
          <div className="mt-7">
            <LoginForm next={next} initialMessage={initialMessage} />
          </div>
          <p className="mt-6 text-sm text-slate-400">New to Webbly? <Link href={signupHref} className="font-semibold text-blue-400 hover:text-blue-300">Create an account</Link></p>
        </div>
      </div>
    </section>
  );
}
