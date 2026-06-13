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
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-black/5 px-4 py-5 lg:flex lg:w-72 lg:flex-col lg:justify-between lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
          <div>
            <div className="mb-5 lg:mb-10">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Murat Immo</p>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight">Administration</h1>
            </div>

            <nav className="-mx-1 flex gap-2 overflow-x-auto pb-1 lg:mx-0 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
              {navigation.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block shrink-0 rounded-xl px-4 py-3 text-sm transition lg:shrink ${
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

          <div className="mt-5 lg:mt-8">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              Déconnexion
            </button>
          </div>
        </aside>

        <main className="flex-1 px-4 py-6 md:px-6 lg:px-10 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
