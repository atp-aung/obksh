import { selectQuery, executeQuery } from "../utils/db";

import type { RowDataPacket } from "mysql2";

// Category Interface
export interface Category extends RowDataPacket {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Create Category Input
export interface CreateCategoryInput {
  name: string;
  description?: string | null;
}

// Find All Active Categories
export async function findAllCategories(): Promise<Category[]> {
  return selectQuery<Category>(
    `SELECT *
     FROM categories
     WHERE is_active = TRUE
     ORDER BY name ASC`,
  );
}

// Find All Categories For Admin
export async function findAllCategoriesForAdmin(): Promise<Category[]> {
  return selectQuery<Category>(
    `SELECT *
     FROM categories
     ORDER BY name ASC`,
  );
}

// Find Category By ID
export async function findCategoryById(id: number): Promise<Category | null> {
  const categories = await selectQuery<Category>(
    "SELECT * FROM categories WHERE id = ? LIMIT 1",
    [id],
  );

  return categories[0] ?? null;
}

// Create Category
export async function createCategory(
  input: CreateCategoryInput,
): Promise<number> {
  const result = await executeQuery(
    `INSERT INTO categories (
      name,
      description
    ) VALUES (?, ?)`,
    [input.name, input.description ?? null],
  );

  return result.insertId;
}

// Update Category
export async function updateCategory(
  id: number,
  input: CreateCategoryInput,
): Promise<boolean> {
  const result = await executeQuery(
    `UPDATE categories
     SET name = ?, description = ?
     WHERE id = ?`,
    [input.name, input.description ?? null, id],
  );

  return result.affectedRows > 0;
}

// Deactivate Category
export async function deactivateCategory(id: number): Promise<boolean> {
  const result = await executeQuery(
    `UPDATE categories
     SET is_active = FALSE
     WHERE id = ?`,
    [id],
  );

  return result.affectedRows > 0;
}
