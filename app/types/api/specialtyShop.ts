export interface Specialty {
  idSpecialties: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  approval_status?: "pending" | "approved" | "rejected";
  status?: "active" | "inactive";
  rejected_reason?: string;
  created_by?: string | null;
  created_by_role?: "vendor" | "admin" | null;
  shop_id?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at?: string;
  updated_at?: string;
  is_featured?: boolean;
  distanceKm?: number;
}

export interface Shop {
  idShop: string;

  name: string;
  slug: string;

  phone: string;
  cover_image: string;

  latitude: number;
  longitude: number;

  address: string;
  formatted_address: string;

  status: "active" | "inactive";

  specialties: Specialty[];
}

export interface GetShopsWithSpecialtiesResponse {
  statusCode: number;
  error: string | null;
  message: string;
  metadata: Shop[];
}

export interface NearbySpecialtyShop {
  _id: string;
  name: string;
  slug: string;
  address: string;
  formatted_address: string;
  cover_image: string;
  latitude: number;
  longitude: number;
}

export interface NearbySpecialty {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  approval_status?: "pending" | "approved" | "rejected";
  status?: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
  distanceKm?: number;
  shop: NearbySpecialtyShop;
}

export interface GetNearbySpecialtiesResponse {
  statusCode: number;
  error: string | null;
  message: string;
  metadata: {
    specialties: NearbySpecialty[];
    total: number;
    radiusKm: number;
  };
}
