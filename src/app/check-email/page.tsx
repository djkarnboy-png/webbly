import Link from "next/link";
import { redirect } from "next/navigation";
import { ButtonLink } from "@/components/Button";
import { CheckEmailResend } from "@/components/CheckEmailResend";
import { getViewer } from "@/lib/auth";
import { getEmailVerificationState } from "@/lib/auth-verification";

export const metadata = { title: "Check Your Email | Webbly" };

export default async function CheckEmailPage() {
  const viewer = await getViewer();
  if (viewer) {
    redirect(viewer.role === "creator" ? "/dashboard" : "/account");
  }

  const { email, secondsRemaining } = await getEmailVerificationState();

  return (
    <section className="site-grid bg-[#f6f7fb] px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(16,24,40,0.1)] sm:p-10">
        <p className="text-sm font-semibold uppercase text-blue-700">
          Check your inbox
        </p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-950">
          We sent a verification link to your email.
        </h1>
        {email ? (
          <p className="mt-4 text-base leading-7 text-slate-600">
            Open the message sent to{" "}
            <strong className="break-all text-slate-950">{email}</strong> and
            confirm your address. This browser will sign you in automatically.
          </p>
        ) : (
          <p className="mt-4 text-base leading-7 text-slate-600">
            We could not find a pending email address. Return to signup to send
            a new verification link.
          </p>
        )}

        <div className="mt-8 grid gap-4">
          {email ? (
            <CheckEmailResend
              initialSecondsRemaining={secondsRemaining}
            />
          ) : null}
          <ButtonLink href="/login" variant="outline" size="lg" className="w-full">
            Open login page
          </ButtonLink>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Used the wrong address?{" "}
          <Link
            href="/signup"
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            Change email / Back to signup
          </Link>
        </p>
      </div>
    </section>
  );
}
