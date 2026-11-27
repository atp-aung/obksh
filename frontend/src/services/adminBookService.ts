import { apiRequest } from "./api";
import type { Book } from "../types/book";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type AdminBook = Book;

export interface CreateBookInput {
  category_id: number;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
}

export async function getAdminBooks(): Promise<AdminBook[]> {
  const response = await apiRequest<ApiResponse<AdminBook[]>>("/books/admin");

  return response.data;
}

export async function createAdminBook(input: CreateBookInput): Promise<void> {
  await apiRequest<ApiResponse<{ id: number }>>("/books", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateAdminBook(
  id: number,
  input: CreateBookInput,
): Promise<void> {
  await apiRequest<ApiResponse<null>>(`/books/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deactivateAdminBook(id: number): Promise<void> {
  await apiRequest<ApiResponse<null>>(`/books/${id}`, {
    method: "DELETE",
  });
}
