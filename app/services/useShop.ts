import { useEffect, useState } from "react";
import { Shop, ShopsResponse } from "../types/api/shops";
import { getShopBySlug, getShops } from "@/apiRequest/shops";

let shopsRequest: Promise<ShopsResponse> | null = null;
let shopsCache: ShopsResponse | null = null;

const loadShops = async () => {
	if (shopsCache) return shopsCache;
	if (!shopsRequest) {
		shopsRequest = getShops().then((res) => {
			shopsCache = res;
			return res;
		});
	}

	return shopsRequest;
};

export const useShopAPI = (enabled = true) => {
	const [shop, setShop] = useState<ShopsResponse | null>(() =>
		enabled ? shopsCache : null,
	);		

	useEffect(() => {
		if (!enabled) return;

		if (shopsCache) {
			void Promise.resolve().then(() => setShop(shopsCache));
			return;
		}

		const getShop = async () => {	
			try {
				const res = await loadShops()
				setShop(res)
			}catch (error) {
				console.error("Error fetching shop data:", error);
			}
		}

		getShop();
	}, [enabled])

	return {
		shop,	
		};	
}

export const useShopDetail = (slug: string) => {
	const [shopDetail, setShopDetail] = useState<Shop | null>(null);

	useEffect(() => {
		const getShopDetail = async () => {
			try {
				const res = await getShopBySlug(slug);
				if (res.metadata) {
					setShopDetail(res.metadata);
				}
			} catch (error) {
				console.error("Error fetching shop detail:", error);
			}
		};

		getShopDetail();
	}, [slug]);

	return {
		shopDetail,
	};
}
