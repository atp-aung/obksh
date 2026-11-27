import { getMyOrderDetails } from "../services/orderService";
import type { OrderDetails } from "../services/orderService";

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

  return `
    <span class="badge ${statusClasses[status] || "bg-secondary"}">
      ${escapeHtml(status.toUpperCase())}
    </span>
  `;
}

export function renderOrderDetailsPage(): string {
  return `
    <section id="orderDetailsContainer">
      <div class="text-center py-5">
        <div class="spinner-border text-success"></div>
        <p class="text-muted mt-2">Loading order details...</p>
      </div>
    </section>
  `;
}

export async function setupOrderDetailsPage(orderId: number): Promise<void> {
  const container = document.querySelector<HTMLDivElement>(
    "#orderDetailsContainer",
  );

  if (!container) return;

  try {
    const data: OrderDetails = await getMyOrderDetails(orderId);

    const order = data.order;
    const items = data.items;

    container.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold">Order Details</h2>

        <a href="/orders" class="btn btn-outline-secondary">
          <i class="fa-solid fa-arrow-left me-2"></i>
          Back
        </a>
      </div>

      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body p-4">
          <div class="row g-3">
            <div class="col-md-6">
              <small class="text-muted">Order Number</small>
              <h6 class="fw-bold">
                ${escapeHtml(order.order_number)}
              </h6>
            </div>

            <div class="col-md-6">
              <small class="text-muted">Order Date</small>
              <h6>
                ${new Date(order.created_at).toLocaleDateString()}
              </h6>
            </div>

            <div class="col-md-6">
              <small class="text-muted">Order Status</small>
              <h6>${getStatusBadge(order.status)}</h6>
            </div>

            <div class="col-md-6">
              <small class="text-muted">Payment Status</small>
              <h6>
                ${escapeHtml(order.payment_status.toUpperCase())}
              </h6>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-3">Ordered Books</h5>

              ${
                items.length > 0
                  ? items
                      .map(
                        (item) => `
                    <div class="d-flex justify-content-between border-bottom py-3">
                      <div>
                        <h6 class="fw-bold mb-1">
                          ${escapeHtml(item.book_title)}
                        </h6>

                        <small class="text-muted">
                          ${escapeHtml(item.author)}
                        </small>

                        <p class="small mb-0">
                          ${Number(item.unit_price).toLocaleString()} MMK
                          × ${item.quantity}
                        </p>
                      </div>

                      <strong>
                        ${(
                          Number(item.unit_price) * item.quantity
                        ).toLocaleString()} MMK
                      </strong>
                    </div>
                  `,
                      )
                      .join("")
                  : '<p class="text-muted">No order items found.</p>'
              }

              <div class="d-flex justify-content-between mt-3">
                <span>Subtotal</span>
                <strong>
                  ${Number(order.subtotal).toLocaleString()} MMK
                </strong>
              </div>

              <div class="d-flex justify-content-between mt-2">
                <span>Shipping Fee</span>
                <strong>
                  ${Number(order.shipping_fee).toLocaleString()} MMK
                </strong>
              </div>

              <hr>

              <div class="d-flex justify-content-between">
                <h5>Total</h5>
                <h5 class="text-success">
                  ${Number(order.total_amount).toLocaleString()} MMK
                </h5>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-3">Shipping Information</h5>

              <p class="mb-2">
                <i class="fa-solid fa-user text-success me-2"></i>
                ${escapeHtml(order.shipping_name)}
              </p>

              <p class="mb-2">
                <i class="fa-solid fa-phone text-success me-2"></i>
                ${escapeHtml(order.shipping_phone)}
              </p>

              <p class="mb-0">
                <i class="fa-solid fa-location-dot text-success me-2"></i>
                ${escapeHtml(order.shipping_address)}
              </p>

              <hr>

              <h6 class="fw-bold">Payment Method</h6>

              <p class="text-muted">
                ${
                  order.payment_method === "cash_on_delivery"
                    ? "Cash on Delivery"
                    : "Bank Transfer"
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `
      <div class="text-center py-5">
        <div class="alert alert-danger">
          ${escapeHtml(
            error instanceof Error
              ? error.message
              : "Failed to load order details.",
          )}
        </div>

        <a href="/orders" class="btn btn-success mt-3">
          Back to Orders
        </a>
      </div>
    `;
  }
}
