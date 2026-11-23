import bcrypt from "bcrypt";

import { findUserByEmail, createUser } from "../models/userModel";

import type { User, CreateUserInput } from "../models/userModel";

// Public User Type
export type PublicUser = Omit<User, "password_hash">;

// Register Input
export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

// Login Input
export interface LoginInput {
  email: string;
  password: string;
}

// Register User
export async function registerUser(input: RegisterInput): Promise<PublicUser> {
  const username = input.username.trim();
  const email = input.email.trim().toLowerCase();

  if (!username || !email || !input.password) {
    throw new Error("All fields are required");
  }

  if (username.length > 100) {
    throw new Error("Username must not exceed 100 characters");
  }

  if (email.length > 150) {
    throw new Error("Email must not exceed 150 characters");
  }

  if (input.password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const userInput: CreateUserInput = {
    username,
    email,
    password_hash: passwordHash,
  };

  await createUser(userInput);

  const createdUser = await findUserByEmail(email);

  if (!createdUser) {
    throw new Error("Failed to create user");
  }

  const { password_hash, ...publicUser } = createdUser;

  return publicUser;
}

// Authenticate User
export async function authenticateUser(
  input: LoginInput,
): Promise<PublicUser | null> {
  const email = input.email.trim().toLowerCase();

  if (!email || !input.password) {
    return null;
  }

  const user = await findUserByEmail(email);

  if (!user || !user.is_active) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.password_hash,
  );

  if (!passwordMatches) {
    return null;
  }

  const { password_hash, ...publicUser } = user;

  return publicUser;
}
