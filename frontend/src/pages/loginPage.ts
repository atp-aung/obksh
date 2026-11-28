import { login } from "../services/authService";

export function renderLoginPage(): string {
  return `
    <section class="row justify-content-center py-5">
      <div class="col-md-6 col-lg-5">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4 p-md-5">

            <h2 class="fw-bold text-center mb-2">
              Login
            </h2>

            <p class="text-muted text-center mb-4">
              Welcome back to Online Book Shop.
            </p>

            <div
              id="loginMessage"
              class="alert d-none"
              role="alert"
            ></div>

            <form id="loginForm">
              <div class="mb-3">
                <label for="email" class="form-label">
                  Email Address
                </label>

                <input
                  type="email"
                  id="email"
                  class="form-control"
                  required
                >
              </div>

              <div class="mb-4">
                <label for="password" class="form-label">
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  class="form-control"
                  required
                >
              </div>

              <button
                type="submit"
                id="loginButton"
                class="btn btn-success w-100"
              >
                Login
              </button>
            </form>

            <p class="text-center mt-4 mb-0">
              Don't have an account?
              <a href="/register" class="text-success">
                Register
              </a>
            </p>

          </div>
        </div>
      </div>
    </section>
  `;
}

export function setupLoginPage(): void {
  const form = document.querySelector<HTMLFormElement>("#loginForm");

  const message = document.querySelector<HTMLDivElement>("#loginMessage");

  const button = document.querySelector<HTMLButtonElement>("#loginButton");

  if (!form || !message || !button) return;

  // Clear previous form data
  form.reset();

  // Clear password when page is restored from browser cache
  window.addEventListener("pageshow", () => {
    form.reset();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document
      .querySelector<HTMLInputElement>("#email")
      ?.value.trim();

    const password =
      document.querySelector<HTMLInputElement>("#password")?.value;

    if (!email || !password) return;

    button.disabled = true;
    button.textContent = "Logging in...";

    message.classList.add("d-none");

    try {
      const user = await login({ email, password });

      form.reset();

      window.location.replace(user.role === "admin" ? "/admin" : "/");
    } catch (error) {
      message.textContent =
        error instanceof Error ? error.message : "Login failed.";

      message.className = "alert alert-danger";

      button.disabled = false;
      button.textContent = "Login";
    }
  });
}
