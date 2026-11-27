import { getCart } from "../services/cartService";
import type { CartItem } from "../services/cartService";
import { checkout, type CheckoutInput } from "../services/orderService";

export function renderCheckoutPage(): string {
  return `
    <section>
      <h2 class="fw-bold mb-4">
        <i class="fa-solid fa-credit-card text-success me-2"></i>
        Checkout
      </h2>

      <div id="checkoutMessage"></div>

      <div class="row g-4">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-4">Shipping Information</h5>

              <form id="checkoutForm">
                <div class="mb-3">
                  <label class="form-label">Full Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="shippingName"
                    maxlength="150"
                    required
                  >
                </div>

                <div class="mb-3">
                  <label class="form-label">Phone Number</label>
                  <input
                    type="tel"
                    class="form-control"
                    id="shippingPhone"
                    maxlength="30"
                    required
                  >
                </div>

                <div class="mb-4">
                  <label class="form-label">Shipping Address</label>
                  <textarea
                    class="form-control"
                    id="shippingAddress"
                    rows="3"
                    required
                  ></textarea>
                </div>

                <h5 class="fw-bold mb-3">Payment Method</h5>

                <div class="form-check mb-2">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="codPayment"
                    value="cash_on_delivery"
                    checked
                  >
                  <label class="form-check-label" for="codPayment">
                    Cash on Delivery
                  </label>
                </div>

                <div class="form-check mb-4">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="bankPayment"
                    value="bank_transfer"
                  >
                  <label class="form-check-label" for="bankPayment">
                    Bank Transfer
                  </label>
                </div>

                <button
                  type="submit"
                  class="btn btn-success w-100"
                  id="placeOrderButton"
                  disabled
                >
                  Place Order
                </button>
              </form>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-3">Order Summary</h5>

              <div id="checkoutItems">
                <p class="text-muted">Loading cart...</p>
              </div>

              <hr>

              <div class="d-flex justify-content-between fw-bold">
                <span>Subtotal</span>
                <span id="checkoutSubtotal">0 MMK</span>
              </div>

              <div class="d-flex justify-content-between mt-2">
                <span>Shipping Fee</span>
                <span>0 MMK</span>
              </div>

              <hr>

              <div class="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span class="text-success" id="checkoutTotal">
                  0 MMK
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export async function setupCheckoutPage(): Promise<void> {
  const form = document.querySelector<HTMLFormElement>("#checkoutForm");

  const message = document.querySelector<HTMLDivElement>("#checkoutMessage");

  const button = document.querySelector<HTMLButtonElement>("#placeOrderButton");

  if (!form || !message || !button) return;

  let cartItems: CartItem[] = [];

  try {
    cartItems = await getCart();

    if (cartItems.length === 0) {
      document.querySelector("#checkoutItems")!.innerHTML = `
        <p class="text-muted">Your cart is empty.</p>
        <a href="/books" class="btn btn-outline-success btn-sm">
          Browse Books
        </a>
      `;
      return;
    }

    const subtotal = cartItems.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0,
    );

    const itemsContainer =
      document.querySelector<HTMLDivElement>("#checkoutItems");

    if (itemsContainer) {
      itemsContainer.innerHTML = cartItems
        .map(
          (item) => `
        <div class="d-flex justify-content-between mb-3">
          <div>
            <div class="fw-semibold">${escapeHtml(item.title)}</div>
            <small class="text-muted">
              ${item.quantity} × ${Number(item.price).toLocaleString()} MMK
            </small>
          </div>
          <span>
            ${(Number(item.price) * item.quantity).toLocaleString()} MMK
          </span>
        </div>
      `,
        )
        .join("");
    }

    document.querySelector("#checkoutSubtotal")!.textContent =
      `${subtotal.toLocaleString()} MMK`;

    document.querySelector("#checkoutTotal")!.textContent =
      `${subtotal.toLocaleString()} MMK`;

    button.disabled = false;
  } catch (error) {
    message.innerHTML = `
      <div class="alert alert-danger">
        ${escapeHtml(
          error instanceof Error ? error.message : "Failed to load cart.",
        )}
      </div>
    `;
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const paymentMethod = form.querySelector<HTMLInputElement>(
      'input[name="paymentMethod"]:checked',
    );

    if (!paymentMethod) return;

    const input: CheckoutInput = {
      shipping_name: document
        .querySelector<HTMLInputElement>("#shippingName")!
        .value.trim(),
      shipping_phone: document
        .querySelector<HTMLInputElement>("#shippingPhone")!
        .value.trim(),
      shipping_address: document
        .querySelector<HTMLTextAreaElement>("#shippingAddress")!
        .value.trim(),
      payment_method: paymentMethod.value as CheckoutInput["payment_method"],
    };

    try {
      button.disabled = true;
      button.textContent = "Processing Order...";

      const order = await checkout(input);

      window.location.replace(`/orders/${order.order_id}`);
    } catch (error) {
      message.innerHTML = `
        <div class="alert alert-danger">
          ${escapeHtml(
            error instanceof Error ? error.message : "Failed to place order.",
          )}
        </div>
      `;

      button.disabled = false;
      button.textContent = "Place Order";
    }
  });
}

function escapeHtml(value: string | null): string {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });
}
