import { get } from "./indext";

export interface GhnProvince {
  province_id: number;
  province_name: string;
}

export interface GhnDistrict {
  district_id: number;
  district_name: string;
}

export interface GhnWard {
  ward_code: string;
  ward_name: string;
}

type RawGhnProvince = Partial<GhnProvince> & {
  ProvinceID?: number;
  ProvinceName?: string;
};

type RawGhnDistrict = Partial<GhnDistrict> & {
  DistrictID?: number;
  DistrictName?: string;
};

type RawGhnWard = Partial<GhnWard> & {
  WardCode?: string | number;
  WardName?: string;
};

type GhnListResponse<T> =
  | T[]
  | {
      data?: T[];
      metadata?: T[];
      err?: number;
      mess?: string;
      message?: string;
    };

function extractGhnList<T>(payload: GhnListResponse<T>): T[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.metadata)) return payload.metadata;

  if (payload.err && payload.err !== 0) {
    throw new Error(payload.mess || payload.message || "Khong the tai du lieu GHN");
  }

  return [];
}

function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

function normalizeProvince(item: RawGhnProvince): GhnProvince | null {
  const provinceId = Number(item.province_id ?? item.ProvinceID);
  const provinceName = item.province_name ?? item.ProvinceName;

  if (!Number.isFinite(provinceId) || !provinceName) return null;

  return {
    province_id: provinceId,
    province_name: provinceName,
  };
}

function normalizeDistrict(item: RawGhnDistrict): GhnDistrict | null {
  const districtId = Number(item.district_id ?? item.DistrictID);
  const districtName = item.district_name ?? item.DistrictName;

  if (!Number.isFinite(districtId) || !districtName) return null;

  return {
    district_id: districtId,
    district_name: districtName,
  };
}

function normalizeWard(item: RawGhnWard): GhnWard | null {
  const wardCode = item.ward_code ?? item.WardCode;
  const wardName = item.ward_name ?? item.WardName;

  if (wardCode === undefined || wardCode === null || !wardName) return null;

  return {
    ward_code: String(wardCode),
    ward_name: wardName,
  };
}

export const getGhnProvinces = async (): Promise<GhnProvince[]> => {
  const payload = await get<GhnListResponse<RawGhnProvince>>("/ghn/provinces");
  return extractGhnList(payload).map(normalizeProvince).filter(isDefined);
};

export const getGhnDistricts = async (
  provinceId: number,
): Promise<GhnDistrict[]> => {
  const payload = await get<GhnListResponse<RawGhnDistrict>>(
    `/ghn/districts?province_id=${encodeURIComponent(provinceId)}`,
  );
  return extractGhnList(payload).map(normalizeDistrict).filter(isDefined);
};

export const getGhnWards = async (districtId: number): Promise<GhnWard[]> => {
  const payload = await get<GhnListResponse<RawGhnWard>>(
    `/ghn/wards?district_id=${encodeURIComponent(districtId)}`,
  );
  return extractGhnList(payload).map(normalizeWard).filter(isDefined);
};
