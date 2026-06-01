
import {
  GetNearbySpecialtiesResponse,
  GetShopsWithSpecialtiesResponse,
} from "@/app/types/api/specialtyShop";
import { get } from "./indext";

const SPECIALTIES_API_URL = "http://localhost:3003/api";

export const getShopsWithSpecialties = async (
  params?: { lat?: number; lng?: number }
): Promise<GetShopsWithSpecialtiesResponse> => {
  const query =
    params?.lat !== undefined && params?.lng !== undefined
      ? `?lat=${params.lat}&lng=${params.lng}`
      : "";

  return await get(`/shops/with-specialties${query}`);
};

export const getNearbySpecialties = async (params: {
  lat: number;
  lng: number;
}): Promise<GetNearbySpecialtiesResponse> => {
  return await get(
    `${SPECIALTIES_API_URL}/specialties/nearby?lat=${params.lat}&lng=${params.lng}`,
  );
};
