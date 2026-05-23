import {
  SearchAllParams,
  SearchAllResponse,
  SearchShopsParams,
  SearchShopsResponse,
} from "@/app/types/api/search";
import { get } from "./indext";

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  return query.toString();
};

export const searchAll = async ({
  keyword,
  shopLimit,
  shopPage,
  productLimit,
  productPage,
}: SearchAllParams): Promise<SearchAllResponse> => {
  return await get(
    `/search?${buildQuery({
      keyword,
      shopLimit,
      shopPage,
      productLimit,
      productPage,
    })}`,
  );
};

export const searchShops = async ({
  keyword,
  page,
  limit,
}: SearchShopsParams): Promise<SearchShopsResponse> => {
  return await get(`/search/shops?${buildQuery({ keyword, page, limit })}`);
};
