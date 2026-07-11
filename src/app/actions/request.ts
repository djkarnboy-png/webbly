"use server";

import type { WebsiteRequestInput } from "@/lib/marketplace";
import { createClient } from "@/lib/supabase/server";

export type RequestActionResult = {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof WebsiteRequestInput, string>>;
};

export async function submitWebsiteRequest(
  input: WebsiteRequestInput,
): Promise<RequestActionResult> {
  const fieldErrors = validateRequest(input);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      message: "Check the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const buyerId = typeof data?.claims?.sub === "string" ? data.claims.sub : null;
  const templateId = isUuid(input.templateId) ? input.templateId : null;
  const creatorId = isUuid(input.creatorId) ? input.creatorId : null;

  const { error } = await supabase.from("website_requests").insert({
    template_id: templateId,
    creator_id: creatorId,
    buyer_id: buyerId,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    business_type: input.businessType.trim(),
    budget: input.budget.trim(),
    website_style: input.style?.trim() || input.templateName?.trim() || null,
    message: input.message.trim(),
    request_type: input.requestType ?? "general",
  });

  if (error) {
    console.error("Failed to submit Webbly request", error.code);
    return {
      success: false,
      message: "We could not send your request. Please wait a moment and try again.",
    };
  }

  return {
    success: true,
    message: "Request sent successfully. The creator can review it from their dashboard.",
  };
}

function validateRequest(input: WebsiteRequestInput) {
  const errors: Partial<Record<keyof WebsiteRequestInput, string>> = {};

  if (!input.name.trim()) {
    errors.name = "Enter your name.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!input.businessType.trim()) {
    errors.businessType = "Select your business type.";
  }
  if (!input.budget.trim()) {
    errors.budget = "Select a rough budget range.";
  }
  if (input.message.trim().length < 20) {
    errors.message = "Add a little more detail, at least 20 characters.";
  }

  return errors;
}

function isUuid(value?: string) {
  return Boolean(
    value &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        value,
      ),
  );
}
