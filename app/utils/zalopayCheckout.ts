import type { CreateOrderPayload } from "@/apiRequest/order";

const PENDING_ZALOPAY_ORDER_KEY = "pendingZaloPayOrderId";
const PENDING_ZALOPAY_PREFIX = "pendingZaloPayOrder:";

export interface PendingZaloPayOrder {
  paymentOrderId: string;
  orderPayload: CreateOrderPayload;
}

export function createPaymentOrderId() {
  return `ORDER_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function savePendingZaloPayOrder(order: PendingZaloPayOrder) {
  sessionStorage.setItem(PENDING_ZALOPAY_ORDER_KEY, order.paymentOrderId);
  sessionStorage.setItem(
    `${PENDING_ZALOPAY_PREFIX}${order.paymentOrderId}`,
    JSON.stringify(order),
  );
}

export function getPendingZaloPayOrder(paymentOrderId?: string | null) {
  const orderId =
    paymentOrderId || sessionStorage.getItem(PENDING_ZALOPAY_ORDER_KEY);
  if (!orderId) return null;

  const raw = sessionStorage.getItem(`${PENDING_ZALOPAY_PREFIX}${orderId}`);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PendingZaloPayOrder;
  } catch {
    return null;
  }
}

export function clearPendingZaloPayOrder(paymentOrderId?: string | null) {
  const orderId =
    paymentOrderId || sessionStorage.getItem(PENDING_ZALOPAY_ORDER_KEY);
  if (orderId) {
    sessionStorage.removeItem(`${PENDING_ZALOPAY_PREFIX}${orderId}`);
  }
  sessionStorage.removeItem(PENDING_ZALOPAY_ORDER_KEY);
}
