import { getCurrentUser, type User } from "../services/authService";

let currentUser: User | null = null;
let authChecked = false;

export async function initializeAuth(): Promise<User | null> {
  if (authChecked) {
    return currentUser;
  }

  currentUser = await getCurrentUser();
  authChecked = true;

  return currentUser;
}

export function getAuthUser(): User | null {
  return currentUser;
}

export function isLoggedIn(): boolean {
  return currentUser !== null;
}

export function isAdmin(): boolean {
  return currentUser?.role === "admin";
}

export function clearAuth(): void {
  currentUser = null;
  authChecked = false;
}
