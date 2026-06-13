"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { normalizeAccessCode, VISITOR_ACCESS_COOKIE } from "@/lib/access-codes";

export function VisitorAccessForm({ initialCode = "" }: { initialCode?: string }) {
  const [code, setCode] = useState(normalizeAccessCode(initialCode));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const hasAutoSubmitted = useRef(false);

  function submitCode(nextCode: string) {
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/visitor-access", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ code: nextCode })
        });

        const result = (await response.json()) as { code?: string; error?: string };

        if (!response.ok || !result.code) {
          setError(result.error ?? "Ce code est invalide ou expiré.");
          return;
        }

        sessionStorage.setItem(VISITOR_ACCESS_COOKIE, result.code);
        window.location.assign("/properties");
      } catch {
        setError("Impossible de vérifier le code pour le moment.");
      }
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitCode(normalizeAccessCode(code));
  }

  useEffect(() => {
    if (!code || hasAutoSubmitted.current) {
      return;
    }

    hasAutoSubmitted.current = true;
    submitCode(code);
  }, [code]);

  return (
    <div className="w-full max-w-sm rounded-[24px] border border-black/5 bg-white p-6 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
      <div className="space-y-3 text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Murat Immo</p>
        <h1 className="font-display text-[2rem] tracking-tight text-slate-950">Entrez dans la collection privée</h1>
        <p className="text-sm leading-6 text-slate-500">
          Saisissez votre code d&apos;accès pour découvrir une sélection de biens réservée à nos visiteurs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input
          type="text"
          inputMode="text"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          value={code}
          onChange={(event) => setCode(normalizeAccessCode(event.target.value))}
          placeholder="Ex. AB12CD34"
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-center text-sm tracking-[0.2em] text-slate-950 outline-none transition placeholder:tracking-normal placeholder:text-slate-400 focus:border-slate-950"
        />

        <button
          type="submit"
          disabled={isPending}
          className="h-11 w-full rounded-xl bg-slate-950 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isPending ? "Vérification..." : "Accéder"}
        </button>
      </form>

      {error ? <p className="mt-4 text-center text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
