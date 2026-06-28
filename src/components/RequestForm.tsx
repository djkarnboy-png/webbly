"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  createWebsiteRequest,
  type WebsiteRequestInput,
} from "@/lib/marketplace";
import { Button } from "./Button";
import type { RequestModalContextValue } from "./RequestModalProvider";

type RequestFormProps = {
  context?: Partial<RequestModalContextValue>;
  onSubmitted?: () => void;
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
  requestType: "general",
};

export function RequestForm({ context, onSubmitted }: RequestFormProps) {
  const [values, setValues] = useState<FormState>({
    ...initialState,
    templateName: context?.templateName ?? "",
    creatorName: context?.creatorName ?? "",
    requestType: context?.requestType ?? "general",
    style: context?.templateName
      ? `I like the style of ${context.templateName}.`
      : "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const helperText = useMemo(() => {
    if (context?.requestType === "contact") {
      return "Send a focused note to the creator with your business type, budget, and the style you are interested in.";
    }

    return "Share the website direction you like and what you need next. Requests are demo-only in this early preview.";
  }, [context?.requestType]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setSuccess(false);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    await createWebsiteRequest(values);
    setIsSubmitting(false);
    setSuccess(true);
    onSubmitted?.();
  }

  function updateField(name: keyof FormState, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSuccess(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      noValidate
    >
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-violet-50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-black text-blue-950">Early preview request</p>
            <p className="mt-1 text-sm leading-6 text-blue-900">{helperText}</p>
          </div>
          <span className="w-fit rounded-full bg-white/80 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-blue-700">
            No message sent yet
          </span>
        </div>
        <div className="mt-4 grid gap-2 text-xs font-bold text-blue-950 sm:grid-cols-3">
          <span className="rounded-full bg-white/70 px-3 py-2">1. Share context</span>
          <span className="rounded-full bg-white/70 px-3 py-2">2. Match the style</span>
          <span className="rounded-full bg-white/70 px-3 py-2">3. Creator follow-up later</span>
        </div>
      </div>

      {success ? (
        <div
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900"
          role="status"
        >
          Request sent - this is an early preview, so no real message was sent yet.
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          name="name"
          value={values.name}
          error={errors.name}
          placeholder="Avery Johnson"
          onChange={updateField}
        />
        <Field
          label="Email"
          name="email"
          value={values.email}
          error={errors.email}
          placeholder="avery@business.com"
          type="email"
          onChange={updateField}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Business type"
          name="businessType"
          value={values.businessType}
          error={errors.businessType}
          placeholder="Cafe, salon, gym, agency..."
          onChange={updateField}
        />
        <Field
          label="Budget"
          name="budget"
          value={values.budget}
          error={errors.budget}
          placeholder="$1,500 - $3,000"
          onChange={updateField}
        />
      </div>
      <Field
        label="Website style they like"
        name="style"
        value={values.style ?? ""}
        error={errors.style}
        placeholder="Modern cafe layout, minimal salon booking site, bold gym landing page..."
        onChange={updateField}
      />
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-700">Message</span>
        <textarea
          name="message"
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          rows={6}
          placeholder="Share the pages, features, timeline, and anything important about the business."
          aria-invalid={Boolean(errors.message)}
          className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
            errors.message
              ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
              : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
          }`}
        />
        {errors.message ? (
          <span className="text-sm font-medium text-rose-600">
            {errors.message}
          </span>
        ) : null}
      </label>
      <Button
        type="submit"
        size="lg"
        className="w-full shadow-md shadow-blue-600/15 sm:w-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Submit Request"}
      </Button>
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
  onChange,
}: {
  label: string;
  name: keyof FormState;
  value: string;
  error?: string;
  placeholder: string;
  type?: string;
  onChange: (name: keyof FormState, value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        name={name}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        type={type}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
          error
            ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
            : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
        }`}
      />
      {error ? (
        <span className="text-sm font-medium text-rose-600">{error}</span>
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
    errors.businessType = "Tell the creator what kind of business this is.";
  }

  if (!values.budget.trim()) {
    errors.budget = "Add a rough budget so creators can qualify the request.";
  }

  if (!values.message.trim()) {
    errors.message = "Add a short message about what you need.";
  } else if (values.message.trim().length < 20) {
    errors.message = "Add a little more detail, at least 20 characters.";
  }

  return errors;
}
