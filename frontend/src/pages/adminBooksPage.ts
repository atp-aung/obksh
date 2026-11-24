interface AdminBook {
  id: number;
  title: string;
  author: string;
  category: string;
  price: number;
  stock: number;
  is_active: boolean;
}

// Temporary Sample Data
const sampleBooks: AdminBook[] = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    price: 25000,
    stock: 10,
    is_active: true,
  },
  {
    id: 2,
    title: "The Pragmatic Programmer",
    author: "David Thomas",
    category: "Programming",
    price: 30000,
    stock: 8,
    is_active: true,
  },
  {
    id: 3,
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Novel",
    price: 18000,
    stock: 15,
    is_active: true,
  },
  {
    id: 4,
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    category: "Business",
    price: 20000,
    stock: 0,
    is_active: false,
  },
];

export function renderAdminBooksPage(): string {
  return `
    <section>
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h2 class="fw-bold mb-1">Book Management</h2>
          <p class="text-muted mb-0">
            Manage your bookstore collection.
          </p>
        </div>

        <button class="btn btn-success mt-3 mt-md-0" type="button">
          <i class="fa-solid fa-plus me-2"></i>
          Add New Book
        </button>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-light">
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

              <tbody>
                ${sampleBooks
                  .map(
                    (book) => `
                  <tr>
                    <td>${book.id}</td>

                    <td class="fw-bold">
                      ${book.title}
                    </td>

                    <td>${book.author}</td>

                    <td>${book.category}</td>

                    <td class="text-success fw-bold">
                      ${book.price.toLocaleString()} MMK
                    </td>

                    <td>${book.stock}</td>

                    <td>
                      ${
                        book.is_active
                          ? '<span class="badge bg-success">Active</span>'
                          : '<span class="badge bg-secondary">Inactive</span>'
                      }
                    </td>

                    <td>
                      <button
                        class="btn btn-sm btn-outline-primary me-1"
                        type="button"
                        title="Edit Book"
                      >
                        <i class="fa-solid fa-pen"></i>
                      </button>

                      <button
                        class="btn btn-sm btn-outline-danger"
                        type="button"
                        title="Deactivate Book"
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  `;
}
