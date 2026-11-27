import {
  getAdminBooks,
  createAdminBook,
  updateAdminBook,
  deactivateAdminBook,
  type AdminBook,
  type CreateBookInput,
} from "../services/adminBookService";

import { apiRequest } from "../services/api";

interface Category {
  id: number;
  name: string;
  is_active: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

let books: AdminBook[] = [];
let categories: Category[] = [];

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });
}

export function renderAdminBooksPage(): string {
  return `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Book Management</h2>
          <p class="text-muted mb-0">Manage your bookstore books</p>
        </div>

        <button class="btn btn-primary" id="addBookButton">
          <i class="fas fa-plus me-2"></i>Add New Book
        </button>
      </div>

      <div class="card shadow-sm">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Book Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="adminBooksTableBody">
                <tr>
                  <td colspan="8" class="text-center py-4">
                    Loading books...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="card shadow-sm mt-4 d-none" id="bookFormCard">
        <div class="card-header bg-white">
          <h5 class="mb-0" id="bookFormTitle">Add New Book</h5>
        </div>

        <div class="card-body">
          <form id="adminBookForm">
            <input type="hidden" id="bookId">

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Book Title</label>
                <input
                  type="text"
                  class="form-control"
                  id="bookTitle"
                  maxlength="255"
                  required
                >
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Author</label>
                <input
                  type="text"
                  class="form-control"
                  id="bookAuthor"
                  maxlength="150"
                  required
                >
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Category</label>
                <select
                  class="form-select"
                  id="bookCategory"
                  required
                >
                  <option value="">Select Category</option>
                </select>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">ISBN</label>
                <input
                  type="text"
                  class="form-control"
                  id="bookIsbn"
                  maxlength="20"
                >
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Price (MMK)</label>
                <input
                  type="number"
                  class="form-control"
                  id="bookPrice"
                  min="0"
                  step="0.01"
                  required
                >
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Stock</label>
                <input
                  type="number"
                  class="form-control"
                  id="bookStock"
                  min="0"
                  step="1"
                  required
                >
              </div>

              <div class="col-12 mb-3">
                <label class="form-label">Image URL</label>
                <input
                  type="url"
                  class="form-control"
                  id="bookImageUrl"
                  maxlength="500"
                >
              </div>

              <div class="col-12 mb-3">
                <label class="form-label">Description</label>
                <textarea
                  class="form-control"
                  id="bookDescription"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" id="saveBookButton">
              Save Book
            </button>

            <button
              type="button"
              class="btn btn-secondary ms-2"
              id="cancelBookButton"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
}

function renderBookRows(): string {
  if (books.length === 0) {
    return `
      <tr>
        <td colspan="8" class="text-center py-4 text-muted">
          No books found.
        </td>
      </tr>
    `;
  }

  return books
    .map(
      (book) => `
    <tr>
      <td>${book.id}</td>
      <td>${escapeHtml(book.title)}</td>
      <td>${escapeHtml(book.author)}</td>
      <td>${escapeHtml(book.category_name || "N/A")}</td>
      <td>${Number(book.price).toLocaleString()} MMK</td>
      <td>${book.stock}</td>
      <td>
        ${
          book.is_active
            ? '<span class="badge bg-success">Active</span>'
            : '<span class="badge bg-secondary">Inactive</span>'
        }
      </td>
      <td>
        ${
          book.is_active
            ? `
              <button
                class="btn btn-sm btn-outline-primary me-1"
                data-edit-book="${book.id}"
              >
                <i class="fas fa-edit"></i>
              </button>

              <button
                class="btn btn-sm btn-outline-danger"
                data-deactivate-book="${book.id}"
              >
                <i class="fas fa-ban"></i>
              </button>
            `
            : ""
        }
      </td>
    </tr>
  `,
    )
    .join("");
}

async function loadAdminBooks(): Promise<void> {
  const tbody = document.querySelector<HTMLTableSectionElement>(
    "#adminBooksTableBody",
  );

  if (!tbody) return;

  try {
    books = await getAdminBooks();
    tbody.innerHTML = renderBookRows();
  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center text-danger py-4">
          Failed to load books.
        </td>
      </tr>
    `;
    console.error(error);
  }
}

async function loadCategories(): Promise<void> {
  const response = await apiRequest<ApiResponse<Category[]>>("/categories");

  categories = response.data.filter((category) => category.is_active);

  const select = document.querySelector<HTMLSelectElement>("#bookCategory");

  if (!select) return;

  select.innerHTML = `
    <option value="">Select Category</option>
    ${categories
      .map(
        (category) => `
      <option value="${category.id}">
        ${escapeHtml(category.name)}
      </option>
    `,
      )
      .join("")}
  `;
}

