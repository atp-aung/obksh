import { Router } from "express";

import {
  getBooks,
  getAdminBooks,
  getBook,
  searchBooks,
  addBook,
  editBook,
  removeBook,
} from "../controllers/bookController";

import { requireAdmin } from "../middleware/adminMiddleware";

const router = Router();

// Public Routes
router.get("/", getBooks);
router.get("/search", searchBooks);

// Admin Only Routes
router.get("/admin", requireAdmin, getAdminBooks);

router.get("/:id", getBook);
router.post("/", requireAdmin, addBook);
router.put("/:id", requireAdmin, editBook);
router.delete("/:id", requireAdmin, removeBook);

export default router;
