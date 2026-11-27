import {
  findAllBooks,
  findAllBooksForAdmin,
  findBookById,
  searchBooks,
  createBook as createBookModel,
  updateBook as updateBookModel,
  deactivateBook as deactivateBookModel,
} from "../models/bookModel";
import { handleDatabaseError } from "../utils/databaseError";
import { findCategoryById } from "../models/categoryModel";

import type { BookWithCategory, CreateBookInput } from "../models/bookModel";

// Validate Book Input
async function validateBookInput(
  input: CreateBookInput,
): Promise<CreateBookInput> {
  const title = input.title.trim();
  const author = input.author.trim();

  if (!title || !author) {
    throw new Error("Book title and author are required");
  }

  if (title.length > 255) {
    throw new Error("Book title must not exceed 255 characters");
  }

  if (author.length > 150) {
    throw new Error("Author name must not exceed 150 characters");
  }

  if (!Number.isFinite(input.price) || input.price < 0) {
    throw new Error("Invalid book price");
  }

  if (!Number.isInteger(input.stock) || input.stock < 0) {
    throw new Error("Stock must be a non-negative integer");
  }

  if (!Number.isInteger(input.category_id) || input.category_id <= 0) {
    throw new Error("Invalid category ID");
  }

  const category = await findCategoryById(input.category_id);

  if (!category || !category.is_active) {
    throw new Error("Category not found or inactive");
  }

  const isbn = input.isbn?.trim() || null;

  if (isbn && isbn.length > 20) {
    throw new Error("ISBN must not exceed 20 characters");
  }

  const imageUrl = input.image_url?.trim() || null;

  if (imageUrl && imageUrl.length > 500) {
    throw new Error("Image URL must not exceed 500 characters");
  }

  return {
    ...input,
    title,
    author,
    isbn,
    description: input.description?.trim() || null,
    image_url: imageUrl,
  };
}

// Get All Active Books
export async function getAllBooks(): Promise<BookWithCategory[]> {
  return findAllBooks();
}

export async function getAllBooksForAdmin(): Promise<BookWithCategory[]> {
  return findAllBooksForAdmin();
}

// Get Book By ID
export async function getBookById(id: number): Promise<BookWithCategory> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid book ID");
  }

  const book = await findBookById(id);

  if (!book || !book.is_active) {
    throw new Error("Book not found");
  }

  return book;
}

// Search Books
export async function searchBooksByKeyword(
  keyword: string,
): Promise<BookWithCategory[]> {
  const trimmedKeyword = keyword.trim();

  if (!trimmedKeyword) {
    return [];
  }

  return searchBooks(trimmedKeyword);
}

// Create Book

export async function createBook(input: CreateBookInput): Promise<number> {
  const validatedInput = await validateBookInput(input);

  try {
    return await createBookModel(validatedInput);
  } catch (error) {
    handleDatabaseError(error);
  }
}

// Update Book
export async function updateBook(
  id: number,
  input: CreateBookInput,
): Promise<boolean> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid book ID");
  }

  const existingBook = await findBookById(id);

  if (!existingBook || !existingBook.is_active) {
    throw new Error("Book not found");
  }

  const validatedInput = await validateBookInput(input);

  try {
    return await updateBookModel(id, validatedInput);
  } catch (error) {
    handleDatabaseError(error);
  }
}

// Deactivate Book
export async function deactivateBook(id: number): Promise<boolean> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid book ID");
  }

  const existingBook = await findBookById(id);

  if (!existingBook || !existingBook.is_active) {
    throw new Error("Book not found");
  }

  try {
    return await deactivateBookModel(id);
  } catch (error) {
    handleDatabaseError(error);
  }
}
