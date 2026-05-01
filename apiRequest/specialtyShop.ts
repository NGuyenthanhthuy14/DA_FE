
import { GetShopsWithSpecialtiesResponse } from "@/app/types/api/specialtyShop";
import { post, get } from "./indext";

type Params = {
  lat: number;
  lng: number;
};

export const getShopsWithSpecialties = async (
  params?: { lat?: number; lng?: number }
): Promise<GetShopsWithSpecialtiesResponse> => {
  const query =
    params?.lat !== undefined && params?.lng !== undefined
      ? `?lat=${params.lat}&lng=${params.lng}`
      : "";

  return await get(`/shops/with-specialties${query}`);
};