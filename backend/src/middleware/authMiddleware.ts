import type { RequestHandler } from "express";

import { findUserById } from "../models/userModel";

// Require Authentication Middleware
export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    // Check Login Session
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // Find Current User
    const user = await findUserById(userId);

    // Check User Status
    if (!user || !user.is_active) {
      req.session.destroy(() => {});

      res.status(401).json({
        success: false,
        message: "User not found or inactive",
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
