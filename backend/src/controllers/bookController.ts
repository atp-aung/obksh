import type { RequestHandler } from "express";

import {
  getAllBooks,
  getBookById,
  searchBooksByKeyword,
  createBook,
  updateBook,
  deactivateBook,
} from "../services/bookService";
import type { CreateBookInput } from "../models/bookModel";

// Get All Books Controller
export const getBooks: RequestHandler = async (req, res, next) => {
  try {
    const books = await getAllBooks();

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

// Get Book By ID Controller
export const getBook: RequestHandler = async (req, res, next) => {
  try {
    const bookId = Number(req.params.id);

    const book = await getBookById(bookId);

    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// Search Books Controller
export const searchBooks: RequestHandler = async (req, res, next) => {
  try {
    const keyword = String(req.query.keyword ?? "");

    const books = await searchBooksByKeyword(keyword);

    res.status(200).json({
      success: true,
      message: "Books search completed successfully",
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

// Create Book Controller
export const addBook: RequestHandler = async (req, res, next) => {
  try {
    const input: CreateBookInput = {
      category_id: req.body.category_id,
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      image_url: req.body.image_url,
    };

    const bookId = await createBook(input);

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: {
        id: bookId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update Book Controller
export const editBook: RequestHandler = async (req, res, next) => {
  try {
    const bookId = Number(req.params.id);

    const input: CreateBookInput = {
      category_id: req.body.category_id,
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      image_url: req.body.image_url,
    };

    await updateBook(bookId, input);

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Deactivate Book Controller
export const removeBook: RequestHandler = async (req, res, next) => {
  try {
    const bookId = Number(req.params.id);

    await deactivateBook(bookId);

    res.status(200).json({
      success: true,
      message: "Book deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
};
