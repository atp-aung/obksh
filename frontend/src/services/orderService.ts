import { apiRequest } from "./api";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cash_on_delivery" | "bank_transfer";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface CheckoutInput {
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  payment_method: PaymentMethod;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  book_id: number | null;
  book_title: string;
  author: string;
  unit_price: number;
  quantity: number;
}

export interface CheckoutResult {
  order_id: number;
  order_number: string;
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  payment_method: PaymentMethod;
}

export interface OrderDetails {
  order: Order;
  items: OrderItem[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Checkout
export async function checkout(input: CheckoutInput): Promise<CheckoutResult> {
  const response = await apiRequest<ApiResponse<CheckoutResult>>(
    "/orders/checkout",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );

  return response.data;
}

// Get My Orders
export async function getMyOrders(): Promise<Order[]> {
  const response = await apiRequest<ApiResponse<Order[]>>("/orders");

  return response.data;
}

// Get My Order Details
export async function getMyOrderDetails(
  orderId: number,
): Promise<OrderDetails> {
  const response = await apiRequest<ApiResponse<OrderDetails>>(
    `/orders/${orderId}`,
  );

  return response.data;
}
