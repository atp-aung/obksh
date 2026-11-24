import { renderAdminNavbar } from "../components/adminNavbar";

export function createAdminLayout(content: HTMLElement): HTMLElement {
  const layout = document.createElement("div");

  layout.className = "min-vh-100 d-flex flex-column";

  layout.innerHTML = `
    ${renderAdminNavbar()}

    <main class="container-fluid px-4 py-4 flex-grow-1">
      <div id="adminPageContent"></div>
    </main>

    <footer class="bg-dark text-white text-center py-3">
      <small>
        &copy; 2026 Online Book Shop Admin Panel
      </small>
    </footer>
  `;

  const contentContainer =
    layout.querySelector<HTMLDivElement>("#adminPageContent");

  if (contentContainer) {
    contentContainer.replaceChildren(content);
  }

  return layout;
}
