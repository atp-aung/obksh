import { findCartByUserId, createCart } from "../models/cartModel";

import {
  findCartItems,
  addBookToCart,
  updateCartItemQuantity,
  removeBookFromCart,
  clearCart,
} from "../models/cartItemModel";

import { findBookById } from "../models/bookModel";
import { withTransaction } from "../utils/db";
import { handleDatabaseError } from "../utils/databaseError";

import type { PoolConnection } from "mysql2/promise";

import type { CartItemWithBook } from "../models/cartItemModel";

async function getOrCreateCart(
  userId: number,
  connection?: PoolConnection,
  lockForUpdate: boolean = false,
) {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("Invalid user ID");
  }

  let cart = await findCartByUserId(userId, connection, lockForUpdate);

  if (!cart) {
    const cartId = await createCart(userId, connection);

    cart = await findCartByUserId(userId, connection, lockForUpdate);

    if (!cart || cart.id !== cartId) {
      throw new Error("Failed to create cart");
    }
  }

  return cart;
}

// Get User Cart
export async function getUserCart(userId: number): Promise<CartItemWithBook[]> {
  const cart = await getOrCreateCart(userId);

  return findCartItems(cart.id);
}

// Add Book To Cart

export async function addToCart(
  userId: number,
  bookId: number,
  quantity: number,
): Promise<number> {
  if (!Number.isInteger(bookId) || bookId <= 0) {
    throw new Error("Invalid book ID");
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be a positive integer");
  }

  try {
    return await withTransaction(async (connection) => {
      const cart = await getOrCreateCart(userId, connection, true);

      const book = await findBookById(bookId);

      if (!book || !book.is_active) {
        throw new Error("Book not found or unavailable");
      }

      const cartItems = await findCartItems(cart.id, connection);

      const existingItem = cartItems.find((item) => item.book_id === bookId);

      const totalQuantity = (existingItem?.quantity ?? 0) + quantity;

      if (totalQuantity > book.stock) {
        throw new Error("Requested quantity exceeds available stock");
      }

      return await addBookToCart(cart.id, bookId, quantity, connection);
    });
  } catch (error) {
    handleDatabaseError(error);
  }
}

// Update Cart Item Quantity

export async function updateCartQuantity(
  userId: number,
  cartItemId: number,
  quantity: number,
): Promise<boolean> {
  if (!Number.isInteger(cartItemId) || cartItemId <= 0) {
    throw new Error("Invalid cart item ID");
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be a positive integer");
  }

  try {
    return await withTransaction(async (connection) => {
      const cart = await getOrCreateCart(userId, connection, true);

      const cartItems = await findCartItems(cart.id, connection);

      const item = cartItems.find((cartItem) => cartItem.id === cartItemId);

      if (!item) {
        throw new Error("Cart item not found");
      }

      const book = await findBookById(item.book_id);

      if (!book || !book.is_active) {
        throw new Error("Book is unavailable");
      }

      if (quantity > book.stock) {
        throw new Error("Requested quantity exceeds available stock");
      }

      return await updateCartItemQuantity(
        cart.id,
        item.book_id,
        quantity,
        connection,
      );
    });
  } catch (error) {
    handleDatabaseError(error);
  }
}

// Remove Book From Cart

export async function removeFromCart(
  userId: number,
  cartItemId: number,
): Promise<boolean> {
  if (!Number.isInteger(cartItemId) || cartItemId <= 0) {
    throw new Error("Invalid cart item ID");
  }

  try {
    return await withTransaction(async (connection) => {
      const cart = await getOrCreateCart(userId, connection, true);

      const cartItems = await findCartItems(cart.id, connection);

      const item = cartItems.find((cartItem) => cartItem.id === cartItemId);

      if (!item) {
        throw new Error("Cart item not found");
      }

      return await removeBookFromCart(cart.id, item.book_id, connection);
    });
  } catch (error) {
    handleDatabaseError(error);
  }
}

// Clear User Cart

export async function clearUserCart(userId: number): Promise<boolean> {
  try {
    return await withTransaction(async (connection) => {
      const cart = await getOrCreateCart(userId, connection, true);

      return await clearCart(cart.id, connection);
    });
  } catch (error) {
    handleDatabaseError(error);
  }
}
