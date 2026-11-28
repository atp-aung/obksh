import type {
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
} from "../services/orderService";

import {
  getAdminOrders,
  getAdminOrderDetails,
  updateAdminOrderStatus,
  updateAdminPaymentStatus,
} from "../services/adminOrderService";

interface AdminOrder extends Order {
  username: string;
  email: string;
}

let orders: AdminOrder[] = [];

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

function renderOrderStatus(status: string): string {
  const classes: Record<string, string> = {
    pending: "bg-warning text-dark",
    confirmed: "bg-info text-dark",
    processing: "bg-primary",
    shipped: "bg-info text-dark",
    delivered: "bg-success",
    cancelled: "bg-danger",
  };

  return `
    <span class="badge ${classes[status] || "bg-secondary"}">
      ${escapeHtml(status.toUpperCase())}
    </span>
  `;
}

function renderOrdersTable(): string {
  if (orders.length === 0) {
    return `
      <tr>
        <td colspan="7" class="text-center text-muted py-4">
          No orders found.
        </td>
      </tr>
    `;
  }

  return orders
    .map(
      (order) => `
        <tr>
          <td class="fw-bold">
            ${escapeHtml(order.order_number)}
          </td>

          <td>
            <div>${escapeHtml(order.username)}</div>
            <small class="text-muted">
              ${escapeHtml(order.email)}
            </small>
          </td>

          <td>
            ${new Date(order.created_at).toLocaleDateString()}
          </td>

          <td class="text-success fw-bold">
            ${Number(order.total_amount).toLocaleString()} MMK
          </td>

          <td>
            <div class="mb-2">
              ${renderOrderStatus(order.status)}
            </div>

            <select
              class="form-select form-select-sm order-status-select"
              data-id="${order.id}"
            >
              ${(
                [
                  "pending",
                  "confirmed",
                  "processing",
                  "shipped",
                  "delivered",
                  "cancelled",
                ] as OrderStatus[]
              )
                .map(
                  (status) => `
                    <option
                      value="${status}"
                      ${order.status === status ? "selected" : ""}
                    >
                      ${status.toUpperCase()}
                    </option>
                  `,
                )
                .join("")}
            </select>
          </td>

          <td>
            <div class="mb-2">
              <span class="${
                order.payment_status === "paid"
                  ? "text-success"
                  : "text-warning"
              }">
                ${escapeHtml(order.payment_status.toUpperCase())}
              </span>
            </div>

            <small class="text-muted d-block mb-2">
              ${
                order.payment_method === "cash_on_delivery"
                  ? "Cash on Delivery"
                  : "Bank Transfer"
              }
            </small>

            <select
              class="form-select form-select-sm payment-status-select"
              data-id="${order.id}"
            >
              ${(["pending", "paid", "failed", "refunded"] as PaymentStatus[])
                .map(
                  (status) => `
                    <option
                      value="${status}"
                      ${order.payment_status === status ? "selected" : ""}
                    >
                      ${status.toUpperCase()}
                    </option>
                  `,
                )
                .join("")}
            </select>
          </td>

          <td>
            <button
  type="button"
  class="btn btn-sm btn-outline-success view-order-button"
  data-id="${order.id}"
>
  View
</button>
          </td>
        </tr>
      `,
    )
    .join("");
}

