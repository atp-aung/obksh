import { selectQuery, executeQuery } from "../utils/db";

import type { RowDataPacket } from "mysql2";
import type { PoolConnection } from "mysql2/promise";

// Order Status
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

// Payment Method
export type PaymentMethod = "cash_on_delivery" | "bank_transfer";

// Payment Status
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

// Order Interface
export interface Order extends RowDataPacket {
  id: number;
  user_id: number;
  order_number: string;
  subtotal: string | number;
  shipping_fee: string | number;
  total_amount: string | number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  created_at: Date;
  updated_at: Date;
}

// Create Order Input
export interface CreateOrderInput {
  user_id: number;
  order_number: string;
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  payment_method: PaymentMethod;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
}

// Find Orders By User ID
export async function findOrdersByUserId(
  userId: number,
  connection?: PoolConnection,
): Promise<Order[]> {
  return selectQuery<Order>(
    `SELECT *
     FROM orders
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId],
    connection,
  );
}

// Find Order By ID
export async function findOrderById(
  id: number,
  connection?: PoolConnection,
): Promise<Order | null> {
  const orders = await selectQuery<Order>(
    `SELECT *
     FROM orders
     WHERE id = ?
     LIMIT 1`,
    [id],
    connection,
  );

  return orders[0] ?? null;
}

// Find Order By Order Number
export async function findOrderByNumber(
  orderNumber: string,
  connection?: PoolConnection,
): Promise<Order | null> {
  const orders = await selectQuery<Order>(
    `SELECT *
     FROM orders
     WHERE order_number = ?
     LIMIT 1`,
    [orderNumber],
    connection,
  );

  return orders[0] ?? null;
}

// Create Order
export async function createOrder(
  input: CreateOrderInput,
  connection?: PoolConnection,
): Promise<number> {
  const result = await executeQuery(
    `INSERT INTO orders (
      user_id,
      order_number,
      subtotal,
      shipping_fee,
      total_amount,
      payment_method,
      shipping_name,
      shipping_phone,
      shipping_address
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.user_id,
      input.order_number,
      input.subtotal,
      input.shipping_fee,
      input.total_amount,
      input.payment_method,
      input.shipping_name,
      input.shipping_phone,
      input.shipping_address,
    ],
    connection,
  );

  return result.insertId;
}

// Update Order Status
export async function updateOrderStatus(
  id: number,
  status: OrderStatus,
  connection?: PoolConnection,
): Promise<boolean> {
  const result = await executeQuery(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, id],
    connection,
  );

  return result.affectedRows > 0;
}

// Update Payment Status
export async function updatePaymentStatus(
  id: number,
  status: PaymentStatus,
  connection?: PoolConnection,
): Promise<boolean> {
  const result = await executeQuery(
    "UPDATE orders SET payment_status = ? WHERE id = ?",
    [status, id],
    connection,
  );

  return result.affectedRows > 0;
}
