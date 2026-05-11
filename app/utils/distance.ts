/**
 * Format khoảng cách thành chuỗi dễ đọc.
 * - Dưới 1km → hiển thị mét (VD: "800m")
 * - Từ 1km trở lên → hiển thị km (VD: "2.5km")
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
}

/**
 * Tính khoảng cách giữa 2 tọa độ (Haversine) → trả về km.
 */
export function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Tính khoảng cách từ vị trí người dùng đến shop, trả về chuỗi format.
 */
export function getDistanceToShop(
  userLat: number | null,
  userLng: number | null,
  shopLat: number | undefined,
  shopLng: number | undefined
): string | undefined {
  if (
    userLat == null || userLng == null ||
    shopLat == null || shopLng == null ||
    !Number.isFinite(shopLat) || !Number.isFinite(shopLng)
  ) {
    return undefined;
  }
  const km = getDistanceKm(userLat, userLng, shopLat, shopLng);
  return formatDistance(km);
}

/**
 * Lấy khoảng cách của sản phẩm dựa trên shop_id và bản đồ khoảng cách.
 * Trả về chuỗi đã format hoặc undefined nếu không có dữ liệu.
 */
export function getProductDistance(
  shopId: string | undefined,
  shopDistanceMap: Map<string, number>,
  hasLocation: boolean
): string | undefined {
  if (!hasLocation || !shopId) return undefined;
  const dist = shopDistanceMap.get(shopId);
  if (dist === undefined) return undefined;
  return formatDistance(dist);
}
