"use server";

import { createSupabaseAdminClient } from "@/lib/supabase-admin";

function getAppUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function createAdminRecoveryLink(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error("Veuillez renseigner votre adresse e-mail.");
  }

  const supabase = createSupabaseAdminClient();
  const redirectTo = new URL("/admin/reset-password", getAppUrl()).toString();

  const { data, error } = await (supabase.auth.admin as any).generateLink({
    type: "recovery",
    email: normalizedEmail,
    options: {
      redirectTo
    }
  });

  if (error) {
    throw new Error(error.message || "Impossible de générer le lien de réinitialisation.");
  }

  const link = data?.properties?.action_link;

  if (typeof link !== "string" || !link) {
    throw new Error("Impossible de générer le lien de réinitialisation.");
  }

  return { link };
}
