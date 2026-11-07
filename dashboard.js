(() => {
  "use strict";

  const body = document.body;
  const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]")?.value || "";
  const stateNode = document.getElementById("dashboard-data");
  const state = stateNode ? JSON.parse(stateNode.textContent) : {};
  const menuUrl = body.dataset.menuUrl;
  const galleryUrl = body.dataset.galleryUrl;
  let draggedMenuId = null;
  let draggedGalleryId = null;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function notice(selector, message, isError = false) {
    const target = document.querySelector(selector);
    if (!target) return;
    target.textContent = message;
    target.hidden = false;
    target.classList.toggle("dashboard-error", isError);
  }

  async function request(url, options = {}) {
    const response = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "X-CSRFToken": csrfToken,
        ...(options.json ? { "Content-Type": "application/json" } : {})
      },
      body: options.json ? JSON.stringify(options.json) : options.body,
      credentials: "same-origin"
    });
    const data = response.headers.get("content-type")?.includes("application/json")
      ? await response.json()
      : null;
    if (!response.ok) {
      const error = new Error(data?.error || `Request failed (${response.status}).`);
      error.data = data;
      throw error;
    }
    return data;
  }

  function messageError(selector, error) {
    console.error(error);
    notice(selector, error.message || "The change could not be saved.", true);
  }

  function renderCategories() {
    const select = document.querySelector("#menu-category");
    const list = document.querySelector("[data-categories]");
    if (select) {
      const selected = select.value;
      select.replaceChildren();
      state.categories.forEach(category => {
        const option = element("option", "", category.name);
        option.value = category.id;
        select.append(option);
      });
      if (state.categories.some(category => String(category.id) === selected)) select.value = selected;
    }
    if (list) {
      list.replaceChildren();
      state.categories.forEach(category => {
        const chip = element("span", "dashboard-category-chip", category.name);
        const remove = element("button", "", "×");
        remove.type = "button";
        remove.setAttribute("aria-label", `Delete category ${category.name}`);
        remove.addEventListener("click", async () => {
          try {
            await request(`/dashboard/api/categories/${category.id}/delete/`, { method: "POST" });
            state.categories = state.categories.filter(entry => entry.id !== category.id);
            renderCategories();
          } catch (error) {
            notice("[data-category-notice]", error.message, true);
          }
        });
        chip.append(remove);
        list.append(chip);
      });
    }
  }

  function renderMenu() {
    const target = document.querySelector("[data-menu-items]");
    if (!target) return;
    target.replaceChildren();
    state.menu.forEach(item => {
      const row = document.createElement("tr");
      row.draggable = true;
      row.dataset.menuRow = item.id;
      row.addEventListener("dragstart", () => { draggedMenuId = item.id; });
      row.addEventListener("dragover", event => event.preventDefault());
      row.addEventListener("drop", async event => {
        event.preventDefault();
        await reorderMenu(draggedMenuId, item.id);
      });
      const imageCell = document.createElement("td");
      if (item.image) {
        const image = element("img", "dashboard-table-image");
        image.src = item.image;
        image.alt = item.name;
        image.loading = "lazy";
        imageCell.append(image);
      } else imageCell.textContent = "—";
      const nameCell = element("td", "", item.name);
      if (item.specialOffer) nameCell.append(element("span", "dashboard-tag", "Special offer"));
      const actions = element("div", "dashboard-table-actions");
      const edit = element("button", "button button-outline button-small", "Edit");
      edit.type = "button";
      edit.dataset.menuEdit = item.id;
      const remove = element("button", "button button-outline button-small", "Delete");
      remove.type = "button";
      remove.dataset.menuDelete = item.id;
      actions.append(edit, remove);
      const status = element(
        "span",
        `dashboard-status${item.available ? "" : " unavailable"}`,
        item.available ? "Available" : "Unavailable"
      );
      row.append(
        imageCell,
        nameCell,
        element("td", "", item.category_name),
        element("td", "", `K${Number(item.price).toLocaleString()}`),
        element("td", "").appendChild(status).parentElement,
        element("td", "").appendChild(actions).parentElement
      );
      target.append(row);
    });
    notice("[data-menu-notice]", `${state.menu.length} menu item${state.menu.length === 1 ? "" : "s"}.`);
  }

  function openMenuForm(item = null) {
    const form = document.querySelector("[data-menu-form]");
    if (!form) return;
    form.reset();
    form.elements.id.value = item?.id || "";
    form.elements.name.value = item?.name || "";
    form.elements.category.value = item?.category || state.categories[0]?.id || "";
    form.elements.price.value = item?.price || "";
    form.elements.description.value = item?.description || "";
    form.elements.available.checked = item?.available !== false;
    form.elements.special_offer.checked = Boolean(item?.specialOffer);
    form.elements.featured.checked = Boolean(item?.featured);
    form.querySelector("[data-menu-form-title]").textContent = item ? "Edit menu item" : "Add menu item";
    form.hidden = false;
    form.elements.name.focus();
  }

  async function saveMenuOrder() {
    await request(document.body.dataset.menuReorderUrl, {
      method: "POST",
      json: { ids: state.menu.map(item => item.id) }
    });
  }

  async function reorderMenu(fromId, toId) {
    if (!fromId || fromId === toId) return;
    const from = state.menu.findIndex(item => item.id === fromId);
    const to = state.menu.findIndex(item => item.id === toId);
    if (from < 0 || to < 0) return;
    state.menu.splice(to, 0, state.menu.splice(from, 1)[0]);
    try {
      await saveMenuOrder();
      renderMenu();
    } catch (error) {
      messageError("[data-menu-notice]", error);
    }
  }

  function bindMenu() {
    const form = document.querySelector("[data-menu-form]");
    document.querySelector("[data-menu-add]")?.addEventListener("click", () => openMenuForm());
    document.querySelector("[data-menu-cancel]")?.addEventListener("click", () => { form.hidden = true; });
    document.querySelector("[data-menu-items]")?.addEventListener("click", async event => {
      const edit = event.target.closest("[data-menu-edit]");
      if (edit) openMenuForm(state.menu.find(item => item.id === Number(edit.dataset.menuEdit)));
      const remove = event.target.closest("[data-menu-delete]");
      if (!remove || !window.confirm("Delete this menu item?")) return;
      try {
        await request(`${menuUrl}${remove.dataset.menuDelete}/delete/`, { method: "POST" });
        state.menu = state.menu.filter(item => item.id !== Number(remove.dataset.menuDelete));
        renderMenu();
      } catch (error) {
        messageError("[data-menu-notice]", error);
      }
    });
    form?.addEventListener("submit", async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      try {
        const saved = await request(menuUrl, { method: "POST", body: new FormData(form) });
        const index = state.menu.findIndex(item => item.id === saved.item.id);
        if (index < 0) state.menu.push(saved.item);
        else state.menu[index] = saved.item;
        form.hidden = true;
        renderMenu();
        notice("[data-menu-notice]", "Menu item saved and published.");
      } catch (error) {
        messageError("[data-menu-notice]", error);
        const errors = error.data?.errors || {};
        Object.entries(errors).forEach(([field, entries]) => {
          notice("[data-menu-notice]", `${field}: ${entries.map(entry => entry.message).join(" ")}`, true);
        });
      }
    });
    const categoryForm = document.querySelector("[data-category-form]");
    categoryForm?.addEventListener("submit", async event => {
      event.preventDefault();
      try {
        const name = categoryForm.elements.name.value.trim();
        const result = await request(document.body.dataset.categoryUrl, {
          method: "POST",
          json: { name }
        });
        state.categories.push(result.category);
        categoryForm.reset();
        renderCategories();
        notice("[data-category-notice]", "Category added.");
      } catch (error) {
        notice("[data-category-notice]", error.message, true);
      }
    });
  }

  function renderGallery() {
    const target = document.querySelector("[data-gallery-items]");
    if (!target) return;
    target.replaceChildren();
    state.gallery.forEach((photo, index) => {
      const card = element("article", "dashboard-gallery-card");
      card.draggable = true;
      card.dataset.galleryCard = photo.id;
      card.addEventListener("dragstart", () => { draggedGalleryId = photo.id; });
      card.addEventListener("dragover", event => event.preventDefault());
      card.addEventListener("drop", async event => {
        event.preventDefault();
        await reorderGallery(draggedGalleryId, photo.id);
      });
      const image = element("img", "dashboard-gallery-image");
      image.src = photo.image;
      image.alt = photo.caption || "Restaurant gallery image";
      image.loading = "lazy";
      const caption = document.createElement("input");
      caption.type = "text";
      caption.className = "dashboard-gallery-caption";
      caption.value = photo.caption || "";
      caption.maxLength = 180;
      caption.setAttribute("aria-label", `Caption for image ${index + 1}`);
      caption.addEventListener("change", () => updateGallery(photo, { caption: caption.value.trim(), category: photo.category }));
      const category = document.createElement("select");
      category.className = "dashboard-gallery-caption";
      ["food", "drinks", "ambiance"].forEach(value => {
        const option = element("option", "", { food: "Food", drinks: "Drinks & Cocktails", ambiance: "Ambiance" }[value]);
        option.value = value;
        option.selected = photo.category === value;
        category.append(option);
      });
      category.setAttribute("aria-label", `Category for image ${index + 1}`);
      category.addEventListener("change", () => updateGallery(photo, { caption: caption.value.trim(), category: category.value }));
      const actions = element("div", "dashboard-gallery-actions");
      const remove = element("button", "button button-outline button-small", "Delete");
      remove.type = "button";
      remove.addEventListener("click", () => deleteGallery(photo));
      actions.append(remove);
      card.append(image, caption, category, actions);
      target.append(card);
    });
  }

  async function updateGallery(photo, values) {
    try {
      const result = await request(`${galleryUrl}${photo.id}/`, {
        method: "POST",
        json: values
      });
      Object.assign(photo, result.photo);
      notice("[data-gallery-notice]", "Gallery details saved.");
    } catch (error) {
      messageError("[data-gallery-notice]", error);
    }
  }

  async function deleteGallery(photo) {
    if (!window.confirm("Delete this gallery image?")) return;
    try {
      await request(`${galleryUrl}${photo.id}/delete/`, { method: "POST" });
      state.gallery = state.gallery.filter(entry => entry.id !== photo.id);
      renderGallery();
      notice("[data-gallery-notice]", "Gallery image deleted.");
    } catch (error) {
      messageError("[data-gallery-notice]", error);
    }
  }

  async function reorderGallery(fromId, toId) {
    if (!fromId || fromId === toId) return;
    const from = state.gallery.findIndex(photo => photo.id === fromId);
    const to = state.gallery.findIndex(photo => photo.id === toId);
    if (from < 0 || to < 0) return;
    state.gallery.splice(to, 0, state.gallery.splice(from, 1)[0]);
    try {
      await request(`${galleryUrl}reorder/`, {
        method: "POST",
        json: { ids: state.gallery.map(photo => photo.id) }
      });
      renderGallery();
    } catch (error) {
      messageError("[data-gallery-notice]", error);
    }
  }

  function bindGallery() {
    const upload = document.querySelector("[data-gallery-upload]");
    document.querySelector("[data-gallery-open]")?.addEventListener("click", () => upload?.click());
    upload?.addEventListener("change", async () => {
      if (!upload.files?.length) return;
      const form = new FormData();
      form.append("category", document.querySelector("[data-gallery-category]")?.value || "food");
      Array.from(upload.files).forEach(file => form.append("images", file));
      try {
        const result = await request(galleryUrl, { method: "POST", body: form });
        state.gallery.push(...result.photos);
        renderGallery();
        notice("[data-gallery-notice]", `${result.photos.length} image${result.photos.length === 1 ? "" : "s"} uploaded.`);
      } catch (error) {
        messageError("[data-gallery-notice]", error);
      } finally {
        upload.value = "";
      }
    });
  }

  function renderOrders() {
    const target = document.querySelector("[data-orders]");
    if (!target) return;
    target.replaceChildren();
    const search = (document.querySelector("[data-order-search]")?.value || "").trim().toLowerCase();
    const filter = document.querySelector("[data-order-filter]")?.value || "all";
    const matches = state.orders.filter(order =>
      `${order.number} ${order.customer} ${order.items} ${order.phone}`.toLowerCase().includes(search)
      && (filter === "all" || order.status === filter)
    );
    matches.forEach(order => {
      const row = document.createElement("tr");
      row.append(element("td", "", order.number));
      const customer = element("td");
      customer.append(element("span", "", order.customer));
      customer.append(element("small", "dashboard-order-phone", order.phone));
      row.append(customer);
      [order.items, `K${Number(order.total).toLocaleString()}`]
        .forEach(value => row.append(element("td", "", value)));
      const statusCell = document.createElement("td");
      statusCell.append(element("span", "dashboard-status", order.status[0].toUpperCase() + order.status.slice(1)));
      const updateCell = document.createElement("td");
      const select = document.createElement("select");
      select.className = "dashboard-status-select";
      select.setAttribute("aria-label", `Update status for order ${order.number}`);
      ["pending", "preparing", "ready", "completed", "cancelled"].forEach(status => {
        const option = element("option", "", status[0].toUpperCase() + status.slice(1));
        option.value = status;
        option.selected = order.status === status;
        select.append(option);
      });
      select.addEventListener("change", async () => {
        try {
          const result = await request(`/dashboard/api/orders/${order.id}/status/`, {
            method: "POST",
            json: { status: select.value }
          });
          order.status = result.order.status;
          renderOrders();
          renderOrderStats();
          refreshDashboard();
        } catch (error) {
          messageError("[data-orders-notice]", error);
        }
      });
      updateCell.append(select);
      row.append(statusCell, updateCell);
      target.append(row);
    });
    if (!matches.length) {
      const row = document.createElement("tr");
      const cell = element("td", "", "No orders match your search.");
      cell.colSpan = 6;
      row.append(cell);
      target.append(row);
    }
  }

  function renderOrderStats() {
    const target = document.querySelector("[data-order-stats]");
    if (!target) return;
    target.replaceChildren();
    ["pending", "preparing", "ready", "completed", "cancelled"].forEach(status => {
      const count = state.orders.filter(order => order.status === status).length;
      const card = element("article", "value-card dashboard-order-stat");
      card.append(element("p", "", status[0].toUpperCase() + status.slice(1)), element("strong", "", String(count)));
      target.append(card);
    });
  }

  function renderAnalytics() {
    const data = state.analytics;
    const cards = [
      ["Today's Orders", data.today_orders],
      ["Today's Revenue", `K${Number(data.today_revenue).toLocaleString()}`],
      ["Weekly Revenue", `K${Number(data.weekly_revenue).toLocaleString()}`],
      ["Monthly Revenue", `K${Number(data.monthly_revenue).toLocaleString()}`],
      ["Best Selling Item", data.best_selling_item],
      ["Total Customers", data.total_customers],
      ["Average Order", `K${Number(data.average_order).toLocaleString()}`],
      ["Pending Orders", data.pending_orders],
      ["Completed Orders", data.completed_orders],
      ["Cancelled Orders", data.cancelled_orders]
    ];
    const target = document.querySelector("[data-analytics]");
    target?.replaceChildren();
    cards.forEach(([label, value]) => {
      const card = element("article", "value-card dashboard-stat-card");
      card.append(element("p", "", label), element("strong", "dashboard-analytics-value", String(value)));
      target?.append(card);
    });
    const summary = document.querySelector("[data-statistics]");
    summary?.replaceChildren();
    [
      ["Website Visitors", data.website_visitors],
      ["Menu Views", data.menu_views],
      ["Orders", data.orders],
      ["Revenue", `K${Number(data.revenue).toLocaleString()}`]
    ].forEach(([label, value]) => {
      const card = element("article", "value-card dashboard-stat-card");
      card.append(element("p", "", label), element("strong", "", String(value)));
      summary?.append(card);
    });
    renderRevenueChart(data.chart || []);
  }

  function renderRevenueChart(days) {
    const target = document.querySelector("[data-revenue-chart]");
    if (!target) return;
    target.replaceChildren();
    const peak = Math.max(1, ...days.map(day => Number(day.revenue)));
    days.forEach(day => {
      const row = element("div", "dashboard-chart-row");
      const label = element("span", "", new Date(`${day.date}T12:00:00`).toLocaleDateString(undefined, { weekday: "short" }));
      const track = element("div", "dashboard-chart-track");
      const bar = element("span", "dashboard-chart-bar");
      bar.style.width = `${Math.max(1, Number(day.revenue) / peak * 100)}%`;
      bar.setAttribute("aria-label", `K${Number(day.revenue).toLocaleString()}`);
      track.append(bar);
      row.append(label, track, element("strong", "", `K${Number(day.revenue).toLocaleString()}`));
      target.append(row);
    });
  }

  async function refreshDashboard() {
    try {
      const response = await request("/dashboard/api/data/");
      Object.assign(state, response);
      renderOrders();
      renderOrderStats();
      renderAnalytics();
    } catch (error) {
      messageError("[data-dashboard-notice]", error);
    }
  }

  function bindSettings() {
    const form = document.querySelector("[data-settings-form]");
    if (!form) return;
    form.elements.language.value = form.dataset.language;
    form.elements.notifications.checked = form.dataset.notifications === "true";
    form.addEventListener("submit", async event => {
      event.preventDefault();
      const password = {
        old: form.elements.old_password.value,
        new: form.elements.password.value,
        confirm: form.elements.password_confirm.value
      };
      try {
        const result = await request("/dashboard/api/settings/", {
          method: "POST",
          json: {
            language: form.elements.language.value,
            notifications: form.elements.notifications.checked,
            password: password.new || password.old || password.confirm ? password : {}
          }
        });
        form.dataset.language = result.language;
        form.dataset.notifications = String(result.notifications);
        form.elements.old_password.value = "";
        form.elements.password.value = "";
        form.elements.password_confirm.value = "";
        notice("[data-settings-notice]", "Settings saved.");
      } catch (error) {
        messageError("[data-settings-notice]", error);
        if (error.data?.errors) {
          const text = Object.values(error.data.errors).flat().map(entry => entry.message).join(" ");
          notice("[data-settings-notice]", text, true);
        }
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
      if (sidebar.contains(document.activeElement)) toggle.focus({ preventScroll: true });
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
      } else closeSidebar();
    }
    toggle.addEventListener("click", () => {
      const open = sidebar.classList.toggle("open");
      sidebar.setAttribute("aria-hidden", String(!open));
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close dashboard navigation" : "Open dashboard navigation");
      backdrop.hidden = !open;
    });
    closeButton.addEventListener("click", closeSidebar);
    backdrop.addEventListener("click", closeSidebar);
    sidebar.querySelectorAll(".dashboard-nav-link[href]").forEach(link => link.addEventListener("click", () => {
      sidebar.querySelectorAll(".dashboard-nav-link[href]").forEach(navLink => {
        navLink.classList.toggle("active", navLink === link);
        if (navLink === link) navLink.setAttribute("aria-current", "page");
        else navLink.removeAttribute("aria-current");
      });
      if (mobile.matches) closeSidebar();
    }));
    document.addEventListener("keydown", event => { if (event.key === "Escape" && mobile.matches) closeSidebar(); });
    mobile.addEventListener("change", syncViewport);
    syncViewport();
  }

  function setupQrCode() {
    const select = document.querySelector("[data-qr-target]");
    const preview = document.querySelector("[data-qr-preview]");
    const download = document.querySelector("[data-qr-download]");
    const description = document.querySelector("[data-qr-description]");
    if (!select || !preview || !download) return;
    const update = () => {
      const target = select.value === "menu" ? "menu" : "website";
      const url = new URL(body.dataset.qrUrl, window.location.origin);
      url.searchParams.set("target", target);
      const image = element("img", "dashboard-qr-image");
      image.src = url.pathname + url.search;
      image.alt = `QR code for restaurant ${target === "menu" ? "menu" : "website"}`;
      preview.replaceChildren(image);
      download.href = image.src;
      download.download = `${body.dataset.restaurantSlug}-${target}-qr.png`;
      if (description) {
        description.textContent = target === "menu"
          ? "Scan to open your restaurant menu."
          : "Scan to open your restaurant website.";
      }
    };
    select.addEventListener("change", update);
    update();
  }

  function init() {
    renderCategories();
    renderMenu();
    renderGallery();
    renderOrders();
    renderOrderStats();
    renderAnalytics();
    bindMenu();
    bindGallery();
    bindSettings();
    document.querySelector("[data-order-search]")?.addEventListener("input", renderOrders);
    document.querySelector("[data-order-filter]")?.addEventListener("change", renderOrders);
    setupSidebar();
    setupQrCode();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
