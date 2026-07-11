"use client";

import { useActionState } from "react";
import { loginAction, signupAction, type AuthActionState } from "@/app/auth/actions";
import { Button } from "./Button";

export function LoginForm({
  next = "",
  initialMessage = "",
}: {
  next?: string;
  initialMessage?: string;
}) {
  const loginInitialState: AuthActionState = {
    status: initialMessage ? "error" : "idle",
    message: initialMessage,
  };
  const [state, action, pending] = useActionState(loginAction, loginInitialState);

  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="next" value={next} />
      <AuthMessage state={state} />
      <AuthField label="Email" name="email" type="email" autoComplete="email" placeholder="you@business.com" />
      <AuthField label="Password" name="password" type="password" autoComplete="current-password" placeholder="Your password" />
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Logging in..." : "Log In"}
      </Button>
    </form>
  );
}

export function SignupForm() {
  const [state, action, pending] = useActionState(
    signupAction,
    initialAuthState,
  );

  return (
    <form action={action} className="grid gap-5">
      <AuthMessage state={state} />
      <AuthField label="Full name" name="fullName" autoComplete="name" placeholder="Avery Johnson" />
      <AuthField label="Email" name="email" type="email" autoComplete="email" placeholder="you@business.com" />
      <div className="grid gap-5 sm:grid-cols-2">
        <AuthField label="Password" name="password" type="password" autoComplete="new-password" placeholder="8+ characters" />
        <AuthField label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" placeholder="Repeat password" />
      </div>
      <fieldset>
        <legend className="text-sm font-semibold text-slate-700">I want to</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <label className="cursor-pointer rounded-lg border border-slate-200 bg-white p-4 has-checked:border-blue-500 has-checked:bg-blue-50">
            <input className="mr-2 accent-blue-600" type="radio" name="role" value="buyer" defaultChecked />
            <span className="font-semibold text-slate-950">Find a website</span>
            <span className="mt-1 block pl-5 text-xs leading-5 text-slate-500">Browse, save, and contact creators.</span>
          </label>
          <label className="cursor-pointer rounded-lg border border-slate-200 bg-white p-4 has-checked:border-blue-500 has-checked:bg-blue-50">
            <input className="mr-2 accent-blue-600" type="radio" name="role" value="creator" />
            <span className="font-semibold text-slate-950">List my work</span>
            <span className="mt-1 block pl-5 text-xs leading-5 text-slate-500">Publish templates and receive requests.</span>
          </label>
        </div>
      </fieldset>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}

function AuthField({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        className="h-12 rounded-md border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function AuthMessage({ state }: { state: AuthActionState }) {
  if (!state.message) {
    return null;
  }

  const success = state.status === "success";
  return (
    <div
      className={`rounded-md border p-3 text-sm leading-6 ${
        success
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-rose-200 bg-rose-50 text-rose-900"
      }`}
      role="status"
    >
      {state.message}
    </div>
  );
}

const initialAuthState: AuthActionState = {
  status: "idle",
  message: "",
};
