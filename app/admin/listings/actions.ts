"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { deletePhoto, uploadPhoto } from "@/lib/storage";
import type { ListingFormState } from "@/types/listing";

function getErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof Error && error.message ? error.message : fallbackMessage;
}

function parseString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function parseNumber(formData: FormData, key: string) {
  const value = Number(parseString(formData, key));

  return Number.isFinite(value) ? value : Number.NaN;
}

function parseFiles(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

function validateListingPayload(formData: FormData) {
  const title = parseString(formData, "title");
  const description = parseString(formData, "description");
  const city = parseString(formData, "city");
  const price = parseNumber(formData, "price");
  const areaSqm = parseNumber(formData, "area_sqm");
  const bedrooms = parseNumber(formData, "bedrooms");
  const published = formData.get("published") === "on";

  if (!title || !description || !city) {
    return { error: "Tous les champs de texte obligatoires doivent être renseignés." };
  }

  if (!Number.isFinite(price) || price < 0 || !Number.isFinite(areaSqm) || areaSqm < 0) {
    return { error: "Le prix et la surface doivent être des nombres valides." };
  }

  if (!Number.isInteger(bedrooms) || bedrooms < 0) {
    return { error: "Le nombre de chambres doit être un entier valide." };
  }

  return {
    title,
    description,
    city,
    price,
    areaSqm,
    bedrooms,
    published
  };
}

function getRedirectTarget(listingId?: string) {
  return listingId ? `/admin/listings/${listingId}/edit` : "/admin/listings/new";
}

export async function createListing(
  _previousState: ListingFormState,
  formData: FormData
): Promise<ListingFormState> {
  const payload = validateListingPayload(formData);

  if ("error" in payload) {
    return payload;
  }

  const supabase = createSupabaseAdminClient();
  const files = parseFiles(formData, "photos");
  const { data: createdListing, error: insertError } = await supabase
    .from("listings")
    .insert({
      title: payload.title,
      description: payload.description,
      price: payload.price,
      city: payload.city,
      area_sqm: payload.areaSqm,
      bedrooms: payload.bedrooms,
      published: payload.published,
      photos: []
    })
    .select("id")
    .single();

  if (insertError || !createdListing) {
    return { error: "Impossible de créer l'annonce." };
  }

  const uploadedUrls: string[] = [];

  try {
    for (const file of files) {
      const publicUrl = await uploadPhoto(file, createdListing.id);

      uploadedUrls.push(publicUrl);
    }

    const { error: updateError } = await supabase
      .from("listings")
      .update({ photos: uploadedUrls })
      .eq("id", createdListing.id);

    if (updateError) {
      throw updateError;
    }
  } catch (error) {
    await Promise.allSettled(uploadedUrls.map((url) => deletePhoto(url)));
    await supabase.from("listings").delete().eq("id", createdListing.id);

    return { error: getErrorMessage(error, "Impossible d'enregistrer les photos de l'annonce.") };
  }

  revalidatePath("/admin/listings");
  revalidatePath("/admin/dashboard");
  redirect("/admin/listings");
}

export async function updateListing(
  listingId: string,
  _previousState: ListingFormState,
  formData: FormData
): Promise<ListingFormState> {
  const payload = validateListingPayload(formData);

  if ("error" in payload) {
    return payload;
  }

  const supabase = createSupabaseAdminClient();
  const { data: existingListing, error: fetchError } = await supabase
    .from("listings")
    .select("id, photos")
    .eq("id", listingId)
    .maybeSingle();

  if (fetchError || !existingListing) {
    return { error: "Annonce introuvable." };
  }

  const removedPhotoUrls = formData
    .getAll("remove_photos")
    .filter((value): value is string => typeof value === "string" && value.length > 0);
  const files = parseFiles(formData, "photos");
  const keptPhotos = existingListing.photos.filter((url) => !removedPhotoUrls.includes(url));
  const uploadedUrls: string[] = [];

  try {
    for (const file of files) {
      const publicUrl = await uploadPhoto(file, listingId);

      uploadedUrls.push(publicUrl);
    }

    const nextPhotos = [...keptPhotos, ...uploadedUrls];
    const { error: updateError } = await supabase
      .from("listings")
      .update({
        title: payload.title,
        description: payload.description,
        price: payload.price,
        city: payload.city,
        area_sqm: payload.areaSqm,
        bedrooms: payload.bedrooms,
        published: payload.published,
        photos: nextPhotos
      })
      .eq("id", listingId);

    if (updateError) {
      throw updateError;
    }

    await Promise.all(removedPhotoUrls.map((url) => deletePhoto(url)));
  } catch (error) {
    await Promise.allSettled(uploadedUrls.map((url) => deletePhoto(url)));

    return { error: getErrorMessage(error, "Impossible de mettre à jour l'annonce.") };
  }

  revalidatePath("/admin/listings");
  revalidatePath(`/admin/listings/${listingId}/edit`);
  revalidatePath("/admin/dashboard");
  redirect("/admin/listings");
}

export async function deleteListing(listingId: string) {
  const supabase = createSupabaseAdminClient();
  const { data: listing, error: fetchError } = await supabase
    .from("listings")
    .select("photos")
    .eq("id", listingId)
    .maybeSingle();

  if (fetchError || !listing) {
    throw new Error("Annonce introuvable.");
  }

  await Promise.allSettled(listing.photos.map((url) => deletePhoto(url)));

  const { error: deleteError } = await supabase.from("listings").delete().eq("id", listingId);

  if (deleteError) {
    throw new Error("Impossible de supprimer l'annonce.");
  }

  revalidatePath("/admin/listings");
  revalidatePath("/admin/dashboard");
  redirect("/admin/listings");
}
