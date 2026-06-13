import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { mapListingRow } from "@/lib/listings";
import { ListingCard } from "@/components/ListingCard";
import type { ListingSort } from "@/types/listing";

type PropertiesPageProps = {
  searchParams?: Promise<{
    sort?: string | string[];
  }>;
};

function getSortValue(value: string | string[] | undefined): ListingSort {
  const normalizedValue = Array.isArray(value) ? value[0] : value;

  return normalizedValue === "price-asc" ? "price-asc" : "price-desc";
}

function getSortHref(sort: ListingSort) {
  return sort === "price-asc" ? "/properties?sort=price-asc" : "/properties?sort=price-desc";
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const sort = getSortValue(params?.sort);
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("published", true)
    .order("price", { ascending: sort === "price-asc" });

  if (error) {
    throw new Error("Impossible de charger les annonces publiées.");
  }

  const listings = data.map(mapListingRow);

  return (
    <section className="mx-auto max-w-6xl px-5 py-8 md:px-6 md:py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_16rem]">
        <div className="space-y-6">
          <div className="space-y-3 animate-fade-up">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-muted)]">Catalogue privé</p>
            <h1 className="max-w-3xl font-display text-[2.4rem] leading-[1] text-[var(--color-text)] md:text-[3.3rem]">
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
            <div className="grid gap-5 md:grid-cols-2">
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

        <aside className="animate-fade-up space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-[22px] border border-black/5 bg-[var(--color-panel)] p-4 shadow-[0_10px_30px_rgba(26,26,26,0.035)]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">Tri</p>
            <div className="mt-3 space-y-2">
              <a
                href={getSortHref("price-desc")}
                className={`block rounded-xl px-3 py-2.5 text-sm transition ${
                  sort === "price-desc"
                    ? "bg-[var(--color-text)] text-white"
                    : "bg-white text-[var(--color-text)] hover:bg-[var(--color-surface)]"
                }`}
              >
                Prix décroissant
              </a>
              <a
                href={getSortHref("price-asc")}
                className={`block rounded-xl px-3 py-2.5 text-sm transition ${
                  sort === "price-asc"
                    ? "bg-[var(--color-text)] text-white"
                    : "bg-white text-[var(--color-text)] hover:bg-[var(--color-surface)]"
                }`}
              >
                Prix croissant
              </a>
            </div>
          </div>

          <div className="rounded-[22px] border border-black/5 bg-white p-4 shadow-[0_10px_30px_rgba(26,26,26,0.03)]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">En ce moment</p>
            <div className="mt-3 space-y-2 text-sm text-[var(--color-muted)]">
              <p>{listings.length} annonce(s) publiée(s)</p>
              <p>Accès réservé aux visiteurs munis d’un code valide.</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
