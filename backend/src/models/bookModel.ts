import { selectQuery, executeQuery } from "../utils/db";

import type { RowDataPacket } from "mysql2";
import type { PoolConnection } from "mysql2/promise";

// Book Interface
export interface Book extends RowDataPacket {
  id: number;
  category_id: number;
  title: string;
  author: string;
  isbn: string | null;
  description: string | null;
  price: string | number;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Book with Category Name
export interface BookWithCategory extends Book {
  category_name: string;
}

// Create Book Input
export interface CreateBookInput {
  category_id: number;
  title: string;
  author: string;
  isbn?: string | null;
  description?: string | null;
  price: number;
  stock: number;
  image_url?: string | null;
}

// Find All Active Books
export async function findAllBooks(): Promise<BookWithCategory[]> {
  return selectQuery<BookWithCategory>(
    `SELECT
      books.*,
      categories.name AS category_name
    FROM books
    INNER JOIN categories
      ON books.category_id = categories.id
    WHERE books.is_active = TRUE
      AND categories.is_active = TRUE
    ORDER BY books.created_at DESC`,
  );
}

// Find Book By ID
export async function findBookById(
  id: number,
): Promise<BookWithCategory | null> {
  const books = await selectQuery<BookWithCategory>(
    `SELECT
      books.*,
      categories.name AS category_name
    FROM books
    INNER JOIN categories
      ON books.category_id = categories.id
    WHERE books.id = ?
    LIMIT 1`,
    [id],
  );

  return books[0] ?? null;
}

// Search Books
export async function searchBooks(
  keyword: string,
): Promise<BookWithCategory[]> {
  const searchTerm = `%${keyword}%`;

  return selectQuery<BookWithCategory>(
    `SELECT
      books.*,
      categories.name AS category_name
    FROM books
    INNER JOIN categories
      ON books.category_id = categories.id
    WHERE books.is_active = TRUE
      AND categories.is_active = TRUE
      AND (
        books.title LIKE ?
        OR books.author LIKE ?
        OR books.isbn LIKE ?
      )
    ORDER BY books.created_at DESC`,
    [searchTerm, searchTerm, searchTerm],
  );
}

// Create Book
export async function createBook(input: CreateBookInput): Promise<number> {
  const result = await executeQuery(
    `INSERT INTO books (
      category_id,
      title,
      author,
      isbn,
      description,
      price,
      stock,
      image_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.category_id,
      input.title,
      input.author,
      input.isbn ?? null,
      input.description ?? null,
      input.price,
      input.stock,
      input.image_url ?? null,
    ],
  );

  return result.insertId;
}

// Update Book
export async function updateBook(
  id: number,
  input: CreateBookInput,
): Promise<boolean> {
  const result = await executeQuery(
    `UPDATE books
     SET
      category_id = ?,
      title = ?,
      author = ?,
      isbn = ?,
      description = ?,
      price = ?,
      stock = ?,
      image_url = ?
     WHERE id = ?`,
    [
      input.category_id,
      input.title,
      input.author,
      input.isbn ?? null,
      input.description ?? null,
      input.price,
      input.stock,
      input.image_url ?? null,
      id,
    ],
  );

  return result.affectedRows > 0;
}

// Deactivate Book
export async function deactivateBook(id: number): Promise<boolean> {
  const result = await executeQuery(
    `UPDATE books
     SET is_active = FALSE
     WHERE id = ?`,
    [id],
  );

  return result.affectedRows > 0;
}

export async function decreaseBookStock(
  bookId: number,
  quantity: number,
  connection: PoolConnection,
): Promise<boolean> {
  const result = await executeQuery(
    `UPDATE books
     SET stock = stock - ?
     WHERE id = ?
       AND is_active = TRUE
       AND stock >= ?`,
    [quantity, bookId, quantity],
    connection,
  );

  return result.affectedRows > 0;
}
