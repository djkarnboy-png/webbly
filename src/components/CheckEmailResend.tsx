"use client";

import { useActionState, useEffect, useState } from "react";
import {
  resendVerificationAction,
  type ResendVerificationState,
} from "@/app/check-email/actions";
import { Button } from "./Button";

type CheckEmailResendProps = {
  email: string;
  initialSecondsRemaining: number;
};

const initialState: ResendVerificationState = {
  status: "idle",
  message: "",
  cooldownUntil: 0,
  secondsRemaining: 0,
};

export function CheckEmailResend({
  email,
  initialSecondsRemaining,
}: CheckEmailResendProps) {
  const [state, action, pending] = useActionState(
    resendVerificationAction,
    initialState,
  );
  const secondsRemaining =
    state.cooldownUntil > 0
      ? state.secondsRemaining
      : initialSecondsRemaining;
  const cooldownKey =
    state.cooldownUntil > 0
      ? `action-${state.cooldownUntil}-${state.status}`
      : `initial-${initialSecondsRemaining}`;

  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="email" value={email} />
      {state.message ? (
        <p
          className={`rounded-md border p-3 text-sm leading-6 ${
            state.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
          role="status"
        >
          {state.message}
        </p>
      ) : null}
      <CooldownButton
        key={cooldownKey}
        initialSecondsRemaining={secondsRemaining}
        pending={pending}
      />
    </form>
  );
}

function CooldownButton({
  initialSecondsRemaining,
  pending,
}: {
  initialSecondsRemaining: number;
  pending: boolean;
}) {
  const [secondsRemaining, setSecondsRemaining] = useState(
    initialSecondsRemaining,
  );

  useEffect(() => {
    if (secondsRemaining <= 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setSecondsRemaining((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [secondsRemaining]);

  return (
    <Button
      type="submit"
      size="lg"
      className="w-full"
      disabled={pending || secondsRemaining > 0}
    >
      {pending
        ? "Sending..."
        : secondsRemaining > 0
          ? `Resend available in ${secondsRemaining}s`
          : "Resend verification email"}
    </Button>
  );
}
