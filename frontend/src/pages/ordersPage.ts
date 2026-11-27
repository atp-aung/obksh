import { getMyOrders } from "../services/orderService";
import type { Order } from "../services/orderService";

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

function getStatusBadge(status: string): string {
  const statusClasses: Record<string, string> = {
    pending: "bg-warning text-dark",
    confirmed: "bg-info text-dark",
    processing: "bg-primary",
    shipped: "bg-info",
    delivered: "bg-success",
    cancelled: "bg-danger",
  };

  const badgeClass = statusClasses[status] || "bg-secondary";

  return `
    <span class="badge ${badgeClass}">
      ${escapeHtml(status.charAt(0).toUpperCase() + status.slice(1))}
    </span>
  `;
}

export function renderOrdersPage(): string {
  return `
    <section>
      <h2 class="fw-bold mb-4">
        <i class="fa-solid fa-box text-success me-2"></i>
        My Orders
      </h2>

      <div id="ordersError" class="alert alert-danger d-none"></div>

      <div id="ordersContainer">
        <div class="text-center py-5">
          <div class="spinner-border text-success"></div>
          <p class="text-muted mt-2">Loading orders...</p>
        </div>
      </div>
    </section>
  `;
}

export async function setupOrdersPage(): Promise<void> {
  const container = document.querySelector<HTMLDivElement>("#ordersContainer");

  const errorContainer = document.querySelector<HTMLDivElement>("#ordersError");

  if (!container || !errorContainer) return;

  try {
    const orders: Order[] = await getMyOrders();

    errorContainer.classList.add("d-none");

    if (orders.length === 0) {
      container.innerHTML = `
        <div class="card border-0 shadow-sm">
          <div class="card-body text-center py-5">
            <i class="fa-solid fa-box-open fa-3x text-muted mb-3"></i>
            <h5>No Orders Yet</h5>
            <p class="text-muted">
              You haven't placed any orders yet.
            </p>
            <a href="/books" class="btn btn-success">
              Browse Books
            </a>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="p-3">Order Number</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                ${orders
                  .map(
                    (order) => `
                  <tr>
                    <td class="p-3 fw-bold">
                      ${escapeHtml(order.order_number)}
                    </td>

                    <td>
                      ${new Date(order.created_at).toLocaleDateString()}
                    </td>

                    <td class="text-success fw-bold">
                      ${Number(order.total_amount).toLocaleString()} MMK
                    </td>

                    <td>
                      ${getStatusBadge(order.status)}
                    </td>

                    <td>
                      ${
                        order.payment_status === "paid"
                          ? '<span class="text-success">Paid</span>'
                          : '<span class="text-warning">Pending</span>'
                      }
                    </td>

                    <td>
                      <a
                        href="/orders/${order.id}"
                        class="btn btn-sm btn-outline-success"
                      >
                        View
                      </a>
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
    `;
  } catch (error) {
    container.innerHTML = "";

    errorContainer.textContent =
      error instanceof Error ? error.message : "Failed to load orders.";

    errorContainer.classList.remove("d-none");
  }
}
