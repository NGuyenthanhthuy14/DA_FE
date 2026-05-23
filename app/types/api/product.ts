export interface ProductReviewUser {
  _id: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
}

export interface ProductDetailReview {
  _id: string;
  user?: ProductReviewUser | string;
  product: string;
  order?: string;
  shop?: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at?: string;
}

export interface ProductRatingSummary {
  averageRating: number;
  total: number;
  stars: Record<"1" | "2" | "3" | "4" | "5", number>;
}

export interface Product {
  _id: string;
  id?: string;
  shop_id?: string;
  category_id?: string;
  specialty_id?: string;
  name: string;
  slug?: string;
  image?: string;
  image_url?: string;
  type?: string;
  price: number;
  countInStock?: number;
  rating?: number;
  description?: string;
  sold?: number;
  discount?: number;
  reviews?: ProductDetailReview[];
  reviewCount?: number;
  ratingSummary?: ProductRatingSummary;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  err: number;
  mess: string;
  data: Product[];
  totalProduts: number;
  currentPage: number;
  totalPage: number;
}

export interface NearbyProductShop {
  _id: string;
  name: string;
  slug: string;
  address: string;
  formatted_address: string;
  cover_image: string;
  latitude: number;
  longitude: number;
}

export interface NearbyProduct {
  _id: string;
  name: string;
  image: string;
  type: string;
  price: number;
  rating: number;
  description: string;
  discount: number;
  sold: number;
  distanceKm: number;
  shop: NearbyProductShop;
}

export interface NearbyProductsResponse {
  err: number;
  mess: string;
  data: NearbyProduct[];
  total: number;
}
