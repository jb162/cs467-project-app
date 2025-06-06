const BASE_URL =
  process.env.FLASK_API_URL ||
  "https://backend-api-729553473022.us-central1.run.app/v1";

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  user_location?: string;
}

export interface User {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  user_location?: string;
  favorite_listings?: number[]; 
  created_datetime?: string;
  updated_datetime?: string;
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  try {
    const res = await fetch(`${BASE_URL}/Users`, requestOptions);

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create user");
    }

    return await res.json();
  } catch (error) {
    console.error("createUser error:", error);
    throw error;
  }
}

export async function getUser(username: string): Promise<User> {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await fetch(`${BASE_URL}/Users/${username}`, requestOptions);

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to fetch user");
    }

    return await res.json();
  } catch (error) {
    console.error("getUser error:", error);
    throw error;
  }
}

export async function updateUser(username: string, updates: Partial<User>): Promise<{ message: string }> {
  const requestOptions: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  };

  try {
    const res = await fetch(`${BASE_URL}/Users/${username}`, requestOptions);

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update user");
    }

    return await res.json();
  } catch (error) {
    console.error("updateUser error:", error);
    throw error;
  }
}

export async function updateFavoriteListings(
  username: string,
  favoriteListings: string[]
): Promise<{ message: string }> {
  const requestOptions: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ favorite_listings: favoriteListings }),
  };

  try {
    const res = await fetch(
      `${BASE_URL}/Users/${username}/favorite_listings`,
      requestOptions
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update favorites");
    }

    return await res.json();
  } catch (error) {
    console.error("updateFavoriteListings error:", error);
    throw error;
  }
}
