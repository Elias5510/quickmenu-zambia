(() => {
  "use strict";

  const MENU = [
    { id: "pilau", name: "Chicken Pilau", category: "rice", group: "Rice Specials", price: 95, description: "Fragrant spiced rice with tender chicken and fresh kachumbari salsa.", tag: "Guest favourite", rating: "4.9", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=90" },
    { id: "beef-rice", name: "Beef Stew & Basmati Rice", category: "rice", group: "Rice Specials", price: 110, description: "Slow-cooked Zambian beef stew, rich gravy and aromatic basmati.", tag: "Slow cooked", rating: "4.9", image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=1200&q=90" },
    { id: "tilapia-rice", name: "Grilled Tilapia & Fried Rice", category: "rice", group: "Rice Specials", price: 130, description: "Fresh bream fillet with garlic vegetable fried rice and lime.", tag: "Fresh catch", rating: "5.0", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=90" },
    { id: "village-chicken", name: "Village Chicken & Ifisashi", category: "traditional", group: "Traditional Nshima Feasts", price: 140, description: "Local chicken, hot Nshima and pumpkin leaves simmered in peanut paste.", tag: "Zambian classic", rating: "5.0", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1200&q=90" },
    { id: "dried-bream", name: "Dried Bream & Delele", category: "traditional", group: "Traditional Nshima Feasts", price: 120, description: "Traditional dried fish stew with tender okra and freshly pounded Nshima.", tag: "Local favourite", rating: "4.9", image: "assets/fried-bream-traditional-platter.jpg", imageCropped: true },
    { id: "kapenta", name: "Kapenta in Peanut Butter", category: "traditional", group: "Traditional Nshima Feasts", price: 90, description: "Tanganyika kapenta in a warming tomato and peanut sauce, served with Nshima.", tag: "Comfort food", rating: "4.8", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=90" },
    { id: "tbone", name: "Nshima & T-Bone Steak", category: "traditional", group: "Traditional Nshima Feasts", price: 145, description: "Grilled T-bone steak, hot Nshima, seasonal greens and tomato gravy.", tag: "House special", rating: "4.9", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85" },
    { id: "beef-burger", name: "Signature Beef Burger", category: "fastfood", group: "Fast Food & Burgers", price: 95, description: "Char-grilled beef, melted cheddar, house pickles and golden chips.", tag: "Bestseller", rating: "4.9", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85" },
    { id: "chicken-burger", name: "Crispy Chicken Burger", category: "fastfood", group: "Fast Food & Burgers", price: 85, description: "Crunchy chicken, slaw, chilli mayo and hand-cut fries.", tag: "Crispy & fresh", rating: "4.8", image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=900&q=85" },
    { id: "chicken-chips", name: "Peri-Peri Chicken & Chips", category: "fastfood", group: "Fast Food & Burgers", price: 95, description: "Flame-grilled quarter chicken basted in peri-peri with crisp chips.", tag: "Flame grilled", rating: "4.9", image: "assets/flame-grilled-quarter-chicken.jpg" },
    { id: "quarter-chicken", name: "Flame-Grilled Quarter Chicken", category: "fastfood", group: "Fast Food & Burgers", price: 85, description: "Herb-marinated quarter chicken, flame grilled until juicy with a smoky finish.", tag: "Char grilled", rating: "4.9", image: "assets/flame-grilled-quarter-chicken.jpg" },
    { id: "spicy-chicken-spaghetti", name: "Spicy Chicken Spaghetti & Sauce Special", category: "rice-pasta", group: "Rice & Pasta / Fast Meals", price: 85, description: "Savoury spaghetti tossed in a rich tomato sauce with spicy chicken.", tag: "Fast meal", rating: "4.8", image: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?auto=format&fit=crop&w=1200&q=90" },
    { id: "chicken-stir-fry-noodles", name: "Savory Chicken Stir-Fry Noodles", category: "rice-pasta", group: "Rice & Pasta / Fast Meals", price: 75, description: "Wok-tossed noodles with tender chicken and crisp vegetables.", tag: "Wok tossed", rating: "4.8", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=90" },
    { id: "chicken-beef-pilau", name: "Chicken & Beef Pilau Rice Special", category: "rice", group: "Rice Specials", price: 95, description: "Seasoned pilau rice with tender chicken and beef, fragrant spices and kachumbari.", tag: "Hearty pilau", rating: "4.9", image: "assets/seasoned-pilau-rice.jpg" },
    { id: "bream-takeaway-pack", name: "Bream & Nshima Express Takeaway Pack", category: "traditional", group: "Traditional Nshima Feasts", price: 120, description: "Grilled bream packed with Nshima, Ifisashi and fresh vegetables for an easy meal.", tag: "Takeaway favourite", rating: "5.0", image: "assets/bream-nshima-express-pack.jpg", imageCropped: true },
    { id: "ultimate-zambian-feast", name: "Ultimate Zambian Traditional Feast", category: "traditional", group: "Traditional Nshima Feasts", price: 150, description: "A generous traditional platter of fried bream, white and millet Nshima, leafy relishes, beans and gravy.", tag: "Signature feast", rating: "5.0", image: "assets/complete-zambian-platter.jpg", imageCropped: true },
    { id: "victoria-sunset", name: "Victoria Falls Sunset", category: "cocktails", group: "Cocktails & Mocktails", price: 80, description: "Rum, passion fruit liqueur, orange juice and a grenadine finish.", tag: "Signature cocktail", rating: "4.9", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=90" },
    { id: "zam-beeze", name: "Zambezi Breeze", category: "cocktails", group: "Cocktails & Mocktails", price: 75, description: "Vodka infused with fresh mint, lime and ginger ale.", tag: "House cocktail", rating: "4.8", image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=1200&q=90" },
    { id: "mosi-mocktail", name: "Mosi Lemonade Mocktail", category: "cocktails", group: "Cocktails & Mocktails", price: 45, description: "Mint, lemon, sparkling soda and a touch of brown sugar.", tag: "Zero proof", rating: "5.0", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=90" },
    { id: "thobwa", name: "Chilled Thobwa", category: "drinks", group: "Cold Drinks & Local Beverages", price: 30, description: "Sweet, refreshing traditional maize and millet beverage.", tag: "Local heritage", rating: "4.9", image: "https://images.unsplash.com/photo-1570696516188-ade861b84a49?auto=format&fit=crop&w=1200&q=90" },
    { id: "maheu", name: "Fresh Local Maheu", category: "drinks", group: "Cold Drinks & Local Beverages", price: 25, description: "Creamy sorghum and maize energy drink, served ice cold.", tag: "Made local", rating: "4.8", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=90" },
    { id: "soda", name: "Sodas 500ml", category: "drinks", group: "Cold Drinks & Local Beverages", price: 20, description: "Choose Coke, Fanta or Sprite, served chilled.", tag: "Classic refreshment", rating: "4.8", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=1200&q=90" },
    { id: "mosi-lager", name: "Mosi Lager", category: "beers", group: "Cold Beers & Ciders", price: 35, unit: "bottle", minimum: 3, description: "Zambia's legendary crisp, cold brew. Best enjoyed ice cold.", tag: "Zambian classic", rating: "4.9", image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=1200&q=90" },
    { id: "carling-black-label", name: "Carling Black Label", category: "beers", group: "Cold Beers & Ciders", price: 40, unit: "bottle", minimum: 3, description: "Full-flavoured champion beer, served properly chilled.", tag: "Full flavoured", rating: "4.8", image: "assets/carling-black-label.jpg" },
    { id: "castle-lite", name: "Castle Lite", category: "beers", group: "Cold Beers & Ciders", price: 40, unit: "bottle", minimum: 3, description: "Extra cold, smooth refreshment with a light crisp finish.", tag: "Extra cold", rating: "4.8", image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=1200&q=90" },
    { id: "corona-extra", name: "Corona Extra", category: "beers", group: "Cold Beers & Ciders", price: 60, unit: "bottle", minimum: 3, description: "Premium imported Mexican lager, served with a fresh lime wedge.", tag: "Imported premium", rating: "4.9", image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=1200&q=90" },
    { id: "budweiser", name: "Budweiser", category: "beers", group: "Cold Beers & Ciders", price: 55, unit: "bottle", minimum: 3, description: "Crisp American-style lager with its unmistakably clean finish.", tag: "American-style", rating: "4.8", image: "assets/budweiser-cold-bucket.jpg" },
    { id: "heineken", name: "Heineken Cold Brew", category: "beers", group: "Cold Beers & Ciders", price: 50, unit: "bottle", minimum: 3, description: "Premium European lager in the familiar green bottle, served ice cold.", tag: "European premium", rating: "4.9", image: "assets/imported-premium-beer-lineup.jpg", imageCropped: true, imagePosition: "right center" },
    { id: "castle-lager", name: "Castle Lager", category: "beers", group: "Cold Beers & Ciders", price: 40, unit: "bottle", minimum: 3, description: "A classic full-bodied lager, served properly chilled.", tag: "South African classic", rating: "4.8", image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=1200&q=90" },
    { id: "budweiser-cold-bucket", name: "Budweiser Cold Bucket / 3-Pack", category: "beers", group: "Cold Beers & Ciders", price: 165, unit: "3-bottle pack", minimum: 1, minimumLabel: "Minimum order: 3 bottles (1 pack)", bottleCount: 3, description: "Three crisp Budweiser bottles served together, ice cold and ready to share.", tag: "3-bottle bucket", rating: "4.9", image: "assets/budweiser-cold-bucket.jpg", imageCropped: true },
    { id: "imported-premium-combo", name: "Imported Premium Beer Combo", category: "beers", group: "Cold Beers & Ciders", price: 220, unit: "4-bottle combo", minimum: 1, minimumLabel: "Minimum order: 3 bottles (1 combo)", bottleCount: 4, description: "A chilled four-bottle selection featuring Budweiser, Stella Artois, Corona Extra and Heineken.", tag: "Imported selection", rating: "4.9", image: "assets/imported-premium-beer-lineup.jpg", imageCropped: true },
    { id: "savanna-dry", name: "Savanna Dry Cider", category: "beers", group: "Cold Beers & Ciders", price: 50, unit: "bottle", minimum: 3, description: "Crisp, premium dry cider with a refreshing apple finish.", tag: "Premium cider", rating: "4.9", image: "assets/savanna-dry-cider.jpg" },
    { id: "smirnoff-double-black", name: "Smirnoff Ice Double Black", category: "beers", group: "Cold Beers & Ciders", price: 45, unit: "bottle", minimum: 3, description: "Bold citrus and vodka blend, served chilled.", tag: "Citrus cooler", rating: "4.8", image: "assets/smirnoff-ice-double-black.jpg" }
  ];

  const GROUPS = [
    { id: "rice", name: "Rice Specials", intro: "Fragrant, generous plates made for a proper lunch." },
    { id: "rice-pasta", name: "Rice & Pasta / Fast Meals", intro: "Quick, satisfying meals with bold Lusaka flavour." },
    { id: "traditional", name: "Traditional Nshima Feasts", intro: "Proudly Zambian relishes, served the way you love them." },
    { id: "fastfood", name: "Fast Food & Burgers", intro: "Flame-grilled favourites and crisp, satisfying sides." },
    { id: "cocktails", name: "Cocktails & Mocktails", intro: "A little Lusaka sunshine in every glass." },
    { id: "drinks", name: "Cold Drinks & Local Beverages", intro: "Local classics and chilled favourites." },
    { id: "beers", name: "Cold Beers & Ciders", intro: "A chilled selection of Zambian favourites, premium lagers and ciders. Minimum order of 3 bottles per beer or cider." }
  ];

  const RESTAURANT = {
    name: "Mama's Kitchen",
    phone: "260970000000",
    currency: "K",
    deliveryFee: 10,
    areas: { cbd: "Lusaka CBD", massmedia: "Mass Media", rhodes: "Rhodes Park / Longacres", woodlands: "Woodlands", kamwala: "Kamwala", roma: "Roma / Foxdale" }
  };
  const KEYS = { cart: "quickmenuCartState", phone: "quickmenuVerifiedPhone", reviews: "quickmenuCustomerReviews", cateringDraft: "quickmenuCateringDraft", cateringBookings: "quickmenuCateringBookings", orderTracking: "quickmenuActiveOrderTracking" };
  const SEED_REVIEWS = [
    { name: "Chanda M.", area: "Mass Media", rating: 5, text: "Our Nshima and village chicken arrived hot at the office. The Ifisashi was excellent." },
    { name: "Brian K.", area: "Lusaka CBD", rating: 5, text: "Fast delivery to our building and a generous plate. We order for the team every week." },
    { name: "Mwaka P.", area: "Rhodes Park", rating: 5, text: "Quick service right to reception and delicious local relish. A favourite lunch break." }
  ];

  let cart = {};
  let delivery = { area: "cbd", office: "", relish: "Ifisashi", note: "", location: null };
  let verifiedPhone = "";
  let selectedRating = 0;
  let otpCode = "";
  let otpPhone = "";
  let otpDeadline = 0;
  let otpInterval = null;
  let toastTimer = null;
  let activeMenuFilter = "all";
  let invalidSavedBeerQuantity = false;
  let mobileNav = null;
  let mobileBackdrop = null;
  let mobileToggle = null;
  let orderTracking = null;
  let trackingInterval = null;

  const ORDER_STEPS = [
    { title: "Order Received & Confirmed by Kitchen", detail: "Your order is in the kitchen queue." },
    { title: "Fresh Meal / Drinks Being Prepared & Packed", detail: "Your fresh order is being prepared and carefully packed." },
    { title: "Out for Workplace Delivery", detail: "Driver dispatched with your delivery location pin." },
    { title: "Delivered Successfully", detail: "Your delivery is complete. Enjoy!" }
  ];
  const ORDER_STEP_TIMES = [0, 3000, 8000, 18000];

  function readStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
      console.error(`Unable to read ${key} from localStorage.`, error);
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Unable to save ${key} to localStorage.`, error);
      showToast("Could not save your details on this device. Please check browser storage settings.");
      return false;
    }

    function removeStorage(key) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Unable to remove ${key} from localStorage.`, error);
        showToast("Your inquiry was sent, but its saved draft could not be cleared.");
      }
    }
  }

  function loadState() {
    const savedCart = readStorage(KEYS.cart, {});
    if (savedCart && typeof savedCart === "object") {
      const items = savedCart.items && typeof savedCart.items === "object" ? savedCart.items : {};
      MENU.forEach(item => {
        const saved = items[item.id];
        if (saved && Number.isInteger(saved.qty) && saved.qty > 0) {
          if (item.minimum && saved.qty < item.minimum) {
            invalidSavedBeerQuantity = true;
            return;
          }
          cart[item.id] = { ...item, qty: saved.qty };
        }
      });
      const savedDelivery = savedCart.delivery && typeof savedCart.delivery === "object" ? savedCart.delivery : {};
      delivery = { ...delivery, ...savedDelivery };
      if (!RESTAURANT.areas[delivery.area]) delivery.area = "cbd";
      if (delivery.location && delivery.location.source === "gps" &&
          (!Number.isFinite(delivery.location.latitude) || !Number.isFinite(delivery.location.longitude))) {
        delivery.location = null;
      }
    }
    const phone = readStorage(KEYS.phone, "");
    if (typeof phone === "string" && /^\+260\d{9}$/.test(phone)) verifiedPhone = phone;
    const savedTracking = readStorage(KEYS.orderTracking, null);
    if (savedTracking && typeof savedTracking === "object" &&
        typeof savedTracking.id === "string" &&
        typeof savedTracking.createdAt === "string" &&
        !Number.isNaN(Date.parse(savedTracking.createdAt)) &&
        Array.isArray(savedTracking.items) &&
        savedTracking.items.length > 0 &&
        savedTracking.items.every(item => item && typeof item.name === "string" && Number.isInteger(item.qty) && item.qty > 0)) {
      orderTracking = { ...savedTracking, items: savedTracking.items };
      orderTracking.step = getOrderStep(orderTracking.createdAt);
    }
  }

  function saveState() {
    writeStorage(KEYS.cart, { items: cart, delivery });
  }

  function money(amount) {
    return `${RESTAURANT.currency}${amount}`;
  }

  function countItems() {
    return Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  }

  function subtotal() {
    return Object.values(cart).reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function ratingMarkup(rating) {
    return `<span class="food-rating" aria-label="${rating} out of 5 stars">★ ${rating}</span>`;
  }

  function productCard(item) {
    const qty = cart[item.id]?.qty || 0;
    const action = qty
      ? `<div class="quantity"><button type="button" data-remove="${item.id}" aria-label="Remove one ${item.name}">−</button><span>${qty}</span><button type="button" data-add="${item.id}" aria-label="Add one ${item.name}">+</button></div>`
      : `<button type="button" class="button button-small" data-add="${item.id}">Add to order <span aria-hidden="true">+</span></button>`;
    const minimumNote = item.minimum ? `<p class="minimum-order">${item.minimumLabel || `Minimum order: ${item.minimum} bottles`}</p>` : "";
    const imageClasses = ["food-image", item.imageCropped ? "image-crop" : ""].filter(Boolean).join(" ");
    const imageStyle = item.imagePosition ? ` style="object-position:${item.imagePosition}"` : "";
    return `<article class="food-card">
      <div class="${imageClasses}"><img src="${item.image}" alt="${item.name}" loading="lazy"${imageStyle}><span class="food-tag">${item.tag}</span></div>
      <div class="food-body">
        <div class="food-meta"><h3>${item.name}</h3><span class="food-price">${money(item.price)}${item.unit ? `<small> / ${item.unit}</small>` : ""}</span></div>
        <p>${item.description}</p>
        ${minimumNote}
        <div class="food-footer">${ratingMarkup(item.rating)}${action}</div>
      </div>
    </article>`;
  }

  function renderFeatured() {
    const target = document.querySelector("[data-featured-menu]");
    if (!target) return;
    target.innerHTML = ["ultimate-zambian-feast", "chicken-beef-pilau", "quarter-chicken"].map(id => productCard(MENU.find(item => item.id === id))).join("");
    bindProductActions(target);
  }

  function renderMenu() {
    const target = document.querySelector("[data-menu-sections]");
    if (!target) return;
    target.innerHTML = GROUPS.map(group => {
      const items = MENU.filter(item => item.category === group.id);
      return `<section id="section-${group.id}" class="menu-section" data-category-section="${group.id}">
        <div class="menu-section-title"><div><h2>${group.name}</h2><p>${group.intro}</p></div><span class="eyebrow">${String(items.length).padStart(2, "0")} ${group.id === "beers" ? "bottles" : "plates"}</span></div>
        <div class="menu-grid">${items.map(productCard).join("")}</div>
      </section>`;
    }).join("");
    bindProductActions(target);
    applyMenuFilter(GROUPS.map(group => group.id));
  }

  function setupMenuFilters() {
    const categories = GROUPS.map(group => group.id);
    document.querySelectorAll("[data-filter]").forEach(button => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        activeMenuFilter = filter;
        document.querySelectorAll("[data-filter]").forEach(chip => chip.classList.toggle("active", chip === button));
        applyMenuFilter(categories);
      });
    });
  }

  function applyMenuFilter(categories) {
    document.querySelectorAll("[data-category-section]").forEach(section => {
      section.hidden = activeMenuFilter !== "all" &&
        (!categories.includes(activeMenuFilter) || section.dataset.categorySection !== activeMenuFilter);
    });
  }

  function bindProductActions(root) {
    root.querySelectorAll("[data-add]").forEach(button => button.addEventListener("click", () => addItem(button.dataset.add)));
    root.querySelectorAll("[data-remove]").forEach(button => button.addEventListener("click", () => removeItem(button.dataset.remove)));
  }

  function addItem(id) {
    const item = MENU.find(product => product.id === id);
    if (!item) return;
    if (!cart[id]) {
      cart[id] = { ...item, qty: item.minimum || 1 };
      if (item.minimum) showToast(`${item.name}: ${item.minimumLabel || `minimum order ${item.minimum} bottles`}.`);
    } else {
      cart[id].qty += 1;
    }
    saveState();
    refreshUI();
    renderMenu();
  }

  function removeItem(id) {
    if (!cart[id]) return;
    const item = MENU.find(product => product.id === id);
    if (item?.minimum && cart[id].qty <= item.minimum) {
      delete cart[id];
      showToast(`${item.name} removed. ${item.minimumLabel || `Minimum order: ${item.minimum} bottles`}.`);
    } else {
      cart[id].qty -= 1;
    }
    if (cart[id]?.qty <= 0) delete cart[id];
    saveState();
    refreshUI();
    renderMenu();
  }

  function renderReviews(container, limit) {
    if (!container) return;
    const saved = readStorage(KEYS.reviews, []);
    const validSaved = (Array.isArray(saved) ? saved : []).filter(review =>
      review && typeof review.name === "string" && typeof review.text === "string" &&
      Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5
    );
    const reviews = [...validSaved, ...SEED_REVIEWS].slice(0, limit || 30);
    container.replaceChildren();
    reviews.forEach(review => {
      const article = document.createElement("article");
      article.className = "quote-card";
      const stars = document.createElement("div");
      stars.className = "quote-stars";
      stars.textContent = "★".repeat(Math.max(0, Math.min(5, review.rating))) + "☆".repeat(5 - Math.max(0, Math.min(5, review.rating)));
      stars.setAttribute("aria-label", `${review.rating} out of 5 stars`);
      const quote = document.createElement("blockquote");
      quote.textContent = `“${review.text}”`;
      const name = document.createElement("strong");
      name.textContent = review.name;
      const meta = document.createElement("div");
      meta.className = "review-card-meta";
      const date = document.createElement("small");
      const createdAt = review.createdAt ? new Date(review.createdAt) : null;
      date.textContent = createdAt && !Number.isNaN(createdAt.getTime())
        ? createdAt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
        : review.area ? `${review.area}, Lusaka` : "QuickMenu customer";
      meta.append(date);
      if (review.verified === true) {
        const badge = document.createElement("span");
        badge.className = "verified-badge";
        badge.textContent = "✓ Verified delivery";
        meta.append(badge);
      }
      const tags = document.createElement("div");
      tags.className = "review-card-tags";
      if (Array.isArray(review.serviceTags)) {
        review.serviceTags.forEach(label => {
          if (typeof label !== "string") return;
          const tag = document.createElement("span");
          tag.textContent = label;
          tags.append(tag);
        });
      }
      article.append(stars, quote, name, meta);
      if (tags.childElementCount) article.append(tags);
      container.append(article);
    });
  }

  function mountSharedUI() {
    const layout = document.createElement("div");
    layout.innerHTML = `
      <div class="sticky-cart"><button type="button" data-open-cart aria-label="Open shopping basket">
        <span class="sticky-cart-main"><span class="cart-count" data-cart-count>0</span><span>View your basket</span></span><span class="cart-trigger-total" data-cart-total>K0 · 0 items</span>
      </button></div>
      <div class="tracking-overlay" data-tracking-modal hidden>
        <section class="tracking-card" role="dialog" aria-modal="true" aria-labelledby="tracking-title">
          <div class="tracking-head">
            <div><span class="tracking-live"><i aria-hidden="true"></i> LIVE ORDER TRACKING</span><h2 id="tracking-title">Your order is on its way</h2></div>
            <button class="modal-close" type="button" data-close-tracking aria-label="Close order tracking">×</button>
          </div>
          <div class="tracking-order-meta"><span>Order <strong data-tracking-id></strong></span><span data-tracking-time></span></div>
          <div class="tracking-current-status">
            <span class="tracking-status-icon" data-tracking-status-icon aria-hidden="true">✓</span>
            <div><strong data-tracking-current-title></strong><p data-tracking-current-detail></p></div>
          </div>
          <div class="tracking-progress" role="list" aria-label="Order progress" aria-valuemin="1" aria-valuemax="4" aria-valuenow="1" data-tracking-progress>
            ${ORDER_STEPS.map((step, index) => `<div class="tracking-step" role="listitem" data-tracking-step="${index}"><span class="tracking-step-marker">${index < 3 ? index + 1 : "✓"}</span><span class="tracking-step-copy"><strong>${step.title}</strong><small>${step.detail}</small></span></div>`).join("")}
          </div>
          <div class="tracking-order-summary"><strong>Order summary</strong><p data-tracking-items></p><a class="gps-link" data-tracking-map target="_blank" rel="noopener" hidden>Open delivery pin ↗</a></div>
          <p class="tracking-demo-note">Live status simulation · Updates automatically</p>
        </section>
      </div>
      <div class="drawer-layer" data-drawer-layer hidden>
        <aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <div class="drawer-head"><div><h2 id="cart-title">Your basket</h2><p>Made fresh and delivered across Lusaka</p></div><button class="icon-button" type="button" data-close-cart aria-label="Close basket">×</button></div>
          <div class="drawer-content">
            <div class="cart-items" data-cart-items></div>
            <section class="order-success" data-order-success role="status" aria-live="polite" hidden>
              <span class="order-success-icon" aria-hidden="true">✓</span>
              <h3>Order message opened in WhatsApp! 🚀</h3>
              <p>Send it to the kitchen. Once your workplace delivery arrives, let us know how it went.</p>
              <button type="button" class="button button-outline" data-open-tracker>Track Current Order</button>
              <button type="button" class="button" data-review-open>⭐ Rate Your Delivery Experience</button>
            </section>
            <form class="delivery-box" data-delivery-form>
              <h3>Delivery details</h3>
              <div class="field"><label for="delivery-office">Building / office and floor</label><input id="delivery-office" name="office" placeholder="e.g. Longacres Office Park, 3rd floor"></div>
              <div class="field"><label for="delivery-area">Lusaka delivery area</label><select id="delivery-area" name="area">
                <option value="cbd">Lusaka CBD</option><option value="massmedia">Mass Media</option><option value="rhodes">Rhodes Park / Longacres</option><option value="woodlands">Woodlands</option><option value="kamwala">Kamwala</option><option value="roma">Roma / Foxdale</option>
              </select></div>
              <div class="field"><label for="delivery-relish">Relish / side preference</label><select id="delivery-relish" name="relish">
                <option>Ifisashi</option><option>Rape</option><option>Cabbage</option><option>Delele</option><option>Extra Nshima</option><option>No preference</option>
              </select></div>
              <div class="field"><label for="delivery-note">Extra instructions</label><input id="delivery-note" name="note" placeholder="Hot chilli, call on arrival..."></div>
              <button type="button" class="button button-outline button-small" data-detect-location>◎ Detect my delivery location</button>
              <p class="gps-status" data-gps-status aria-live="polite">Choose a Lusaka area or share a precise GPS pin.</p>
              <a class="gps-link" data-gps-link href="#" target="_blank" rel="noopener" hidden>Open location directions ↗</a>
              <p class="notice" data-phone-summary></p>
              <button type="button" class="text-link" data-open-login style="padding:0;border:0;background:transparent">Add / verify phone for checkout</button>
            </form>
          </div>
          <div class="drawer-foot">
            <div class="total-row"><span>Food subtotal</span><strong data-subtotal>K0</strong></div>
            <div class="total-row"><span>Delivery Fee (K10)</span><strong data-delivery-fee>K10</strong></div>
            <div class="total-row grand"><span>Total</span><strong data-grand-total>K0</strong></div>
            <button type="button" class="button" data-send-order>Send Order via WhatsApp <span aria-hidden="true">↗</span></button>
          </div>
        </aside>
      </div>
      <div class="overlay" data-login-modal hidden>
        <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="login-title">
          <div class="modal-head"><div><span class="eyebrow">Quick checkout</span><h2 id="login-title">Phone verification</h2></div><button class="modal-close" type="button" data-close-login aria-label="Close">×</button></div>
          <div data-login-phone-step class="modal-form">
            <p class="screen-message">Enter your Zambian number to keep your checkout details handy.</p>
            <div class="field"><label for="otp-phone">Zambian phone number</label><input id="otp-phone" class="input" type="tel" autocomplete="tel" placeholder="+260 97 123 4567"></div>
            <button type="button" class="button" data-send-otp>Send OTP</button>
            <p class="modal-note">Demo simulation: no SMS is sent. The verification code is shown here.</p><p class="error-text" data-login-error hidden></p>
          </div>
          <div data-login-code-step class="modal-form" hidden>
            <p class="screen-message" data-otp-message></p>
            <div class="field"><label for="otp-code">4-digit code</label><input id="otp-code" class="input" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="4" placeholder="••••"></div>
            <div class="timer-row"><span data-otp-timer>Code expires in 60s</span><button type="button" class="text-link" data-resend-otp style="border:0;background:none;padding:0">Resend</button></div>
            <div class="demo-code" data-demo-code></div><p class="error-text" data-code-error hidden></p>
          </div>
          <div data-login-success hidden><p class="screen-message success-text">✓ Phone verified</p><p data-login-success-message></p></div>
        </section>
      </div>
      <div class="overlay" data-review-modal hidden>
        <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="review-title">
          <div class="modal-head"><div><span class="eyebrow">Your experience matters</span><h2 id="review-title">Rate Your Experience</h2></div><button class="modal-close" type="button" data-close-review aria-label="Close">×</button></div>
          <form class="modal-form" data-review-form>
            <div class="field"><label>Your rating</label><div class="star-picker" role="radiogroup" aria-label="Rating from one to five stars">
              ${[1, 2, 3, 4, 5].map(number => `<button type="button" data-rating="${number}" aria-label="${number} star${number > 1 ? "s" : ""}" aria-pressed="false">★</button>`).join("")}
            </div></div>
          <fieldset class="review-tag-field"><legend>What stood out? <span>(optional)</span></legend>
            <div class="review-tag-picker">
              <button type="button" data-review-tag="Lightning Fast Workplace Delivery" aria-pressed="false">⚡ Lightning Fast Workplace Delivery</button>
              <button type="button" data-review-tag="Hot Nshima & Fresh Relish" aria-pressed="false">♨ Hot Nshima & Fresh Relish</button>
              <button type="button" data-review-tag="Cold Beers" aria-pressed="false">❄ Cold Beers</button>
            </div>
          </fieldset>
          <div class="field"><label for="review-text">Comments about your order or delivery</label><textarea id="review-text" class="input" rows="4" maxlength="500" required placeholder="Tell us what went well or how we can improve..."></textarea></div>
          <div class="review-form-grid">
            <div class="field"><label for="review-name">Your name</label><input id="review-name" class="input" maxlength="60" autocomplete="name" required></div>
            <div class="field"><label for="review-phone">Phone number</label><input id="review-phone" class="input" type="tel" autocomplete="tel" placeholder="+260 97 123 4567" required></div>
          </div>
          <p class="review-phone-note" data-review-phone-note></p>
          <p class="error-text" data-review-error hidden></p><button class="button" type="submit">Submit review</button>
          </form>
        </section>
      </div>
      <div class="overlay" data-catering-modal hidden>
        <section class="modal-card catering-modal" role="dialog" aria-modal="true" aria-labelledby="catering-title">
          <div class="modal-head"><div><span class="eyebrow">Celebrate with a generous Zambian table</span><h2 id="catering-title">Catering & Traditional Events</h2></div><button class="modal-close" type="button" data-close-catering aria-label="Close catering inquiry">×</button></div>
          <form class="modal-form" data-catering-form>
            <div class="catering-form-grid">
              <div class="field"><label for="catering-name">Client name</label><input id="catering-name" name="name" autocomplete="name" maxlength="80" required placeholder="Your full name"></div>
              <div class="field"><label for="catering-phone">Phone number (+260)</label><input id="catering-phone" name="phone" type="tel" autocomplete="tel" required placeholder="+260 97 123 4567"></div>
              <div class="field"><label for="catering-event">Event type</label><select id="catering-event" name="eventType" required>
                <option value="">Choose your occasion</option>
                <option>Chilanga Mulilo (Traditional Food Showcase)</option>
                <option>Kitchen Party / Matebeto</option>
                <option>Wedding Reception Catering</option>
                <option>Corporate Luncheon & Office Feasts</option>
                <option>Private Birthday Party</option>
              </select></div>
              <div class="field"><label for="catering-date">Preferred date</label><input id="catering-date" name="date" type="date" required></div>
              <div class="field"><label for="catering-guests">Estimated guest count (20–500)</label><input id="catering-guests" name="guestCount" type="number" min="20" max="500" step="1" required placeholder="e.g. 120"></div>
              <div class="field"><label for="catering-venue">Venue location / area in Lusaka</label><input id="catering-venue" name="venue" maxlength="180" required placeholder="Venue, suburb or area"></div>
              <div class="field full"><label for="catering-menu">Custom menu request</label><textarea id="catering-menu" name="menuRequest" maxlength="1200" required placeholder="e.g. Full traditional buffet with Nshima, Village Chicken, fish, rice and cocktails"></textarea></div>
            </div>
            <p class="booking-note">Your inquiry and draft are saved on this device. Submitting opens WhatsApp with a ready-to-send catering brief.</p>
            <p class="error-text" data-catering-error hidden></p>
            <div class="catering-actions"><button type="submit" class="button">Send catering inquiry on WhatsApp ↗</button><button type="button" class="button button-outline" data-cancel-catering>Maybe later</button></div>
          </form>
        </section>
      </div>
      <div class="toast" data-toast role="status" hidden></div>`;
    document.body.append(layout);
    const state = layout;

    state.querySelector("[data-close-cart]").addEventListener("click", closeCart);
    state.querySelector("[data-drawer-layer]").addEventListener("click", event => { if (event.target === state.querySelector("[data-drawer-layer]")) closeCart(); });
    state.querySelector("[data-delivery-form]").addEventListener("input", persistDeliveryForm);
    state.querySelector("#delivery-area").addEventListener("change", () => {
      if (!delivery.location || delivery.location.source !== "gps") saveLandmarkLocation();
      refreshUI();
    });
    state.querySelector("[data-detect-location]").addEventListener("click", detectLocation);
    state.querySelector("[data-send-order]").addEventListener("click", sendWhatsAppOrder);
    state.querySelector("[data-close-tracking]").addEventListener("click", closeOrderTracking);
    state.querySelector("[data-tracking-modal]").addEventListener("click", event => {
      if (event.target === state.querySelector("[data-tracking-modal]")) closeOrderTracking();
    });
    document.addEventListener("storage", event => {
      if (event.key !== KEYS.orderTracking) return;
      const savedTracking = readStorage(KEYS.orderTracking, null);
      if (savedTracking && typeof savedTracking.id === "string" && typeof savedTracking.createdAt === "string" &&
          !Number.isNaN(Date.parse(savedTracking.createdAt)) && Array.isArray(savedTracking.items) &&
          savedTracking.items.length > 0 &&
          savedTracking.items.every(item => item && typeof item.name === "string" && Number.isInteger(item.qty) && item.qty > 0)) {
        orderTracking = savedTracking;
        orderTracking.step = getOrderStep(orderTracking.createdAt);
        startOrderTrackingUpdates();
        renderOrderTracking();
      } else {
        orderTracking = null;
        if (trackingInterval) clearInterval(trackingInterval);
        trackingInterval = null;
        renderOrderTracking();
      }
    });
    state.querySelectorAll("[data-open-login]").forEach(button => button.addEventListener("click", openLogin));
    state.querySelector("[data-close-login]").addEventListener("click", closeLogin);
    state.querySelector("[data-login-modal]").addEventListener("click", event => { if (event.target === state.querySelector("[data-login-modal]")) closeLogin(); });
    state.querySelector("[data-send-otp]").addEventListener("click", () => sendOtp(false));
    state.querySelector("[data-resend-otp]").addEventListener("click", () => sendOtp(true));
    state.querySelector("#otp-code").addEventListener("input", event => {
      event.target.value = event.target.value.replace(/\D/g, "").slice(0, 4);
      if (event.target.value.length === 4) verifyOtp();
    });
    state.querySelector("[data-close-review]").addEventListener("click", closeReview);
    state.querySelector("[data-review-modal]").addEventListener("click", event => { if (event.target === state.querySelector("[data-review-modal]")) closeReview(); });
    state.querySelector("[data-review-form]").addEventListener("submit", submitReview);
    state.querySelectorAll("[data-rating]").forEach(button => {
      button.addEventListener("click", () => setRating(Number(button.dataset.rating)));
      button.addEventListener("mouseenter", () => previewRating(Number(button.dataset.rating)));
      button.addEventListener("mouseleave", () => previewRating(0));
      button.addEventListener("focus", () => previewRating(Number(button.dataset.rating)));
      button.addEventListener("blur", () => previewRating(0));
    });
    state.querySelectorAll("[data-review-tag]").forEach(button => button.addEventListener("click", () => {
      const selected = button.getAttribute("aria-pressed") !== "true";
      button.setAttribute("aria-pressed", String(selected));
      button.classList.toggle("selected", selected);
    }));
    state.querySelector("[data-close-catering]").addEventListener("click", closeCatering);
    state.querySelector("[data-cancel-catering]").addEventListener("click", closeCatering);
    state.querySelector("[data-catering-modal]").addEventListener("click", event => { if (event.target === state.querySelector("[data-catering-modal]")) closeCatering(); });
    state.querySelector("[data-catering-form]").addEventListener("input", persistCateringDraft);
    state.querySelector("[data-catering-form]").addEventListener("change", persistCateringDraft);
    state.querySelector("[data-catering-form]").addEventListener("submit", submitCateringInquiry);
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") { closeCart(); closeLogin(); closeReview(); closeCatering(); closeMobileNav(); closeOrderTracking(); }
    });
    hydrateDeliveryForm();
    updatePhone();
  }

  function refreshUI() {
    const count = countItems();
    const fee = count ? RESTAURANT.deliveryFee : 0;
    document.querySelectorAll("[data-cart-count]").forEach(node => { node.textContent = count; });
    document.querySelectorAll("[data-cart-total]").forEach(node => { node.textContent = `${money(subtotal() + fee)} · ${count} item${count === 1 ? "" : "s"}`; });
    document.querySelectorAll(".nav-cart").forEach(button => {
      button.setAttribute("aria-label", `Open cart, ${count} item${count === 1 ? "" : "s"}, total ${money(subtotal() + fee)}`);
    });
    document.querySelectorAll("[data-subtotal]").forEach(node => { node.textContent = money(subtotal()); });
    document.querySelectorAll("[data-delivery-fee]").forEach(node => { node.textContent = money(fee); });
    document.querySelectorAll("[data-grand-total]").forEach(node => { node.textContent = money(subtotal() + fee); });
    const list = document.querySelector("[data-cart-items]");
    if (list) {
      const items = Object.values(cart);
      list.innerHTML = items.length ? items.map(item => `<div class="cart-row">
        <img src="${item.image}" alt="" loading="lazy"><div><strong>${item.name}</strong><small>${money(item.price)} each${item.unit ? ` · ${item.unit}` : ""}</small></div>
        <div class="quantity"><button type="button" data-remove="${item.id}" aria-label="Remove one ${item.name}">−</button><span>${item.qty}</span><button type="button" data-add="${item.id}" aria-label="Add one ${item.name}">+</button></div>
      </div>`).join("") : `<div class="cart-empty">Your basket is waiting for something delicious.<br>Explore the menu to get started.</div>`;
      bindProductActions(list);
    }
    const summary = document.querySelector("[data-phone-summary]");
    if (summary) summary.textContent = verifiedPhone ? `Verified phone: ${verifiedPhone}` : "No verified phone yet.";
    renderLocation();
    saveState();
    renderFeatured();
  }

  function openCart() {
    const layer = document.querySelector("[data-drawer-layer]");
    layer.hidden = false;
    document.body.classList.add("locked");
    refreshUI();
    setTimeout(() => document.querySelector("#delivery-office")?.focus({ preventScroll: true }), 120);
  }

  function closeCart() {
    const layer = document.querySelector("[data-drawer-layer]");
    if (!layer) return;
    layer.hidden = true;
    document.body.classList.remove("locked");
  }

  function hydrateDeliveryForm() {
    const form = document.querySelector("[data-delivery-form]");
    if (!form) return;
    form.elements.office.value = delivery.office || "";
    form.elements.area.value = delivery.area || "cbd";
    form.elements.relish.value = delivery.relish || "Ifisashi";
    form.elements.note.value = delivery.note || "";
  }

  function persistDeliveryForm() {
    const form = document.querySelector("[data-delivery-form]");
    if (!form) return;
    delivery.office = form.elements.office.value.trim();
    delivery.area = form.elements.area.value;
    delivery.relish = form.elements.relish.value;
    delivery.note = form.elements.note.value.trim();
    if (!delivery.location || delivery.location.source !== "gps") saveLandmarkLocation();
    refreshUI();
  }

  function saveLandmarkLocation() {
    const place = RESTAURANT.areas[delivery.area] || RESTAURANT.areas.cbd;
    const query = encodeURIComponent(`${place}, Lusaka, Zambia`);
    delivery.location = {
      source: "landmark", landmark: place,
      mapLink: `https://maps.google.com/?q=${query}`,
      directionsLink: `https://www.google.com/maps/dir/?api=1&destination=${query}`
    };
  }

  function renderLocation() {
    const status = document.querySelector("[data-gps-status]");
    const link = document.querySelector("[data-gps-link]");
    if (!status || !link) return;
    if (!delivery.location) {
      status.textContent = "Choose a Lusaka area or share a precise GPS pin.";
      link.hidden = true;
      return;
    }
    if (delivery.location.source === "gps") {
      status.textContent = `GPS pin saved: ${delivery.location.latitude.toFixed(5)}, ${delivery.location.longitude.toFixed(5)}.`;
    } else {
      status.textContent = `Delivery landmark: ${delivery.location.landmark}, Lusaka.`;
    }
    link.href = delivery.location.directionsLink || delivery.location.mapLink;
    link.hidden = false;
  }

  function detectLocation() {
    const status = document.querySelector("[data-gps-status]");
    if (!navigator.geolocation) {
      status.textContent = "GPS is unavailable in this browser. Your selected Lusaka landmark is saved instead.";
      saveLandmarkLocation();
      refreshUI();
      return;
    }
    status.textContent = "Requesting your precise location…";
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      delivery.location = {
        source: "gps", latitude, longitude,
        landmark: RESTAURANT.areas[delivery.area],
        mapLink: `https://maps.google.com/?q=${latitude},${longitude}`,
        directionsLink: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
      };
      refreshUI();
    }, error => {
      const reason = error.code === 1 ? "Location permission was denied." : error.code === 3 ? "Location request timed out." : "Your location could not be determined.";
      status.textContent = `${reason} Using your selected Lusaka landmark instead.`;
      saveLandmarkLocation();
      refreshUI();
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
  }

  function sendWhatsAppOrder() {
    if (!countItems()) {
      showToast("Add at least one menu item before sending an order.");
      return;
    }
    const items = Object.values(cart).map(item => `• ${item.qty} × ${item.name}${item.unit ? ` (${item.unit}${item.qty === 1 ? "" : "s"})` : ""} — ${money(item.price * item.qty)}`).join("\n");
    const fee = RESTAURANT.deliveryFee;
    const location = delivery.location;
    const lines = [
      `Hello ${RESTAURANT.name}! I'd like to place a delivery order:`,
      "",
      items,
      "",
      `Building / floor: ${delivery.office || "Please confirm"}`,
      `Delivery area: ${RESTAURANT.areas[delivery.area] || "Lusaka CBD"}`,
      `Verified phone: ${verifiedPhone || "Not verified"}`,
      `Relish / side: ${delivery.relish || "No preference"}`,
      `Extra instructions: ${delivery.note || "None"}`
    ];
    if (location?.mapLink) {
      lines.push(`Google Maps pin: ${location.mapLink}`);
      if (location.directionsLink) lines.push(`Directions: ${location.directionsLink}`);
      if (Number.isFinite(location.latitude) && Number.isFinite(location.longitude)) {
        lines.push(`GPS coordinates: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`);
      } else {
        lines.push(`Landmark: ${location.landmark}, Lusaka`);
      }
    }
    lines.push("", `Subtotal: ${money(subtotal())}`, `Delivery Fee: ${money(fee)}`, `Grand Total: ${money(subtotal() + fee)}`, "", "Please confirm my order. Thank you!");
    createOrderTracking();
    window.open(`https://wa.me/${RESTAURANT.phone}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
    const success = document.querySelector("[data-order-success]");
    if (success) {
      success.hidden = false;
    }
    closeCart();
    openOrderTracking();
  }

  function getOrderStep(createdAt) {
    const elapsed = Math.max(0, Date.now() - Date.parse(createdAt));
    for (let index = ORDER_STEP_TIMES.length - 1; index >= 0; index -= 1) {
      if (elapsed >= ORDER_STEP_TIMES[index]) return index;
    }
    return 0;
  }

  function createOrderTracking() {
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
    orderTracking = {
      id: `QM-${datePart}-${randomPart}`,
      createdAt: now.toISOString(),
      step: 0,
      items: Object.values(cart).map(item => ({
        name: item.name,
        qty: item.qty,
        unit: item.unit || "",
        total: item.price * item.qty
      })),
      total: subtotal() + RESTAURANT.deliveryFee,
      deliveryArea: RESTAURANT.areas[delivery.area] || "Lusaka CBD",
      mapLink: delivery.location?.mapLink || ""
    };
    writeStorage(KEYS.orderTracking, orderTracking);
    renderOrderTracking();
    startOrderTrackingUpdates();
  }

  function startOrderTrackingUpdates() {
    if (trackingInterval) clearInterval(trackingInterval);
    if (!orderTracking) return;
    const update = () => {
      if (!orderTracking) return;
      const step = getOrderStep(orderTracking.createdAt);
      if (step !== orderTracking.step) {
        orderTracking.step = step;
        writeStorage(KEYS.orderTracking, orderTracking);
      }
      renderOrderTracking();
      if (step === ORDER_STEPS.length - 1) {
        clearInterval(trackingInterval);
        trackingInterval = null;
      }
    };
    update();
    if (orderTracking.step < ORDER_STEPS.length - 1) trackingInterval = setInterval(update, 500);
  }

  function renderOrderTracking() {
    const modal = document.querySelector("[data-tracking-modal]");
    const controls = document.querySelectorAll("[data-open-tracker]");
    controls.forEach(button => { button.hidden = !orderTracking; });
    document.querySelectorAll(".tracker-nav-button").forEach(button => {
      button.setAttribute("aria-label", orderTracking ? `Track current order ${orderTracking.id}` : "Track current order");
    });
    if (!modal) return;
    if (!orderTracking) {
      modal.hidden = true;
      return;
    }
    const step = Math.max(0, Math.min(ORDER_STEPS.length - 1, orderTracking.step || 0));
    const current = ORDER_STEPS[step];
    modal.querySelector("[data-tracking-id]").textContent = orderTracking.id;
    modal.querySelector("[data-tracking-time]").textContent = `Placed ${new Date(orderTracking.createdAt).toLocaleString()}`;
    modal.querySelector("[data-tracking-current-title]").textContent = current.title;
    modal.querySelector("[data-tracking-current-detail]").textContent = current.detail;
    modal.querySelector("[data-tracking-status-icon]").textContent = step === ORDER_STEPS.length - 1 ? "✓" : "↗";
    modal.querySelector("[data-tracking-items]").textContent = orderTracking.items
      .map(item => `${item.qty} × ${item.name}${item.unit ? ` (${item.unit})` : ""}`)
      .join(" · ");
    const progress = modal.querySelector("[data-tracking-progress]");
    progress.setAttribute("aria-valuenow", String(step + 1));
    progress.querySelectorAll("[data-tracking-step]").forEach(node => {
      const index = Number(node.dataset.trackingStep);
      node.classList.toggle("complete", index < step);
      node.classList.toggle("current", index === step);
      node.classList.toggle("upcoming", index > step);
    });
    const map = modal.querySelector("[data-tracking-map]");
    if (orderTracking.mapLink) {
      map.href = orderTracking.mapLink;
      map.hidden = false;
    } else {
      map.hidden = true;
    }
  }

  function openOrderTracking() {
    if (!orderTracking) {
      showToast("There is no current order to track yet.");
      return;
    }
    closeCart();
    closeMobileNav();
    const modal = document.querySelector("[data-tracking-modal]");
    modal.hidden = false;
    document.body.classList.add("locked");
    renderOrderTracking();
    modal.querySelector("[data-close-tracking]").focus();
    startOrderTrackingUpdates();
  }

  function closeOrderTracking() {
    const modal = document.querySelector("[data-tracking-modal]");
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("locked");
    const trackerButton = document.querySelector(".tracker-nav-button:not([hidden])");
    (trackerButton || mobileToggle)?.focus();
  }

  function openLogin() {
    closeMobileNav();
    closeCart();
    const modal = document.querySelector("[data-login-modal]");
    modal.hidden = false;
    modal.querySelector("[data-login-phone-step]").hidden = false;
    modal.querySelector("[data-login-code-step]").hidden = true;
    modal.querySelector("[data-login-success]").hidden = true;
    modal.querySelector("#otp-phone").value = verifiedPhone || "";
    modal.querySelector("#otp-phone").focus();
    document.body.classList.add("locked");
  }

  function closeLogin() {
    const modal = document.querySelector("[data-login-modal]");
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("locked");
    if (otpInterval) clearInterval(otpInterval);
    otpInterval = null;
  }

  function normalizePhone(value) {
    let digits = value.replace(/\D/g, "");
    if (digits.length === 10 && digits.startsWith("0")) digits = `260${digits.slice(1)}`;
    if (digits.length === 9) digits = `260${digits}`;
    return /^260\d{9}$/.test(digits) ? `+${digits}` : null;
  }

  function sendOtp(resend) {
    const modal = document.querySelector("[data-login-modal]");
    const error = modal.querySelector("[data-login-error]");
    const phone = normalizePhone(modal.querySelector("#otp-phone").value);
    error.hidden = true;
    if (!phone) {
      error.textContent = "Enter a valid Zambian phone number, such as +260 97 123 4567.";
      error.hidden = false;
      return;
    }
    otpPhone = phone;
    otpCode = String(Math.floor(1000 + Math.random() * 9000));
    otpDeadline = Date.now() + 60000;
    modal.querySelector("[data-login-phone-step]").hidden = true;
    modal.querySelector("[data-login-code-step]").hidden = false;
    modal.querySelector("[data-otp-message]").textContent = `Enter the simulated code for ${phone}.`;
    modal.querySelector("[data-demo-code]").textContent = `Demo verification code: ${otpCode} (no SMS sent)`;
    modal.querySelector("#otp-code").value = "";
    modal.querySelector("[data-code-error]").hidden = true;
    if (resend) showToast("A new demo verification code is ready.");
    startOtpTimer();
    modal.querySelector("#otp-code").focus();
  }

  function startOtpTimer() {
    if (otpInterval) clearInterval(otpInterval);
    const timer = document.querySelector("[data-otp-timer]");
    const update = () => {
      const seconds = Math.max(0, Math.ceil((otpDeadline - Date.now()) / 1000));
      timer.textContent = seconds ? `Code expires in ${seconds}s` : "Code expired — resend to continue.";
      if (!seconds) { clearInterval(otpInterval); otpInterval = null; }
    };
    update();
    otpInterval = setInterval(update, 1000);
  }

  function verifyOtp() {
    const modal = document.querySelector("[data-login-modal]");
    const error = modal.querySelector("[data-code-error]");
    const input = modal.querySelector("#otp-code");
    error.hidden = true;
    if (Date.now() > otpDeadline) {
      error.textContent = "This code has expired. Request a new one.";
      error.hidden = false;
      return;
    }
    if (input.value !== otpCode) {
      error.textContent = "That code does not match. Please try again.";
      error.hidden = false;
      return;
    }
    verifiedPhone = otpPhone;
    const saved = writeStorage(KEYS.phone, verifiedPhone);
    modal.querySelector("[data-login-code-step]").hidden = true;
    modal.querySelector("[data-login-success]").hidden = false;
    modal.querySelector("[data-login-success-message]").textContent = saved
      ? `${verifiedPhone} is ready for checkout.`
      : `${verifiedPhone} is verified for this visit, but could not be saved.`;
    if (otpInterval) clearInterval(otpInterval);
    otpInterval = null;
    refreshUI();
    setTimeout(closeLogin, 1200);
  }

  function updatePhone() {
    const formattedPhone = verifiedPhone
      ? `${verifiedPhone.slice(0, 4)} ${verifiedPhone.slice(4, 6)} ${verifiedPhone.slice(6, 9)} ${verifiedPhone.slice(9)}`
      : "Phone login";
    document.querySelectorAll("[data-login-label]").forEach(node => { node.textContent = formattedPhone; });
  }

  function openReview() {
    const modal = document.querySelector("[data-review-modal]");
    if (!modal) return;
    closeCart();
    closeMobileNav();
    const phone = modal.querySelector("#review-phone");
    if (verifiedPhone) phone.value = verifiedPhone;
    const phoneNote = modal.querySelector("[data-review-phone-note]");
    phoneNote.textContent = verifiedPhone
      ? "Your OTP-verified phone is filled in. It will receive a verified delivery badge."
      : "Log in with your phone to receive a verified delivery badge on your review.";
    modal.hidden = false;
    document.body.classList.add("locked");
    modal.querySelector("#review-name").focus();
  }

  function closeReview() {
    const modal = document.querySelector("[data-review-modal]");
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("locked");
  }

  function openCatering() {
    closeMobileNav();
    const modal = document.querySelector("[data-catering-modal]");
    if (!modal) return;
    closeCart();
    const form = modal.querySelector("[data-catering-form]");
    const dateInput = form.elements.date;
    const localDate = new Date();
    const today = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    dateInput.min = today;
    const draft = readStorage(KEYS.cateringDraft, null);
    if (draft && typeof draft === "object") {
      Object.entries(draft).forEach(([name, value]) => {
        if (form.elements[name] && typeof value === "string") form.elements[name].value = value;
      });
    }
    if (!form.elements.phone.value && verifiedPhone) form.elements.phone.value = verifiedPhone;
    modal.hidden = false;
    document.body.classList.add("locked");
    form.elements.name.focus();
  }

  function closeCatering() {
    const modal = document.querySelector("[data-catering-modal]");
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("locked");
  }

  function persistCateringDraft() {
    const form = document.querySelector("[data-catering-form]");
    if (!form) return;
    writeStorage(KEYS.cateringDraft, {
      name: form.elements.name.value,
      phone: form.elements.phone.value,
      eventType: form.elements.eventType.value,
      date: form.elements.date.value,
      guestCount: form.elements.guestCount.value,
      venue: form.elements.venue.value,
      menuRequest: form.elements.menuRequest.value
    });
  }

  function submitCateringInquiry(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const error = form.querySelector("[data-catering-error]");
    error.hidden = true;
    const phone = normalizePhone(form.elements.phone.value);
    if (!phone) {
      error.textContent = "Enter a valid Zambian number, such as +260 97 123 4567.";
      error.hidden = false;
      form.elements.phone.focus();
      return;
    }
    const guests = Number(form.elements.guestCount.value);
    if (!Number.isInteger(guests) || guests < 20 || guests > 500) {
      error.textContent = "Guest count must be a whole number between 20 and 500.";
      error.hidden = false;
      form.elements.guestCount.focus();
      return;
    }
    const booking = {
      name: form.elements.name.value.trim(),
      phone,
      eventType: form.elements.eventType.value,
      date: form.elements.date.value,
      guestCount: guests,
      venue: form.elements.venue.value.trim(),
      menuRequest: form.elements.menuRequest.value.trim(),
      submittedAt: new Date().toISOString()
    };
    const previous = readStorage(KEYS.cateringBookings, []);
    const bookings = Array.isArray(previous) ? previous : [];
    writeStorage(KEYS.cateringBookings, [booking, ...bookings].slice(0, 100));
    const message = `🎉 NEW CATERING INQUIRY: ${booking.eventType} for ${booking.guestCount} guests on ${booking.date} at ${booking.venue}. Client: ${booking.name} (${booking.phone}). Notes: ${booking.menuRequest}`;
    window.open(`https://wa.me/${RESTAURANT.phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    removeStorage(KEYS.cateringDraft);
    form.reset();
    closeCatering();
    showToast("Catering inquiry prepared in WhatsApp. Send the message to confirm your request.");
  }

  function setRating(rating) {
    selectedRating = rating;
    document.querySelectorAll("[data-rating]").forEach(button => {
      const active = Number(button.dataset.rating) <= rating;
      button.classList.toggle("selected", active);
      button.classList.remove("preview");
      button.setAttribute("aria-pressed", String(Number(button.dataset.rating) === rating));
    });
  }

  function previewRating(rating) {
    document.querySelectorAll("[data-rating]").forEach(button => {
      const active = rating ? Number(button.dataset.rating) <= rating : Number(button.dataset.rating) <= selectedRating;
      button.classList.toggle("preview", Boolean(rating && active && Number(button.dataset.rating) > selectedRating));
    });
  }

  function submitReview(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.querySelector("#review-name").value.trim();
    const text = form.querySelector("#review-text").value.trim();
    const phone = normalizePhone(form.querySelector("#review-phone").value);
    const serviceTags = [...form.querySelectorAll("[data-review-tag][aria-pressed='true']")].map(button => button.dataset.reviewTag);
    const error = form.querySelector("[data-review-error]");
    error.hidden = true;
    if (!selectedRating || !name || !text || !phone) {
      error.textContent = !phone
        ? "Enter a valid Zambian phone number, such as +260 97 123 4567."
        : "Choose a star rating and enter your name and feedback.";
      error.hidden = false;
      return;
    }
    const saved = readStorage(KEYS.reviews, []);
    const reviews = Array.isArray(saved) ? saved : [];
    reviews.unshift({
      name, text, rating: selectedRating, phone,
      verified: phone === verifiedPhone,
      serviceTags,
      createdAt: new Date().toISOString()
    });
    if (!writeStorage(KEYS.reviews, reviews)) {
      error.textContent = "Your review could not be saved. Please try again.";
      error.hidden = false;
      return;
    }
    document.querySelectorAll("[data-reviews]").forEach(container => renderReviews(container));
    form.reset();
    setRating(0);
    form.querySelectorAll("[data-review-tag]").forEach(button => {
      button.classList.remove("selected");
      button.setAttribute("aria-pressed", "false");
    });
    form.querySelector("#review-phone").value = verifiedPhone;
    closeReview();
    showToast("Thank you — your review has been added.");
  }

  function showToast(message) {
    const toast = document.querySelector("[data-toast]");
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3600);
  }

  function setupNavigation() {
    const page = document.body.dataset.page;
    document.querySelectorAll("[data-nav-page]").forEach(link => {
      if (link.dataset.navPage === page) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
    mobileToggle = document.querySelector("[data-mobile-toggle]");
    mobileNav = document.querySelector("[data-mobile-nav]");
    const navActions = document.querySelector(".nav-actions");
    if (navActions && !navActions.querySelector(".tracker-nav-button")) {
      const trackerButton = document.createElement("button");
      trackerButton.type = "button";
      trackerButton.className = "tracker-nav-button";
      trackerButton.dataset.openTracker = "";
      trackerButton.innerHTML = `<span aria-hidden="true">⌖</span><span>Track Current Order</span>`;
      navActions.insertBefore(trackerButton, navActions.querySelector("[data-open-cart], .mobile-toggle") || null);
    }
    if (mobileToggle && mobileNav) {
      mobileNav.setAttribute("aria-hidden", "true");
      const closeButton = document.createElement("button");
      closeButton.type = "button";
      closeButton.className = "mobile-nav-close";
      closeButton.setAttribute("aria-label", "Close navigation");
      closeButton.innerHTML = "<span>QuickMenu Navigation</span><span aria-hidden=\"true\">✕</span>";
      mobileNav.prepend(closeButton);

      const cateringButton = document.createElement("button");
      cateringButton.type = "button";
      cateringButton.className = "button mobile-nav-catering";
      cateringButton.dataset.cateringOpen = "";
      cateringButton.textContent = "Chilanga Mulilo & event catering";
      mobileNav.append(cateringButton);

      const reviewButton = document.createElement("button");
      reviewButton.type = "button";
      reviewButton.className = "button button-outline mobile-nav-review";
      reviewButton.dataset.reviewOpen = "";
      reviewButton.textContent = "⭐ Rate your delivery";
      mobileNav.append(reviewButton);

      const trackingButton = document.createElement("button");
      trackingButton.type = "button";
      trackingButton.className = "button button-outline mobile-nav-review";
      trackingButton.dataset.openTracker = "";
      trackingButton.innerHTML = `<span aria-hidden="true">⌖</span> Track Current Order`;
      mobileNav.append(trackingButton);

      document.body.append(mobileNav);

      mobileBackdrop = document.createElement("button");
      mobileBackdrop.type = "button";
      mobileBackdrop.className = "mobile-nav-backdrop";
      mobileBackdrop.setAttribute("aria-label", "Close navigation");
      mobileBackdrop.hidden = true;
      document.body.append(mobileBackdrop);

      closeButton.addEventListener("click", closeMobileNav);
      mobileBackdrop.addEventListener("click", closeMobileNav);
      mobileToggle.addEventListener("click", () => {
        if (mobileNav.classList.contains("open")) closeMobileNav();
        else openMobileNav();
      });
      mobileNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMobileNav));
      mobileNav.querySelectorAll("[data-login-open], [data-catering-open], [data-review-open], [data-open-tracker]").forEach(button => button.addEventListener("click", closeMobileNav));
    }
    document.querySelectorAll("[data-review-open]").forEach(button => button.addEventListener("click", openReview));
    document.querySelectorAll("[data-login-open]").forEach(button => button.addEventListener("click", openLogin));
    document.querySelectorAll("[data-open-cart]").forEach(button => button.addEventListener("click", openCart));
    document.querySelectorAll("[data-open-tracker]").forEach(button => button.addEventListener("click", openOrderTracking));
    document.querySelectorAll("[data-catering-open]").forEach(button => button.addEventListener("click", openCatering));
  }

  function openMobileNav() {
    if (!mobileNav || !mobileBackdrop || !mobileToggle) return;
    mobileNav.classList.add("open");
    mobileBackdrop.hidden = false;
    requestAnimationFrame(() => mobileBackdrop.classList.add("visible"));
    mobileNav.setAttribute("aria-hidden", "false");
    mobileToggle.setAttribute("aria-expanded", "true");
  }

  function closeMobileNav() {
    if (!mobileNav || !mobileBackdrop || !mobileToggle) return;
    mobileNav.classList.remove("open");
    mobileBackdrop.classList.remove("visible");
    if (mobileNav.contains(document.activeElement)) mobileToggle.focus();
    mobileNav.setAttribute("aria-hidden", "true");
    mobileToggle.setAttribute("aria-expanded", "false");
    setTimeout(() => {
      if (!mobileNav.classList.contains("open")) mobileBackdrop.hidden = true;
    }, 250);
  }

  function setupGallery() {
    const filters = document.querySelectorAll("[data-gallery-filter]");
    const items = document.querySelectorAll("[data-gallery-category]");
    filters.forEach(button => button.addEventListener("click", () => {
      filters.forEach(filter => filter.classList.toggle("active", filter === button));
      const selected = button.dataset.galleryFilter;
      items.forEach(item => { item.hidden = selected !== "all" && item.dataset.galleryCategory !== selected; });
    }));
  }

  function setupContactForm() {
    const form = document.querySelector("[data-contact-form]");
    if (!form) return;
    form.addEventListener("submit", event => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const topic = String(data.get("topic") || "").trim();
      const message = String(data.get("message") || "").trim();
      const body = `Hello ${RESTAURANT.name},%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0ATopic: ${encodeURIComponent(topic)}%0A%0A${encodeURIComponent(message)}`;
      window.open(`https://wa.me/${RESTAURANT.phone}?text=${body}`, "_blank", "noopener");
      showToast("Your message is ready to send in WhatsApp.");
      form.reset();
    });
  }

  function init() {
    loadState();
    mountSharedUI();
    setupNavigation();
    renderFeatured();
    renderMenu();
    setupMenuFilters();
    renderReviews(document.querySelector("[data-reviews]"), 3);
    setupGallery();
    setupContactForm();
    refreshUI();
    renderOrderTracking();
    startOrderTrackingUpdates();
    if (invalidSavedBeerQuantity) showToast("A saved beer quantity was below the 3-bottle minimum, so that item was removed from your basket.");
    document.querySelectorAll("[data-contact-phone]").forEach(link => {
      link.href = `https://wa.me/${RESTAURANT.phone}`;
      link.textContent = `+${RESTAURANT.phone.slice(0, 3)} ${RESTAURANT.phone.slice(3, 5)} ${RESTAURANT.phone.slice(5, 8)} ${RESTAURANT.phone.slice(8)}`;
    });
    document.querySelectorAll("[data-year]").forEach(node => { node.textContent = new Date().getFullYear(); });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
