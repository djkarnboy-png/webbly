"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toggleSavedTemplate } from "@/app/actions/saved";
import {
  AUTH_ACTION_PARAM,
  loginPathFor,
  verificationPathFor,
  withAuthAction,
  withoutAuthAction,
} from "@/lib/auth-redirect";

export function SaveTemplateButton({
  templateId,
  initialSaved = false,
  canSave = false,
  verified = false,
  compact = false,
}: {
  templateId: string;
  initialSaved?: boolean;
  canSave?: boolean;
  verified?: boolean;
  compact?: boolean;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const actionReturnPath = useCallback(() => {
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    return withAuthAction(currentPath, "save", { templateId });
  }, [templateId]);

  const handleSave = useCallback(() => {
    setError("");
    if (!canSave) {
      router.push(loginPathFor(actionReturnPath()));
      return;
    }

    if (!verified) {
      router.push(verificationPathFor(actionReturnPath()));
      return;
    }

    startTransition(async () => {
      const result = await toggleSavedTemplate(templateId, actionReturnPath());
      if (result.loginRequired) {
        router.push(loginPathFor(actionReturnPath()));
        return;
      }
      if (result.success) {
        setSaved(result.saved);
      } else {
        setError(result.message);
      }
    });
  }, [actionReturnPath, canSave, router, templateId, verified]);

  useEffect(() => {
    if (!verified) {
      return;
    }

    const url = new URL(window.location.href);
    if (
      url.searchParams.get(AUTH_ACTION_PARAM) !== "save" ||
      url.searchParams.get("templateId") !== templateId
    ) {
      return;
    }

    const currentPath = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState(
      window.history.state,
      "",
      withoutAuthAction(currentPath),
    );
    const timer = window.setTimeout(handleSave, 0);
    return () => window.clearTimeout(timer);
  }, [handleSave, templateId, verified]);

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
          : "border-white/15 bg-[#070b12]/90 text-slate-200 hover:border-blue-400/60 hover:bg-blue-500/10 hover:text-blue-200"
      }`}
    >
      <span aria-live="polite">
        {isPending ? "Saving..." : error ? "Try again" : saved ? "Saved" : "Save"}
      </span>
    </button>
  );
}
