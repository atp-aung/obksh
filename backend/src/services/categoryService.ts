import {
  findAllCategories,
  findAllCategoriesForAdmin,
  findCategoryById,
  createCategory as createCategoryModel,
  updateCategory as updateCategoryModel,
  deactivateCategory as deactivateCategoryModel,
} from "../models/categoryModel";
import { handleDatabaseError } from "../utils/databaseError";

import type { Category } from "../models/categoryModel";

// Get All Active Categories
export async function getAllCategories(): Promise<Category[]> {
  return findAllCategories();
}

// Get All Categories For Admin
export async function getAllCategoriesForAdmin(): Promise<Category[]> {
  return findAllCategoriesForAdmin();
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

  try {
    return await createCategoryModel({
      name,
      description,
    });
  } catch (error) {
    handleDatabaseError(error);
  }
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

  const name = input.name.trim();
  const description = input.description?.trim() || null;

  if (!name) {
    throw new Error("Category name is required");
  }

  if (name.length > 100) {
    throw new Error("Category name must not exceed 100 characters");
  }

  const existingCategory = await findCategoryById(id);

  if (!existingCategory) {
    throw new Error("Category not found");
  }

  try {
    return await updateCategoryModel(id, {
      name,
      description,
    });
  } catch (error) {
    handleDatabaseError(error);
  }
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

  try {
    return await deactivateCategoryModel(id);
  } catch (error) {
    handleDatabaseError(error);
  }
}
