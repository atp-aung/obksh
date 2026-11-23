import type { RequestHandler } from "express";

import {
  getAllUsers,
  getUserById,
  changeUserRole,
  changeUserStatus,
} from "../services/userService";

// Get All Users Controller
export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Get User By ID Controller
export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    const user = await getUserById(userId);

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Change User Role Controller
export const updateUserRole: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const { role } = req.body;

    const currentAdminId = req.session.userId;

    if (!currentAdminId) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    await changeUserRole(userId, role, currentAdminId);

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Change User Status Controller
export const updateUserStatus: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const { isActive } = req.body;

    const currentAdminId = req.session.userId;

    if (!currentAdminId) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    await changeUserStatus(userId, isActive, currentAdminId);

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
