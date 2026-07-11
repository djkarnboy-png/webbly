"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function moderateTemplateAction(formData: FormData) {
  const viewer = await requireViewer("/admin");
  if (viewer.role !== "admin") {
    redirect("/admin");
  }

  const templateId = getText(formData, "templateId");
  const intent = getText(formData, "intent");

  if (!isUuid(templateId)) {
    return;
  }

  const supabase = await createClient();

  if (intent === "approve") {
    await supabase.from("templates").update({ status: "published" }).eq("id", templateId);
  } else if (intent === "reject") {
    await supabase
      .from("templates")
      .update({ status: "rejected", is_featured: false })
      .eq("id", templateId);
  } else if (intent === "feature") {
    await supabase
      .from("templates")
      .update({ is_featured: true })
      .eq("id", templateId)
      .eq("status", "published");
  } else if (intent === "unfeature") {
    await supabase.from("templates").update({ is_featured: false }).eq("id", templateId);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/templates");
}

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}
