import { AppError } from "./AppError";

// MySQL Database Error Handler
export function handleDatabaseError(error: unknown): never {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = error.code;

    if (code === "ER_DUP_ENTRY") {
      throw new AppError("This record already exists", 409);
    }

    if (code === "ER_NO_REFERENCED_ROW_2") {
      throw new AppError("Referenced record does not exist", 400);
    }

    if (code === "ER_ROW_IS_REFERENCED_2") {
      throw new AppError("This record is being used by another record", 409);
    }
  }

  throw error;
}
