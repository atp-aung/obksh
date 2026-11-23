import { selectQuery, executeQuery } from "../utils/db";
import type { RowDataPacket } from "mysql2";
import type { PoolConnection } from "mysql2/promise";

// Cart Interface
export interface Cart extends RowDataPacket {
  id: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

// Find Cart By User ID
export async function findCartByUserId(
  userId: number,
  connection?: PoolConnection,
  lockForUpdate: boolean = false,
): Promise<Cart | null> {
  if (lockForUpdate && !connection) {
    throw new Error("Transaction connection is required for row locking");
  }

  const lockClause = lockForUpdate ? " FOR UPDATE" : "";

  const carts = await selectQuery<Cart>(
    `SELECT *
     FROM carts
     WHERE user_id = ?
     LIMIT 1
     ${lockClause}`,
    [userId],
    connection,
  );

  return carts[0] ?? null;
}

// Create Cart
export async function createCart(
  userId: number,
  connection?: PoolConnection,
): Promise<number> {
  const result = await executeQuery(
    `INSERT INTO carts (user_id)
     VALUES (?)
     ON DUPLICATE KEY UPDATE
       id = LAST_INSERT_ID(id)`,
    [userId],
    connection,
  );

  return result.insertId;
}
