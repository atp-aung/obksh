import { apiRequest } from "./api";

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
  is_active: boolean;
  created_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Change User Role
export async function updateAdminUserRole(
  id: number,
  role: "admin" | "user",
): Promise<void> {
  await apiRequest<ApiResponse<null>>(`/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

// Change User Status
export async function updateAdminUserStatus(
  id: number,
  is_active: boolean,
): Promise<void> {
  await apiRequest<ApiResponse<null>>(`/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ is_active }),
  });
}

// Get All Users
export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await apiRequest<ApiResponse<AdminUser[]>>("/users");

  return response.data;
}
