export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  areaSqm: number;
  bedrooms: number;
  photos: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ListingSort = "price-asc" | "price-desc";

export type ListingFormState = {
  error?: string;
};
