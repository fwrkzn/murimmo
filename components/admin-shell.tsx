"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";

const navigation = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/listings", label: "Annonces" },
  { href: "/admin/codes", label: "Codes d'accès" },
  { href: "/admin/preview", label: "Aperçu visiteur" }
] as const satisfies ReadonlyArray<{ href: Route; label: string }>;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return children;
  }

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();

    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="flex w-72 flex-col justify-between border-r border-black/5 px-6 py-8">
          <div>
            <div className="mb-10">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Murat Immo</p>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight">Administration</h1>
            </div>

            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-xl px-4 py-3 text-sm transition ${
                      isActive
                        ? "bg-white font-medium text-slate-950 shadow-sm"
                        : "text-slate-600 hover:bg-white/70 hover:text-slate-950"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
          >
            Déconnexion
          </button>
        </aside>

        <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
      </div>
    </div>
  );
}
