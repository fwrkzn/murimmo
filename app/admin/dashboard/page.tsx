import { createSupabaseAdminClient } from "@/lib/supabase-admin";

function formatCount(value: number | null) {
  return new Intl.NumberFormat("fr-FR").format(value ?? 0);
}

export default async function AdminDashboardPage() {
  const supabase = createSupabaseAdminClient();
  const now = new Date().toISOString();

  const [
    { count: publishedListings, error: publishedError },
    { count: activeCodes, error: activeError },
    { count: expiredCodes, error: expiredError }
  ] = await Promise.all([
    supabase.from("listings").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("access_codes").select("*", { count: "exact", head: true }).gte("expires_at", now),
    supabase.from("access_codes").select("*", { count: "exact", head: true }).lt("expires_at", now)
  ]);

  if (publishedError || activeError || expiredError) {
    throw new Error("Impossible de charger les statistiques du tableau de bord.");
  }

  const stats = [
    {
      label: "Annonces publiées",
      value: formatCount(publishedListings),
      hint: "Biens actuellement visibles"
    },
    {
      label: "Codes actifs valides",
      value: formatCount(activeCodes),
      hint: "Codes réutilisables encore valides"
    },
    {
      label: "Codes expirés",
      value: formatCount(expiredCodes),
      hint: "Codes à renouveler si besoin"
    }
  ];

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Admin</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Tableau de bord</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">{stat.value}</p>
            <p className="mt-3 text-sm text-slate-400">{stat.hint}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
