"use server";

import { revalidatePath } from "next/cache";
import { requireVerifiedViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type SaveTemplateResult = {
  success: boolean;
  saved: boolean;
  loginRequired?: boolean;
  message: string;
};

export async function toggleSavedTemplate(
  templateId: string,
  returnTo = "/saved",
): Promise<SaveTemplateResult> {
  const viewer = await requireVerifiedViewer(returnTo);

  if (!isUuid(templateId)) {
    return { success: false, saved: false, message: "This template cannot be saved." };
  }

  const supabase = await createClient();
  const { data: existing, error: lookupError } = await supabase
    .from("saved_templates")
    .select("id")
    .eq("user_id", viewer.id)
    .eq("template_id", templateId)
    .maybeSingle();

  if (lookupError) {
    return { success: false, saved: false, message: "We could not update your saved templates." };
  }

  if (existing) {
    const { error } = await supabase
      .from("saved_templates")
      .delete()
      .eq("id", existing.id)
      .eq("user_id", viewer.id);

    if (error) {
      return { success: false, saved: true, message: "We could not remove this template." };
    }

    revalidateSavedPages();
    return { success: true, saved: false, message: "Removed from saved templates." };
  }

  const { error } = await supabase.from("saved_templates").insert({
    user_id: viewer.id,
    template_id: templateId,
  });

  if (error) {
    return { success: false, saved: false, message: "We could not save this template." };
  }

  revalidateSavedPages();
  return { success: true, saved: true, message: "Template saved." };
}

function revalidateSavedPages() {
  revalidatePath("/");
  revalidatePath("/templates");
  revalidatePath("/saved");
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}
