"use client";

import { useActionState } from "react";
import {
  updateAccountAction,
  type AccountActionState,
} from "@/app/account/actions";
import type { ProfileRow } from "@/lib/supabase/database.types";
import { Button } from "./Button";

export function AccountForm({ profile }: { profile: ProfileRow }) {
  const [state, formAction, isPending] = useActionState(
    updateAccountAction,
    initialAccountState,
  );

  return (
    <form action={formAction} className="grid gap-6">
      {state.message ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm font-medium ${
            state.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
          role="status"
        >
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <AccountField
          label="Full name"
          name="fullName"
          defaultValue={profile.full_name ?? ""}
          autoComplete="name"
          required
        />
        <AccountField
          label="Username"
          name="username"
          defaultValue={profile.username ?? ""}
          autoComplete="username"
          placeholder="your-name"
        />
        <AccountField
          label="Location"
          name="location"
          defaultValue={profile.location ?? ""}
          autoComplete="address-level2"
          placeholder="Austin, TX"
        />
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">Short bio</span>
        <textarea
          name="bio"
          defaultValue={profile.bio ?? ""}
          rows={5}
          maxLength={320}
          placeholder="Share a little about your business, interests, or work."
          className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
        <span className="text-xs text-slate-500">Up to 320 characters.</span>
      </label>

      <div className="flex justify-end border-t border-slate-200 pt-5">
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </form>
  );
}

const initialAccountState: AccountActionState = {
  status: "idle",
  message: "",
};

function AccountField({
  label,
  name,
  defaultValue,
  type = "text",
  autoComplete,
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}
