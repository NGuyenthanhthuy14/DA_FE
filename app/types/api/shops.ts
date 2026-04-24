export interface Shop {
  _id: string;

  owner_id: string;
  name: string;
  slug: string;

  description: string;
  phone: string;
  cover_image: string;

  latitude: number;
  longitude: number;

  address: string;
  formatted_address: string;

  status: "active" | "inactive";

  created_at: string;
  updated_at: string;
}

export interface ShopsResponse {
	statusCode: number;
  error: string | null;
  message: string;
  metadata: Shop[];
}