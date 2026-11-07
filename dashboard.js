(() => {
  "use strict";

  const statistics = [
    { label: "Website Views", value: "245" },
    { label: "Menu Items", value: "12" },
    { label: "Gallery Photos", value: "18" },
    { label: "QR Scans", value: "54" }
  ];

  const menuItems = [
    { name: "Chicken Pilau", category: "Rice Specials", price: "K95", status: "Available", image: "assets/seasoned-pilau-rice.jpg" },
    { name: "Zambian Feast", category: "Traditional", price: "K150", status: "Available", image: "assets/complete-zambian-platter.jpg" },
    { name: "Flame-Grilled Chicken", category: "Fast Food", price: "K85", status: "Available", image: "assets/flame-grilled-quarter-chicken.jpg" },
    { name: "Bream & Nshima", category: "Traditional", price: "K120", status: "Available", image: "assets/bream-nshima-express-pack.jpg" },
    { name: "Golden Fries", category: "Sides", price: "K35", status: "Available", image: "assets/golden-fries.jpg" },
    { name: "Strawberry Shake", category: "Drinks", price: "K45", status: "Available", image: "assets/strawberry-shake.jpg" }
  ];

  const galleryImages = [
    { name: "Zambian platter", image: "assets/complete-zambian-platter.jpg" },
    { name: "Bream express pack", image: "assets/bream-nshima-express-pack.jpg" },
    { name: "Grilled chicken", image: "assets/flame-grilled-quarter-chicken.jpg" },
    { name: "Chicken pilau", image: "assets/seasoned-pilau-rice.jpg" },
    { name: "Golden fries", image: "assets/golden-fries.jpg" },
    { name: "Strawberry shake", image: "assets/strawberry-shake.jpg" },
    { name: "Fried bream", image: "assets/fried-bream-traditional-platter.jpg" },
    { name: "Mixed grill", image: "assets/grilled-mixed-feast.jpg" },
    { name: "Chicken wrap", image: "assets/roast-chicken-wrap.jpg" },
    { name: "Cold drinks", image: "assets/budweiser-cold-bucket.jpg" },
    { name: "Premium beers", image: "assets/imported-premium-beer-lineup.jpg" },
    { name: "Local platter", image: "assets/complete-zambian-platter.jpg" },
    { name: "Bream and nshima", image: "assets/fried-bream-traditional-platter.jpg" },
    { name: "Pilau special", image: "assets/seasoned-pilau-rice.jpg" },
    { name: "Grilled feast", image: "assets/grilled-mixed-feast.jpg" },
    { name: "Chicken meal", image: "assets/flame-grilled-quarter-chicken.jpg" },
    { name: "Fresh wrap", image: "assets/roast-chicken-wrap.jpg" },
    { name: "Chilled beverage", image: "assets/strawberry-shake.jpg" }
  ];

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function renderStatistics() {
    const target = document.querySelector("[data-statistics]");
    if (!target) return;

    statistics.forEach(statistic => {
      const card = createElement("article", "value-card dashboard-stat-card");
      card.append(createElement("p", "", statistic.label), createElement("strong", "", statistic.value));
      target.append(card);
    });
  }

  function createActionButton(label, action, className) {
    const button = createElement("button", `button button-outline ${className || ""}`.trim(), label);
    button.type = "button";
    button.dataset.itemAction = action;
    return button;
  }

  function renderMenu() {
    const target = document.querySelector("[data-menu-items]");
    if (!target) return;

    menuItems.forEach(item => {
      const row = document.createElement("tr");
      const imageCell = document.createElement("td");
      const image = createElement("img", "dashboard-table-image");
      image.src = item.image;
      image.alt = "";
      image.loading = "lazy";
      imageCell.append(image);

      const nameCell = createElement("td", "", item.name);
      const categoryCell = createElement("td", "", item.category);
      const priceCell = createElement("td", "", item.price);
      const statusCell = document.createElement("td");
      statusCell.append(createElement("span", "dashboard-status", item.status));
      const actionsCell = document.createElement("td");
      const actions = createElement("div", "dashboard-table-actions");
      actions.append(createActionButton("Edit", "edit"), createActionButton("Delete", "delete"));
      actionsCell.append(actions);
      row.append(imageCell, nameCell, categoryCell, priceCell, statusCell, actionsCell);
      target.append(row);
    });
  }

  function renderGallery() {
    const target = document.querySelector("[data-gallery-items]");
    if (!target) return;

    galleryImages.forEach(item => {
      const card = createElement("article", "dashboard-gallery-card");
      const image = createElement("img", "dashboard-gallery-image");
      image.src = item.image;
      image.alt = item.name;
      image.loading = "lazy";

      const actions = createElement("div", "dashboard-gallery-actions");
      actions.append(createActionButton("Replace", "replace"), createActionButton("Delete", "delete"));
      card.append(image, actions);
      target.append(card);
    });
  }

  function setupPreviewActions() {
    document.addEventListener("click", event => {
      const actionButton = event.target.closest("[data-preview-action], [data-item-action]");
      if (!actionButton) return;

      const message = actionButton.dataset.previewAction ||
        `${actionButton.textContent.trim()} is a preview-only action. Changes are not saved.`;
      const notice = actionButton.closest("#menu-management")
        ? document.querySelector("[data-menu-notice]")
        : actionButton.closest("#gallery-management")
          ? document.querySelector("[data-gallery-notice]")
          : document.querySelector("[data-dashboard-notice]");

      if (notice) {
        notice.textContent = message;
        notice.hidden = false;
      }
    });

    const settingsForm = document.querySelector("[data-settings-form]");
    const settingsNotice = document.querySelector("[data-settings-notice]");
    settingsForm?.addEventListener("submit", event => {
      event.preventDefault();
      if (settingsNotice) {
        settingsNotice.textContent = "Preview only — settings were not saved.";
      }
    });
  }

  function setupSidebar() {
    const sidebar = document.querySelector("#dashboard-sidebar");
    const toggle = document.querySelector("[data-sidebar-toggle]");
    const backdrop = document.querySelector("[data-sidebar-backdrop]");
    const closeButton = document.querySelector("[data-sidebar-close]");
    if (!sidebar || !toggle || !backdrop || !closeButton) return;

    const mobile = window.matchMedia("(max-width: 1080px)");

    function closeSidebar() {
      if (sidebar.contains(document.activeElement)) {
        toggle.focus({ preventScroll: true });
      }
      sidebar.classList.remove("open");
      sidebar.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open dashboard navigation");
      backdrop.hidden = true;
    }

    function syncViewport() {
      if (!mobile.matches) {
        sidebar.classList.remove("open");
        sidebar.setAttribute("aria-hidden", "false");
        toggle.setAttribute("aria-expanded", "false");
        backdrop.hidden = true;
      } else {
        closeSidebar();
      }
    }

    toggle.addEventListener("click", () => {
      const isOpen = sidebar.classList.toggle("open");
      sidebar.setAttribute("aria-hidden", String(!isOpen));
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close dashboard navigation" : "Open dashboard navigation");
      backdrop.hidden = !isOpen;
    });
    closeButton.addEventListener("click", closeSidebar);
    backdrop.addEventListener("click", closeSidebar);
    sidebar.querySelectorAll(".dashboard-nav-link[href]").forEach(link => {
      link.addEventListener("click", () => {
        sidebar.querySelectorAll(".dashboard-nav-link[href]").forEach(navLink => {
          navLink.classList.toggle("active", navLink === link);
          if (navLink === link) navLink.setAttribute("aria-current", "page");
          else navLink.removeAttribute("aria-current");
        });
        if (mobile.matches) closeSidebar();
      });
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && mobile.matches) closeSidebar();
    });
    mobile.addEventListener("change", syncViewport);
    syncViewport();
  }

  function init() {
    renderStatistics();
    renderMenu();
    renderGallery();
    setupPreviewActions();
    setupSidebar();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
