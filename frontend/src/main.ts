import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App element not found");
}

app.innerHTML = `
  <div class="container py-5">
    <div class="text-center">
      <i class="fa-solid fa-book-open book-icon mb-3"></i>

      <h1 class="fw-bold">
        Online Book Shop
      </h1>

      <p class="text-secondary">
        Welcome to our online bookstore.
      </p>

      <button class="btn btn-primary">
        <i class="fa-solid fa-book me-2"></i>
        Explore Books
      </button>
    </div>
  </div>
`;
