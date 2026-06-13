import type { Database } from "@/types/database";
import type { Listing } from "@/types/listing";

type ListingRow = Database["public"]["Tables"]["listings"]["Row"];

export function mapListingRow(row: ListingRow): Listing {
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
