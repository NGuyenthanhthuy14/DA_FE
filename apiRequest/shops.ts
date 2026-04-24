import { ShopsResponse } from "@/app/types/api/shops";
import { post, get } from "./indext";

export const getShops = async () : Promise<ShopsResponse> => {
	return await get("/shops");
}