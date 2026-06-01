import { useEffect, useState } from "react";
import { Product, ProductsResponse, NearbyProduct } from "../types/api/product";
import { getAllProduct, getNearbyProducts, getProductById } from "@/apiRequest/product";

let productsRequest: Promise<ProductsResponse> | null = null;
let productsCache: ProductsResponse | null = null;
const nearbyProductsRequests = new Map<string, Promise<NearbyProduct[]>>();
const nearbyProductsCache = new Map<string, NearbyProduct[]>();

const loadProducts = async () => {
	if (productsCache) return productsCache;
	if (!productsRequest) {
		productsRequest = getAllProduct().then((res) => {
			productsCache = res;
			return res;
		});
	}

	return productsRequest;
};

const loadNearbyProducts = async (lat: number, lng: number) => {
	const key = `${lat},${lng}`;
	const cached = nearbyProductsCache.get(key);
	if (cached) return cached;

	if (!nearbyProductsRequests.has(key)) {
		nearbyProductsRequests.set(
			key,
			getNearbyProducts(lat, lng, 20, 20).then((res) => {
				const data = res.err === 0 ? res.data : [];
				nearbyProductsCache.set(key, data);
				return data;
			}),
		);
	}

	return nearbyProductsRequests.get(key) as Promise<NearbyProduct[]>;
};

export const useProduct = (enabled = true) => {
	const [product, setProduct] = useState<ProductsResponse | null>(() =>
		enabled ? productsCache : null,
	);

	useEffect(() => {
		if (!enabled) return;

		if (productsCache) {
			void Promise.resolve().then(() => setProduct(productsCache));
			return;
		}

		const getProduct = async () => {
			try {
				const res = await loadProducts();
				setProduct(res);
			} catch (error) {
				console.error("Error fetching product data:", error);
			}
		};

		getProduct();
	}, [enabled]);

	return {
		product,
	};
};

export const useNearbyProducts = (lat: number | null, lng: number | null) => {
	const [nearbyProducts, setNearbyProducts] = useState<NearbyProduct[]>([]);
	const [loading, setLoading] = useState(false);
	const [hasFetchedNearby, setHasFetchedNearby] = useState(false);

	useEffect(() => {
		if (lat === null || lng === null) {
			setNearbyProducts([]);
			setHasFetchedNearby(false);
			setLoading(false);
			return;
		}

		const fetchNearby = async () => {
			setLoading(true);
			try {
				const data = await loadNearbyProducts(lat, lng);
				setNearbyProducts(data);
				setHasFetchedNearby(true);
			} catch (error) {
				console.error("Error fetching nearby products:", error);
				setNearbyProducts([]);
				setHasFetchedNearby(true);
			} finally {
				setLoading(false);
			}
		};

		fetchNearby();
	}, [lat, lng]);

	return {
		nearbyProducts,
		nearbyProductsLoading: loading,
		hasFetchedNearby,
	};
};

export const useProductDetail = (id: string) => {
	const [productDetail, setProductDetail] = useState<Product | null>(null);
	const [loading, setLoading] = useState(Boolean(id));

	useEffect(() => {
		if (!id) return;

		const fetchDetail = async () => {
			setLoading(true);
			try {
				const res = await getProductById(id);
				if (res?.data) {
					setProductDetail(res.data);
				} else {
					setProductDetail(null);
				}
			} catch (error) {
				console.error("Error fetching product detail:", error);
				setProductDetail(null);
			} finally {
				setLoading(false);
			}
		};

		fetchDetail();
	}, [id]);

	return { productDetail, loading };
};
