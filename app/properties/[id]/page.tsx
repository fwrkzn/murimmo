import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { PhotoGallery } from "@/components/PhotoGallery";
import { mapListingRow } from "@/lib/listings";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

type PropertyDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(value);
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  const [{ data, error }, { data: relatedRows, error: relatedError }] = await Promise.all([
    supabase.from("listings").select("*").eq("id", id).eq("published", true).maybeSingle(),
    supabase
      .from("listings")
      .select("*")
      .eq("published", true)
      .neq("id", id)
      .order("created_at", { ascending: false })
      .limit(2)
  ]);

  if (error) {
    throw new Error("Impossible de charger cette annonce.");
  }

  if (relatedError) {
    throw new Error("Impossible de charger les autres annonces.");
  }

  if (!data) {
    notFound();
  }

  const listing = mapListingRow(data);
  const relatedListings = relatedRows.map(mapListingRow);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-5 md:px-6 md:py-10">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
        <div className="space-y-5">
          <div className="flex flex-col gap-4 animate-fade-up">
            <Link
              href={"/properties" as Route}
              className="inline-flex w-fit items-center rounded-full border border-[var(--color-border)] bg-white px-3.5 py-1.5 text-xs uppercase tracking-[0.16em] text-[var(--color-text)] transition hover:border-[var(--color-text)]"
            >
              Retour à la liste
            </Link>

            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">{listing.city}</p>
              <h1 className="max-w-3xl font-display text-[2rem] leading-[0.98] text-[var(--color-text)] sm:text-[2.5rem] md:text-[3.4rem]">
                {listing.title}
              </h1>
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "80ms" }}>
            <PhotoGallery photos={listing.photos} title={listing.title} />
          </div>

          <div className="grid gap-4 md:grid-cols-[12rem_1fr] animate-fade-up" style={{ animationDelay: "120ms" }}>
            <div className="rounded-[20px] border border-black/5 bg-[var(--color-panel)] p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">Repères</p>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">Surface</p>
                  <p className="mt-1 text-[var(--color-text)]">{listing.areaSqm} m2</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">Chambres</p>
                  <p className="mt-1 text-[var(--color-text)]">{listing.bedrooms}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">Ville</p>
                  <p className="mt-1 text-[var(--color-text)]">{listing.city}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[0_10px_26px_rgba(26,26,26,0.03)]">
              <h2 className="font-display text-[1.65rem] text-[var(--color-text)]">Description</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)] whitespace-pre-line">{listing.description}</p>
            </div>
          </div>
        </div>

        <aside className="animate-fade-up lg:sticky lg:top-20 lg:self-start" style={{ animationDelay: "100ms" }}>
          <div className="rounded-[22px] border border-black/5 bg-white p-5 shadow-[0_12px_32px_rgba(26,26,26,0.04)]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">Prix</p>
            <p className="mt-2 font-display text-[2rem] leading-none text-[var(--color-text)]">
              {formatPrice(listing.price)}
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              Un aperçu synthétique du bien, avec ses informations essentielles, avant une visite plus détaillée.
            </p>
          </div>
        </aside>
      </section>

      {relatedListings.length ? (
        <section className="mt-14 space-y-5 animate-fade-up" style={{ animationDelay: "160ms" }}>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">Continuer la visite</p>
              <h2 className="font-display text-[2rem] text-[var(--color-text)]">Découvrir d&apos;autres biens</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[var(--color-muted)]">
              Poursuivez votre visite avec d&apos;autres annonces actuellement disponibles dans la collection privée.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {relatedListings.map((relatedListing) => (
              <ListingCard key={relatedListing.id} listing={relatedListing} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
