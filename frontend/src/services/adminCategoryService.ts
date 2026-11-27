import { apiRequest } from "./api";

export interface AdminCategory {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface CategoryInput {
  name: string;
  description: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const response =
    await apiRequest<ApiResponse<AdminCategory[]>>("/categories/admin");

  return response.data;
}

export async function createAdminCategory(input: CategoryInput): Promise<void> {
  await apiRequest<ApiResponse<{ id: number }>>("/categories", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateAdminCategory(
  id: number,
  input: CategoryInput,
): Promise<void> {
  await apiRequest<ApiResponse<null>>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deactivateAdminCategory(id: number): Promise<void> {
  await apiRequest<ApiResponse<null>>(`/categories/${id}`, {
    method: "DELETE",
  });
}
