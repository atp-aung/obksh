import express from "express";
import cors from "cors";
import dotenv from "dotenv";
//import pool from "./config/pool";
import type { RowDataPacket } from "mysql2";
import { selectQuery } from "./utils/db";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

interface DatabaseHealthRow extends RowDataPacket {
  database_connected: number;
}

// Security
app.disable("x-powered-by");

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.get("/api/db-health", async (req, res) => {
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
    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
