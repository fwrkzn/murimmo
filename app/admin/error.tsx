"use client";

export default function AdminErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F9F9F8] px-6 py-12">
      <section className="w-full max-w-xl rounded-3xl border border-red-100 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
        <p className="text-xs uppercase tracking-[0.24em] text-red-500">Administration</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Une erreur serveur est survenue</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Le chargement de cette page a échoué. Les détails ont été envoyés dans les logs du serveur.
        </p>
        {error.digest ? (
          <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">Référence: {error.digest}</p>
        ) : null}
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Réessayer
        </button>
      </section>
    </main>
  );
}
