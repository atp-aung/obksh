import { apiRequest } from "./api";

export interface CartItem {
  id: number;
  cart_id: number;
  book_id: number;
  quantity: number;
  title: string;
  author: string;
  price: number;
  stock: number;
  image_url: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Get User Cart
export async function getCart(): Promise<CartItem[]> {
  const response = await apiRequest<ApiResponse<CartItem[]>>("/cart");

  return response.data;
}

// Add Book To Cart
export async function addToCart(
  bookId: number,
  quantity: number = 1,
): Promise<void> {
  await apiRequest("/cart/items", {
    method: "POST",
    body: JSON.stringify({
      book_id: bookId,
      quantity,
    }),
  });
}

// Update Cart Quantity
export async function updateCartQuantity(
  cartItemId: number,
  quantity: number,
): Promise<void> {
  await apiRequest(`/cart/items/${cartItemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

// Remove Cart Item
export async function removeCartItem(cartItemId: number): Promise<void> {
  await apiRequest(`/cart/items/${cartItemId}`, { method: "DELETE" });
}

// Clear Cart
export async function clearCart(): Promise<void> {
  await apiRequest("/cart", { method: "DELETE" });
}
