"use client";

import type { FormEvent } from "react";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export function AdminResetPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let isMounted = true;

    const initialize = async () => {
      const { data } = await supabase.auth.getSession();

      if (isMounted) {
        setHasRecoverySession(Boolean(data.session));
        setIsReady(true);
      }
    };

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasRecoverySession(Boolean(session));
        setIsReady(true);
      }
    });

    void initialize();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmation = String(formData.get("confirmation") ?? "");

    setError(null);
    setMessage(null);

    if (!hasRecoverySession) {
      setError("Le lien de réinitialisation n'est pas encore actif.");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password
    });

    if (updateError) {
      setError("Impossible de changer le mot de passe pour le moment.");
      return;
    }

    setMessage("Mot de passe mis à jour. Redirection...");

    startTransition(() => {
      router.replace("/admin/dashboard");
      router.refresh();
    });
  }

  return (
    <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Admin panel</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Nouveau mot de passe</h1>
        <p className="text-sm text-slate-500">
          {isReady
            ? "Choisissez un nouveau mot de passe pour reprendre l'accès à l'administration."
            : "Vérification du lien de réinitialisation..."}
        </p>
      </div>

      {isReady ? (
        hasRecoverySession ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Nouveau mot de passe</span>
              <input
                required
                type="password"
                name="password"
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400"
                placeholder="Nouveau mot de passe"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Confirmer le mot de passe</span>
              <input
                required
                type="password"
                name="confirmation"
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400"
                placeholder="Confirmez le mot de passe"
              />
            </label>

            {error ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            {message ? (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isPending ? "Mise à jour..." : "Modifier le mot de passe"}
            </button>
          </form>
        ) : (
          <div className="mt-8 space-y-4">
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Ce lien ne semble plus valide. Demandez un nouvel e-mail de réinitialisation depuis la page de connexion.
            </p>
            <button
              type="button"
              onClick={() => router.replace("/admin/login")}
              className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Retour à la connexion
            </button>
          </div>
        )
      ) : null}
    </section>
  );
}
