import type { Database } from "@/types/database";
import type { Listing as ListingModel } from "@/types/listing";

export type Admin = Database["public"]["Tables"]["admins"]["Row"];
export type ListingRow = Database["public"]["Tables"]["listings"]["Row"];
export type AccessCode = Database["public"]["Tables"]["access_codes"]["Row"];
export type Listing = ListingModel;
