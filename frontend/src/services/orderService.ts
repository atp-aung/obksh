import { apiRequest } from "./api";

export interface CheckoutInput {
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  payment_method: "cash_on_delivery" | "bank_transfer";
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  status: string;
  payment_method: "cash_on_delivery" | "bank_transfer";
  payment_status: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  created_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Checkout
export async function checkout(input: CheckoutInput): Promise<Order> {
  const response = await apiRequest<ApiResponse<Order>>("/orders/checkout", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return response.data;
}

// Get My Orders
export async function getMyOrders(): Promise<Order[]> {
  const response = await apiRequest<ApiResponse<Order[]>>("/orders");

  return response.data;
}

// Get Order Details
export async function getMyOrderDetails(orderId: number): Promise<Order> {
  const response = await apiRequest<ApiResponse<Order>>(`/orders/${orderId}`);

  return response.data;
}
