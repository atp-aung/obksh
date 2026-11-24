export function renderCheckoutPage(): string {
  return `
    <section>
      <h2 class="fw-bold mb-4">
        <i class="fa-solid fa-credit-card text-success me-2"></i>
        Checkout
      </h2>

      <div class="row g-4">
        <!-- Shipping Information -->
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">

              <h5 class="fw-bold mb-4">
                Shipping Information
              </h5>

              <form id="checkoutForm">
                <div class="mb-3">
                  <label for="shippingName" class="form-label">
                    Full Name
                  </label>

                  <input
                    type="text"
                    class="form-control"
                    id="shippingName"
                    name="shippingName"
                    placeholder="Enter your full name"
                    maxlength="150"
                    required
                  >
                </div>

                <div class="mb-3">
                  <label for="shippingPhone" class="form-label">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    class="form-control"
                    id="shippingPhone"
                    name="shippingPhone"
                    placeholder="Enter your phone number"
                    maxlength="30"
                    required
                  >
                </div>

                <div class="mb-4">
                  <label for="shippingAddress" class="form-label">
                    Shipping Address
                  </label>

                  <textarea
                    class="form-control"
                    id="shippingAddress"
                    name="shippingAddress"
                    rows="4"
                    placeholder="Enter your complete address"
                    required
                  ></textarea>
                </div>

                <hr>

                <h5 class="fw-bold mb-3">
                  Payment Method
                </h5>

                <div class="form-check border rounded p-3 mb-3">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="cashOnDelivery"
                    value="cash_on_delivery"
                    checked
                  >

                  <label
                    class="form-check-label ms-2"
                    for="cashOnDelivery"
                  >
                    <i class="fa-solid fa-money-bill-wave me-2 text-success"></i>
                    Cash on Delivery
                  </label>
                </div>

                <div class="form-check border rounded p-3 mb-4">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="bankTransfer"
                    value="bank_transfer"
                  >

                  <label
                    class="form-check-label ms-2"
                    for="bankTransfer"
                  >
                    <i class="fa-solid fa-building-columns me-2 text-success"></i>
                    Bank Transfer
                  </label>
                </div>

                <button
                  type="submit"
                  class="btn btn-success btn-lg w-100"
                >
                  Place Order
                  <i class="fa-solid fa-check ms-2"></i>
                </button>
              </form>

            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-4">Order Summary</h5>

              <div class="d-flex justify-content-between mb-3">
                <span>Clean Code x 2</span>
                <span>50,000 MMK</span>
              </div>

              <div class="d-flex justify-content-between mb-3">
                <span>The Alchemist x 1</span>
                <span>18,000 MMK</span>
              </div>

              <hr>

              <div class="d-flex justify-content-between mb-3">
                <span>Subtotal</span>
                <span>68,000 MMK</span>
              </div>

              <div class="d-flex justify-content-between mb-3">
                <span>Shipping Fee</span>
                <span>0 MMK</span>
              </div>

              <hr>

              <div class="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span class="text-success">
                  68,000 MMK
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  `;
}
