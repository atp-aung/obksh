import type { ResultSetHeader, RowDataPacket } from "mysql2";

import pool from "../config/pool";

// SELECT Queries
export async function selectQuery<T extends RowDataPacket>(
  sql: string,
  params: any[] = [],
): Promise<T[]> {
  const [rows] = await pool.execute<T[]>(sql, params);

  return rows;
}

// INSERT, UPDATE, DELETE Queries
export async function executeQuery(
  sql: string,
  params: any[] = [],
): Promise<ResultSetHeader> {
  const [result] = await pool.execute<ResultSetHeader>(sql, params);

  return result;
}
