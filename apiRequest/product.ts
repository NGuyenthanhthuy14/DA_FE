import { Product, ProductsResponse, NearbyProductsResponse } from "@/app/types/api/product";
import { ProductTypesResponse } from "@/app/types/api/productType";
import { get } from "./indext";

type ProductDetailResponse = {
  err: number;
  mess: string;
  data: Product | null;
  metadata?: Product | null;
};

export const getAllProduct = async (): Promise<ProductsResponse> => {
  return await get("/product/get-all");
}; 

export const getNearbyProducts = async (
  lat: number,
  lng: number,
  maxKm: number = 20,
  limit: number = 20
): Promise<NearbyProductsResponse> => {
  return await get(`/product/nearby?lat=${lat}&lng=${lng}&maxKm=${maxKm}&limit=${limit}`);
};

export const getAllProductTypes = async (): Promise<ProductTypesResponse> => {
  return await get("/product/get-all-type");
};

export const getAllProductByFilter = async (
  filterKey: string,
  filterValue: string,
  limit: number = 20,
  page: number = 1
): Promise<ProductsResponse> => {
  return await get(
    `/product/get-all?limit=${limit}&page=${page}&filter=${filterKey}&filter=${filterValue}`
  );
};

export const getProductById = async (id: string): Promise<ProductDetailResponse> => {
  const res = await get<ProductDetailResponse>(`/product/get-detail/${id}`);
  return {
    ...res,
    data: res.data ?? res.metadata ?? null,
  };
};
