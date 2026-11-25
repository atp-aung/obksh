import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./style.css";

import { createMainLayout } from "./layouts/mainLayout";
import { createAdminLayout } from "./layouts/adminLayout";

import { renderHomePage } from "./pages/homePage";
import { renderBooksPage, setupBooksPage } from "./pages/booksPage";
import {
  renderBookDetailsPage,
  setupBookDetailsPage,
} from "./pages/bookDetailsPage";
import { renderLoginPage, setupLoginPage } from "./pages/loginPage";
import { renderRegisterPage, setupRegisterPage } from "./pages/registerPage";
import { renderCartPage, setupCartPage } from "./pages/cartPage";
import { renderCheckoutPage } from "./pages/checkoutPage";
import { renderOrdersPage } from "./pages/ordersPage";
import { renderOrderDetailsPage } from "./pages/orderDetailsPage";

import { renderAdminDashboardPage } from "./pages/adminDashboardPage";
import { renderAdminBooksPage } from "./pages/adminBooksPage";
import { renderAdminCategoriesPage } from "./pages/adminCategoriesPage";
import { renderAdminOrdersPage } from "./pages/adminOrdersPage";
import { renderAdminUsersPage } from "./pages/adminUsersPage";

import { initializeAuth, isLoggedIn, isAdmin } from "./utils/auth";

const app = document.querySelector<HTMLDivElement>("#app");

async function renderApp(): Promise<void> {
  if (!app) return;

  const currentUser = await initializeAuth();
  const path = window.location.pathname;

  // Protected Routes
  const isProtectedRoute =
    path === "/cart" ||
    path === "/checkout" ||
    path === "/orders" ||
    /^\/orders\/\d+$/.test(path) ||
    path.startsWith("/admin");

  if (isProtectedRoute && !isLoggedIn()) {
    window.location.replace("/login");
    return;
  }

  // Admin Routes
  if (path.startsWith("/admin") && !isAdmin()) {
    window.location.replace("/");
    return;
  }

  // Logged-in users should not return to Login/Register
  if ((path === "/login" || path === "/register") && currentUser) {
    window.location.replace(currentUser.role === "admin" ? "/admin" : "/");
    return;
  }

  let content: string;

  // Public Routes
  if (path === "/books") {
    content = renderBooksPage();
  } else if (/^\/books\/\d+$/.test(path)) {
    content = renderBookDetailsPage();
  } else if (path === "/login") {
    content = renderLoginPage();
  } else if (path === "/register") {
    content = renderRegisterPage();
  } else if (path === "/") {
    content = renderHomePage();
  }

  // User Routes
  else if (path === "/cart") {
    content = renderCartPage();
  } else if (path === "/checkout") {
    content = renderCheckoutPage();
  } else if (path === "/orders") {
    content = renderOrdersPage();
  } else if (/^\/orders\/\d+$/.test(path)) {
    const orderId = Number(path.split("/")[2]);
    content = renderOrderDetailsPage(orderId);
  }

  // Admin Routes
  else if (path === "/admin") {
    content = renderAdminDashboardPage();
  } else if (path === "/admin/books") {
    content = renderAdminBooksPage();
  } else if (path === "/admin/categories") {
    content = renderAdminCategoriesPage();
  } else if (path === "/admin/orders") {
    content = renderAdminOrdersPage();
  } else if (path === "/admin/users") {
    content = renderAdminUsersPage();
  } else {
    content = renderHomePage();
  }

  const contentElement = document.createElement("div");
  contentElement.innerHTML = content;

  if (path.startsWith("/admin")) {
    app.replaceChildren(createAdminLayout(contentElement));
  } else {
    app.replaceChildren(createMainLayout(contentElement));
  }

  // Page Setup
  if (path === "/books") {
    void setupBooksPage();
  }

  if (/^\/books\/\d+$/.test(path)) {
    const bookId = Number(path.split("/")[2]);
    void setupBookDetailsPage(bookId);
  }

  if (path === "/login") {
    setupLoginPage();
  }

  if (path === "/register") {
    setupRegisterPage();
  }

  if (path === "/cart") {
    void setupCartPage();
  }
}

void renderApp();
