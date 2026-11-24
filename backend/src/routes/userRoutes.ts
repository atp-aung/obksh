import { Router } from "express";

import {
  getUsers,
  getUser,
  updateUserRole,
  updateUserStatus,
} from "../controllers/userController";

import { requireAdmin } from "../middleware/adminMiddleware";

const router = Router();

// All User Routes Require Admin
router.use(requireAdmin);

// Get All Users
router.get("/", getUsers);

// Get User By ID
router.get("/:id", getUser);

// Update User Role
router.patch("/:id/role", updateUserRole);

// Update User Status
router.patch("/:id/status", updateUserStatus);

export default router;
