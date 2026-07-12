"use client";

import { useActionState, useState } from "react";
import { loginAction, signupAction, type AuthActionState } from "@/app/auth/actions";
import {
  isStrongPassword,
  PASSWORD_PATTERN,
  PASSWORD_REQUIREMENTS,
} from "@/lib/auth-password";
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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const passwordIsStrong = isStrongPassword(password);
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  return (
    <form action={action} className="grid gap-5">
      <AuthMessage state={state} />
      <AuthField label="Full name" name="fullName" autoComplete="name" placeholder="Avery Johnson" />
      <AuthField label="Email" name="email" type="email" autoComplete="email" placeholder="you@business.com" />
      <div className="grid items-start gap-5 sm:grid-cols-2">
        <div>
          <PasswordField
            id="signup-password"
            label="Password"
            name="password"
            value={password}
            onChange={setPassword}
            showPassword={showPasswords}
            onToggleVisibility={() => setShowPasswords((visible) => !visible)}
            describedBy="password-requirements"
          />
          <ul
            id="password-requirements"
            className="mt-3 grid gap-2 text-xs"
            aria-label="Password requirements"
          >
            {PASSWORD_REQUIREMENTS.map((requirement) => {
              const complete = requirement.test(password);
              return (
                <li
                  key={requirement.id}
                  className={`flex items-center gap-2 transition-colors ${
                    complete ? "font-semibold text-emerald-700" : "text-slate-500"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] leading-none ${
                      complete
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-slate-300 bg-white text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  {requirement.label}
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <PasswordField
            id="signup-confirm-password"
            label="Confirm password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={setConfirmPassword}
            showPassword={showPasswords}
            onToggleVisibility={() => setShowPasswords((visible) => !visible)}
            describedBy="password-match-status"
          />
          <p
            id="password-match-status"
            className={`mt-3 min-h-5 text-xs font-semibold ${
              confirmPassword.length === 0
                ? "text-slate-500"
                : passwordsMatch
                  ? "text-emerald-700"
                  : "text-rose-700"
            }`}
            aria-live="polite"
          >
            {confirmPassword.length === 0
              ? "Repeat the password exactly."
              : passwordsMatch
                ? "Passwords match."
                : "Passwords do not match."}
          </p>
        </div>
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
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={pending || !passwordIsStrong || !passwordsMatch}
      >
        {pending ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}

function PasswordField({
  id,
  label,
  name,
  value,
  onChange,
  showPassword,
  onToggleVisibility,
  describedBy,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggleVisibility: () => void;
  describedBy: string;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-slate-700">
          {label}
        </label>
        <button
          type="button"
          className="text-xs font-semibold text-blue-700 hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          aria-pressed={showPassword}
          onClick={onToggleVisibility}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      <input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder={name === "password" ? "Create a strong password" : "Repeat password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        pattern={PASSWORD_PATTERN.source}
        aria-describedby={describedBy}
        required
        className="h-12 rounded-md border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </div>
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
