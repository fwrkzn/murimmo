import { AccessCodeGenerator } from "@/components/access-code-generator";
import { AccessLinkCopyButton } from "@/components/access-link-copy-button";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default async function AdminCodesPage() {
  const supabase = createSupabaseAdminClient();
  const { data: codes, error } = await supabase
    .from("access_codes")
    .select("id, code, label, created_at, expires_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Impossible de charger les codes d'accès.");
  }

  const now = Date.now();

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Admin</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Codes d&apos;accès</h2>
      </div>

      <AccessCodeGenerator />

      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <div className="hidden grid-cols-[1.1fr_1.3fr_1fr_1fr_0.8fr_0.9fr] gap-4 border-b border-slate-100 px-6 py-4 text-xs uppercase tracking-[0.22em] text-slate-400 md:grid">
          <span>Code</span>
          <span>Label</span>
          <span>Créé le</span>
          <span>Expire le</span>
          <span>Statut</span>
          <span className="text-right">Action</span>
        </div>

        <div className="divide-y divide-slate-100">
          {codes.length === 0 ? (
            <p className="px-6 py-10 text-sm text-slate-500">Aucun code d&apos;accès pour le moment.</p>
          ) : (
            codes.map((accessCode) => {
              const isExpired = new Date(accessCode.expires_at).getTime() <= now;

              return (
                <div
                  key={accessCode.id}
                  className={`grid grid-cols-1 gap-4 px-4 py-5 sm:px-6 md:grid-cols-[1.1fr_1.3fr_1fr_1fr_0.8fr_0.9fr] md:items-center ${
                    isExpired ? "text-slate-400" : "text-slate-700"
                  }`}
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400 md:hidden">Code</p>
                    <p className="mt-1 font-semibold tracking-[0.22em] text-slate-950">{accessCode.code}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400 md:hidden">Label</p>
                    <p className="mt-1 text-sm">{accessCode.label ?? "Code générique"}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400 md:hidden">Création</p>
                    <p className="mt-1 text-sm">{formatDate(accessCode.created_at)}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400 md:hidden">Expiration</p>
                    <p className="mt-1 text-sm">{formatDate(accessCode.expires_at)}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400 md:hidden">Statut</p>
                    <p className={`mt-1 text-sm font-medium ${isExpired ? "text-slate-400" : "text-emerald-600"}`}>
                      {isExpired ? "Expiré" : "Actif"}
                    </p>
                  </div>

                  <AccessLinkCopyButton code={accessCode.code} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
