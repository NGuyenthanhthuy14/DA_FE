export interface SpecialtyStoryShop {
  _id: string;
  name: string;
  slug: string;
  address: string;
  formatted_address: string;
  cover_image: string;
  latitude: number;
  longitude: number;
}

export interface SpecialtyStorySpecialty {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  status?: "active" | "inactive";
  approval_status?: "pending" | "approved" | "rejected";
}

export interface SpecialtyStoryProductRef {
  _id?: string;
  id?: string;
  slug?: string;
}

export interface NearbySpecialtyStory {
  _id: string;
  specialty_id: string;
  product_id?: string;
  product?: SpecialtyStoryProductRef | string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover_image_url: string;
  images: string[];
  tags: string[];
  status: "draft" | "published" | "archived";
  published_at: string | null;
  distanceKm?: number;
  specialty: SpecialtyStorySpecialty;
  shop: SpecialtyStoryShop;
}

export interface GetNearbySpecialtyStoriesResponse {
  statusCode: number;
  error: string | null;
  message: string;
  metadata: {
    stories: NearbySpecialtyStory[];
    total: number;
    radiusKm: number;
  } | null;
}
