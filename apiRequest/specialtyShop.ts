
import { GetShopsWithSpecialtiesResponse } from "@/app/types/api/specialtyShop";
import { get } from "./indext";

export const getShopsWithSpecialties = async (
  params?: { lat?: number; lng?: number }
): Promise<GetShopsWithSpecialtiesResponse> => {
  const query =
    params?.lat !== undefined && params?.lng !== undefined
      ? `?lat=${params.lat}&lng=${params.lng}`
      : "";

  return await get(`/shops/with-specialties${query}`);
};
