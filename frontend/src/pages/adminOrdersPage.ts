interface AdminOrder {
  id: number;
  order_number: string;
  customer_name: string;
  created_at: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
}

// Temporary Sample Data
const sampleOrders: AdminOrder[] = [
  {
    id: 1,
    order_number: "ORD-2026-001",
    customer_name: "Mg Mg",
    created_at: "2026-11-20",
    total_amount: 68000,
    status: "delivered",
    payment_method: "cash_on_delivery",
    payment_status: "paid",
  },
  {
    id: 2,
    order_number: "ORD-2026-002",
    customer_name: "Aung Aung",
    created_at: "2026-11-22",
    total_amount: 30000,
    status: "processing",
    payment_method: "bank_transfer",
    payment_status: "paid",
  },
  {
    id: 3,
    order_number: "ORD-2026-003",
    customer_name: "Su Su",
    created_at: "2026-11-23",
    total_amount: 25000,
    status: "pending",
    payment_method: "cash_on_delivery",
    payment_status: "pending",
  },
];

function renderOrderStatus(status: string): string {
  const classes: Record<string, string> = {
    pending: "bg-warning text-dark",
    confirmed: "bg-info text-dark",
    processing: "bg-primary",
    shipped: "bg-info",
    delivered: "bg-success",
    cancelled: "bg-danger",
  };

  return `
    <span class="badge ${classes[status] || "bg-secondary"}">
      ${status.toUpperCase()}
    </span>
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

              <tbody>
                ${sampleOrders
                  .map(
                    (order) => `
                  <tr>
                    <td class="fw-bold">
                      ${order.order_number}
                    </td>

                    <td>${order.customer_name}</td>

                    <td>${order.created_at}</td>

                    <td class="text-success fw-bold">
                      ${order.total_amount.toLocaleString()} MMK
                    </td>

                    <td>
                      ${renderOrderStatus(order.status)}
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
    </section>
  `;
}
