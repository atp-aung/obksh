export function renderAdminNavbar(): string {
  return `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid px-4">

        <a class="navbar-brand fw-bold" href="/admin">
          <i class="fa-solid fa-book-open me-2"></i>
          Book Shop Admin
        </a>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbar"
          aria-controls="adminNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="adminNavbar">
          <ul class="navbar-nav ms-auto align-items-lg-center">

            <li class="nav-item">
              <a class="nav-link" href="/admin">
                <i class="fa-solid fa-gauge me-1"></i>
                Dashboard
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="/admin/books">
                <i class="fa-solid fa-book me-1"></i>
                Books
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="/admin/categories">
                <i class="fa-solid fa-layer-group me-1"></i>
                Categories
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="/admin/orders">
                <i class="fa-solid fa-box me-1"></i>
                Orders
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="/admin/users">
                <i class="fa-solid fa-users me-1"></i>
                Users
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="/">
                <i class="fa-solid fa-store me-1"></i>
                View Shop
              </a>
            </li>

            <li class="nav-item">
              <button
                class="btn btn-outline-light btn-sm ms-lg-2"
                id="adminLogoutButton"
                type="button"
              >
                <i class="fa-solid fa-right-from-bracket me-1"></i>
                Logout
              </button>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  `;
}
