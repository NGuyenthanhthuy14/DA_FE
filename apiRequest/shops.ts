import {
	FavoriteShopMutationResponse,
	FavoriteShopsResponse,
	ShopsResponse,
} from "@/app/types/api/shops";
import { ShopDetailResponse } from "@/app/types/api/shopDetail";
import { del, get, post } from "./indext";

export const getShops = async () : Promise<ShopsResponse> => {
	return await get("/shops");
}

export const getShopBySlug = async (slug: string): Promise<ShopDetailResponse> => {
	return await get(`/shops/${slug}`);
}

export const getFavoriteShops = async (): Promise<FavoriteShopsResponse> => {
	return await get("/user/favorite-shops");
}

export const addFavoriteShop = async (
	shopId: string,
): Promise<FavoriteShopMutationResponse> => {
	return await post(`/user/favorite-shops/${shopId}`);
}

export const removeFavoriteShop = async (
	shopId: string,
): Promise<FavoriteShopMutationResponse> => {
	return await del(`/user/favorite-shops/${shopId}`);
}

