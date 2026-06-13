import { normalizeAccessCode } from "@/lib/access-codes";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function getValidAccessCode(code: string) {
  const normalizedCode = normalizeAccessCode(code);

  if (!normalizedCode) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("access_codes")
    .select("code, expires_at, label")
    .eq("code", normalizedCode)
    .gt("expires_at", now)
    .maybeSingle();

  if (error) {
    throw new Error("Impossible de verifier le code d'acces.");
  }

  return data;
}
