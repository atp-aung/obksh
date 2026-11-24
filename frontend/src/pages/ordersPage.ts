interface Order {
  id: number;
  order_number: string;
  created_at: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
}

const sampleOrders: Order[] = [
  {
    id: 1,
    order_number: "ORD-2026-001",
    created_at: "2026-11-20",
    total_amount: 68000,
    status: "delivered",
    payment_method: "cash_on_delivery",
    payment_status: "paid",
  },
  {
    id: 2,
    order_number: "ORD-2026-002",
    created_at: "2026-11-22",
    total_amount: 30000,
    status: "processing",
    payment_method: "bank_transfer",
    payment_status: "paid",
  },
  {
    id: 3,
    order_number: "ORD-2026-003",
    created_at: "2026-11-23",
    total_amount: 25000,
    status: "pending",
    payment_method: "cash_on_delivery",
    payment_status: "pending",
  },
];

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
      ${status.charAt(0).toUpperCase() + status.slice(1)}
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
                ${sampleOrders
                  .map(
                    (order) => `
                  <tr>
                    <td class="p-3 fw-bold">
                      ${order.order_number}
                    </td>

                    <td>${order.created_at}</td>

                    <td class="text-success fw-bold">
                      ${order.total_amount.toLocaleString()} MMK
                    </td>

                    <td>${getStatusBadge(order.status)}</td>

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
    </section>
  `;
}
