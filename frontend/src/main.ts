import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./style.css";

import { createMainLayout } from "./layouts/mainLayout";

import { renderHomePage } from "./pages/homePage";
import { renderBooksPage, setupBooksSearch } from "./pages/booksPage";
import { renderBookDetailsPage } from "./pages/bookDetailsPage";
import { renderLoginPage } from "./pages/loginPage";
import { renderRegisterPage } from "./pages/registerPage";
import { renderCartPage } from "./pages/cartPage";
import { renderCheckoutPage } from "./pages/checkoutPage";
import { renderOrdersPage } from "./pages/ordersPage";
import { renderOrderDetailsPage } from "./pages/orderDetailsPage";
import { renderAdminDashboardPage } from "./pages/adminDashboardPage";
import { createAdminLayout } from "./layouts/adminLayout";
import { renderAdminBooksPage } from "./pages/adminBooksPage";
import { renderAdminCategoriesPage } from "./pages/adminCategoriesPage";
import { renderAdminOrdersPage } from "./pages/adminOrdersPage";
import { renderAdminUsersPage } from "./pages/adminUsersPage";

const app = document.querySelector<HTMLDivElement>("#app");

function renderApp(): void {
  if (!app) return;

  const path = window.location.pathname;

  let content: string;

  if (path === "/books") {
    content = renderBooksPage();
  } else if (/^\/books\/\d+$/.test(path)) {
    const bookId = Number(path.split("/")[2]);
    content = renderBookDetailsPage(bookId);
  } else if (path === "/login") {
    content = renderLoginPage();
  } else if (path === "/register") {
    content = renderRegisterPage();
  } else if (path === "/cart") {
    content = renderCartPage();
  } else if (path === "/checkout") {
    content = renderCheckoutPage();
  } else if (path === "/orders") {
    content = renderOrdersPage();
  } else if (/^\/orders\/\d+$/.test(path)) {
    const orderId = Number(path.split("/")[2]);
    content = renderOrderDetailsPage(orderId);
  } else if (path === "/admin") {
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

  if (path === "/books") {
    setupBooksSearch();
  }
}

renderApp();
