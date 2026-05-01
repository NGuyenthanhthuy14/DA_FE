type UnknownRecord = Record<string, unknown>;

export type HomeOverview = {
  areaName: string | null;
  chatbotSuggestions: string[];
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function extractAreaName(payload: unknown): string | null {
  if (!isRecord(payload)) return null;

  const candidates = [
    payload.areaName,
    payload.locationName,
    payload.regionName,
    payload.region,
    payload.district,
    payload.city,
  ];

  for (const candidate of candidates) {
    const text = asString(candidate);
    if (text) return text;
  }

  const nestedCandidates = [payload.data, payload.result, payload.meta];
  for (const nested of nestedCandidates) {
    const areaName = extractAreaName(nested);
    if (areaName) return areaName;
  }

  return null;
}

function extractSuggestionList(payload: unknown): string[] {
  if (!isRecord(payload)) return [];

  const candidates = [
    payload.chatbotSuggestions,
    payload.suggestions,
    payload.hints,
    payload.gptPrompts,
  ];

  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) continue;
    const list = candidate
      .map((item) => asString(item))
      .filter((item): item is string => Boolean(item));
    if (list.length > 0) return list;
  }

  return [];
}

export function buildChatbotSuggestions(
  areaName?: string | null,
): string[] {
  const area = areaName ?? "khu vực gần bạn";

  return [
    `Ở ${area} nên ăn món gì trước?`,
    `Quán nào ở ${area} đang mở cửa và dễ đi xe máy?`,
    `Đặc sản nào ở ${area} dễ ăn cho lần đầu thử?`,
    `Gợi ý lịch ăn tối tiết kiệm cho 2 người tại ${area}.`,
  ];
}

function createFallbackOverview(areaName: string | null = null): HomeOverview {
  return {
    areaName,
    chatbotSuggestions: buildChatbotSuggestions(areaName),
  };
}

export async function loadHomeOverview(
  lat: number,
  lng: number,
  signal?: AbortSignal,
): Promise<HomeOverview> {
  try {
    const query = `lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`;
    const res = await fetch(`/api/home/overview?${query}`, {
      method: "GET",
      cache: "no-store",
      signal,
    });

    if (!res.ok) return createFallbackOverview();

    const payload = (await res.json()) as unknown;
    if (!isRecord(payload)) return createFallbackOverview();

    const areaName = extractAreaName(payload);
    const chatbotSuggestions = extractSuggestionList(payload);

    return {
      areaName,
      chatbotSuggestions:
        chatbotSuggestions.length > 0
          ? chatbotSuggestions
          : buildChatbotSuggestions(areaName),
    };
  } catch {
    return createFallbackOverview();
  }
}
