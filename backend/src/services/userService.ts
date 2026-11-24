import {
  findAllUsers,
  findUserById,
  updateUserRole,
  updateUserStatus,
} from "../models/userModel";
import { handleDatabaseError } from "../utils/databaseError";

import type { User, UserRole } from "../models/userModel";

import type { PublicUser } from "./authService";

// Get All Users

export async function getAllUsers(): Promise<PublicUser[]> {
  try {
    const users = await findAllUsers();

    return users.map(({ password_hash, ...user }) => user);
  } catch (error) {
    handleDatabaseError(error);
  }
}

// Get User By ID

export async function getUserById(id: number): Promise<PublicUser> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid user ID");
  }

  try {
    const user = await findUserById(id);

    if (!user) {
      throw new Error("User not found");
    }

    const { password_hash, ...publicUser } = user;

    return publicUser;
  } catch (error) {
    handleDatabaseError(error);
  }
}

// Change User Role

export async function changeUserRole(
  targetUserId: number,
  newRole: UserRole,
  currentAdminId: number,
): Promise<boolean> {
  if (!Number.isInteger(targetUserId) || targetUserId <= 0) {
    throw new Error("Invalid user ID");
  }

  if (!["admin", "user"].includes(newRole)) {
    throw new Error("Invalid user role");
  }

  if (targetUserId === currentAdminId) {
    throw new Error("You cannot change your own role");
  }

  try {
    const targetUser = await findUserById(targetUserId);

    if (!targetUser) {
      throw new Error("User not found");
    }

    return await updateUserRole(targetUserId, newRole);
  } catch (error) {
    handleDatabaseError(error);
  }
}

// Change User Account Status

export async function changeUserStatus(
  targetUserId: number,
  isActive: boolean,
  currentAdminId: number,
): Promise<boolean> {
  if (!Number.isInteger(targetUserId) || targetUserId <= 0) {
    throw new Error("Invalid user ID");
  }

  if (typeof isActive !== "boolean") {
    throw new Error("Invalid account status");
  }

  if (targetUserId === currentAdminId) {
    throw new Error("You cannot deactivate your own account");
  }

  try {
    const targetUser = await findUserById(targetUserId);

    if (!targetUser) {
      throw new Error("User not found");
    }

    return await updateUserStatus(targetUserId, isActive);
  } catch (error) {
    handleDatabaseError(error);
  }
}
