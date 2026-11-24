import session from "express-session";
import MySQLStoreFactory from "express-mysql-session";
import "dotenv/config";

// Create MySQL Session Store
const MySQLStore = MySQLStoreFactory(session);

// MySQL Session Store Configuration
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "online_book_shop",

  // Remove Expired Sessions
  clearExpired: true,

  // Check Expired Sessions Every 15 Minutes
  checkExpirationInterval: 15 * 60 * 1000,

  // Session Expiration: 24 Hours
  expiration: 24 * 60 * 60 * 1000,
});

// Session Secret
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET is not configured");
}

// Session Middleware
const sessionMiddleware = session({
  name: "obksh.sid",
  secret: sessionSecret,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,

  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  },
});

// Export Session Middleware
export default sessionMiddleware;
