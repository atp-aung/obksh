import type { RequestHandler } from "express";

import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deactivateCategory,
} from "../services/categoryService";

// Get All Categories Controller
export const getCategories: RequestHandler = async (req, res, next) => {
  try {
    const categories = await getAllCategories();

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// Get Category By ID Controller
export const getCategory: RequestHandler = async (req, res, next) => {
  try {
    const categoryId = Number(req.params.id);

    const category = await getCategoryById(categoryId);

    res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Create Category Controller
export const addCategory: RequestHandler = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const category = await createCategory({
      name,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Update Category Controller
export const editCategory: RequestHandler = async (req, res, next) => {
  try {
    const categoryId = Number(req.params.id);

    const { name, description } = req.body;

    const category = await updateCategory(categoryId, {
      name,
      description,
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Deactivate Category Controller
export const removeCategory: RequestHandler = async (req, res, next) => {
  try {
    const categoryId = Number(req.params.id);

    await deactivateCategory(categoryId);

    res.status(200).json({
      success: true,
      message: "Category deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
};
