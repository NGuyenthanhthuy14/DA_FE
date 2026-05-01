import { useEffect, useState } from "react";
import { Shop, ShopsResponse } from "../types/api/shops";
import { getShopBySlug, getShops } from "@/apiRequest/shops";

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

export const useShopDetail = (slug: string) => {
	const [shopDetail, setShopDetail] = useState<Shop | null>(null);

	const getShopDetail = async () => {
		try {
			const res = await getShopBySlug(slug);
			if (res.metadata) {
				setShopDetail(res.metadata);
			}
		} catch (error) {
			console.error("Error fetching shop detail:", error);
			return null;
		}
	};

	useEffect(() => {
		getShopDetail();
	}, [slug]);

	return {
		shopDetail,
	};
}