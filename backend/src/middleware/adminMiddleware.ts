import type { RequestHandler } from "express";

import { findUserById } from "../models/userModel";

// Require Admin Middleware
export const requireAdmin: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const user = await findUserById(userId);

    if (!user || !user.is_active) {
      req.session.destroy(() => {});

      res.status(401).json({
        success: false,
        message: "User not found or inactive",
      });
      return;
    }

    if (user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Admin access required",
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
