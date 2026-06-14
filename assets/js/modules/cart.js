import { products } from "../data/products.js";

const STORAGE_KEY = "kousui_cart";

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addToCart(productId, qty = 1) {
  const items = readCart();
  const existing = items.find((i) => i.id === productId);
  if (existing) existing.qty += qty;
  else items.push({ id: productId, qty });
  writeCart(items);
}

function getProductById(id) {
  return products.find((p) => p.id === id);
}

export function initCart() {
  const list = document.getElementById("cartItems");
  const subtotalEl = document.getElementById("cartSubtotal");
  if (!list || !subtotalEl) return;

  const items = readCart();

  if (items.length === 0) {
    list.innerHTML = "<p>Your cart is empty.</p>";
    subtotalEl.textContent = "0";
    return;
  }

  const subtotal = items.reduce((sum, it) => {
    const p = getProductById(it.id);
    return sum + (p ? p.price * it.qty : 0);
  }, 0);

  list.innerHTML = items
    .map((it) => {
      const p = getProductById(it.id);
      if (!p) return "";
      return `
        <div class="cart-item">
          <div>
            <strong>${p.name}</strong>
            <div class="muted">Qty: ${it.qty}</div>
          </div>
          <div>₹${(p.price * it.qty).toLocaleString()}</div>
        </div>
      `;
    })
    .join("");

  subtotalEl.textContent = subtotal.toLocaleString();
}

export function initAddToCartButtons() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-cart");
    if (!btn) return;
    const id = btn.getAttribute("data-id");
    if (!id) return;
    addToCart(id, 1);
    btn.textContent = "Added";
    setTimeout(() => (btn.textContent = "Add to cart"), 900);
  });
}

