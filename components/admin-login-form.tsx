"use client";

import type { Route } from "next";
import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createAdminRecoveryLink } from "@/app/admin/login/actions";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [recoveryLink, setRecoveryLink] = useState<string | null>(null);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setError(null);
    setMessage(null);
    setRecoveryLink(null);

    const supabase = createSupabaseBrowserClient();

    if (isResetMode) {
      if (!email) {
        setError("Veuillez renseigner votre adresse e-mail.");
        return;
      }

      const redirectTo = new URL("/admin/reset-password", window.location.origin).toString();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo
      });

      if (resetError) {
        try {
          const { link } = await createAdminRecoveryLink(email);

          setMessage("L'envoi par e-mail n'est pas disponible ici. Voici un lien de réinitialisation direct.");
          setRecoveryLink(link);
          return;
        } catch {
          setError("Impossible d'envoyer ou de générer le lien de réinitialisation pour le moment.");
          return;
        }
      }

      setMessage("Si l'adresse existe, vous allez recevoir un e-mail pour réinitialiser le mot de passe.");
      return;
    }

    if (!email || !password) {
      setError("Veuillez renseigner votre adresse e-mail et votre mot de passe.");
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      setError("Connexion impossible. Vérifiez vos identifiants.");
      return;
    }

    const dashboardRoute: Route = "/admin/dashboard";

    startTransition(() => {
      router.replace(dashboardRoute);
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:p-8"
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Bienvenue</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Heureux de vous retrouver. Connectez-vous pour accéder à votre espace d&apos;administration et gérer vos
            annonces en toute simplicité.
          </p>
        </div>

        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Admin panel</p>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            {isResetMode ? "Mot de passe oublié" : "Connexion"}
          </h1>
          <p className="text-sm text-slate-500">
            {isResetMode
              ? "Demandez un lien de réinitialisation pour créer un nouveau mot de passe."
              : "Connectez-vous pour gérer les annonces et les codes d'accès."}
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Adresse e-mail</span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400"
            placeholder="admin@exemple.com"
          />
        </label>

        {!isResetMode ? (
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Mot de passe</span>
            <input
              required
              type="password"
              name="password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400"
              placeholder="Votre mot de passe"
            />
          </label>
        ) : null}
      </div>

      {error ? (
        <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {message ? (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <p>{message}</p>
          {recoveryLink ? (
            <a
              href={recoveryLink}
              className="mt-3 block break-all rounded-lg bg-white/80 px-3 py-2 font-medium text-slate-950 underline decoration-slate-300 underline-offset-2"
            >
              {recoveryLink}
            </a>
          ) : null}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isPending ? "Connexion..." : isResetMode ? "Envoyer le lien" : "Se connecter"}
      </button>

      <button
        type="button"
        onClick={() => {
          setIsResetMode((current) => !current);
          setError(null);
          setMessage(null);
          setRecoveryLink(null);
        }}
        className="mt-4 w-full text-sm font-medium text-slate-600 transition hover:text-slate-950"
      >
        {isResetMode ? "Retour à la connexion" : "Mot de passe oublié ?"}
      </button>
    </form>
  );
}
