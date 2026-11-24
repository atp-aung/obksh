export function renderAdminDashboardPage(): string {
  return `
    <section>
      <div class="mb-4">
        <h2 class="fw-bold">Admin Dashboard</h2>
        <p class="text-muted mb-0">
          Overview of your online book shop.
        </p>
      </div>

      <div class="row g-4">
        <div class="col-sm-6 col-xl-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between">
                <div>
                  <p class="text-muted mb-2">Total Users</p>
                  <h3 class="fw-bold mb-0">120</h3>
                </div>
                <i class="fa-solid fa-users fa-2x text-primary"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-6 col-xl-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between">
                <div>
                  <p class="text-muted mb-2">Total Books</p>
                  <h3 class="fw-bold mb-0">85</h3>
                </div>
                <i class="fa-solid fa-book fa-2x text-success"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-6 col-xl-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between">
                <div>
                  <p class="text-muted mb-2">Categories</p>
                  <h3 class="fw-bold mb-0">7</h3>
                </div>
                <i class="fa-solid fa-layer-group fa-2x text-info"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-6 col-xl-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between">
                <div>
                  <p class="text-muted mb-2">Total Orders</p>
                  <h3 class="fw-bold mb-0">56</h3>
                </div>
                <i class="fa-solid fa-box fa-2x text-warning"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-6 col-xl-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between">
                <div>
                  <p class="text-muted mb-2">Pending Orders</p>
                  <h3 class="fw-bold mb-0">8</h3>
                </div>
                <i class="fa-solid fa-clock fa-2x text-danger"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-6 col-xl-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between">
                <div>
                  <p class="text-muted mb-2">Total Revenue</p>
                  <h3 class="fw-bold text-success mb-0">
                    2,500,000 MMK
                  </h3>
                </div>
                <i class="fa-solid fa-money-bill-wave fa-2x text-success"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
