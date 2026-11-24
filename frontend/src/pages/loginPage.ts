export function renderLoginPage(): string {
  return `
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4 p-md-5">

            <div class="text-center mb-4">
              <i class="fa-solid fa-user-circle fa-3x text-success mb-3"></i>
              <h2 class="fw-bold">Welcome Back</h2>
              <p class="text-muted">
                Login to your account
              </p>
            </div>

            <form id="loginForm">
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
                  placeholder="Enter your password"
                  required
                >
              </div>

              <button
                type="submit"
                class="btn btn-success w-100 mt-3"
              >
                <i class="fa-solid fa-right-to-bracket me-2"></i>
                Login
              </button>
            </form>

            <p class="text-center mt-4 mb-0">
              Don't have an account?
              <a href="/register" class="text-success fw-bold">
                Register
              </a>
            </p>

          </div>
        </div>
      </div>
    </div>
  `;
}
