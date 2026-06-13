import { createSupabaseAdminClient } from "@/lib/supabase-admin";

const LISTINGS_PHOTOS_BUCKET = "listings-photos";

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

async function ensureListingsPhotosBucket() {
  const supabase = createSupabaseAdminClient();
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    throw new Error("Impossible de verifier le bucket photo.");
  }

  const alreadyExists = buckets.some((bucket) => bucket.name === LISTINGS_PHOTOS_BUCKET);

  if (alreadyExists) {
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(LISTINGS_PHOTOS_BUCKET, {
    public: true
  });

  if (createError && createError.message !== "The resource already exists") {
    throw new Error("Impossible de creer le bucket photo.");
  }
}

export async function uploadPhoto(file: File, listingId: string) {
  await ensureListingsPhotosBucket();

  const supabase = createSupabaseAdminClient();
  const fileExtension = file.name.includes(".") ? file.name.split(".").pop() : undefined;
  const fileName = sanitizeFileName(file.name.replace(/\.[^.]+$/, "")) || "photo";
  const path = `${listingId}/${crypto.randomUUID()}-${fileName}${fileExtension ? `.${fileExtension}` : ""}`;
  const { error: uploadError } = await supabase.storage
    .from(LISTINGS_PHOTOS_BUCKET)
    .upload(path, file, { cacheControl: "3600", contentType: file.type, upsert: false });

  if (uploadError) {
    throw new Error(uploadError.message || "Impossible d'envoyer une photo vers le stockage.");
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from(LISTINGS_PHOTOS_BUCKET).getPublicUrl(path);

  return publicUrl;
}

function getStoragePathFromUrl(url: string) {
  const pathname = new URL(url).pathname;
  const marker = `/storage/v1/object/public/${LISTINGS_PHOTOS_BUCKET}/`;
  const markerIndex = pathname.indexOf(marker);

  if (markerIndex === -1) {
    throw new Error("URL de photo Supabase invalide.");
  }

  return decodeURIComponent(pathname.slice(markerIndex + marker.length));
}

export async function deletePhoto(url: string) {
  const supabase = createSupabaseAdminClient();
  const path = getStoragePathFromUrl(url);
  const { error } = await supabase.storage.from(LISTINGS_PHOTOS_BUCKET).remove([path]);

  if (error) {
    throw new Error(error.message || "Impossible de supprimer une photo du stockage.");
  }
}
