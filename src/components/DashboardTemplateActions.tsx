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
          className="inline-flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800 transition hover:border-blue-300 hover:bg-blue-50"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={archiveTemplate}
          disabled={isPending}
          className="h-9 rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800 transition hover:bg-slate-100 disabled:opacity-50"
        >
          Archive
        </button>
        <button
          type="button"
          onClick={deleteTemplate}
          disabled={isPending}
          className="h-9 rounded-md border border-rose-200 bg-white px-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
      {message ? <p className="mt-2 text-xs text-slate-500" role="status">{message}</p> : null}
    </div>
  );
}
