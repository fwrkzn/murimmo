import { createListing } from "@/app/admin/listings/actions";
import { ListingForm } from "@/components/listing-form";

export default function AdminNewListingPage() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Admin</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Nouvelle annonce</h2>
      </div>

      <ListingForm action={createListing} submitLabel="Créer l'annonce" />
    </section>
  );
}
