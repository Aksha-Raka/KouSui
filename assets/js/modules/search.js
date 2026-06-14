import { products } from "../data/products.js";

export function initSearch() {
  const input = document.getElementById("searchInput");
  const grid = document.getElementById("productsGrid");
  if (!input || !grid) return;

  const render = (items) => {
    grid.innerHTML = items
      .map(
        (p) => `
          <article class="product-card">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <div class="product-price">₹${p.price.toLocaleString()}</div>
            <button class="btn add-to-cart" data-id="${p.id}">Add to cart</button>
          </article>
        `
      )
      .join("");
  };

  const filter = (q) => {
    const query = q.trim().toLowerCase();
    if (!query) return products;
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    });
  };

  render(products);

  input.addEventListener("input", () => {
    render(filter(input.value));
  });
}

