import { selectQuery, executeQuery } from "../utils/db";

import type { RowDataPacket } from "mysql2";

// User Role
export type UserRole = "admin" | "user";

// User Database Interface
export interface User extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Create User Input
export interface CreateUserInput {
  username: string;
  email: string;
  password_hash: string;
}

// Find User By Email
export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await selectQuery<User>(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email],
  );

  return users[0] ?? null;
}

// Find User By ID
export async function findUserById(id: number): Promise<User | null> {
  const users = await selectQuery<User>(
    "SELECT * FROM users WHERE id = ? LIMIT 1",
    [id],
  );

  return users[0] ?? null;
}

// Create User
export async function createUser(input: CreateUserInput): Promise<number> {
  const result = await executeQuery(
    `INSERT INTO users (
      username,
      email,
      password_hash
    ) VALUES (?, ?, ?)`,
    [input.username, input.email, input.password_hash],
  );

  return result.insertId;
}

// Update User Role
export async function updateUserRole(
  id: number,
  role: UserRole,
): Promise<boolean> {
  const result = await executeQuery("UPDATE users SET role = ? WHERE id = ?", [
    role,
    id,
  ]);

  return result.affectedRows > 0;
}

// Update User Active Status
export async function updateUserStatus(
  id: number,
  isActive: boolean,
): Promise<boolean> {
  const result = await executeQuery(
    "UPDATE users SET is_active = ? WHERE id = ?",
    [isActive, id],
  );

  return result.affectedRows > 0;
}

// Find All Users
export async function findAllUsers(): Promise<User[]> {
  return selectQuery<User>(
    `SELECT *
     FROM users
     ORDER BY created_at DESC`,
  );
}
