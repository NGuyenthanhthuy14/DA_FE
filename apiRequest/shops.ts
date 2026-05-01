import { ShopsResponse } from "@/app/types/api/shops";
import { ShopDetailResponse } from "@/app/types/api/shopDetail";
import { post, get } from "./indext";

export const getShops = async () : Promise<ShopsResponse> => {
	return await get("/shops");
}

export const getShopBySlug = async (slug: string): Promise<ShopDetailResponse> => {
	return await get(`/shops/${slug}`);
}

