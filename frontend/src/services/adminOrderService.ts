import { apiRequest } from "./api";
import type {
  Order,
  OrderStatus,
  PaymentStatus,
  OrderDetails,
} from "./orderService";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Get All Orders For Admin
export async function getAdminOrders(): Promise<Order[]> {
  const response = await apiRequest<ApiResponse<Order[]>>("/orders/admin");
  return response.data;
}

// Get Order By Number
export async function getAdminOrderByNumber(
  orderNumber: string,
): Promise<Order> {
  const response = await apiRequest<ApiResponse<Order>>(
    `/orders/number/${encodeURIComponent(orderNumber)}`,
  );
  return response.data;
}

// Get Order Details For Admin
export async function getAdminOrderDetails(id: number): Promise<OrderDetails> {
  const response = await apiRequest<ApiResponse<OrderDetails>>(
    `/orders/admin/${id}`,
  );

  return response.data;
}

// Update Order Status
export async function updateAdminOrderStatus(
  id: number,
  status: OrderStatus,
): Promise<void> {
  await apiRequest<ApiResponse<null>>(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// Update Payment Status
export async function updateAdminPaymentStatus(
  id: number,
  status: PaymentStatus,
): Promise<void> {
  await apiRequest<ApiResponse<null>>(`/orders/${id}/payment-status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
