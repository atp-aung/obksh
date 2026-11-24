import { Router } from "express";

import {
  getBooks,
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
router.get("/:id", getBook);

// Admin Only Routes
router.post("/", requireAdmin, addBook);
router.put("/:id", requireAdmin, editBook);
router.delete("/:id", requireAdmin, removeBook);

export default router;
