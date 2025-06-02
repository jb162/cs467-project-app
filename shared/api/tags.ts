const BASE_URL =
  process.env.FLASK_API_URL ||
  "https://backend-api-729553473022.us-central1.run.app/v1";

export interface Tag {
  tag_id: number;
  listing_id: number;
  name: string;
  created_datetime: string;
}

export async function getTags(): Promise<Tag[]> {
  try {
    const res = await fetch(`${BASE_URL}/Tags`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to fetch tags");
    }
    return await res.json();
  } catch (error) {
    console.error("getTags error:", error);
    throw error;
  }
}

// Get tags for a specific listing
export async function getTagsForListing(listingId: number): Promise<Tag[]> {
  try {
    const res = await fetch(`${BASE_URL}/Tags/${listingId}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || `Failed to fetch tags for listing ${listingId}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`getTagsForListing error (listingId: ${listingId}):`, error);
    throw error;
  }
}

export async function createTag(name: string): Promise<Tag> {
  const body = JSON.stringify({ name });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  };

  try {
    const res = await fetch(`${BASE_URL}/Tags`, requestOptions);

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create tag");
    }

    return await res.json();
  } catch (error) {
    console.error("createTag error:", error);
    throw error;
  }
}
