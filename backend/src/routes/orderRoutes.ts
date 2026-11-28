import { Router } from "express";

import {
  createCheckout,
  getMyOrders,
  getMyOrderDetails,
  getOrderByNumberController,
  getAllOrdersForAdminController,
  getAdminOrderDetailsController,
  editOrderStatus,
  editPaymentStatus,
} from "../controllers/orderController";

import { requireAuth } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/adminMiddleware";

const router = Router();

// Customer Routes
router.post("/checkout", requireAuth, createCheckout);
router.get("/", requireAuth, getMyOrders);
router.get("/:id", requireAuth, getMyOrderDetails);

/// Admin Only Routes
router.get("/admin", requireAdmin, getAllOrdersForAdminController);

router.get("/admin/:id", requireAdmin, getAdminOrderDetailsController);

router.get("/number/:orderNumber", requireAdmin, getOrderByNumberController);

router.patch("/:id/status", requireAdmin, editOrderStatus);

router.patch("/:id/payment-status", requireAdmin, editPaymentStatus);

export default router;
