import { ButtonLink } from "@/components/Button";
import { getViewer } from "@/lib/auth";
import { safeNextPath } from "@/lib/auth-redirect";

type VerifiedPageProps = {
  searchParams: Promise<{
    success?: string;
    error?: string;
    next?: string;
  }>;
};

export const metadata = { title: "Email Verification | Webbly" };

export default async function VerifiedPage({
  searchParams,
}: VerifiedPageProps) {
  const { success, next: requestedNext } = await searchParams;
  const next = safeNextPath(requestedNext, "/account");
  const viewer = success === "true" ? await getViewer() : null;
  const verified = success === "true" && viewer !== null;
  const continueHref = viewer
    ? next
    : `/login?next=${encodeURIComponent(next)}`;

  return (
    <section className="app-page px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="app-panel mx-auto max-w-2xl rounded-lg p-6 text-center sm:p-10">
        {verified ? (
          <>
            <div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-4xl font-bold text-white shadow-[0_14px_30px_rgba(5,150,105,0.24)]"
              aria-hidden="true"
            >
              ✓
            </div>
            <p className="mt-6 text-sm font-semibold uppercase text-emerald-300">
              Account activated
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-50 sm:text-4xl">
              Email verified successfully
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-400">
              Your Webbly account is active.
            </p>
            <p className="mt-1 text-base leading-7 text-slate-400">
              You can return to the device where you signed up.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <ButtonLink href={continueHref} size="lg" className="w-full">
                Continue on this device
              </ButtonLink>
              <ButtonLink
                href="/login"
                variant="outline"
                size="lg"
                className="w-full"
              >
                Go to login
              </ButtonLink>
            </div>
          </>
        ) : (
          <>
            <div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-rose-400/25 bg-rose-500/10 text-4xl font-bold text-rose-300"
              aria-hidden="true"
            >
              !
            </div>
            <p className="mt-6 text-sm font-semibold uppercase text-rose-300">
              Link unavailable
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-50 sm:text-4xl">
              Verification could not be completed
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-400">
              This verification link may be expired or already used. Request a
              fresh link, or return to login if your account is already active.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <ButtonLink href="/signup" size="lg" className="w-full">
                Resend verification
              </ButtonLink>
              <ButtonLink
                href="/login"
                variant="outline"
                size="lg"
                className="w-full"
              >
                Return to login
              </ButtonLink>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