function showBookForm(book?: AdminBook): void {
  const card = document.querySelector("#bookFormCard");
  const form = document.querySelector<HTMLFormElement>("#adminBookForm");

  if (!card || !form) return;

  form.reset();

  const title = document.querySelector("#bookFormTitle");
  const bookId = document.querySelector<HTMLInputElement>("#bookId");

  if (book) {
    if (title) title.textContent = "Edit Book";
    if (bookId) bookId.value = String(book.id);

    (document.querySelector("#bookTitle") as HTMLInputElement).value =
      book.title;

    (document.querySelector("#bookAuthor") as HTMLInputElement).value =
      book.author;

    (document.querySelector("#bookCategory") as HTMLSelectElement).value =
      String(book.category_id);

    (document.querySelector("#bookIsbn") as HTMLInputElement).value =
      book.isbn || "";

    (document.querySelector("#bookPrice") as HTMLInputElement).value = String(
      book.price,
    );

    (document.querySelector("#bookStock") as HTMLInputElement).value = String(
      book.stock,
    );

    (document.querySelector("#bookImageUrl") as HTMLInputElement).value =
      book.image_url || "";

    (document.querySelector("#bookDescription") as HTMLTextAreaElement).value =
      book.description || "";
  } else {
    if (title) title.textContent = "Add New Book";
    if (bookId) bookId.value = "";
  }

  card.classList.remove("d-none");
  card.scrollIntoView({ behavior: "smooth" });
}

function hideBookForm(): void {
  document.querySelector("#bookFormCard")?.classList.add("d-none");
  document.querySelector<HTMLFormElement>("#adminBookForm")?.reset();
}

async function handleBookSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();

  const bookId = (document.querySelector("#bookId") as HTMLInputElement).value;

  const input: CreateBookInput = {
    title: (
      document.querySelector("#bookTitle") as HTMLInputElement
    ).value.trim(),
    author: (
      document.querySelector("#bookAuthor") as HTMLInputElement
    ).value.trim(),
    category_id: Number(
      (document.querySelector("#bookCategory") as HTMLSelectElement).value,
    ),
    isbn: (
      document.querySelector("#bookIsbn") as HTMLInputElement
    ).value.trim(),
    price: Number(
      (document.querySelector("#bookPrice") as HTMLInputElement).value,
    ),
    stock: Number(
      (document.querySelector("#bookStock") as HTMLInputElement).value,
    ),
    image_url: (
      document.querySelector("#bookImageUrl") as HTMLInputElement
    ).value.trim(),
    description: (
      document.querySelector("#bookDescription") as HTMLTextAreaElement
    ).value.trim(),
  };

  const saveButton =
    document.querySelector<HTMLButtonElement>("#saveBookButton");

  if (saveButton) {
    saveButton.disabled = true;
    saveButton.textContent = "Saving...";
  }

  try {
    if (bookId) {
      await updateAdminBook(Number(bookId), input);
      alert("Book updated successfully.");
    } else {
      await createAdminBook(input);
      alert("Book created successfully.");
    }

    hideBookForm();
    await loadAdminBooks();
  } catch (error) {
    alert(error instanceof Error ? error.message : "Failed to save book.");
  } finally {
    if (saveButton) {
      saveButton.disabled = false;
      saveButton.textContent = "Save Book";
    }
  }
}

export async function setupAdminBooksPage(): Promise<void> {
  await Promise.all([loadAdminBooks(), loadCategories()]);

  document.querySelector("#addBookButton")?.addEventListener("click", () => {
    showBookForm();
  });

  document.querySelector("#cancelBookButton")?.addEventListener("click", () => {
    hideBookForm();
  });

  document
    .querySelector<HTMLFormElement>("#adminBookForm")
    ?.addEventListener("submit", (event) => {
      void handleBookSubmit(event);
    });

  document
    .querySelector("#adminBooksTableBody")
    ?.addEventListener("click", async (event) => {
      const target = event.target as HTMLElement;

      const editButton = target.closest<HTMLElement>("[data-edit-book]");

      if (editButton) {
        const id = Number(editButton.dataset.editBook);
        const book = books.find((item) => item.id === id);

        if (book) showBookForm(book);
        return;
      }

      const deactivateButton = target.closest<HTMLElement>(
        "[data-deactivate-book]",
      );

      if (deactivateButton) {
        const id = Number(deactivateButton.dataset.deactivateBook);

        if (!confirm("Are you sure you want to deactivate this book?")) {
          return;
        }

        try {
          await deactivateAdminBook(id);
          alert("Book deactivated successfully.");
          await loadAdminBooks();
        } catch (error) {
          alert(
            error instanceof Error
              ? error.message
              : "Failed to deactivate book.",
          );
        }
      }
    });
}
