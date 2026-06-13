"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { getAdminSession } from "@/lib/auth";

const ACCESS_CODE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const ACCESS_CODE_LENGTH = 8;
const ACCESS_CODE_VALIDITY_MS = 24 * 60 * 60 * 1000;

function generateRandomAccessCode() {
  const randomValues = crypto.getRandomValues(new Uint8Array(ACCESS_CODE_LENGTH));

  return Array.from(randomValues, (value) => ACCESS_CODE_CHARACTERS[value % ACCESS_CODE_CHARACTERS.length]).join(
    ""
  );
}

export async function generateAccessCode(label?: string) {
  const session = await getAdminSession();

  if (!session?.user) {
    throw new Error("Session admin introuvable.");
  }

  if (!session.user.email) {
    throw new Error("Le compte admin doit avoir une adresse e-mail.");
  }

  const supabase = createSupabaseAdminClient();
  const normalizedLabel = label?.trim() || null;
  const { data: existingAdmin, error: existingAdminError } = await supabase
    .from("admins")
    .select("id")
    .eq("id", session.user.id)
    .maybeSingle();

  if (existingAdminError) {
    throw new Error("Impossible de vérifier l'admin courant.");
  }

  if (!existingAdmin) {
    const { error: adminInsertError } = await supabase.from("admins").insert({
      id: session.user.id,
      email: session.user.email
    });

    if (adminInsertError) {
      throw new Error("Impossible de rattacher ce code à l'admin courant.");
    }
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generateRandomAccessCode();
    const expiresAt = new Date(Date.now() + ACCESS_CODE_VALIDITY_MS).toISOString();
    const { error } = await supabase.from("access_codes").insert({
      code,
      created_by: session.user.id,
      expires_at: expiresAt,
      label: normalizedLabel
    });

    if (!error) {
      revalidatePath("/admin/codes");
      revalidatePath("/admin/dashboard");

      return { code };
    }

    if (error.code !== "23505") {
      throw new Error("Impossible de générer un code d'accès.");
    }
  }

  throw new Error("Impossible de générer un code unique. Réessayez.");
}
