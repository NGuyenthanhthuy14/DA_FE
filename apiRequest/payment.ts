import { post } from "./indext";

export interface CreateZaloPayPaymentPayload {
  orderId: string;
  bankCode?: string;
  redirectUrl: string;
}

export interface CreateZaloPayPaymentResponse {
  err: number;
  mess: string;
  data?: {
    order_url?: string;
    orderUrl?: string;
    [key: string]: unknown;
  };
  metadata?: {
    order_url?: string;
    orderUrl?: string;
    [key: string]: unknown;
  };
}

export const createZaloPayPayment = async (
  payload: CreateZaloPayPaymentPayload,
): Promise<CreateZaloPayPaymentResponse> => {
  return await post("/payments/zalopay/create", {
    bankCode: "",
    ...payload,
  });
};

export const continueZaloPayPayment = async (
  orderId: string,
  payload?: Pick<CreateZaloPayPaymentPayload, "bankCode" | "redirectUrl">,
): Promise<CreateZaloPayPaymentResponse> => {
  return await post(`/payments/zalopay/continue/${orderId}`, {
    bankCode: "",
    ...payload,
  });
};
