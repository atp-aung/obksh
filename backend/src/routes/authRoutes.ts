import { Router } from "express";

import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../controllers/authController";

const router = Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Logout
router.post("/logout", logout);

// Get Current User
router.get("/me", getCurrentUser);

export default router;
