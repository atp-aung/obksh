import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./style.css";
import { apiRequest } from "./services/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface HealthData {
  environment: string;
}

interface DatabaseData {
  database_connected: number;
}

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App element not found");
}

app.innerHTML = `
  <div class="container py-5">
    <div class="text-center mb-5">
      <i class="fa-solid fa-book-open book-icon mb-3"></i>
      <h1 class="fw-bold">Online Book Shop</h1>
      <p class="text-secondary">
        Frontend & Backend Integration
      </p>
    </div>

    <div class="card shadow-sm mx-auto" style="max-width: 550px;">
      <div class="card-body p-4">
        <h5 class="fw-bold mb-4">
          <i class="fa-solid fa-server me-2"></i>
          API Connection Test
        </h5>

        <div class="mb-3">
          <div class="d-flex justify-content-between align-items-center">
            <span>Backend Server</span>
            <span id="server-status" class="badge bg-secondary">
              Checking...
            </span>
          </div>
          <p id="server-message" class="small text-secondary mt-2 mb-0">
            Waiting for response...
          </p>
        </div>

        <hr />

        <div class="mb-4">
          <div class="d-flex justify-content-between align-items-center">
            <span>MySQL Database</span>
            <span id="database-status" class="badge bg-secondary">
              Not tested
            </span>
          </div>
          <p id="database-message" class="small text-secondary mt-2 mb-0">
            Click the button to test database connection.
          </p>
        </div>

        <button id="test-database" class="btn btn-primary w-100">
          <i class="fa-solid fa-database me-2"></i>
          Test Database Connection
        </button>
      </div>
    </div>
  </div>
`;

const serverStatus = document.querySelector<HTMLSpanElement>("#server-status")!;

const serverMessage =
  document.querySelector<HTMLParagraphElement>("#server-message")!;

const databaseStatus =
  document.querySelector<HTMLSpanElement>("#database-status")!;

const databaseMessage =
  document.querySelector<HTMLParagraphElement>("#database-message")!;

const databaseButton =
  document.querySelector<HTMLButtonElement>("#test-database")!;

// Test Backend Server
async function checkServer(): Promise<void> {
  try {
    const result = await apiRequest<ApiResponse<HealthData>>("/health");

    serverStatus.className = "badge bg-success";
    serverStatus.textContent = "Connected";

    serverMessage.textContent = result.message;
  } catch (error) {
    serverStatus.className = "badge bg-danger";
    serverStatus.textContent = "Disconnected";

    serverMessage.textContent =
      error instanceof Error ? error.message : "Unable to connect to server";
  }
}

// Test MySQL Database
async function checkDatabase(): Promise<void> {
  databaseButton.disabled = true;
  databaseButton.innerHTML = `
    <i class="fa-solid fa-spinner fa-spin me-2"></i>
    Testing...
  `;

  try {
    const result = await apiRequest<ApiResponse<DatabaseData[]>>("/db-health");

    databaseStatus.className = "badge bg-success";
    databaseStatus.textContent = "Connected";

    databaseMessage.textContent = result.message;
  } catch (error) {
    databaseStatus.className = "badge bg-danger";
    databaseStatus.textContent = "Failed";

    databaseMessage.textContent =
      error instanceof Error ? error.message : "Database connection failed";
  } finally {
    databaseButton.disabled = false;
    databaseButton.innerHTML = `
      <i class="fa-solid fa-database me-2"></i>
      Test Database Connection
    `;
  }
}

databaseButton.addEventListener("click", checkDatabase);

checkServer();
