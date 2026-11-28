import type { Request, Response, NextFunction, RequestHandler } from "express";

import { registerUser, authenticateUser } from "../services/authService";
import { findUserById } from "../models/userModel";

// Register Controller
export const register: RequestHandler = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = await registerUser({
      username,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Login Controller
export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authenticateUser({
      email,
      password,
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    req.session.regenerate((error) => {
      if (error) {
        next(error);
        return;
      }

      req.session.userId = user.id;

      req.session.save((saveError) => {
        if (saveError) {
          next(saveError);
          return;
        }

        res.status(200).json({
          success: true,
          message: "Login successful",
          data: user,
        });
      });
    });
  } catch (error) {
    next(error);
  }
};

// Logout Controller
export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
      return;
    }

    res.clearCookie("obksh.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  });
};

// Get Current User Controller
export const getCurrentUser: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
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

    const { password_hash, ...publicUser } = user;

    res.status(200).json({
      success: true,
      message: "Current user retrieved successfully",
      data: publicUser,
    });
  } catch (error) {
    next(error);
  }
};
