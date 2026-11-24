import { apiRequest } from "./api";
import type { Book } from "../types/book";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Get All Books
export async function getBooks(): Promise<Book[]> {
  const response = await apiRequest<ApiResponse<Book[]>>("/books");

  return response.data;
}

// Get Book Details
export async function getBookById(bookId: number): Promise<Book> {
  const response = await apiRequest<ApiResponse<Book>>(`/books/${bookId}`);

  return response.data;
}

// Search Books
export async function searchBooks(keyword: string): Promise<Book[]> {
  const response = await apiRequest<ApiResponse<Book[]>>(
    `/books/search?keyword=${encodeURIComponent(keyword)}`,
  );

  return response.data;
}
