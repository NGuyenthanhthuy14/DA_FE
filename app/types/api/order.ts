export interface CreateOrderRequest {
  userId: string;
  shippingAddress: ShippingAddress;
  shopOrders: ShopOrderRequest[];
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingTotal: number;
  totalPrice: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  detail: string;
}

export interface ShopOrderRequest {
  shop: string;
  shopName: string;
  items: OrderItem[];
  shippingMethod: ShippingMethod;
  shippingLabel: string;
  shippingPrice: number;
  productTotal: number;
  shopTotal: number;
  note?: string;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  itemTotal: number;
}

export type PaymentMethod = "cod" | "online" | "ewallet";

export type ShippingMethod = "standard" | "express";

export interface CreateOrderResponse {
  err: number;
  mess: string;
  data: Order;
}

export interface Order {
  _id: string;
  user: string;
  shippingAddress: ShippingAddress;
  shopOrders: ShopOrder[];
  paymentMethod: PaymentMethod;
  paymentProvider?: string;
  paymentStatus?: "pending" | "paid" | "failed" | "cancelled" | string;
  paymentTransactionId?: string;
  paymentOrderUrl?: string;
  paymentOrderToken?: string;
  paymentQrCode?: string;
  zaloPayTransId?: string;
  subtotal: number;
  shippingTotal: number;
  totalPrice: number;
  status: OrderStatus;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShopOrder {
  _id: string;
  shop: string;
  shopName: string;
  items: OrderItem[];
  shippingMethod: ShippingMethod;
  shippingLabel: string;
  shippingPrice: number;
  productTotal: number;
  shopTotal: number;
  note?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "delivered"
  | "cancelled";
