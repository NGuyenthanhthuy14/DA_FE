import {
  CreateProductReviewRequest,
  ProductReviewResponse,
  ProductReviewsResponse,
} from "@/app/types/api/productReview";
import { get, post } from "./indext";

export const createProductReview = async (
  payload: CreateProductReviewRequest,
): Promise<ProductReviewResponse> => {
  return await post("/user/product-reviews", payload);
};

export const getMyProductReviews = async (): Promise<ProductReviewsResponse> => {
  return await get("/user/product-reviews");
};
