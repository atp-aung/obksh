import { createNavbar } from "../components/navbar";

// Create Main Layout
export function createMainLayout(content: HTMLElement): HTMLElement {
  const layout = document.createElement("div");

  layout.className = "min-vh-100 d-flex flex-column";

  // Navbar
  layout.appendChild(createNavbar());

  // Main Content
  const main = document.createElement("main");

  main.className = "flex-grow-1";
  main.appendChild(content);

  layout.appendChild(main);

  // Footer
  const footer = document.createElement("footer");

  footer.className = "bg-dark text-white text-center py-3";

  footer.innerHTML = `
    <div class="container">
      <p class="mb-0">
        &copy; ${new Date().getFullYear()}
        Online Book Shop. All rights reserved.
      </p>
    </div>
  `;

  layout.appendChild(footer);

  return layout;
}
