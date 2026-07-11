"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleSavedTemplate } from "@/app/actions/saved";

export function SaveTemplateButton({
  templateId,
  initialSaved = false,
  canSave = false,
  compact = false,
}: {
  templateId: string;
  initialSaved?: boolean;
  canSave?: boolean;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setError("");
    if (!canSave) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    startTransition(async () => {
      const result = await toggleSavedTemplate(templateId);
      if (result.loginRequired) {
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }
      if (result.success) {
        setSaved(result.saved);
      } else {
        setError(result.message);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={isPending}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved templates" : "Save template"}
      title={error || (saved ? "Remove from saved templates" : "Save template")}
      className={`inline-flex items-center justify-center border font-semibold shadow-sm backdrop-blur transition disabled:opacity-60 ${
        compact ? "h-9 rounded-md px-3 text-xs" : "h-11 rounded-lg px-4 text-sm"
      } ${
        saved
          ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
          : "border-white/80 bg-white/95 text-slate-800 hover:border-blue-300 hover:text-blue-700"
      }`}
    >
      <span aria-live="polite">
        {isPending ? "Saving..." : error ? "Try again" : saved ? "Saved" : "Save"}
      </span>
    </button>
  );
}
