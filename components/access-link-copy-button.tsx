"use client";

import { useState, useTransition } from "react";

export function AccessLinkCopyButton({ code }: { code: string }) {
  const [feedback, setFeedback] = useState<"idle" | "copied" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  function handleCopy() {
    startTransition(async () => {
      try {
        const url = new URL("/", window.location.origin);

        url.searchParams.set("code", code);
        await navigator.clipboard.writeText(url.toString());
        setFeedback("copied");
      } catch {
        setFeedback("error");
      }

      window.setTimeout(() => {
        setFeedback("idle");
      }, 2000);
    });
  }

  return (
    <div className="flex items-center justify-end gap-3">
      {feedback === "copied" ? <span className="text-xs text-emerald-600">Lien copie</span> : null}
      {feedback === "error" ? <span className="text-xs text-red-600">Copie impossible</span> : null}

      <button
        type="button"
        onClick={handleCopy}
        disabled={isPending}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:text-slate-400"
      >
        Copier le lien
      </button>
    </div>
  );
}
