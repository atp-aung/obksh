export function renderHomePage(): string {
  return `
    <!-- Hero Section -->
    <section class="bg-light rounded-4 p-5 text-center mb-5">
      <h1 class="display-5 fw-bold">
        Welcome to Online Book Shop
      </h1>

      <p class="lead text-muted mt-3">
        Discover amazing books and start your reading journey.
      </p>

      <a href="/books" class="btn btn-success btn-lg mt-3">
        <i class="fa-solid fa-book-open me-2"></i>
        Explore Books
      </a>
    </section>

    <!-- Features Section -->
    <section class="mb-5">
      <h2 class="text-center fw-bold mb-4">
        Why Choose Us?
      </h2>

      <div class="row g-4">
        <div class="col-md-4">
          <div class="card border-0 shadow-sm h-100 text-center p-4">
            <i class="fa-solid fa-book fa-2x text-success mb-3"></i>
            <h5>Wide Collection</h5>
            <p class="text-muted mb-0">
              Explore books from different categories.
            </p>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card border-0 shadow-sm h-100 text-center p-4">
            <i class="fa-solid fa-tags fa-2x text-success mb-3"></i>
            <h5>Affordable Prices</h5>
            <p class="text-muted mb-0">
              Find your favorite books at great prices.
            </p>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card border-0 shadow-sm h-100 text-center p-4">
            <i class="fa-solid fa-truck-fast fa-2x text-success mb-3"></i>
            <h5>Easy Ordering</h5>
            <p class="text-muted mb-0">
              Order books conveniently from anywhere.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call To Action -->
    <section class="bg-success text-white rounded-4 p-5 text-center">
      <h2 class="fw-bold">Ready to Find Your Next Book?</h2>

      <p class="mt-3">
        Browse our collection and discover something new.
      </p>

      <a href="/books" class="btn btn-light text-success mt-2">
        Browse All Books
      </a>
    </section>
  `;
}
