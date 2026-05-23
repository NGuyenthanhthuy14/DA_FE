"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import StoreBanner from "./components/store-banner";
import StoreCard from "./components/store-card";
import StoreCardSkeleton from "./components/store-card-skeleton";
import { useShopAPI } from "@/app/services/useShop";
import {
    addFavoriteShop,
    getFavoriteShops,
    removeFavoriteShop,
} from "@/apiRequest/shops";
import { getShopsWithSpecialties } from "@/apiRequest/specialtyShop";
import { useUser } from "@/app/hook/useUser";
import Pagination from "../products/components/pagination";
import type { Specialty } from "@/app/types/api/specialtyShop";

const ITEMS_PER_PAGE = 6;

const TAG_POOL = [
    ["Phở", "Quán lâu năm"],
    ["Bún chả", "Nổi tiếng"],
    ["Bánh mì", "Giá rẻ"],
    ["Cơm tấm", "No căng bụng"],
    ["Bún đậu", "Đông khách"],
    ["Lẩu", "Ăn là ghiền"],
];

function getTags(index: number): string[] {
    return TAG_POOL[index % TAG_POOL.length];
}

function getRating(index: number): number {
    const ratings = [4.7, 4.6, 4.5, 4.4, 4.3, 4.2];
    return ratings[index % ratings.length];
}

function getReviewCount(index: number): number {
    const counts = [2100, 3200, 1500, 1100, 980, 870];
    return counts[index % counts.length];
}

/* ── Haversine distance (km) ── */
function haversineKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistanceKm(km: number): string {
    if (km < 1) return `${Math.round(km * 1000)}m`;
    return `${km.toFixed(1)}km`;
}

export default function StorePage() {
    const { shop } = useShopAPI();
    const { isAuthenticated } = useUser();
    const router = useRouter();
    const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
    const [favoritePendingIds, setFavoritePendingIds] = useState<Set<string>>(
        new Set(),
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [userLocation, setUserLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    const [specialtiesMap, setSpecialtiesMap] = useState<
        Record<string, Specialty[]>
    >({})

    const stores = shop?.metadata ?? [];
    const loading = !shop;

    useEffect(() => {
        if (!isAuthenticated) {
            setLikedIds(new Set());
            return;
        }

        let ignore = false;

        async function fetchFavoriteShops() {
            try {
                const res = await getFavoriteShops();
                if (!ignore && res.err === 0 && Array.isArray(res.data)) {
                    setLikedIds(new Set(res.data.map((item) => item._id)));
                }
            } catch (error) {
                console.error("Lỗi khi lấy shop yêu thích:", error);
            }
        }

        fetchFavoriteShops();

        return () => {
            ignore = true;
        };
    }, [isAuthenticated]);

    // Get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) =>
                    setUserLocation({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    }),
                () => setUserLocation({ lat: 21.0285, lng: 105.8542 }),
            );
        } else {
            setUserLocation({ lat: 21.0285, lng: 105.8542 });
        }
    }, []);

    // Lấy đặc sản cho từng shop
    useEffect(() => {
        async function fetchSpecialties() {
            try {
                const res = await getShopsWithSpecialties();
                if (res.metadata) {
                    const map: Record<string, Specialty[]> = {};
                    for (const s of res.metadata) {
                        const shopId = s.idShop || (s as any)._id || "";
                        const slug = s.slug || "";
                        if (s.specialties && s.specialties.length > 0) {
                            if (shopId) map[shopId] = s.specialties;
                            if (slug) map[slug] = s.specialties;
                        }
                    }
                    setSpecialtiesMap(map);
                }
            } catch (error) {
                console.error("Lỗi khi lấy đặc sản:", error);
            }
        }
        fetchSpecialties();
    }, []);

    const storesWithDistance = useMemo(() => {
        if (!userLocation)
            return stores.map((s) => ({ store: s, distanceKm: 0 }));

        const withDist = stores.map((store) => ({
            store,
            distanceKm: haversineKm(
                userLocation.lat,
                userLocation.lng,
                store.latitude,
                store.longitude,
            ),
        }));

        withDist.sort((a, b) => a.distanceKm - b.distanceKm);
        return withDist;
    }, [stores, userLocation]);

    const handleToggleLike = async (id: string) => {
        // Kiểm tra xác thực - nếu chưa đăng nhập, redirect đến trang login
        if (!isAuthenticated) {
            toast.error(
                "Vui lòng đăng nhập để thêm quán vào danh sách yêu thích",
            );
            router.push("/auth/login");
            return;
        }

        if (favoritePendingIds.has(id)) return;

        const wasLiked = likedIds.has(id);

        setLikedIds((prev) => {
            const next = new Set(prev);
            if (wasLiked) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
        setFavoritePendingIds((prev) => new Set(prev).add(id));

        try {
            const res = wasLiked
                ? await removeFavoriteShop(id)
                : await addFavoriteShop(id);

            if (res.err !== 0) {
                throw new Error(res.mess || "Không thể cập nhật shop yêu thích");
            }

            toast.success(
                wasLiked
                    ? "Đã bỏ shop khỏi danh sách yêu thích"
                    : "Đã thêm shop vào danh sách yêu thích",
            );
        } catch (error: unknown) {
            setLikedIds((prev) => {
                const next = new Set(prev);
                if (wasLiked) {
                    next.add(id);
                } else {
                    next.delete(id);
                }
                return next;
            });

            const message =
                error instanceof Error
                    ? error.message
                    : "Không thể cập nhật shop yêu thích";
            toast.error(message);
        } finally {
            setFavoritePendingIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    };

    // Tìm specialties cho 1 shop theo _id hoặc slug
    const getShopSpecialties = (shopId: string, slug: string): Specialty[] => {
        return specialtiesMap[shopId] || specialtiesMap[slug] || [];
    };

    // Paginate
    const totalPages = Math.max(
        1,
        Math.ceil(storesWithDistance.length / ITEMS_PER_PAGE),
    );
    const paginatedStores = useMemo(() => {
        return storesWithDistance.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE,
        );
    }, [storesWithDistance, currentPage]);

    return (
        <div className="min-h-screen bg-[#fdf8f3]">
            <StoreBanner />

            <main className="container pt-6 pb-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <StoreCardSkeleton key={i} />
                        ))}
                    </div>
                ) : storesWithDistance.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {paginatedStores.map(
                                ({ store, distanceKm }, index) => (
                                    <StoreCard
                                        key={store._id}
                                        id={store._id}
                                        slug={store.slug}
                                        name={store.name}
                                        image={store.cover_image || undefined}
                                        description={store.description}
                                        address={
                                            store.formatted_address ||
                                            store.address
                                        }
                                        rating={getRating(index)}
                                        reviewCount={getReviewCount(index)}
                                        distance={formatDistanceKm(distanceKm)}
                                        tags={getTags(index)}
                                        specialties={getShopSpecialties(
                                            store._id,
                                            store.slug,
                                        )}
                                        liked={likedIds.has(store._id)}
                                        likeDisabled={favoritePendingIds.has(
                                            store._id,
                                        )}
                                        onToggleLike={() =>
                                            handleToggleLike(store._id)
                                        }
                                    />
                                ),
                            )}
                        </div>

                        <Pagination
                            current={currentPage}
                            total={totalPages}
                            onChange={setCurrentPage}
                        />
                    </>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-5xl mb-4">😢</p>
                        <p className="text-[#8b7a6b] text-base">
                            Không tìm thấy quán ăn nào
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
