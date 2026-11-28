import {
  getAdminUsers,
  updateAdminUserRole,
  updateAdminUserStatus,
  type AdminUser,
} from "../services/adminUserService";

import { getAuthUser } from "../utils/auth";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[char];
  });
}

function renderUsersTable(users: AdminUser[]): string {
  const currentUser = getAuthUser();

  if (users.length === 0) {
    return `
      <tr>
        <td colspan="6" class="text-center py-4">
          No users found.
        </td>
      </tr>
    `;
  }

  return users
    .map((user) => {
      const isCurrentUser = user.id === currentUser?.id;

      return `
        <tr>
          <td>${user.id}</td>

          <td>${escapeHtml(user.username)}</td>

          <td>${escapeHtml(user.email)}</td>

          <td>
            <select
              class="form-select form-select-sm user-role-select"
              data-id="${user.id}"
              ${isCurrentUser ? "disabled" : ""}
            >
              <option value="user" ${user.role === "user" ? "selected" : ""}>
                User
              </option>

              <option value="admin" ${user.role === "admin" ? "selected" : ""}>
                Admin
              </option>
            </select>
          </td>

          <td>
            ${
              user.is_active
                ? '<span class="badge bg-success">Active</span>'
                : '<span class="badge bg-secondary">Inactive</span>'
            }
          </td>

          <td>
            <button
              class="btn btn-sm ${
                user.is_active ? "btn-outline-danger" : "btn-outline-success"
              } user-status-button"
              data-id="${user.id}"
              data-active="${user.is_active}"
              ${isCurrentUser ? "disabled" : ""}
            >
              ${user.is_active ? "Deactivate" : "Activate"}
            </button>
          </td>
        </tr>
      `;
    })
    .join("");
}

export function renderAdminUsersPage(): string {
  return `
    <div class="container-fluid py-4">

      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold mb-1">User Management</h2>
          <p class="text-muted mb-0">
            Manage registered users and their permissions.
          </p>
        </div>

        <button
          class="btn btn-outline-primary"
          id="refreshUsersButton"
        >
          <i class="fas fa-sync-alt me-2"></i>
          Refresh
        </button>
      </div>

      <div id="usersMessage"></div>

      <div class="card shadow-sm">
        <div class="card-body">

          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody id="adminUsersTableBody">
                <tr>
                  <td colspan="6" class="text-center py-4">
                    Loading users...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </div>
  `;
}

export async function setupAdminUsersPage(): Promise<void> {
  const tableBody = document.getElementById("adminUsersTableBody");
  const messageContainer = document.getElementById("usersMessage");
  const refreshButton = document.getElementById("refreshUsersButton");

  if (!tableBody || !messageContainer) return;

  function showMessage(message: string, type: "success" | "danger"): void {
    messageContainer!.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show">
        ${escapeHtml(message)}
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
        ></button>
      </div>
    `;
  }

  async function loadUsers(): Promise<void> {
    tableBody!.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4">
          Loading users...
        </td>
      </tr>
    `;

    try {
      const users = await getAdminUsers();
      tableBody!.innerHTML = renderUsersTable(users);
    } catch (error) {
      tableBody!.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-danger py-4">
            Failed to load users.
          </td>
        </tr>
      `;

      showMessage(
        error instanceof Error ? error.message : "Failed to load users.",
        "danger",
      );
    }
  }

  refreshButton?.addEventListener("click", () => {
    void loadUsers();
  });

  tableBody.addEventListener("change", async (event) => {
    const target = event.target as HTMLSelectElement;

    if (!target.classList.contains("user-role-select")) return;

    const userId = Number(target.dataset.id);
    const newRole = target.value as "admin" | "user";

    if (!confirm(`Change this user's role to ${newRole}?`)) {
      await loadUsers();
      return;
    }

    target.disabled = true;

    try {
      await updateAdminUserRole(userId, newRole);

      showMessage("User role updated successfully.", "success");
      await loadUsers();
    } catch (error) {
      showMessage(
        error instanceof Error ? error.message : "Failed to update user role.",
        "danger",
      );

      await loadUsers();
    }
  });

  tableBody.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;

    const button = target.closest(
      ".user-status-button",
    ) as HTMLButtonElement | null;

    if (!button) return;

    const userId = Number(button.dataset.id);
    const currentStatus = button.dataset.active === "true";
    const newStatus = !currentStatus;

    const action = newStatus ? "activate" : "deactivate";

    if (!confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    button.disabled = true;

    try {
      await updateAdminUserStatus(userId, newStatus);

      showMessage(`User ${action}d successfully.`, "success");

      await loadUsers();
    } catch (error) {
      showMessage(
        error instanceof Error
          ? error.message
          : "Failed to update user status.",
        "danger",
      );

      await loadUsers();
    }
  });

  await loadUsers();
}
