"use client";

import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import type { Listing, ListingFormState } from "@/types/listing";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {pending ? "Enregistrement..." : label}
    </button>
  );
}

type ListingFormProps = {
  action: (state: ListingFormState, formData: FormData) => Promise<ListingFormState>;
  submitLabel: string;
  listing?: Listing;
};

const initialState: ListingFormState = {};

export function ListingForm({ action, submitLabel, listing }: ListingFormProps) {
  const [state, formAction] = useFormState(action, initialState);
  const [selectedPhotoPreviews, setSelectedPhotoPreviews] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      selectedPhotoPreviews.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    };
  }, [selectedPhotoPreviews]);

  function handlePhotoSelection(event: ChangeEvent<HTMLInputElement>) {
    selectedPhotoPreviews.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    const files = Array.from(event.target.files ?? []);
    const nextPreviews = files.map((file) => URL.createObjectURL(file));

    setSelectedPhotoPreviews(nextPreviews);
  }

  return (
    <form action={formAction} className="space-y-8 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <div className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Titre</span>
          <input
            type="text"
            name="title"
            defaultValue={listing?.title}
            required
            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-950"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Ville / localisation</span>
          <input
            type="text"
            name="city"
            defaultValue={listing?.city}
            required
            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-950"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Prix en EUR</span>
          <input
            type="number"
            name="price"
            min="0"
            step="0.01"
            defaultValue={listing?.price}
            required
            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-950"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Surface en m2</span>
          <input
            type="number"
            name="area_sqm"
            min="0"
            step="0.01"
            defaultValue={listing?.areaSqm}
            required
            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-950"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Nombre de chambres</span>
          <input
            type="number"
            name="bedrooms"
            min="0"
            step="1"
            defaultValue={listing?.bedrooms}
            required
            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-950"
          />
        </label>

        <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
          <input type="checkbox" name="published" defaultChecked={listing?.published} className="h-4 w-4" />
          <span className="text-sm font-medium text-slate-700">Annonce publiée</span>
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Description</span>
        <textarea
          name="description"
          defaultValue={listing?.description}
          required
          rows={8}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Photos</span>
        <input
          type="file"
          name="photos"
          multiple
          accept="image/*"
          onChange={handlePhotoSelection}
          className="block w-full rounded-xl border border-dashed border-slate-300 bg-[#F9F9F8] px-4 py-4 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800"
        />
        <p className="text-xs text-slate-500">
          Vous pouvez sélectionner plusieurs photos en une fois. La première photo servira d&apos;image principale.
          Lors d&apos;une modification, les nouvelles photos s&apos;ajoutent aux photos existantes tant que vous ne cochez pas leur
          suppression.
        </p>
      </label>

      {selectedPhotoPreviews.length ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">
            Nouvelles photos sélectionnées ({selectedPhotoPreviews.length})
          </p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {selectedPhotoPreviews.map((previewUrl, index) => (
              <div key={previewUrl} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="aspect-[4/3] bg-slate-100">
                  <img src={previewUrl} alt={`Aperçu photo ${index + 1}`} className="h-full w-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {listing?.photos.length ? (
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-700">Photos existantes</p>
            <p className="text-xs text-slate-500">
              Laissez-les telles quelles pour les conserver. Cochez uniquement celles à retirer.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {listing.photos.map((photoUrl) => (
              <label key={photoUrl} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="relative aspect-[4/3] bg-slate-100">
                  <img src={photoUrl} alt={listing.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex items-center gap-3 px-4 py-3">
                  <input type="checkbox" name="remove_photos" value={photoUrl} className="h-4 w-4" />
                  <span className="text-sm text-slate-700">Supprimer cette photo</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      ) : null}

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <div className="flex items-center justify-end">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
