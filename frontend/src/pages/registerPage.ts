export function renderRegisterPage(): string {
  return `
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4 p-md-5">

            <div class="text-center mb-4">
              <i class="fa-solid fa-user-plus fa-3x text-success mb-3"></i>
              <h2 class="fw-bold">Create Account</h2>
              <p class="text-muted">
                Join our Online Book Shop
              </p>
            </div>

            <form id="registerForm">
              <div class="mb-3">
                <label for="username" class="form-label">
                  Username
                </label>

                <input
                  type="text"
                  class="form-control"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
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
                  class="form-control"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
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
                  class="form-control"
                  id="password"
                  name="password"
                  placeholder="At least 8 characters"
                  minlength="8"
                  required
                >
              </div>

              <div class="mb-3">
                <label for="confirmPassword" class="form-label">
                  Confirm Password
                </label>

                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  minlength="8"
                  required
                >
              </div>

              <button
                type="submit"
                class="btn btn-success w-100 mt-3"
              >
                <i class="fa-solid fa-user-plus me-2"></i>
                Register
              </button>
            </form>

            <p class="text-center mt-4 mb-0">
              Already have an account?
              <a href="/login" class="text-success fw-bold">
                Login
              </a>
            </p>

          </div>
        </div>
      </div>
    </div>
  `;
}
