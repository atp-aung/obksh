import type { Book } from "../types/book";

// Temporary Sample Data
const sampleBooks: Book[] = [
  {
    id: 1,
    category_id: 1,
    category_name: "Programming",
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "9780132350884",
    description:
      "A handbook of agile software craftsmanship. This book teaches developers how to write clean, readable, and maintainable code.",
    price: 25000,
    stock: 10,
    is_active: true,
    image_url: "https://placehold.co/400x500?text=Clean+Code",
  },
  {
    id: 2,
    category_id: 1,
    category_name: "Programming",
    title: "The Pragmatic Programmer",
    author: "David Thomas",
    isbn: "9780135957059",
    description:
      "A practical guide to becoming a better software developer through proven programming practices.",
    price: 30000,
    stock: 8,
    is_active: true,
    image_url: "https://placehold.co/400x500?text=Pragmatic+Programmer",
  },
  {
    id: 3,
    category_id: 2,
    category_name: "Novel",
    title: "The Alchemist",
    author: "Paulo Coelho",
    isbn: "9780061122415",
    description:
      "A story about following your dreams and discovering your personal legend.",
    price: 18000,
    stock: 15,
    is_active: true,
    image_url: "https://placehold.co/400x500?text=The+Alchemist",
  },
  {
    id: 4,
    category_id: 3,
    category_name: "Business",
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    isbn: "9781612680194",
    description:
      "A personal finance book that explores different approaches to money and financial education.",
    price: 20000,
    stock: 12,
    is_active: true,
    image_url: "https://placehold.co/400x500?text=Rich+Dad+Poor+Dad",
  },
];

export function renderBookDetailsPage(bookId: number): string {
  const book = sampleBooks.find((item) => item.id === bookId);

  if (!book) {
    return `
      <div class="text-center py-5">
        <i class="fa-solid fa-book-open fa-3x text-muted mb-3"></i>
        <h3>Book Not Found</h3>
        <a href="/books" class="btn btn-success mt-3">
          Back to Books
        </a>
      </div>
    `;
  }

  return `
    <section class="row g-5">
      <div class="col-md-5 text-center">
        <img
          src="${book.image_url || "https://placehold.co/400x500?text=Book"}"
          alt="${book.title}"
          class="img-fluid rounded shadow-sm book-details-image"
        >
      </div>

      <div class="col-md-7">
        <small class="text-success fw-bold">
          ${book.category_name || "General"}
        </small>

        <h2 class="fw-bold mt-2">${book.title}</h2>

        <p class="text-muted">
          By ${book.author}
        </p>

        <h3 class="text-success fw-bold mt-4">
          ${Number(book.price).toLocaleString()} MMK
        </h3>

        <p class="mt-4">${book.description || "No description available."}</p>

        <p>
          <strong>ISBN:</strong>
          ${book.isbn || "N/A"}
        </p>

        <p>
          <strong>Stock:</strong>
          ${
            book.stock > 0
              ? `<span class="text-success">In Stock (${book.stock})</span>`
              : `<span class="text-danger">Out of Stock</span>`
          }
        </p>

        <button
          class="btn btn-success btn-lg mt-3"
          ${book.stock <= 0 ? "disabled" : ""}
        >
          <i class="fa-solid fa-cart-plus me-2"></i>
          Add to Cart
        </button>

        <div class="mt-4">
          <a href="/books" class="text-decoration-none text-success">
            <i class="fa-solid fa-arrow-left me-2"></i>
            Back to Books
          </a>
        </div>
      </div>
    </section>
  `;
}
