import type { Book } from "../types/book";
import { renderBookCard } from "../components/bookCard";

// Temporary Sample Data
const sampleBooks: Book[] = [
  {
    id: 1,
    category_id: 1,
    category_name: "Programming",
    title: "Clean Code",
    author: "Robert C. Martin",
    price: 25000,
    stock: 10,
    is_active: true,
    image_url: "https://placehold.co/300x350?text=Clean+Code",
  },
  {
    id: 2,
    category_id: 1,
    category_name: "Programming",
    title: "The Pragmatic Programmer",
    author: "David Thomas",
    price: 30000,
    stock: 8,
    is_active: true,
    image_url: "https://placehold.co/300x350?text=Pragmatic+Programmer",
  },
  {
    id: 3,
    category_id: 2,
    category_name: "Novel",
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 18000,
    stock: 15,
    is_active: true,
    image_url: "https://placehold.co/300x350?text=The+Alchemist",
  },
  {
    id: 4,
    category_id: 3,
    category_name: "Business",
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    price: 20000,
    stock: 12,
    is_active: true,
    image_url: "https://placehold.co/300x350?text=Rich+Dad+Poor+Dad",
  },
];

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
        ${sampleBooks.map(renderBookCard).join("")}
      </div>

      <p
        id="noBooksMessage"
        class="text-center text-muted mt-5 d-none"
      >
        No books found.
      </p>
    </section>
  `;
}

export function setupBooksSearch(): void {
  const searchInput = document.querySelector<HTMLInputElement>("#bookSearch");

  const booksContainer =
    document.querySelector<HTMLDivElement>("#booksContainer");

  const noBooksMessage =
    document.querySelector<HTMLParagraphElement>("#noBooksMessage");

  if (!searchInput || !booksContainer || !noBooksMessage) {
    return;
  }

  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.trim().toLowerCase();

    const filteredBooks = sampleBooks.filter((book) => {
      return (
        book.title.toLowerCase().includes(keyword) ||
        book.author.toLowerCase().includes(keyword) ||
        (book.category_name || "").toLowerCase().includes(keyword)
      );
    });

    booksContainer.innerHTML = filteredBooks.map(renderBookCard).join("");

    noBooksMessage.classList.toggle("d-none", filteredBooks.length > 0);
  });
}
