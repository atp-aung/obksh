import { register } from "../services/authService";

export function renderRegisterPage(): string {
  return `
    <section class="row justify-content-center py-5">
      <div class="col-md-7 col-lg-6">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4 p-md-5">

            <h2 class="fw-bold text-center mb-2">
              Create Account
            </h2>

            <p class="text-muted text-center mb-4">
              Join Online Book Shop today.
            </p>

            <div
              id="registerMessage"
              class="alert d-none"
              role="alert"
            ></div>

            <form id="registerForm">
              <div class="mb-3">
                <label for="username" class="form-label">
                  Username
                </label>

                <input
                  type="text"
                  id="username"
                  class="form-control"
                  maxlength="100"
                  required
                >
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">
                  Email Address
                </label>

                <input
                  type="email"
                  id="email"
                  class="form-control"
                  maxlength="150"
                  required
                >
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  class="form-control"
                  minlength="8"
                  required
                >
              </div>

              <div class="mb-4">
                <label for="confirmPassword" class="form-label">
                  Confirm Password
                </label>

                <input
                  type="password"
                  id="confirmPassword"
                  class="form-control"
                  minlength="8"
                  required
                >
              </div>

              <button
                type="submit"
                id="registerButton"
                class="btn btn-success w-100"
              >
                Create Account
              </button>
            </form>

            <p class="text-center mt-4 mb-0">
              Already have an account?
              <a href="/login" class="text-success">
                Login
              </a>
            </p>

          </div>
        </div>
      </div>
    </section>
  `;
}

export function setupRegisterPage(): void {
  const form = document.querySelector<HTMLFormElement>("#registerForm");

  const message = document.querySelector<HTMLDivElement>("#registerMessage");

  const button = document.querySelector<HTMLButtonElement>("#registerButton");

  if (!form || !message || !button) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document
      .querySelector<HTMLInputElement>("#username")
      ?.value.trim();

    const email = document
      .querySelector<HTMLInputElement>("#email")
      ?.value.trim();

    const password =
      document.querySelector<HTMLInputElement>("#password")?.value;

    const confirmPassword =
      document.querySelector<HTMLInputElement>("#confirmPassword")?.value;

    if (!username || !email || !password || !confirmPassword) {
      return;
    }

    if (password !== confirmPassword) {
      message.textContent = "Passwords do not match.";
      message.className = "alert alert-danger";
      return;
    }

    button.disabled = true;
    button.textContent = "Creating Account...";

    message.classList.add("d-none");

    try {
      await register({
        username,
        email,
        password,
      });

      form.reset();

      window.location.replace("/login");
    } catch (error) {
      message.textContent =
        error instanceof Error ? error.message : "Registration failed.";

      message.className = "alert alert-danger";

      button.disabled = false;
      button.textContent = "Create Account";
    }
  });
}
