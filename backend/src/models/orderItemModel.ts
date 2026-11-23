import { selectQuery, executeQuery } from "../utils/db";

import type { RowDataPacket } from "mysql2";
import type { PoolConnection } from "mysql2/promise";

// Order Item Interface
export interface OrderItem extends RowDataPacket {
  id: number;
  order_id: number;
  book_id: number | null;
  book_title: string;
  author: string;
  unit_price: string | number;
  quantity: number;
  created_at: Date;
}

// Create Order Item Input
export interface CreateOrderItemInput {
  order_id: number;
  book_id: number | null;
  book_title: string;
  author: string;
  unit_price: number;
  quantity: number;
}

// Find Order Items
export async function findOrderItems(
  orderId: number,
  connection?: PoolConnection,
): Promise<OrderItem[]> {
  return selectQuery<OrderItem>(
    `SELECT *
     FROM order_items
     WHERE order_id = ?
     ORDER BY id ASC`,
    [orderId],
    connection,
  );
}

// Create Order Item
export async function createOrderItem(
  input: CreateOrderItemInput,
  connection?: PoolConnection,
): Promise<number> {
  const result = await executeQuery(
    `INSERT INTO order_items (
      order_id,
      book_id,
      book_title,
      author,
      unit_price,
      quantity
    )
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      input.order_id,
      input.book_id,
      input.book_title,
      input.author,
      input.unit_price,
      input.quantity,
    ],
    connection,
  );

  return result.insertId;
}
