import { post, get } from "./indext";

// ── Types ──

export interface OrderItemPayload {
  product: string;        // product ObjectId
  name: string;
  image: string;
  price: number;
  quantity: number;
  itemTotal: number;
}

export interface ShopOrderPayload {
  shop: string;           // shop ObjectId
  shopName: string;
  items: OrderItemPayload[];
  shippingMethod: string;
  shippingLabel: string;
  shippingPrice: number;
  productTotal: number;
  shopTotal: number;
  note: string;
}

export interface CreateOrderPayload {
  userId: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    province_id?: number;
    district: string;
    district_id?: number;
    ward: string;
    ward_code?: string;
    detail: string;
  };
  shopOrders: ShopOrderPayload[];
  paymentMethod: string;
  subtotal: number;
  shippingTotal: number;
  totalPrice: number;
}

export interface OrderResponse {
  err: number;
  mess: string;
  data?: any;
}

// ── API calls ──

export const createOrder = async (payload: CreateOrderPayload): Promise<OrderResponse> => {
  return await post("/order/create", payload);
};

export const getOrdersByUser = async (userId: string): Promise<OrderResponse> => {
  return await get(`/order/user/${userId}`);
};

export const getOrderDetail = async (orderId: string): Promise<OrderResponse> => {
  return await get(`/order/detail/${orderId}`);
};
