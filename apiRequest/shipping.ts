import { post } from "./indext";

export interface ShippingFeePayload {
  from_district_id: number;
  from_ward_code: string;
  to_district_id: number;
  to_ward_code: string;
}

export interface ShippingFeeResponse {
  err?: number;
  mess?: string;
  data?: number | Record<string, unknown>;
  metadata?: number | Record<string, unknown>;
  fee?: number;
  total?: number;
}

export const getShippingFee = async (
  payload: ShippingFeePayload,
): Promise<ShippingFeeResponse> => {
  return await post("/shipping/fee", payload);
};

export function extractShippingFee(response: ShippingFeeResponse): number | null {
  const source = response.data ?? response.metadata ?? response;

  if (typeof source === "number") return source;
  if (!source || typeof source !== "object") return null;
  const feeSource = source as Record<string, unknown>;

  const candidates = [
    feeSource.total,
    feeSource.fee,
    feeSource.service_fee,
    feeSource.total_fee,
    feeSource.shipping_fee,
    feeSource.amount,
  ];

  const fee = candidates.find((value) => typeof value === "number");
  return typeof fee === "number" ? fee : null;
}
