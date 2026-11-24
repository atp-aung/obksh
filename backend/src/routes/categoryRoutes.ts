import { Router } from "express";

import {
  getCategories,
  getCategory,
  addCategory,
  editCategory,
  removeCategory,
} from "../controllers/categoryController";

import { requireAdmin } from "../middleware/adminMiddleware";

const router = Router();

// Public Routes
router.get("/", getCategories);
router.get("/:id", getCategory);

// Admin Only Routes
router.post("/", requireAdmin, addCategory);
router.put("/:id", requireAdmin, editCategory);
router.delete("/:id", requireAdmin, removeCategory);

export default router;
