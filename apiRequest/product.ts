import { Product, ProductsResponse, NearbyProductsResponse } from "@/app/types/api/product";
import { ProductTypesResponse } from "@/app/types/api/productType";
import { get } from "./indext";

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

export const getProductById = async (id: string): Promise<{ err: number; mess: string; data: Product | null }> => {
  const res = await getAllProduct();
  const found = res.data?.find((p) => p._id === id) ?? null;
  return { err: found ? 0 : 1, mess: found ? "ok" : "not found", data: found };
};
