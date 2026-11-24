import type { RequestHandler } from "express";
import { AppError } from "../utils/AppError";

// 404 Not Found Middleware
const notFoundMiddleware: RequestHandler = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

export default notFoundMiddleware;
