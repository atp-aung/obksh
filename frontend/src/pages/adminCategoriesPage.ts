import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deactivateAdminCategory,
  type AdminCategory,
  type CategoryInput,
} from "../services/adminCategoryService";

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

let categories: AdminCategory[] = [];

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

        <button
          class="btn btn-success mt-3 mt-md-0"
          type="button"
          id="addCategoryButton"
        >
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

              <tbody id="adminCategoriesTableBody">
                <tr>
                  <td colspan="5" class="text-center py-4">
                    Loading categories...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm mt-4 d-none" id="categoryFormCard">
        <div class="card-header bg-white">
          <h5 class="mb-0" id="categoryFormTitle">Add New Category</h5>
        </div>

        <div class="card-body">
          <form id="adminCategoryForm">
            <input type="hidden" id="categoryId">

            <div class="mb-3">
              <label for="categoryName" class="form-label">
                Category Name
              </label>
              <input
                type="text"
                class="form-control"
                id="categoryName"
                maxlength="100"
                required
              >
            </div>

            <div class="mb-3">
              <label for="categoryDescription" class="form-label">
                Description
              </label>
              <textarea
                class="form-control"
                id="categoryDescription"
                rows="3"
              ></textarea>
            </div>

            <button
              type="submit"
              class="btn btn-success"
              id="saveCategoryButton"
            >
              Save Category
            </button>

            <button
              type="button"
              class="btn btn-secondary ms-2"
              id="cancelCategoryButton"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </section>
  `;
}

function renderCategoryRows(): string {
  if (categories.length === 0) {
    return `
      <tr>
        <td colspan="5" class="text-center text-muted py-4">
          No categories found.
        </td>
      </tr>
    `;
  }

  return categories
    .map(
      (category) => `
    <tr>
      <td>${category.id}</td>
      <td class="fw-bold">${escapeHtml(category.name)}</td>
      <td>${escapeHtml(category.description || "")}</td>
      <td>
        ${
          category.is_active
            ? '<span class="badge bg-success">Active</span>'
            : '<span class="badge bg-secondary">Inactive</span>'
        }
      </td>
      <td>
        ${
          category.is_active
            ? `
              <button
                class="btn btn-sm btn-outline-primary me-1"
                type="button"
                data-edit-category="${category.id}"
                title="Edit Category"
              >
                <i class="fa-solid fa-pen"></i>
              </button>

              <button
                class="btn btn-sm btn-outline-danger"
                type="button"
                data-deactivate-category="${category.id}"
                title="Deactivate Category"
              >
                <i class="fa-solid fa-trash"></i>
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

async function loadAdminCategories(): Promise<void> {
  const tbody = document.querySelector<HTMLTableSectionElement>(
    "#adminCategoriesTableBody",
  );

  if (!tbody) return;

  try {
    categories = await getAdminCategories();
    tbody.innerHTML = renderCategoryRows();
  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-danger py-4">
          Failed to load categories.
        </td>
      </tr>
    `;
    console.error(error);
  }
}

function showCategoryForm(category?: AdminCategory): void {
  const card = document.querySelector("#categoryFormCard");
  const form = document.querySelector<HTMLFormElement>("#adminCategoryForm");

  if (!card || !form) return;

  form.reset();

  const title = document.querySelector("#categoryFormTitle");
  const categoryId = document.querySelector<HTMLInputElement>("#categoryId");
  const categoryName =
    document.querySelector<HTMLInputElement>("#categoryName");
  const description = document.querySelector<HTMLTextAreaElement>(
    "#categoryDescription",
  );

  if (category) {
    if (title) title.textContent = "Edit Category";
    if (categoryId) categoryId.value = String(category.id);
    if (categoryName) categoryName.value = category.name;
    if (description) description.value = category.description || "";
  } else {
    if (title) title.textContent = "Add New Category";
    if (categoryId) categoryId.value = "";
  }

  card.classList.remove("d-none");
  card.scrollIntoView({ behavior: "smooth" });
}

function hideCategoryForm(): void {
  document.querySelector("#categoryFormCard")?.classList.add("d-none");

  document.querySelector<HTMLFormElement>("#adminCategoryForm")?.reset();
}

async function handleCategorySubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();

  const id = (document.querySelector("#categoryId") as HTMLInputElement).value;

  const input: CategoryInput = {
    name: (
      document.querySelector("#categoryName") as HTMLInputElement
    ).value.trim(),

    description: (
      document.querySelector("#categoryDescription") as HTMLTextAreaElement
    ).value.trim(),
  };

  const saveButton = document.querySelector<HTMLButtonElement>(
    "#saveCategoryButton",
  );

  if (saveButton) {
    saveButton.disabled = true;
    saveButton.textContent = "Saving...";
  }

  try {
    if (id) {
      await updateAdminCategory(Number(id), input);
      alert("Category updated successfully.");
    } else {
      await createAdminCategory(input);
      alert("Category created successfully.");
    }

    hideCategoryForm();
    await loadAdminCategories();
  } catch (error) {
    alert(error instanceof Error ? error.message : "Failed to save category.");
  } finally {
    if (saveButton) {
      saveButton.disabled = false;
      saveButton.textContent = "Save Category";
    }
  }
}

export async function setupAdminCategoriesPage(): Promise<void> {
  await loadAdminCategories();

  document
    .querySelector("#addCategoryButton")
    ?.addEventListener("click", () => {
      showCategoryForm();
    });

  document
    .querySelector("#cancelCategoryButton")
    ?.addEventListener("click", () => {
      hideCategoryForm();
    });

  document
    .querySelector<HTMLFormElement>("#adminCategoryForm")
    ?.addEventListener("submit", (event) => {
      void handleCategorySubmit(event);
    });

  document
    .querySelector("#adminCategoriesTableBody")
    ?.addEventListener("click", async (event) => {
      const target = event.target as HTMLElement;

      const editButton = target.closest<HTMLElement>("[data-edit-category]");

      if (editButton) {
        const id = Number(editButton.dataset.editCategory);
        const category = categories.find((item) => item.id === id);

        if (category) showCategoryForm(category);
        return;
      }

      const deactivateButton = target.closest<HTMLElement>(
        "[data-deactivate-category]",
      );

      if (deactivateButton) {
        const id = Number(deactivateButton.dataset.deactivateCategory);

        if (!confirm("Are you sure you want to deactivate this category?")) {
          return;
        }

        try {
          await deactivateAdminCategory(id);
          alert("Category deactivated successfully.");
          await loadAdminCategories();
        } catch (error) {
          alert(
            error instanceof Error
              ? error.message
              : "Failed to deactivate category.",
          );
        }
      }
    });
}
