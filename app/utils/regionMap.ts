/**
 * Phân loại vùng miền Việt Nam.
 *
 * – getRegionFromProvince(province):  tỉnh → vùng miền
 * – getRegionFromAddress(address):    gọi Goong Geocode API → lấy tỉnh → vùng miền
 */

export type Region = "Miền Bắc" | "Miền Trung" | "Miền Nam" | "Tây Nguyên" | "Hải đảo";

// ─── Province → Region ──────────────────────────────────────────

const PROVINCE_REGION: Record<string, Region> = {};

function reg(region: Region, list: string[]) {
  for (const p of list) PROVINCE_REGION[p.toLowerCase()] = region;
}

reg("Miền Bắc", [
  "Hà Nội", "Hải Phòng", "Hải Dương", "Hưng Yên", "Thái Bình",
  "Nam Định", "Ninh Bình", "Hà Nam", "Bắc Ninh", "Bắc Giang",
  "Vĩnh Phúc", "Phú Thọ", "Thái Nguyên", "Bắc Kạn", "Cao Bằng",
  "Lạng Sơn", "Quảng Ninh", "Tuyên Quang", "Hà Giang", "Yên Bái",
  "Lào Cai", "Lai Châu", "Điện Biên", "Sơn La", "Hòa Bình",
]);

reg("Miền Trung", [
  "Thanh Hóa", "Nghệ An", "Hà Tĩnh", "Quảng Bình", "Quảng Trị",
  "Thừa Thiên Huế", "Huế", "Đà Nẵng", "Quảng Nam", "Quảng Ngãi",
  "Bình Định", "Phú Yên", "Khánh Hòa", "Ninh Thuận", "Bình Thuận",
]);

reg("Tây Nguyên", [
  "Kon Tum", "Gia Lai", "Đắk Lắk", "Đắk Nông", "Lâm Đồng",
]);

reg("Miền Nam", [
  "Hồ Chí Minh", "Bình Dương", "Bình Phước", "Đồng Nai", "Tây Ninh",
  "Bà Rịa - Vũng Tàu", "Long An", "Tiền Giang", "Bến Tre",
  "Trà Vinh", "Vĩnh Long", "Đồng Tháp", "An Giang", "Kiên Giang",
  "Cần Thơ", "Hậu Giang", "Sóc Trăng", "Bạc Liêu", "Cà Mau",
]);

reg("Hải đảo", [
  "Phú Quốc", "Côn Đảo", "Lý Sơn", "Cát Bà",
]);

/**
 * Map tên tỉnh → vùng miền.
 * Tự bỏ prefix "Tỉnh ", "Thành phố ", "TP. "
 */
export function getRegionFromProvince(province?: string): Region | null {
  if (!province) return null;
  const cleaned = province
    .replace(/^(Tỉnh|Thành phố|TP\.|TP)\s+/i, "")
    .trim()
    .toLowerCase();
  return PROVINCE_REGION[cleaned] ?? null;
}

/**
 * Fallback: tìm tên tỉnh trực tiếp trong chuỗi address.
 */
function matchProvinceInAddress(address: string): Region | null {
  const lower = address.toLowerCase();
  for (const [province, region] of Object.entries(PROVINCE_REGION)) {
    if (lower.includes(province)) return region;
  }
  return null;
}

/**
 * Gọi Goong Geocode API, lấy tỉnh (administrative_area_level_1),
 * rồi map sang vùng miền.
 * Nếu API không trả về tỉnh → fallback parse trực tiếp từ chuỗi address.
 */
export const getRegionFromAddress = async (address: string): Promise<Region | null> => {
  if (!address) return null;

  try {
    const res = await fetch(
      `https://rsapi.goong.io/geocode?address=${encodeURIComponent(address)}&api_key=${process.env.NEXT_PUBLIC_GOONG_API_KEY}`
    );
    const data = await res.json();

    const components = data.results?.[0]?.address_components;
    const province = components?.find(
      (c: { types?: string[] }) => c.types?.includes("administrative_area_level_1")
    )?.long_name;

    const region = getRegionFromProvince(province);
    if (region) return region;

    // Fallback: parse tên tỉnh trực tiếp từ chuỗi address
    return matchProvinceInAddress(address);
  } catch (err) {
    console.error("Goong geocode error:", err);
    // Fallback khi API lỗi
    return matchProvinceInAddress(address);
  }
};
