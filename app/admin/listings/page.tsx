import type { Route } from "next";
import Link from "next/link";
import { deleteListing } from "@/app/admin/listings/actions";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(value);
}

export default async function AdminListingsPage() {
  const supabase = createSupabaseAdminClient();
  const { data: listings, error } = await supabase
    .from("listings")
    .select("id, title, city, price, published")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Impossible de charger les annonces.");
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Admin</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Annonces</h2>
        </div>

        <Link
          href={"/admin/listings/new" as Route}
          className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Nouvelle annonce
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <div className="hidden grid-cols-[1.4fr_1fr_1fr_0.8fr_1.25fr] gap-4 border-b border-slate-100 px-6 py-4 text-xs uppercase tracking-[0.22em] text-slate-400 md:grid">
          <span>Titre</span>
          <span>Ville</span>
          <span>Prix</span>
          <span>Statut</span>
          <span className="text-right">Actions</span>
        </div>

        <div className="divide-y divide-slate-100">
          {listings.length === 0 ? (
            <p className="px-6 py-10 text-sm text-slate-500">Aucune annonce pour le moment.</p>
          ) : (
            listings.map((listing) => {
              const deleteAction = deleteListing.bind(null, listing.id);

              return (
                <div
                  key={listing.id}
                  className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-[1.4fr_1fr_1fr_0.8fr_1.25fr] md:items-center"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400 md:hidden">Titre</p>
                    <p className="mt-1 font-medium text-slate-950">{listing.title}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400 md:hidden">Ville</p>
                    <p className="mt-1 text-sm text-slate-600">{listing.city}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400 md:hidden">Prix</p>
                    <p className="mt-1 text-sm text-slate-600">{formatPrice(listing.price)}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400 md:hidden">Statut</p>
                    <span
                      className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        listing.published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {listing.published ? "Publiée" : "Brouillon"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 md:justify-end">
                    {listing.published ? (
                      <a
                        href={`/properties/${listing.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-[var(--color-border)] bg-[#FCFAF7] px-3 py-2 text-sm font-medium text-[var(--color-text)] transition hover:border-[var(--color-text)]"
                      >
                        Voir
                      </a>
                    ) : null}

                    <Link
                      href={`/admin/listings/${listing.id}/edit` as Route}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                    >
                      Modifier
                    </Link>

                    <form action={deleteAction}>
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:border-red-300 hover:text-red-700"
                      >
                        Supprimer
                      </button>
                    </form>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
