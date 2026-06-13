import { ListingCard } from "@/components/ListingCard";
import { PhotoGallery } from "@/components/PhotoGallery";
import { mapListingRow } from "@/lib/listings";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(value);
}

export default async function AdminPreviewPage() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Impossible de charger l'aperçu visiteur.");
  }

  const listings = data.map(mapListingRow);
  const featuredListing = listings[0];

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Admin</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Aperçu visiteur</h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Cette section reprend le style public du catalogue pour vérifier rapidement ce que voit un visiteur
            après validation de son code d&apos;accès.
          </p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
          <p>{listings.length} annonce(s) publiée(s)</p>
          <p className="mt-1 text-slate-400">Seules les annonces publiées apparaissent côté visiteur.</p>
        </div>
      </div>

      {featuredListing ? (
        <div className="space-y-5 rounded-[32px] border border-black/5 bg-[#FCFAF7] p-6 shadow-[0_18px_60px_rgba(26,26,26,0.05)]">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]">Aperçu détail</p>
            <h3 className="font-display text-3xl text-[var(--color-text)]">{featuredListing.title}</h3>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <PhotoGallery photos={featuredListing.photos} title={featuredListing.title} />

            <div className="space-y-6 rounded-[28px] border border-black/5 bg-white p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">{featuredListing.city}</p>
                <p className="mt-3 text-3xl font-medium text-[var(--color-text)]">
                  {formatPrice(featuredListing.price)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-[24px] bg-[var(--color-surface)] p-5 text-sm text-[var(--color-text)]">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">Surface</p>
                  <p className="mt-2">{featuredListing.areaSqm} m2</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">Chambres</p>
                  <p className="mt-2">{featuredListing.bedrooms}</p>
                </div>
              </div>

              <p className="text-sm leading-7 text-[var(--color-muted)] whitespace-pre-line">
                {featuredListing.description}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-5">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]">Aperçu catalogue</p>
          <h3 className="font-display text-3xl text-[var(--color-text)]">Grille publique des annonces</h3>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-[var(--color-border)] bg-white px-8 py-16 text-center">
            <p className="font-display text-3xl text-[var(--color-text)]">Aucune annonce publiée</p>
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              Publiez une annonce pour voir l&apos;aperçu visiteur.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
