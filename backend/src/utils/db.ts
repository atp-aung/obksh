import type { ResultSetHeader, RowDataPacket } from "mysql2";

import type { PoolConnection } from "mysql2/promise";

import pool from "../config/pool";

// SELECT Queries
export async function selectQuery<T extends RowDataPacket>(
  sql: string,
  params: any[] = [],
  connection?: PoolConnection,
): Promise<T[]> {
  const executor = connection ?? pool;

  const [rows] = await executor.execute<T[]>(sql, params);

  return rows;
}

// INSERT, UPDATE, DELETE Queries
export async function executeQuery(
  sql: string,
  params: any[] = [],
  connection?: PoolConnection,
): Promise<ResultSetHeader> {
  const executor = connection ?? pool;

  const [result] = await executor.execute<ResultSetHeader>(sql, params);

  return result;
}

// Database Transaction
export async function withTransaction<T>(
  callback: (connection: PoolConnection) => Promise<T>,
): Promise<T> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const result = await callback(connection);

    await connection.commit();

    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