function renderAdminOrderDetails(details: {
  order: Order;
  items: OrderItem[];
}): string {
  const { order, items } = details;

  return `
    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4 class="fw-bold mb-0">Order Details</h4>

          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            id="closeOrderDetails"
          >
            Close
          </button>
        </div>

        <div class="row g-3 mb-4">
          <div class="col-md-6">
            <h6 class="fw-bold">Order Information</h6>
            <p class="mb-1">
              Order Number: ${escapeHtml(order.order_number)}
            </p>
            <p class="mb-1">
              Date: ${new Date(order.created_at).toLocaleString()}
            </p>
            <p class="mb-1">
              Status: ${renderOrderStatus(order.status)}
            </p>
          </div>

          <div class="col-md-6">
            <h6 class="fw-bold">Shipping Information</h6>
            <p class="mb-1">
              Name: ${escapeHtml(order.shipping_name)}
            </p>
            <p class="mb-1">
              Phone: ${escapeHtml(order.shipping_phone)}
            </p>
            <p class="mb-1">
              Address: ${escapeHtml(order.shipping_address)}
            </p>
          </div>
        </div>

        <h6 class="fw-bold mb-3">Purchased Books</h6>

        <div class="table-responsive">
          <table class="table table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th>Book</th>
                <th>Author</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>

            <tbody>
              ${items
                .map(
                  (item) => `
                <tr>
                  <td>${escapeHtml(item.book_title)}</td>
                  <td>${escapeHtml(item.author)}</td>
                  <td>
                    ${Number(item.unit_price).toLocaleString()} MMK
                  </td>
                  <td>${item.quantity}</td>
                  <td>
                    ${(
                      Number(item.unit_price) * item.quantity
                    ).toLocaleString()} MMK
                  </td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="text-end">
          <p class="mb-1">
            Subtotal:
            <strong>${Number(order.subtotal).toLocaleString()} MMK</strong>
          </p>

          <p class="mb-1">
            Shipping Fee:
            <strong>${Number(order.shipping_fee).toLocaleString()} MMK</strong>
          </p>

          <h5 class="text-success fw-bold">
            Total:
            ${Number(order.total_amount).toLocaleString()} MMK
          </h5>

          <p class="mb-0">
            Payment Method:
            ${
              order.payment_method === "cash_on_delivery"
                ? "Cash on Delivery"
                : "Bank Transfer"
            }
          </p>

          <p class="mb-0">
            Payment Status:
            ${escapeHtml(order.payment_status.toUpperCase())}
          </p>
        </div>
      </div>
    </div>
  `;
}

export function renderAdminOrdersPage(): string {
  return `
    <section>
      <div class="mb-4">
        <h2 class="fw-bold mb-1">Order Management</h2>
        <p class="text-muted mb-0">
          View and manage customer orders.
        </p>
      </div>

      <div id="adminOrdersMessage"></div>

      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th>Order Number</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Order Status</th>
                  <th>Payment</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody id="adminOrdersTableBody">
                <tr>
                  <td colspan="7" class="text-center py-4">
                    Loading orders...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div id="adminOrderDetails" class="mt-4 d-none"></div>
    </section>
  `;
}

function showMessage(message: string, type: "success" | "danger"): void {
  const container = document.getElementById("adminOrdersMessage");

  if (!container) return;

  container.innerHTML = `
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

async function loadAdminOrders(): Promise<void> {
  const tbody = document.getElementById("adminOrdersTableBody");

  if (!tbody) return;

  try {
    orders = (await getAdminOrders()) as AdminOrder[];
    tbody.innerHTML = renderOrdersTable();
  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-danger py-4">
          Failed to load orders.
        </td>
      </tr>
    `;

    showMessage(
      error instanceof Error ? error.message : "Failed to load orders",
      "danger",
    );
  }
}

async function handleOrderStatusChange(
  id: number,
  status: OrderStatus,
): Promise<void> {
  try {
    await updateAdminOrderStatus(id, status);

    showMessage("Order status updated successfully.", "success");

    await loadAdminOrders();
  } catch (error) {
    showMessage(
      error instanceof Error ? error.message : "Failed to update order status",
      "danger",
    );

    await loadAdminOrders();
  }
}

async function handlePaymentStatusChange(
  id: number,
  status: PaymentStatus,
): Promise<void> {
  try {
    await updateAdminPaymentStatus(id, status);

    showMessage("Payment status updated successfully.", "success");

    await loadAdminOrders();
  } catch (error) {
    showMessage(
      error instanceof Error
        ? error.message
        : "Failed to update payment status",
      "danger",
    );

    await loadAdminOrders();
  }
}

export async function setupAdminOrdersPage(): Promise<void> {
  await loadAdminOrders();

  const tbody = document.getElementById("adminOrdersTableBody");

  if (!tbody) return;

  tbody.addEventListener("change", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLSelectElement)) return;

    const id = Number(target.dataset.id);

    if (!Number.isInteger(id) || id <= 0) return;

    if (target.classList.contains("order-status-select")) {
      void handleOrderStatusChange(id, target.value as OrderStatus);
    }

    if (target.classList.contains("payment-status-select")) {
      void handlePaymentStatusChange(id, target.value as PaymentStatus);
    }
  });

  tbody.addEventListener("click", async (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const button = target.closest(".view-order-button");

    if (!(button instanceof HTMLButtonElement)) return;

    const id = Number(button.dataset.id);

    if (!Number.isInteger(id) || id <= 0) return;

    const detailsContainer = document.getElementById("adminOrderDetails");

    if (!detailsContainer) return;

    try {
      detailsContainer.classList.remove("d-none");
      detailsContainer.innerHTML = `
      <div class="text-center py-4">
        Loading order details...
      </div>
    `;

      const details = await getAdminOrderDetails(id);

      detailsContainer.innerHTML = renderAdminOrderDetails(details);

      detailsContainer.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } catch (error) {
      detailsContainer.innerHTML = `
      <div class="alert alert-danger">
        ${escapeHtml(
          error instanceof Error
            ? error.message
            : "Failed to load order details",
        )}
      </div>
    `;
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    if (target.closest("#closeOrderDetails")) {
      const detailsContainer = document.getElementById("adminOrderDetails");

      detailsContainer?.classList.add("d-none");
      if (detailsContainer) detailsContainer.innerHTML = "";
    }
  });
}
