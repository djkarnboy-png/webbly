"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button, ButtonLink } from "./Button";
import { CheckEmailResend } from "./CheckEmailResend";

const POLL_INTERVAL_MS = 15_000;
const MAX_WAIT_MS = 5 * 60_000;
const REDIRECT_DELAY_MS = 700;

type VerificationStatus =
  | "waiting"
  | "checking"
  | "verified"
  | "paused"
  | "error"
  | "timeout";

type SignupVerificationWaitProps = {
  email: string;
  password: string;
  next: string;
  initialResendSeconds: number;
  onClearCredentials: () => void;
};

export function SignupVerificationWait({
  email,
  password,
  next,
  initialResendSeconds,
  onClearCredentials,
}: SignupVerificationWaitProps) {
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>("waiting");
  const [message, setMessage] = useState("");
  const credentialsRef = useRef({ email, password });
  const mountedRef = useRef(false);
  const inFlightRef = useRef(false);
  const stoppedRef = useRef(false);
  const automaticPausedRef = useRef(false);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const redirectRef = useRef<number | null>(null);

  const stopAutomaticChecks = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const clearInMemoryCredentials = useCallback(() => {
    credentialsRef.current.email = "";
    credentialsRef.current.password = "";
    onClearCredentials();
  }, [onClearCredentials]);

  const checkVerification = useCallback(
    async (manual = false) => {
      if (stoppedRef.current || inFlightRef.current) {
        return;
      }

      const credentials = credentialsRef.current;
      if (!credentials.email || !credentials.password) {
        return;
      }

      if (manual) {
        automaticPausedRef.current = false;
      } else if (automaticPausedRef.current) {
        return;
      }

      inFlightRef.current = true;
      setStatus("checking");
      setMessage("");

      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (stoppedRef.current) {
          return;
        }

        if (!error && data.session && data.user) {
          stoppedRef.current = true;
          stopAutomaticChecks();
          setStatus("verified");
          setMessage("Email verified. Signing you in...");
          clearInMemoryCredentials();

          redirectRef.current = window.setTimeout(() => {
            router.replace(next || "/account");
            router.refresh();
          }, REDIRECT_DELAY_MS);
          return;
        }

        const code = error?.code?.toLowerCase() ?? "";
        const errorMessage = error?.message.toLowerCase() ?? "";

        if (
          code === "email_not_confirmed" ||
          errorMessage.includes("email not confirmed")
        ) {
          automaticPausedRef.current = false;
          setStatus("waiting");
          return;
        }

        if (
          error?.status === 429 ||
          code.includes("rate_limit") ||
          errorMessage.includes("rate limit")
        ) {
          automaticPausedRef.current = true;
          setStatus("paused");
          setMessage(
            "Automatic checks are paused for a moment. Use Check again when you are ready.",
          );
          return;
        }

        stoppedRef.current = true;
        stopAutomaticChecks();
        setStatus("error");
        setMessage(
          "We could not complete automatic sign-in. Verify your email, then log in normally.",
        );
        clearInMemoryCredentials();
      } catch {
        if (stoppedRef.current) {
          return;
        }

        stoppedRef.current = true;
        stopAutomaticChecks();
        setStatus("error");
        setMessage(
          "We could not reach the sign-in service. Verify your email, then log in normally.",
        );
        clearInMemoryCredentials();
      } finally {
        inFlightRef.current = false;
      }
    },
    [clearInMemoryCredentials, next, router, stopAutomaticChecks],
  );

  useEffect(() => {
    const credentials = credentialsRef.current;
    mountedRef.current = true;
    stoppedRef.current = false;
    automaticPausedRef.current = false;
    onClearCredentials();

    intervalRef.current = window.setInterval(() => {
      void checkVerification();
    }, POLL_INTERVAL_MS);

    timeoutRef.current = window.setTimeout(() => {
      if (stoppedRef.current) {
        return;
      }

      stoppedRef.current = true;
      stopAutomaticChecks();
      setStatus("timeout");
      setMessage(
        "Automatic checking has stopped after five minutes. Verify your email, then log in normally.",
      );
      clearInMemoryCredentials();
    }, MAX_WAIT_MS);

    return () => {
      mountedRef.current = false;
      stoppedRef.current = true;
      stopAutomaticChecks();
      if (redirectRef.current !== null) {
        window.clearTimeout(redirectRef.current);
      }

      queueMicrotask(() => {
        if (!mountedRef.current) {
          credentials.email = "";
          credentials.password = "";
        }
      });
    };
  }, [
    checkVerification,
    clearInMemoryCredentials,
    onClearCredentials,
    stopAutomaticChecks,
  ]);

  const terminal = status === "error" || status === "timeout";
  const checking = status === "checking";
  const verified = status === "verified";
  const statusText = verified
    ? "Email verified. Signing you in..."
    : status === "paused"
      ? "Automatic checks paused."
      : terminal
        ? "Automatic sign-in stopped."
        : checking
          ? "Checking your verification status..."
          : "Waiting for email verification...";

  return (
    <div className="grid gap-7">
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white shadow-[0_8px_20px_rgba(37,99,235,0.2)]"
          aria-hidden="true"
        >
          @
        </div>
        <div>
          <p className="text-sm font-semibold uppercase text-blue-400">
            Activate your account
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-tight text-slate-50 sm:text-3xl">
            Check your email to activate your account.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
            We sent a verification link to{" "}
            <strong className="break-all text-slate-100">{email}</strong>. Keep
            this tab open while you confirm it on this device or another one.
          </p>
        </div>
      </div>

      <div
        className={`border-l-4 px-4 py-3 ${
          verified
            ? "border-emerald-400 bg-emerald-500/10 text-emerald-100"
            : terminal
              ? "border-rose-400 bg-rose-500/10 text-rose-100"
              : status === "paused"
                ? "border-amber-400 bg-amber-500/10 text-amber-100"
                : "border-blue-400 bg-blue-500/10 text-blue-100"
        }`}
        role="status"
        aria-live="polite"
      >
        <p className="font-semibold">{statusText}</p>
        {message ? <p className="mt-1 text-sm leading-6">{message}</p> : null}
      </div>

      {!terminal && !verified ? (
        <div className="grid gap-4">
          <Button
            type="button"
            size="lg"
            className="w-full"
            disabled={checking}
            onClick={() => void checkVerification(true)}
          >
            {checking
              ? "Checking..."
              : status === "paused"
                ? "Check again"
                : "I've verified my email — check now"}
          </Button>
          <CheckEmailResend
            email={email}
            initialSecondsRemaining={initialResendSeconds}
          />
        </div>
      ) : null}

      {terminal ? (
        <ButtonLink
          href={`/login?next=${encodeURIComponent(next || "/account")}`}
          size="lg"
          className="w-full"
        >
          Go to login
        </ButtonLink>
      ) : null}

      <div className="grid gap-3 border-t border-white/10 pt-5 text-center text-sm text-slate-400 sm:grid-cols-2 sm:text-left">
        <a
          href={`/signup?next=${encodeURIComponent(next || "/account")}`}
          className="font-semibold text-blue-400 hover:text-blue-300"
        >
          Change email / Back to signup
        </a>
        <Link
          href={`/login?next=${encodeURIComponent(next || "/account")}`}
          className="font-semibold text-blue-400 hover:text-blue-300 sm:text-right"
        >
          Open login page
        </Link>
      </div>

      <p className="text-center text-xs leading-5 text-slate-500">
        Your password stays only in this open tab and is cleared if you refresh,
        leave, time out, or finish signing in.
      </p>
    </div>
  );
}
