import type { Product } from "./product";
import type { Shop } from "./shops";

export interface SearchPagedResult<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPage: number;
  limit: number;
}

export interface SearchAllData {
  keyword: string;
  shops: SearchPagedResult<Shop>;
  products: SearchPagedResult<Product>;
}

export interface SearchAllResponse {
  err: number;
  mess: string;
  data: SearchAllData | null;
}

export interface SearchShopsData {
  keyword: string;
  shops: SearchPagedResult<Shop>;
}

export interface SearchShopsResponse {
  err: number;
  mess: string;
  data: SearchShopsData | null;
}

export interface SearchAllParams {
  keyword: string;
  shopLimit?: number;
  shopPage?: number;
  productLimit?: number;
  productPage?: number;
}

export interface SearchShopsParams {
  keyword: string;
  page?: number;
  limit?: number;
}
