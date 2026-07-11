"use client";

import { useState, type FormEvent } from "react";
import { submitWebsiteRequest } from "@/app/actions/request";
import type { WebsiteRequestInput } from "@/lib/marketplace";
import { Button } from "./Button";
import type { RequestModalContextValue } from "./RequestModalProvider";

type RequestFormProps = {
  context?: Partial<RequestModalContextValue>;
  onSubmitted?: () => void;
  embedded?: boolean;
};

type FormState = WebsiteRequestInput;
type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  name: "",
  email: "",
  businessType: "",
  budget: "",
  style: "",
  message: "",
  templateName: "",
  creatorName: "",
  templateId: "",
  creatorId: "",
  requestType: "general",
};

const businessTypes = [
  "Restaurants",
  "Cafes",
  "Salons",
  "Gyms",
  "Tutors",
  "Online Stores",
  "Agencies",
  "Real Estate",
  "Other small business",
];

const budgets = [
  "Under $1,000",
  "$1,000 - $2,500",
  "$2,500 - $5,000",
  "$5,000 - $10,000",
  "$10,000+",
  "Not sure yet",
];

export function RequestForm({
  context,
  onSubmitted,
  embedded = false,
}: RequestFormProps) {
  const [values, setValues] = useState<FormState>({
    ...initialState,
    templateName: context?.templateName ?? "",
    creatorName: context?.creatorName ?? "",
    templateId: context?.templateId ?? "",
    creatorId: context?.creatorId ?? "",
    requestType: context?.requestType ?? "general",
    style: context?.templateName ?? "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const helperText =
    context?.requestType === "contact"
      ? "Tell the creator what you run, what you like about this direction, and what you want customized."
      : "Share the website direction you like and what a creator should adapt for your business.";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setStatus(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    const result = await submitWebsiteRequest(values);
    setIsSubmitting(false);
    setStatus({ success: result.success, message: result.message });

    if (result.fieldErrors) {
      setErrors(result.fieldErrors);
    }

    if (result.success) {
      setValues((current) => ({ ...current, message: "" }));
      onSubmitted?.();
    }
  }

  function updateField(name: keyof FormState, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setStatus(null);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`grid gap-6 bg-white ${
        embedded
          ? ""
          : "rounded-lg border border-slate-200 p-5 shadow-[0_18px_45px_rgba(16,24,40,0.08)] sm:p-7"
      }`}
      noValidate
    >
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-semibold text-slate-950">Share your project brief</p>
            <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">{helperText}</p>
          </div>
          <span className="w-fit shrink-0 rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            Secure request
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-slate-600">
          {["Share", "Match style", "Creator reply"].map((step, index) => (
            <span key={step} className="inline-flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-[10px] text-white">
                {index + 1}
              </span>
              {step}
            </span>
          ))}
        </div>
        <p className="mt-4 rounded-md bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">
          No purchase is made now. A creator can reply with timing and a quote.
        </p>
      </div>

      {status ? (
        <div
          className={`rounded-md border p-4 ${
            status.success
              ? "border-emerald-200 bg-emerald-50"
              : "border-rose-200 bg-rose-50"
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="flex gap-3">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ${
                status.success ? "bg-emerald-600" : "bg-rose-600"
              }`}
            >
              {status.success ? "OK" : "!"}
            </span>
            <div>
              <p className={`font-semibold ${status.success ? "text-emerald-950" : "text-rose-900"}`}>
                {status.success ? "Request sent" : "Request not sent"}
              </p>
              <p className={`mt-1 text-sm leading-6 ${status.success ? "text-emerald-900" : "text-rose-800"}`}>
                {status.message}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <fieldset className="grid gap-5" disabled={isSubmitting}>
        <legend className="sr-only">Contact and business details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Name"
            name="name"
            value={values.name}
            error={errors.name}
            placeholder="Avery Johnson"
            autoComplete="name"
            onChange={updateField}
          />
          <Field
            label="Email"
            name="email"
            value={values.email}
            error={errors.email}
            placeholder="avery@business.com"
            type="email"
            autoComplete="email"
            onChange={updateField}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            label="Business type"
            name="businessType"
            value={values.businessType}
            error={errors.businessType}
            placeholder="Select business type"
            options={businessTypes}
            onChange={updateField}
          />
          <SelectField
            label="Budget"
            name="budget"
            value={values.budget}
            error={errors.budget}
            placeholder="Select a budget range"
            options={budgets}
            onChange={updateField}
          />
        </div>

        <Field
          label="Website style / template name"
          name="style"
          value={values.style ?? ""}
          error={errors.style}
          placeholder="Modern Cafe Website, minimal salon booking, bold gym layout..."
          onChange={updateField}
        />

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Message</span>
          <textarea
            name="message"
            value={values.message}
            onChange={(event) => updateField("message", event.target.value)}
            rows={6}
            placeholder="Share the pages, features, timeline, and anything important about your business."
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : "message-help"}
            className={`w-full resize-none rounded-md border px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
              errors.message
                ? "border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-rose-100"
                : "border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-100"
            }`}
          />
          {errors.message ? (
            <span id="message-error" className="text-sm font-medium text-rose-600">
              {errors.message}
            </span>
          ) : (
            <span id="message-help" className="text-xs text-slate-500">
              Include enough detail for a creator to understand the next step.
            </span>
          )}
        </label>
      </fieldset>

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-slate-500">
          Your details are saved securely so the right creator can follow up.
        </p>
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending request..." : "Send Request"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  error,
  placeholder,
  type = "text",
  autoComplete,
  onChange,
}: {
  label: string;
  name: keyof FormState;
  value: string;
  error?: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  onChange: (name: keyof FormState, value: string) => void;
}) {
  const errorId = `${name}-error`;

  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        name={name}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`h-12 w-full rounded-md border px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
          error
            ? "border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-rose-100"
            : "border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-100"
        }`}
      />
      {error ? (
        <span id={errorId} className="text-sm font-medium text-rose-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function SelectField({
  label,
  name,
  value,
  error,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  name: "businessType" | "budget";
  value: string;
  error?: string;
  placeholder: string;
  options: string[];
  onChange: (name: keyof FormState, value: string) => void;
}) {
  const errorId = `${name}-error`;

  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <select
        name={name}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`h-12 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:ring-4 ${
          value ? "text-slate-950" : "text-slate-500"
        } ${
          error
            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
            : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? (
        <span id={errorId} className="text-sm font-medium text-rose-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function validate(values: FormState) {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Enter your name.";
  }
  if (!values.email.trim()) {
    errors.email = "Enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.businessType.trim()) {
    errors.businessType = "Select your business type.";
  }
  if (!values.budget.trim()) {
    errors.budget = "Select a rough budget range.";
  }
  if (!values.message.trim()) {
    errors.message = "Add a short message about what you need.";
  } else if (values.message.trim().length < 20) {
    errors.message = "Add a little more detail, at least 20 characters.";
  }

  return errors;
}
