import { getBookById } from "../services/bookService";
import { addToCart } from "../services/cartService";
import type { Book } from "../types/book";

export function renderBookDetailsPage(): string {
  return `
    <section id="bookDetailsContainer">
      <div class="text-center py-5">
        <div class="spinner-border text-success"></div>
        <p class="text-muted mt-2">Loading book details...</p>
      </div>
    </section>
  `;
}

export async function setupBookDetailsPage(bookId: number): Promise<void> {
  const container = document.querySelector<HTMLDivElement>(
    "#bookDetailsContainer",
  );

  if (!container) return;

  try {
    const book: Book = await getBookById(bookId);

    container.innerHTML = `
      <div class="row g-5">
        <div class="col-md-5">
          <img
            src="${escapeHtml(book.image_url || "https://placehold.co/500x600?text=Book")}"
            alt="${escapeHtml(book.title)}"
            class="img-fluid rounded shadow-sm book-details-image"
          >
        </div>

        <div class="col-md-7">
          <small class="text-success fw-semibold">
            ${escapeHtml(book.category_name || "General")}
          </small>

          <h2 class="fw-bold mt-2">${escapeHtml(book.title)}</h2>

          <p class="text-muted">
            By ${escapeHtml(book.author)}
          </p>

          <h3 class="text-success fw-bold mt-4">
            ${Number(book.price).toLocaleString()} MMK
          </h3>

          <p class="mt-4">
            ${escapeHtml(book.description || "No description available.")}
          </p>

          <p>
            <strong>ISBN:</strong>
            ${escapeHtml(book.isbn || "Not available")}
          </p>

          <p>
            <strong>Stock:</strong>
            ${book.stock > 0 ? book.stock + " available" : "Out of stock"}
          </p>

          <div id="addCartMessage" class="mt-3"></div>

          <button
            class="btn btn-success btn-lg mt-3"
            type="button"
            id="addToCartButton"
            ${book.stock <= 0 || !book.is_active ? "disabled" : ""}
          >
            <i class="fa-solid fa-cart-plus me-2"></i>
            Add to Cart
          </button>

          <a
            href="/books"
            class="btn btn-outline-secondary btn-lg mt-3 ms-2"
          >
            Back to Books
          </a>
        </div>
      </div>
    `;

    // Add To Cart Button
    const addButton =
      document.querySelector<HTMLButtonElement>("#addToCartButton");

    const message = document.querySelector<HTMLDivElement>("#addCartMessage");

    addButton?.addEventListener("click", async () => {
      if (!message || !addButton) return;

      try {
        addButton.disabled = true;

        addButton.innerHTML = `
          <span class="spinner-border spinner-border-sm me-2"></span>
          Adding...
        `;

        await addToCart(book.id, 1);

        message.innerHTML = `
          <div class="alert alert-success">
            Book added to cart successfully!
            <a href="/cart" class="alert-link">View Cart</a>
          </div>
        `;

        addButton.innerHTML = `
          <i class="fa-solid fa-check me-2"></i>
          Added to Cart
        `;
      } catch (error) {
        message.innerHTML = `
          <div class="alert alert-danger">
            ${escapeHtml(
              error instanceof Error
                ? error.message
                : "Failed to add book to cart.",
            )}
          </div>
        `;

        addButton.disabled = false;

        addButton.innerHTML = `
          <i class="fa-solid fa-cart-plus me-2"></i>
          Add to Cart
        `;
      }
    });
  } catch (error) {
    container.innerHTML = `
      <div class="alert alert-danger">
        ${escapeHtml(
          error instanceof Error
            ? error.message
            : "Failed to load book details.",
        )}
      </div>

      <a href="/books" class="btn btn-outline-secondary">
        Back to Books
      </a>
    `;
  }
}

// Escape HTML
function escapeHtml(value: string | null): string {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });
}
