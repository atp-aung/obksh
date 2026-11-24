import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import type { RowDataPacket } from "mysql2";

import { selectQuery } from "./utils/db";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import bookRoutes from "./routes/bookRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";

import sessionMiddleware from "./config/session";
import errorMiddleware from "./middleware/errorMiddleware";
import notFoundMiddleware from "./middleware/notFoundMiddleware";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

interface DatabaseHealthRow extends RowDataPacket {
  database_connected: number;
}

// Disable X-Powered-By
app.disable("x-powered-by");

// CORS Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Middleware
app.use(sessionMiddleware);

// Prevent caching of application responses
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Online Book Shop API is running",
    data: {
      environment: process.env.NODE_ENV || "development",
    },
  });
});

// Database Health Check
app.get("/api/db-health", async (req, res, next) => {
  try {
    const rows = await selectQuery<DatabaseHealthRow>(
      "SELECT 1 AS database_connected",
    );

    res.status(200).json({
      success: true,
      message: "Database connection successful",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// 404 Not Found Middleware
app.use(notFoundMiddleware);

// Global Error Handling Middleware
app.use(errorMiddleware);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
