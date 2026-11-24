interface OrderItem {
  title: string;
  author: string;
  price: number;
  quantity: number;
}

interface OrderDetails {
  id: number;
  order_number: string;
  created_at: string;
  status: string;
  payment_method: string;
  payment_status: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  items: OrderItem[];
  total_amount: number;
}

// Temporary Sample Data
const sampleOrders: OrderDetails[] = [
  {
    id: 1,
    order_number: "ORD-2026-001",
    created_at: "2026-11-20",
    status: "delivered",
    payment_method: "cash_on_delivery",
    payment_status: "paid",
    shipping_name: "Mg Mg",
    shipping_phone: "09123456789",
    shipping_address: "Yangon, Myanmar",
    items: [
      {
        title: "Clean Code",
        author: "Robert C. Martin",
        price: 25000,
        quantity: 2,
      },
      {
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 18000,
        quantity: 1,
      },
    ],
    total_amount: 68000,
  },
  {
    id: 2,
    order_number: "ORD-2026-002",
    created_at: "2026-11-22",
    status: "processing",
    payment_method: "bank_transfer",
    payment_status: "paid",
    shipping_name: "Mg Mg",
    shipping_phone: "09123456789",
    shipping_address: "Yangon, Myanmar",
    items: [
      {
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        price: 30000,
        quantity: 1,
      },
    ],
    total_amount: 30000,
  },
];

export function renderOrderDetailsPage(orderId: number): string {
  const order = sampleOrders.find((item) => item.id === orderId);

  if (!order) {
    return `
      <div class="text-center py-5">
        <h3>Order Not Found</h3>
        <a href="/orders" class="btn btn-success mt-3">
          Back to Orders
        </a>
      </div>
    `;
  }

  const subtotal = order.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return `
    <section>
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
              <h6 class="fw-bold">${order.order_number}</h6>
            </div>

            <div class="col-md-6">
              <small class="text-muted">Order Date</small>
              <h6>${order.created_at}</h6>
            </div>

            <div class="col-md-6">
              <small class="text-muted">Order Status</small>
              <h6>
                <span class="badge bg-success">
                  ${order.status.toUpperCase()}
                </span>
              </h6>
            </div>

            <div class="col-md-6">
              <small class="text-muted">Payment Status</small>
              <h6>${order.payment_status.toUpperCase()}</h6>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-3">Ordered Books</h5>

              ${order.items
                .map(
                  (item) => `
                <div class="d-flex justify-content-between border-bottom py-3">
                  <div>
                    <h6 class="fw-bold mb-1">${item.title}</h6>
                    <small class="text-muted">${item.author}</small>
                    <p class="small mb-0">
                      ${item.price.toLocaleString()} MMK × ${item.quantity}
                    </p>
                  </div>

                  <strong>
                    ${(item.price * item.quantity).toLocaleString()} MMK
                  </strong>
                </div>
              `,
                )
                .join("")}

              <div class="d-flex justify-content-between mt-3">
                <span>Subtotal</span>
                <strong>${subtotal.toLocaleString()} MMK</strong>
              </div>

              <div class="d-flex justify-content-between mt-2">
                <span>Shipping Fee</span>
                <strong>0 MMK</strong>
              </div>

              <hr>

              <div class="d-flex justify-content-between">
                <h5>Total</h5>
                <h5 class="text-success">
                  ${order.total_amount.toLocaleString()} MMK
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
                ${order.shipping_name}
              </p>

              <p class="mb-2">
                <i class="fa-solid fa-phone text-success me-2"></i>
                ${order.shipping_phone}
              </p>

              <p class="mb-0">
                <i class="fa-solid fa-location-dot text-success me-2"></i>
                ${order.shipping_address}
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
    </section>
  `;
}
