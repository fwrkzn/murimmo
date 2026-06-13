import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { mapListingRow } from "@/lib/listings";
import { ListingCard } from "@/components/ListingCard";

export default async function PropertiesPage() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Impossible de charger les annonces publiées.");
  }

  const listings = data.map(mapListingRow);

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-5 md:px-6 md:py-10">
      <div className="space-y-6">
        <div className="space-y-3 animate-fade-up">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-muted)]">Catalogue privé</p>
          <h1 className="max-w-3xl font-display text-[2rem] leading-[0.98] text-[var(--color-text)] sm:text-[2.4rem] md:text-[3.3rem]">
            Une sélection confidentielle de biens
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
            Les biens présentés ici sont accessibles uniquement dans cet espace privé. Chaque annonce met en avant
            les informations essentielles, avec une lecture simple et directe.
          </p>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[var(--color-border)] bg-white px-6 py-12 text-center shadow-[0_10px_26px_rgba(26,26,26,0.03)]">
            <h2 className="font-display text-[1.8rem] text-[var(--color-text)]">Aucune annonce publiée</h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Le catalogue privé sera mis à jour dès qu&apos;une annonce sera disponible.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {listings.map((listing, index) => (
              <div
                key={listing.id}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(index * 70, 220)}ms` }}
              >
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
