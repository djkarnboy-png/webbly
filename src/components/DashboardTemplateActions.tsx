"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  archiveTemplateAction,
  deleteTemplateAction,
} from "@/app/dashboard/actions";

export function DashboardTemplateActions({ templateId }: { templateId: string }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function archiveTemplate() {
    startTransition(async () => {
      const result = await archiveTemplateAction(templateId);
      setMessage(result.message);
    });
  }

  function deleteTemplate() {
    if (!window.confirm("Delete this template permanently? This cannot be undone.")) {
      return;
    }
    startTransition(async () => {
      const result = await deleteTemplateAction(templateId);
      setMessage(result.message);
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/dashboard/templates/${templateId}/edit`}
          className="inline-flex h-9 items-center justify-center rounded-md border border-white/15 bg-white/[0.04] px-3 text-xs font-semibold text-slate-200 transition hover:border-blue-400/60 hover:bg-blue-500/10"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={archiveTemplate}
          disabled={isPending}
          className="h-9 rounded-md border border-white/15 bg-white/[0.04] px-3 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.08] disabled:opacity-50"
        >
          Archive
        </button>
        <button
          type="button"
          onClick={deleteTemplate}
          disabled={isPending}
          className="h-9 rounded-md border border-rose-400/25 bg-rose-500/[0.06] px-3 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
      {message ? <p className="mt-2 text-xs text-slate-500" role="status">{message}</p> : null}
    </div>
  );
}
