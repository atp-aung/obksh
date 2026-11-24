interface AdminCategory {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
}

// Temporary Sample Data
const sampleCategories: AdminCategory[] = [
  {
    id: 1,
    name: "Programming",
    description: "Programming and software development books.",
    is_active: true,
  },
  {
    id: 2,
    name: "Novel",
    description: "Fiction and story books.",
    is_active: true,
  },
  {
    id: 3,
    name: "Business",
    description: "Business and entrepreneurship books.",
    is_active: true,
  },
  {
    id: 4,
    name: "History",
    description: "History and historical events books.",
    is_active: false,
  },
];

export function renderAdminCategoriesPage(): string {
  return `
    <section>
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h2 class="fw-bold mb-1">Category Management</h2>
          <p class="text-muted mb-0">
            Manage your book categories.
          </p>
        </div>

        <button class="btn btn-success mt-3 mt-md-0" type="button">
          <i class="fa-solid fa-plus me-2"></i>
          Add New Category
        </button>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th>ID</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                ${sampleCategories
                  .map(
                    (category) => `
                  <tr>
                    <td>${category.id}</td>

                    <td class="fw-bold">
                      ${category.name}
                    </td>

                    <td>${category.description}</td>

                    <td>
                      ${
                        category.is_active
                          ? '<span class="badge bg-success">Active</span>'
                          : '<span class="badge bg-secondary">Inactive</span>'
                      }
                    </td>

                    <td>
                      <button
                        class="btn btn-sm btn-outline-primary me-1"
                        type="button"
                        title="Edit Category"
                      >
                        <i class="fa-solid fa-pen"></i>
                      </button>

                      <button
                        class="btn btn-sm btn-outline-danger"
                        type="button"
                        title="Deactivate Category"
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
