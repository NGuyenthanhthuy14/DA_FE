import { useEffect, useState } from "react";
import type {
  GetNearbySpecialtyStoriesResponse,
  NearbySpecialtyStory,
} from "@/app/types/api/specialtyStory";

const nearbyStoriesRequests = new Map<string, Promise<GetNearbySpecialtyStoriesResponse>>();
const nearbyStoriesCache = new Map<string, GetNearbySpecialtyStoriesResponse>();

async function loadNearbySpecialtyStories(
  lat: number,
  lng: number,
  maxKm: number | undefined,
  limit: number,
): Promise<GetNearbySpecialtyStoriesResponse> {
  const key = `${lat},${lng},${maxKm ?? "default"},${limit}`;
  const cached = nearbyStoriesCache.get(key);
  if (cached) return cached;

  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    limit: String(limit),
  });

  if (maxKm !== undefined) {
    params.set("maxKm", String(maxKm));
  }

  if (!nearbyStoriesRequests.has(key)) {
    nearbyStoriesRequests.set(
      key,
      fetch(
        `/api/specialty-stories/nearby?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        },
      ).then(async (res) => {
        const payload = (await res.json()) as GetNearbySpecialtyStoriesResponse;
        const normalized: GetNearbySpecialtyStoriesResponse = {
          statusCode: res.status,
          error: payload?.error ?? (res.ok ? null : "Không thể tải câu chuyện đặc sản"),
          message:
            payload?.message ??
            (res.ok ? "Get nearby specialty stories successfully" : "Không thể tải câu chuyện đặc sản"),
          metadata: payload?.metadata ?? null,
        };

        nearbyStoriesCache.set(key, normalized);
        return normalized;
      }),
    );
  }

  return nearbyStoriesRequests.get(key) as Promise<GetNearbySpecialtyStoriesResponse>;
}

export const useNearbySpecialtyStories = (
  lat: number | null,
  lng: number | null,
  maxKm?: number,
  limit = 12,
) => {
  const [response, setResponse] = useState<GetNearbySpecialtyStoriesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lat === null || lng === null) {
      setResponse(null);
      setError(null);
      setLoading(false);
      return;
    }

    let active = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await loadNearbySpecialtyStories(lat, lng, maxKm, limit);
        if (!active) return;

        setResponse(data);
        setError(data.error);
      } catch (fetchError) {
        if (!active) return;
        console.error("Error fetching nearby specialty stories:", fetchError);
        setResponse(null);
        setError("Không thể tải câu chuyện đặc sản");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [lat, lng, maxKm, limit]);

  const stories: NearbySpecialtyStory[] = response?.metadata?.stories ?? [];

  return {
    response,
    stories,
    total: response?.metadata?.total ?? stories.length,
    radiusKm: response?.metadata?.radiusKm ?? maxKm ?? 0,
    loading,
    error,
  };
};
