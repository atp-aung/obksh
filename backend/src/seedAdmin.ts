import "dotenv/config";
import bcrypt from "bcrypt";
import type { RowDataPacket } from "mysql2";

import pool from "./config/pool";

interface ExistingUser extends RowDataPacket {
  id: number;
  role: "admin" | "user";
}

async function seedAdmin(): Promise<void> {
  const username = process.env.ADMIN_USERNAME;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !email || !password) {
    throw new Error("Admin environment variables are required");
  }

  if (password.length < 8) {
    throw new Error("Admin password must be at least 8 characters");
  }

  const [rows] = await pool.execute<ExistingUser[]>(
    "SELECT id, role FROM users WHERE email = ?",
    [email],
  );

  if (rows.length > 0) {
    if (rows[0].role === "admin") {
      console.log("Admin account already exists.");
      return;
    }

    throw new Error(
      "This email already belongs to a normal user. Please use another admin email.",
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await pool.execute(
    `INSERT INTO users
      (username, email, password_hash, role, is_active)
     VALUES (?, ?, ?, 'admin', TRUE)`,
    [username, email, passwordHash],
  );

  console.log("Admin account created successfully.");
}

seedAdmin()
  .catch((error) => {
    console.error("Admin seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
