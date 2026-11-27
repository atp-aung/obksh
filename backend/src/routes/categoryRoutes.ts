import { Router } from "express";

import {
  getCategories,
  getAdminCategories,
  getCategory,
  addCategory,
  editCategory,
  removeCategory,
} from "../controllers/categoryController";

import { requireAdmin } from "../middleware/adminMiddleware";

const router = Router();

// Public Routes
router.get("/", getCategories);

// Admin Only Routes
router.get("/admin", requireAdmin, getAdminCategories);

router.get("/:id", getCategory);
router.post("/", requireAdmin, addCategory);
router.put("/:id", requireAdmin, editCategory);
router.delete("/:id", requireAdmin, removeCategory);

export default router;
