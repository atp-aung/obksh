import { apiRequest } from "../services/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface DashboardUser {
  id: number;
}

interface DashboardBook {
  id: number;
}

interface DashboardCategory {
  id: number;
}

export function renderAdminDashboardPage(): string {
  return `
    <section>
      <div class="mb-4">
        <h2 class="fw-bold">Admin Dashboard</h2>
        <p class="text-muted mb-0">
          Overview of your online book shop.
        </p>
      </div>

      <div id="dashboardError" class="alert alert-danger d-none"></div>

      <div class="row g-4">
        <div class="col-sm-6 col-xl-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between">
                <div>
                  <p class="text-muted mb-2">Total Users</p>
                  <h3 class="fw-bold mb-0" id="totalUsers">—</h3>
                </div>
                <i class="fa-solid fa-users fa-2x text-primary"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-6 col-xl-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between">
                <div>
                  <p class="text-muted mb-2">Total Books</p>
                  <h3 class="fw-bold mb-0" id="totalBooks">—</h3>
                </div>
                <i class="fa-solid fa-book fa-2x text-success"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-6 col-xl-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between">
                <div>
                  <p class="text-muted mb-2">Categories</p>
                  <h3 class="fw-bold mb-0" id="totalCategories">—</h3>
                </div>
                <i class="fa-solid fa-layer-group fa-2x text-info"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-6 col-xl-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between">
                <div>
                  <p class="text-muted mb-2">Total Orders</p>
                  <h3 class="fw-bold mb-0">—</h3>
                </div>
                <i class="fa-solid fa-box fa-2x text-warning"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-6 col-xl-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between">
                <div>
                  <p class="text-muted mb-2">Pending Orders</p>
                  <h3 class="fw-bold mb-0">—</h3>
                </div>
                <i class="fa-solid fa-clock fa-2x text-danger"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-6 col-xl-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between">
                <div>
                  <p class="text-muted mb-2">Total Revenue</p>
                  <h3 class="fw-bold text-success mb-0">—</h3>
                </div>
                <i class="fa-solid fa-money-bill-wave fa-2x text-success"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export async function setupAdminDashboardPage(): Promise<void> {
  const errorContainer =
    document.querySelector<HTMLDivElement>("#dashboardError");

  try {
    const [usersResponse, booksResponse, categoriesResponse] =
      await Promise.all([
        apiRequest<ApiResponse<DashboardUser[]>>("/users"),
        apiRequest<ApiResponse<DashboardBook[]>>("/books"),
        apiRequest<ApiResponse<DashboardCategory[]>>("/categories"),
      ]);

    const totalUsers =
      document.querySelector<HTMLHeadingElement>("#totalUsers");

    const totalBooks =
      document.querySelector<HTMLHeadingElement>("#totalBooks");

    const totalCategories =
      document.querySelector<HTMLHeadingElement>("#totalCategories");

    if (totalUsers) {
      totalUsers.textContent = usersResponse.data.length.toLocaleString();
    }

    if (totalBooks) {
      totalBooks.textContent = booksResponse.data.length.toLocaleString();
    }

    if (totalCategories) {
      totalCategories.textContent =
        categoriesResponse.data.length.toLocaleString();
    }
  } catch (error) {
    if (errorContainer) {
      errorContainer.textContent =
        error instanceof Error
          ? error.message
          : "Failed to load dashboard data.";

      errorContainer.classList.remove("d-none");
    }
  }
}
