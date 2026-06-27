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
      return "Send a note to the creator. In MVP mode, Webbly records this locally as a prototype interaction.";
    }

    return "Tell the creator what you want built. This prototype validates the request flow before a backend is connected.";
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
      className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      noValidate
    >
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm font-black text-blue-950">MVP mode</p>
        <p className="mt-1 text-sm leading-6 text-blue-900">{helperText}</p>
      </div>

      {success ? (
        <div
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900"
          role="status"
        >
          Request sent! This is a demo for now.
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
        className="w-full sm:w-auto"
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
