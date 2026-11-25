import type { Book } from "../types/book";
import { getBooks } from "../services/bookService";
import { renderBookCard } from "../components/bookCard";

export function renderBooksPage(): string {
  return `
    <section>
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h2 class="fw-bold mb-1">Our Books</h2>
          <p class="text-muted mb-0">
            Explore our book collection.
          </p>
        </div>

        <div class="mt-3 mt-md-0">
          <input
            type="search"
            id="bookSearch"
            class="form-control"
            placeholder="Search books..."
          >
        </div>
      </div>

      <div class="row g-4" id="booksContainer">
        <div class="col-12 text-center py-5">
          <div class="spinner-border text-success"></div>
          <p class="text-muted mt-2">Loading books...</p>
        </div>
      </div>

      <p
        id="noBooksMessage"
        class="text-center text-muted mt-5 d-none"
      >
        No books found.
      </p>

      <p
        id="booksError"
        class="text-center text-danger mt-4 d-none"
      ></p>
    </section>
  `;
}

export async function setupBooksPage(): Promise<void> {
  const searchInput = document.querySelector<HTMLInputElement>("#bookSearch");

  const booksContainer =
    document.querySelector<HTMLDivElement>("#booksContainer");

  const noBooksMessage =
    document.querySelector<HTMLParagraphElement>("#noBooksMessage");

  const booksError =
    document.querySelector<HTMLParagraphElement>("#booksError");

  if (!searchInput || !booksContainer || !noBooksMessage || !booksError) {
    return;
  }

  let books: Book[] = [];

  try {
    books = await getBooks();

    renderBooks(books);

    searchInput.addEventListener("input", () => {
      const keyword = searchInput.value.trim().toLowerCase();

      const filteredBooks = books.filter((book) => {
        return (
          book.title.toLowerCase().includes(keyword) ||
          book.author.toLowerCase().includes(keyword) ||
          (book.category_name || "").toLowerCase().includes(keyword)
        );
      });

      renderBooks(filteredBooks);
    });
  } catch (error) {
    booksContainer.innerHTML = "";

    booksError.textContent =
      error instanceof Error ? error.message : "Failed to load books.";

    booksError.classList.remove("d-none");
  }

  function renderBooks(bookList: Book[]): void {
    const container = document.querySelector<HTMLDivElement>("#booksContainer");

    const noBooks =
      document.querySelector<HTMLParagraphElement>("#noBooksMessage");

    if (!container || !noBooks) {
      return;
    }

    container.innerHTML = bookList.map(renderBookCard).join("");

    noBooks.classList.toggle("d-none", bookList.length > 0);
  }
}
