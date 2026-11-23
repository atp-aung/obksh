import {
  findAllCategories,
  findCategoryById,
  createCategory as createCategoryModel,
  updateCategory as updateCategoryModel,
  deactivateCategory as deactivateCategoryModel,
} from "../models/categoryModel";

import type { Category } from "../models/categoryModel";

// Get All Active Categories
export async function getAllCategories(): Promise<Category[]> {
  return findAllCategories();
}

// Get Category By ID
export async function getCategoryById(id: number): Promise<Category> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid category ID");
  }

  const category = await findCategoryById(id);

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
}

// Create Category
export async function createCategory(input: {
  name: string;
  description?: string | null;
}): Promise<number> {
  const name = input.name.trim();
  const description = input.description?.trim() || null;

  if (!name) {
    throw new Error("Category name is required");
  }

  if (name.length > 100) {
    throw new Error("Category name must not exceed 100 characters");
  }

  return createCategoryModel({
    name,
    description,
  });
}

// Update Category
export async function updateCategory(
  id: number,
  input: {
    name: string;
    description?: string | null;
  },
): Promise<boolean> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid category ID");
  }

  const existingCategory = await findCategoryById(id);

  if (!existingCategory) {
    throw new Error("Category not found");
  }

  const name = input.name.trim();
  const description = input.description?.trim() || null;

  if (!name) {
    throw new Error("Category name is required");
  }

  if (name.length > 100) {
    throw new Error("Category name must not exceed 100 characters");
  }

  return updateCategoryModel(id, {
    name,
    description,
  });
}

// Deactivate Category
export async function deactivateCategory(id: number): Promise<boolean> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid category ID");
  }

  const existingCategory = await findCategoryById(id);

  if (!existingCategory) {
    throw new Error("Category not found");
  }

  return deactivateCategoryModel(id);
}
