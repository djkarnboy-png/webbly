"use server";

import { revalidatePath } from "next/cache";
import { requireVerifiedViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type AccountActionState = {
  status: "idle" | "error" | "success";
  message: string;
};

export async function updateAccountAction(
  _previousState: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  const viewer = await requireVerifiedViewer("/account");
  const fullName = getText(formData, "fullName");
  const username = getText(formData, "username").toLowerCase();
  const location = getText(formData, "location");
  const bio = getText(formData, "bio");

  if (fullName.length < 2) {
    return { status: "error", message: "Enter your full name." };
  }

  if (username && !/^[a-z0-9_-]{3,30}$/.test(username)) {
    return {
      status: "error",
      message: "Username must be 3-30 characters using letters, numbers, dashes, or underscores.",
    };
  }

  if (bio.length > 320) {
    return { status: "error", message: "Keep your bio under 320 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      username: username || null,
      location: location || null,
      bio: bio || null,
    })
    .eq("id", viewer.id);

  if (error) {
    if (error.code === "23505") {
      return { status: "error", message: "That username is already in use." };
    }
    return { status: "error", message: "We could not save your profile. Please try again." };
  }

  await supabase
    .from("creators")
    .update({ display_name: fullName, bio: bio || null })
    .eq("profile_id", viewer.id);

  revalidatePath("/", "layout");
  revalidatePath("/account");
  return { status: "success", message: "Profile updated successfully." };
}

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}
