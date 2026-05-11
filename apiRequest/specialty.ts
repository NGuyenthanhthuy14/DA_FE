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
  category_id: string;
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
  category_id: string;
  products: SpecialtyProduct[];
  totalProducts: number;
}

export interface SpecialtyDetailResponse {
  statusCode: number;
  error: string | null;
  message: string;
  metadata: SpecialtyDetail;
}

export const getSpecialtyBySlug = async (
  slug: string
): Promise<SpecialtyDetailResponse> => {
  return await get(`/specialties/${slug}`);
};
