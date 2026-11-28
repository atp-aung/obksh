import { getAuthUser } from "../utils/auth";

// Create Navbar
export function createNavbar(): HTMLElement {
  const navbar = document.createElement("nav");

  navbar.className = "navbar navbar-expand-lg navbar-dark bg-dark";

  const user = getAuthUser();

  navbar.innerHTML = `
    <div class="container">
      <a class="navbar-brand fw-bold" href="/">
        <i class="fa-solid fa-book-open me-2"></i>
        Online Book Shop
      </a>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        class="collapse navbar-collapse"
        id="navbarContent"
      >
        <ul class="navbar-nav ms-auto align-items-lg-center">

          <li class="nav-item">
            <a class="nav-link" href="/">
              <i class="fa-solid fa-house me-1"></i>
              Home
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link" href="/books">
              <i class="fa-solid fa-book me-1"></i>
              Books
            </a>
          </li>

          ${
            user
              ? `
                <li class="nav-item">
                  <a class="nav-link" href="/cart">
                    <i class="fa-solid fa-cart-shopping me-1"></i>
                    Cart
                  </a>
                </li>

                <li class="nav-item">
                  <a class="nav-link" href="/orders">
                    <i class="fa-solid fa-box me-1"></i>
                    My Orders
                  </a>
                </li>

                <li class="nav-item">
                  <button
                    class="btn btn-outline-light ms-lg-2 mt-2 mt-lg-0"
                    id="logoutButton"
                    type="button"
                  >
                    <i class="fa-solid fa-right-from-bracket me-1"></i>
                    Logout
                  </button>
                </li>
              `
              : `
                <li class="nav-item">
                  <a class="nav-link" href="/login">
                    <i class="fa-solid fa-right-to-bracket me-1"></i>
                    Login
                  </a>
                </li>

                <li class="nav-item">
                  <a
                    class="btn btn-success ms-lg-2 mt-2 mt-lg-0"
                    href="/register"
                  >
                    Register
                  </a>
                </li>
              `
          }

        </ul>
      </div>
    </div>
  `;

  return navbar;
}
