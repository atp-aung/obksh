interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
  is_active: boolean;
  created_at: string;
}

// Temporary Sample Data
const sampleUsers: AdminUser[] = [
  {
    id: 1,
    username: "Admin",
    email: "admin@example.com",
    role: "admin",
    is_active: true,
    created_at: "2026-11-20",
  },
  {
    id: 2,
    username: "John Doe",
    email: "john@example.com",
    role: "user",
    is_active: true,
    created_at: "2026-11-21",
  },
  {
    id: 3,
    username: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    is_active: false,
    created_at: "2026-11-22",
  },
];

export function renderAdminUsersPage(): string {
  return `
    <section>
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h2 class="fw-bold mb-1">User Management</h2>
          <p class="text-muted mb-0">
            Manage registered users and their roles.
          </p>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                ${sampleUsers
                  .map(
                    (user) => `
                  <tr>
                    <td>${user.id}</td>

                    <td class="fw-semibold">
                      ${user.username}
                    </td>

                    <td>${user.email}</td>

                    <td>
                      <span class="badge ${
                        user.role === "admin"
                          ? "text-bg-dark"
                          : "text-bg-primary"
                      }">
                        ${user.role}
                      </span>
                    </td>

                    <td>
                      <span class="badge ${
                        user.is_active ? "text-bg-success" : "text-bg-secondary"
                      }">
                        ${user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>${user.created_at}</td>

                    <td>
                      <button
                        class="btn btn-sm btn-outline-primary me-1"
                        type="button"
                        disabled
                      >
                        Change Role
                      </button>

                      <button
                        class="btn btn-sm btn-outline-warning"
                        type="button"
                        disabled
                      >
                        ${user.is_active ? "Deactivate" : "Activate"}
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
