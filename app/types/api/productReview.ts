import type { Shop } from "./shops";

export interface ReviewProduct {
  _id: string;
  name: string;
  slug?: string;
  image_url?: string;
  price?: number;
  rating?: number;
}

export interface ReviewShop extends Pick<Shop, "_id" | "name" | "slug"> {
  address?: string;
  cover_image?: string;
}

export interface ReviewOrder {
  _id: string;
  status: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
}

export interface ProductReview {
  _id: string;
  product: ReviewProduct | string;
  shop: ReviewShop | string;
  order: ReviewOrder | string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductReviewRequest {
  orderId: string;
  productId: string;
  rating: number;
  comment: string;
}

export interface ProductReviewResponse {
  err: number;
  mess: string;
  data: ProductReview;
}

export interface ProductReviewsResponse {
  err: number;
  mess: string;
  data: ProductReview[];
  total: number;
}
