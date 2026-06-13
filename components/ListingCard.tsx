import type { Route } from "next";
import Link from "next/link";
import type { Listing } from "@/types/listing";

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(value);
}

export function ListingCard({ listing }: { listing: Listing }) {
  const primaryPhoto = listing.photos[0];

  return (
    <Link
      href={`/properties/${listing.id}` as Route}
      className="group overflow-hidden rounded-[22px] border border-black/5 bg-white shadow-[0_10px_32px_rgba(26,26,26,0.045)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(26,26,26,0.08)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface)]">
        {primaryPhoto ? (
          <>
            <img
              src={primaryPhoto}
              alt={listing.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            {listing.photos.length > 1 ? (
              <div className="absolute bottom-3 right-3 rounded-full border border-white/40 bg-white/88 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--color-text)] backdrop-blur">
                {listing.photos.length} photos
              </div>
            ) : null}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--color-muted)]">
            Aucune photo disponible
          </div>
        )}
      </div>

      <div className="space-y-3 px-4 py-4 sm:px-5">
        <div className="space-y-1.5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">{listing.city}</p>
          <h2 className="font-display text-[1.45rem] leading-tight text-[var(--color-text)] transition group-hover:translate-x-0.5">
            {listing.title}
          </h2>
        </div>

        <div className="flex flex-col gap-3 border-t border-black/5 pt-3 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-base font-semibold text-[var(--color-text)]">{formatPrice(listing.price)}</p>
          <div className="text-[13px] text-[var(--color-muted)] sm:text-right">
            <p>{listing.areaSqm} m2</p>
            <p>{listing.bedrooms} chambres</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
