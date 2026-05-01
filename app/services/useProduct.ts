import { useEffect, useState } from "react";
import { ProductsResponse, NearbyProduct } from "../types/api/product";
import { getAllProduct, getNearbyProducts } from "@/apiRequest/product";

export const useProduct = () => {
	const [product, setProduct] = useState<ProductsResponse | null>(null);

	const getProduct = async () => {
		try {
			const res = await getAllProduct();
			setProduct(res);
		} catch (error) {
			console.error("Error fetching product data:", error);
			return null;
		}
	};

	useEffect(() => {
		getProduct();
	}, []);

	return {
		product,
	};
};

export const useNearbyProducts = (lat: number | null, lng: number | null) => {
	const [nearbyProducts, setNearbyProducts] = useState<NearbyProduct[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (lat === null || lng === null) return;

		const fetchNearby = async () => {
			setLoading(true);
			try {
				const res = await getNearbyProducts(lat, lng, 20, 20);
				if (res.err === 0) {
					setNearbyProducts(res.data);
				}
			} catch (error) {
				console.error("Error fetching nearby products:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchNearby();
	}, [lat, lng]);

	return {
		nearbyProducts,
		nearbyProductsLoading: loading,
	};
};