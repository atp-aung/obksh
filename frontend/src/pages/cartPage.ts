interface CartItem {
  id: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
  image_url: string;
}

// Temporary Sample Data
const sampleCartItems: CartItem[] = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    price: 25000,
    quantity: 2,
    image_url: "https://placehold.co/100x120?text=Clean+Code",
  },
  {
    id: 2,
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 18000,
    quantity: 1,
    image_url: "https://placehold.co/100x120?text=The+Alchemist",
  },
];

export function renderCartPage(): string {
  const subtotal = sampleCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return `
    <section>
      <h2 class="fw-bold mb-4">
        <i class="fa-solid fa-cart-shopping text-success me-2"></i>
        Shopping Cart
      </h2>

      <div class="row g-4">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              ${sampleCartItems
                .map(
                  (item) => `
                  <div class="row align-items-center border-bottom py-3">
                    <div class="col-3 col-md-2">
                      <img
                        src="${item.image_url}"
                        alt="${item.title}"
                        class="img-fluid rounded cart-item-image"
                      >
                    </div>

                    <div class="col-9 col-md-4">
                      <h6 class="fw-bold mb-1">${item.title}</h6>
                      <small class="text-muted">${item.author}</small>
                    </div>

                    <div class="col-5 col-md-2 mt-3 mt-md-0">
                      ${item.price.toLocaleString()} MMK
                    </div>

                    <div class="col-3 col-md-2 mt-3 mt-md-0">
                      <input
                        type="number"
                        class="form-control"
                        value="${item.quantity}"
                        min="1"
                        disabled
                      >
                    </div>

                    <div class="col-4 col-md-2 mt-3 mt-md-0 text-end">
                      <strong>
                        ${(item.price * item.quantity).toLocaleString()}
                      </strong>
                    </div>
                  </div>
                `,
                )
                .join("")}
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-4">Order Summary</h5>

              <div class="d-flex justify-content-between mb-3">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()} MMK</span>
              </div>

              <div class="d-flex justify-content-between mb-3">
                <span>Shipping Fee</span>
                <span>0 MMK</span>
              </div>

              <hr>

              <div class="d-flex justify-content-between fw-bold mb-4">
                <span>Total</span>
                <span class="text-success">
                  ${subtotal.toLocaleString()} MMK
                </span>
              </div>

              <a href="/checkout" class="btn btn-success w-100">
                Proceed to Checkout
                <i class="fa-solid fa-arrow-right ms-2"></i>
              </a>

              <a href="/books" class="btn btn-outline-secondary w-100 mt-2">
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
