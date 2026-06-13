"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { generateAccessCode } from "@/app/admin/codes/actions";

export function AccessCodeGenerator() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const result = await generateAccessCode(label);

        setGeneratedCode(result.code);
        setLabel("");
        setIsOpen(false);
        router.refresh();
      } catch {
        setError("Impossible de générer le code pour le moment.");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight text-slate-950">Générer un code</h3>
          <p className="text-sm text-slate-500">
            Chaque code reste valide pendant 24 h et peut être réutilisé durant cette période.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsOpen((current) => !current);
            setError(null);
          }}
          className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          {isOpen ? "Fermer" : "Générer un code"}
        </button>
      </div>

      {isOpen ? (
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 md:flex-row">
          <input
            type="text"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Label facultatif, ex. Jean Dupont"
            className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-950"
          />
          <button
            type="submit"
            disabled={isPending}
            className="h-11 rounded-xl border border-slate-200 bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isPending ? "Génération..." : "Valider"}
          </button>
        </form>
      ) : null}

      {generatedCode ? (
        <p className="mt-4 rounded-xl bg-[#F9F9F8] px-4 py-3 text-sm text-slate-600">
          Nouveau code créé : <span className="font-semibold tracking-[0.18em] text-slate-950">{generatedCode}</span>
        </p>
      ) : null}

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
