import { get } from "./indext";

export interface SpecialtyProduct {
  _id: string;
  name: string;
  slug: string;
  image_url: string;
  price: number;
  rating: number;
  description: string;
  discount: number;
  sold: number;
  countInStock: number;
  specialty_id?: string;
  shop: {
    _id: string;
    name: string;
    slug: string;
    address: string;
    formatted_address: string;
    latitude: number;
    longitude: number;
  };
}

export interface SpecialtyDetail {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  approval_status: "pending" | "approved" | "rejected";
  status: "active" | "inactive";
  rejected_reason?: string;
  created_by?: string | null;
  created_by_role?: "vendor" | "admin" | null;
  shop_id?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at?: string;
  updated_at?: string;
  products: SpecialtyProduct[];
  totalProducts: number;
}

export interface SpecialtyDetailResponse {
  statusCode: number;
  error: string | null;
  message: string;
  metadata: SpecialtyDetail;
}

export interface SpecialtyCatalogItem {
  _id: string;
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
}

export interface SpecialtyCatalogResponse {
  statusCode: number;
  error: string | null;
  message: string;
  metadata: SpecialtyCatalogItem[];
}

export const getAllSpecialties = async (): Promise<SpecialtyCatalogResponse> => {
  return await get("/specialties");
};

export const getSpecialtyBySlug = async (
  slug: string
): Promise<SpecialtyDetailResponse> => {
  return await get(`/specialties/${slug}`);
};
