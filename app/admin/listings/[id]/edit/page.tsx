import { notFound } from "next/navigation";
import { deleteListing, updateListing } from "@/app/admin/listings/actions";
import { ListingForm } from "@/components/listing-form";
import { logAdminError } from "@/lib/admin-errors";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import type { Listing } from "@/types/listing";

export const dynamic = "force-dynamic";

type EditListingPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function mapListing(row: {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  area_sqm: number;
  bedrooms: number;
  photos: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}): Listing {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    city: row.city,
    areaSqm: row.area_sqm,
    bedrooms: row.bedrooms,
    photos: row.photos,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export default async function AdminEditListingPage({ params }: EditListingPageProps) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    logAdminError("edit listing query", error);
    throw new Error("Impossible de charger l'annonce.");
  }

  if (!listing) {
    notFound();
  }

  const updateAction = updateListing.bind(null, id);
  const deleteAction = deleteListing.bind(null, id);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Admin</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Modifier l&apos;annonce</h2>
        </div>

        <form action={deleteAction}>
          <button
            type="submit"
            className="rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-600 transition hover:border-red-300 hover:text-red-700"
          >
            Supprimer l&apos;annonce
          </button>
        </form>
      </div>

      <ListingForm action={updateAction} submitLabel="Enregistrer les modifications" listing={mapListing(listing)} />
    </section>
  );
}
