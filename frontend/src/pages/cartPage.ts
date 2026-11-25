import {
  getCart,
  updateCartQuantity,
  removeCartItem,
  clearCart,
} from "../services/cartService";

import type { CartItem } from "../services/cartService";

// Render Cart Page
export function renderCartPage(): string {
  return `
    <section>
      <h2 class="fw-bold mb-4">
        <i class="fa-solid fa-cart-shopping text-success me-2"></i>
        Shopping Cart
      </h2>

      <div id="cartContainer">
        <div class="text-center py-5">
          <div class="spinner-border text-success"></div>
          <p class="text-muted mt-2">Loading cart...</p>
        </div>
      </div>

      <p id="cartError" class="alert alert-danger d-none"></p>
    </section>
  `;
}

// Setup Cart Page
export async function setupCartPage(): Promise<void> {
  const container = document.querySelector<HTMLDivElement>("#cartContainer");

  const errorMessage =
    document.querySelector<HTMLParagraphElement>("#cartError");

  if (!container || !errorMessage) return;

  try {
    const cartItems = await getCart();

    renderCartItems(cartItems);
  } catch (error) {
    container.innerHTML = "";

    errorMessage.textContent =
      error instanceof Error ? error.message : "Failed to load cart.";

    errorMessage.classList.remove("d-none");
  }

  function renderCartItems(items: CartItem[]): void {
    const cartContainer =
      document.querySelector<HTMLDivElement>("#cartContainer");

    if (!cartContainer) return;

    const currentErrorMessage =
      document.querySelector<HTMLParagraphElement>("#cartError");

    currentErrorMessage?.classList.add("d-none");

    if (items.length === 0) {
      cartContainer.innerHTML = `
        <div class="card border-0 shadow-sm">
          <div class="card-body text-center py-5">
            <i class="fa-solid fa-cart-shopping fa-3x text-muted mb-3"></i>
            <h5 class="fw-bold">Your Cart is Empty</h5>
            <p class="text-muted">
              Browse our books and add your favorites.
            </p>
            <a href="/books" class="btn btn-success">
              Browse Books
            </a>
          </div>
        </div>
      `;
      return;
    }

    const subtotal = items.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0,
    );

    cartContainer.innerHTML = `
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              ${items
                .map(
                  (item) => `
                <div class="row align-items-center border-bottom py-3">
                  <div class="col-3 col-md-2">
                    <img
                      src="${escapeHtml(item.image_url || "https://placehold.co/100x120?text=Book")}"
                      alt="${escapeHtml(item.title)}"
                      class="img-fluid rounded cart-item-image"
                    >
                  </div>

                  <div class="col-9 col-md-4">
                    <h6 class="fw-bold mb-1">
                      ${escapeHtml(item.title)}
                    </h6>
                    <small class="text-muted">
                      ${escapeHtml(item.author)}
                    </small>
                  </div>

                  <div class="col-5 col-md-2 mt-3 mt-md-0">
                    ${Number(item.price).toLocaleString()} MMK
                  </div>

                  <div class="col-4 col-md-2 mt-3 mt-md-0">
                    <input
                      type="number"
                      class="form-control cart-quantity"
                      data-id="${item.id}"
                      value="${item.quantity}"
                      min="1"
                      max="${item.stock}"
                    >
                  </div>

                  <div class="col-3 col-md-2 mt-3 mt-md-0 text-end">
                    <strong>
                      ${(Number(item.price) * item.quantity).toLocaleString()}
                    </strong>

                    <button
                      type="button"
                      class="btn btn-sm btn-outline-danger mt-2 remove-cart-item"
                      data-id="${item.id}"
                      title="Remove item"
                    >
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              `,
                )
                .join("")}
            </div>

            <div class="card-footer bg-white text-end">
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                id="clearCartButton"
              >
                <i class="fa-solid fa-trash me-1"></i>
                Clear Cart
              </button>
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
    `;

    // Update Quantity
    cartContainer
      .querySelectorAll<HTMLInputElement>(".cart-quantity")
      .forEach((input) => {
        input.addEventListener("change", async () => {
          const id = Number(input.dataset.id);
          const quantity = Number(input.value);

          const item = items.find((cartItem) => cartItem.id === id);

          if (
            !item ||
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > item.stock
          ) {
            alert("Please enter a valid quantity.");
            input.value = String(item?.quantity ?? 1);
            return;
          }

          try {
            await updateCartQuantity(id, quantity);
            await setupCartPage();
          } catch (error) {
            alert(
              error instanceof Error
                ? error.message
                : "Failed to update quantity.",
            );
            await setupCartPage();
          }
        });
      });

    // Remove Cart Item
    cartContainer
      .querySelectorAll<HTMLButtonElement>(".remove-cart-item")
      .forEach((button) => {
        button.addEventListener("click", async () => {
          const id = Number(button.dataset.id);

          if (!confirm("Remove this book from your cart?")) return;

          try {
            await removeCartItem(id);
            await setupCartPage();
          } catch (error) {
            alert(
              error instanceof Error ? error.message : "Failed to remove item.",
            );
          }
        });
      });

    // Clear Cart
    const clearButton =
      cartContainer.querySelector<HTMLButtonElement>("#clearCartButton");

    clearButton?.addEventListener("click", async () => {
      if (!confirm("Are you sure you want to clear your cart?")) return;

      try {
        await clearCart();
        await setupCartPage();
      } catch (error) {
        alert(error instanceof Error ? error.message : "Failed to clear cart.");
      }
    });
  }
}

// Escape HTML
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
