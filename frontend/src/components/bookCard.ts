import type { Book } from "../types/book";

export function renderBookCard(book: Book): string {
  return `
    <div class="col-sm-6 col-lg-4 col-xl-3">
      <div class="card h-100 shadow-sm border-0">
        <img
          src="${book.image_url || "https://placehold.co/300x350?text=Book"}"
          class="card-img-top book-card-image"
          alt="${book.title}"
        >

        <div class="card-body d-flex flex-column">
          <small class="text-success mb-2">
            ${book.category_name || "General"}
          </small>

          <h5 class="card-title">${book.title}</h5>

          <p class="text-muted small mb-2">
            By ${book.author}
          </p>

          <h5 class="text-success mt-auto">
            ${Number(book.price).toLocaleString()} MMK
          </h5>

          <a
            href="/books/${book.id}"
            class="btn btn-outline-success mt-2"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  `;
}
