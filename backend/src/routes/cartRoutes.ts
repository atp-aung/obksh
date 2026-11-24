import { Router } from "express";

import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController";

import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

// All Cart Routes Require Authentication
router.use(requireAuth);

// Get Current User Cart
router.get("/", getCart);

// Add Book To Cart
router.post("/items", addCartItem);

// Update Cart Item Quantity
router.patch("/items/:id", updateCartItem);

// Remove Cart Item
router.delete("/items/:id", removeCartItem);

// Clear Cart
router.delete("/", clearCart);

export default router;
