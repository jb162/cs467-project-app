const BASE_URL =
  process.env.FLASK_API_URL ||
  "https://backend-api-729553473022.us-central1.run.app/v1";

// Interfaces
export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  seller: string;
  location?: string;
  category?: string;         // not in DB, tags? remove this?
  item_condition?: string;
  is_sold?: boolean;
  active_status?: string;
  expiration_datetime?: string;
  created_datetime?: string;
  updated_datetime?: string;
  tags?: string[];
  images?: string[]; 
}

export interface PaginationMeta {
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
}

export interface ListingsResponse {
  listings: Listing[];
  pagination: PaginationMeta;
}

// GET /Listings
export async function getListings(): Promise<ListingsResponse> {
  const options: RequestInit = {
    method: "GET",
  };

  const res = await fetch(`${BASE_URL}/Listings`, options);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch listings");
  }

  return res.json();
}

// GET /Listings/:id
export async function getListingById(listingId: string): Promise<Listing> {
  const options: RequestInit = {
    method: "GET",
  };

  const res = await fetch(`${BASE_URL}/Listings/${listingId}`, options);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch listing");
  }

  return res.json();
}

// POST /Listings
export async function createListing(
  listing: Omit<Listing, "id" | "created_datetime" | "updated_datetime" >
): Promise<Listing> {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(listing),
  };

  const res = await fetch(`${BASE_URL}/Listings`, options);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create listing");
  }

  return res.json();
}

// DELETE /Listings/:id
export async function deleteListing(
  listingId: string
): Promise<{ message: string }> {
  const options: RequestInit = {
    method: "DELETE",
  };

  const res = await fetch(`${BASE_URL}/Listings/${listingId}`, options);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete listing");
  }

  return res.json();
}
