import {
  findAllUsers,
  findUserById,
  updateUserRole,
  updateUserStatus,
} from "../models/userModel";

import type { User, UserRole } from "../models/userModel";

import type { PublicUser } from "./authService";

// Get All Users
export async function getAllUsers(): Promise<PublicUser[]> {
  const users = await findAllUsers();

  return users.map(({ password_hash, ...user }) => user);
}

// Get User By ID
export async function getUserById(id: number): Promise<PublicUser> {
  const user = await findUserById(id);

  if (!user) {
    throw new Error("User not found");
  }

  const { password_hash, ...publicUser } = user;

  return publicUser;
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

  const targetUser = await findUserById(targetUserId);

  if (!targetUser) {
    throw new Error("User not found");
  }

  return updateUserRole(targetUserId, newRole);
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

  const targetUser = await findUserById(targetUserId);

  if (!targetUser) {
    throw new Error("User not found");
  }

  return updateUserStatus(targetUserId, isActive);
}
