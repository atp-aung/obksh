import type { ErrorRequestHandler } from "express";
import { AppError } from "../utils/AppError";

// Global Error Handler
const errorMiddleware: ErrorRequestHandler = (error, req, res, next) => {
  console.error("Error:", error);

  // Custom Application Error
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  // Unexpected Server Error
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export default errorMiddleware;
