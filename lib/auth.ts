import "server-only";
import type { Session } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function getAdminSession(): Promise<Session | null> {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("[auth] getUser failed", {
        message: userError.message,
        status: userError.status ?? null,
        name: userError.name ?? null
      });
      return null;
    }

    if (!user) {
      return null;
    }

    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("[auth] getSession failed", {
        message: sessionError.message,
        status: sessionError.status ?? null,
        name: sessionError.name ?? null
      });
      return null;
    }

    return session;
  } catch (error) {
    console.error("[auth] getAdminSession crashed", error);
    return null;
  }
}
