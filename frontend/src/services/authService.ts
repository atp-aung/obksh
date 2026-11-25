import { apiRequest } from "./api";

export interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
  is_active: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// Register
export async function register(input: RegisterInput): Promise<User> {
  const response = await apiRequest<ApiResponse<User>>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return response.data;
}

// Login
export async function login(input: LoginInput): Promise<User> {
  const response = await apiRequest<ApiResponse<User>>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return response.data;
}

// Logout
export async function logout(): Promise<void> {
  await apiRequest<ApiResponse<null>>("/auth/logout", {
    method: "POST",
  });
}

// Get Current User
// Get Current User
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await apiRequest<ApiResponse<User>>("/auth/me");

    return response.data;
  } catch {
    return null;
  }
}
