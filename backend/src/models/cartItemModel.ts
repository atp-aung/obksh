import { selectQuery, executeQuery } from "../utils/db";

import type { RowDataPacket } from "mysql2";
import type { PoolConnection } from "mysql2/promise";

// Cart Item Interface
export interface CartItem extends RowDataPacket {
  id: number;
  cart_id: number;
  book_id: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

// Cart Item with Book Details
export interface CartItemWithBook extends CartItem {
  title: string;
  author: string;
  price: string | number;
  stock: number;
  image_url: string | null;
  is_active: boolean;
}

// Find Cart Items
export async function findCartItems(
  cartId: number,
  connection?: PoolConnection,
  lockForUpdate: boolean = false,
): Promise<CartItemWithBook[]> {
  if (lockForUpdate && !connection) {
    throw new Error("Transaction connection is required for row locking");
  }

  const lockClause = lockForUpdate ? " FOR UPDATE" : "";

  return selectQuery<CartItemWithBook>(
    `SELECT
      cart_items.*,
      books.title,
      books.author,
      books.price,
      books.stock,
      books.image_url,
      books.is_active
    FROM cart_items
    INNER JOIN books
      ON cart_items.book_id = books.id
    WHERE cart_items.cart_id = ?
    ORDER BY cart_items.created_at DESC
    ${lockClause}`,
    [cartId],
    connection,
  );
}

// Add Book To Cart
export async function addBookToCart(
  cartId: number,
  bookId: number,
  quantity: number,
  connection?: PoolConnection,
): Promise<number> {
  const result = await executeQuery(
    `INSERT INTO cart_items (
      cart_id,
      book_id,
      quantity
    ) VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      quantity = quantity + VALUES(quantity)`,
    [cartId, bookId, quantity],
    connection,
  );

  return result.insertId;
}

// Update Cart Item Quantity
export async function updateCartItemQuantity(
  cartId: number,
  bookId: number,
  quantity: number,
  connection?: PoolConnection,
): Promise<boolean> {
  const result = await executeQuery(
    `UPDATE cart_items
     SET quantity = ?
     WHERE cart_id = ?
       AND book_id = ?`,
    [quantity, cartId, bookId],
    connection,
  );

  return result.affectedRows > 0;
}

// Remove Book From Cart
export async function removeBookFromCart(
  cartId: number,
  bookId: number,
  connection?: PoolConnection,
): Promise<boolean> {
  const result = await executeQuery(
    `DELETE FROM cart_items
     WHERE cart_id = ?
       AND book_id = ?`,
    [cartId, bookId],
    connection,
  );

  return result.affectedRows > 0;
}

// Clear Cart
export async function clearCart(
  cartId: number,
  connection?: PoolConnection,
): Promise<boolean> {
  await executeQuery(
    "DELETE FROM cart_items WHERE cart_id = ?",
    [cartId],
    connection,
  );

  return true;
}
