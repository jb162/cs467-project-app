const BASE_URL =
  process.env.FLASK_API_URL ||
  "https://backend-api-729553473022.us-central1.run.app/v1";

export interface ListingImage {
  id: number;
  filename: string;
  url: string;
  is_primary: boolean;
  created_datetime: string | null;
}

export interface UserProfileImageResponse {
  url: string | null;
}

export async function fetchUserProfileImage(username: string): Promise<UserProfileImageResponse> {
  try {
    const response = await fetch(`${BASE_URL}/Users/${encodeURIComponent(username)}/profile-image`);
    if (!response.ok) {
      throw new Error(`Error fetching profile image: ${response.statusText}`);
    }
    const data: UserProfileImageResponse = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return { url: null };
  }
}

export async function getListingImages(
  listingId: number
): Promise<ListingImage[]> {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await fetch(
      `${BASE_URL}/Listings/${listingId}/Images`,
      requestOptions
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to fetch listing images");
    }

    const data = await res.json();
    return data.images;
  } catch (error) {
    console.error("getListingImages error:", error);
    throw error;
  }
}

export async function uploadImage(
  image: File,
  listingId: number,
  uploadUsername: string,
  isPrimary: boolean = false
): Promise<ListingImage> {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("listing_id", listingId.toString());
  formData.append("upload_username", uploadUsername);
  formData.append("is_primary", isPrimary.toString());

  const requestOptions: RequestInit = {
    method: "POST",
    body: formData,
  };

  try {
    const res = await fetch(`${BASE_URL}/Images`, requestOptions);

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to upload image");
    }

    return await res.json();
  } catch (error) {
    console.error("uploadImage error:", error);
    throw error;
  }
}
