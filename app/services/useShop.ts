import { useEffect, useState } from "react";
import { Shop, ShopsResponse } from "../types/api/shops";
import { getShops } from "@/apiRequest/shops";

export const useShopAPI = () => {
	const [shop, setShop] = useState<ShopsResponse | null>(null);		

	const getShop = async () => {	
		try {
			const res = await getShops()
			setShop(res)
		}catch (error) {
			console.error("Error fetching shop data:", error);
			return null;
		}
	}

	useEffect(() => {
		getShop();
	}, [])

	return {
		shop,	
		};	
}