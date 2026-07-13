"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  deleteWebsiteAction,
  publishWebsiteAction,
  unpublishWebsiteAction,
} from "@/app/dashboard/websites/actions";

export function DashboardWebsiteActions({
  websiteId,
  status,
}: {
  websiteId: string;
  status: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function publish() {
    startTransition(async () => {
      const result = await publishWebsiteAction(websiteId);
      setMessage(result.message);
    });
  }

  function unpublish() {
    startTransition(async () => {
      const result = await unpublishWebsiteAction(websiteId);
      setMessage(result.message);
    });
  }

  function deleteWebsite() {
    if (!window.confirm("Delete this website permanently? This cannot be undone.")) {
      return;
    }
    startTransition(async () => {
      const result = await deleteWebsiteAction(websiteId);
      setMessage(result.message);
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/marketplace/${websiteId}`}
          className="inline-flex h-9 items-center justify-center rounded-md border border-white/15 bg-white/[0.04] px-3 text-xs font-semibold text-slate-200 transition hover:border-blue-400/60 hover:bg-blue-500/10"
        >
          Preview
        </Link>
        {status === "listed" ? (
          <button
            type="button"
            onClick={unpublish}
            disabled={isPending}
            className="h-9 rounded-md border border-white/15 bg-white/[0.04] px-3 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.08] disabled:opacity-50"
          >
            Unpublish
          </button>
        ) : (
          <button
            type="button"
            onClick={publish}
            disabled={isPending || status === "sold"}
            className="h-9 rounded-md border border-emerald-400/25 bg-emerald-500/[0.06] px-3 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/10 disabled:opacity-50"
          >
            Publish
          </button>
        )}
        <button
          type="button"
          onClick={deleteWebsite}
          disabled={isPending}
          className="h-9 rounded-md border border-rose-400/25 bg-rose-500/[0.06] px-3 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
      {message ? (
        <p className="mt-2 text-xs text-slate-500" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
