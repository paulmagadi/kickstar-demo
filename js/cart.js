// cart-utils.js
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    if (document.querySelector(".cart-layout")) renderCart();
});

/* -----------------------------
   🔹 Utility Functions
----------------------------- */
function getCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
}

function setCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartCountEl = document.getElementById("cart-count");
    if (cartCountEl) cartCountEl.textContent = count;
document.getElementById("cart-quantity").textContent = `${count} items`;
}


/* -----------------------------
   🔹 Render Cart Layout
----------------------------- */
function renderCart() {
    const { linkBase } = getPageContext();
    const cart = getCart();
    const cartLayout = document.querySelector(".cart-layout");
    const totalEl = document.getElementById("cart-total");

    if (!cartLayout) return;
    cartLayout.innerHTML = "";

    // Empty cart case
    if (cart.length === 0) {
        cartLayout.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
        if (totalEl) totalEl.textContent = "0.00";
        return;
    }

    const cartItems = document.createElement("div");
    cartItems.classList.add("cart-items");

    let subtotal = 0;

    // Render each cart item
    cart.forEach((item, index) => {
        let stock = 1;

        try {
            const product = productsData.find(p => p.id === item.productId);
            const variant = product?.variants[item.variantIndex];
            const sizeObj = variant?.sizes[item.sizeIndex];
            stock = sizeObj?.stock_quantity ?? 1;
        } catch {
            stock = 1;
        }

        if (item.qty > stock) item.qty = stock;

        const itemSubtotal = item.qty * item.price;
        subtotal += itemSubtotal;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div class="item-image">
                    <a href="${linkBase}product-details.html?id=${item.productId}" title="View ${item.name}">
                        <img src="${item.image}" alt="${item.name}">
                    </a>
                </div>
                <div class="item-details">
                    <a href="${linkBase}product-details.html?id=${item.productId}" title=" View ${item.name}">
                        <h3 class="item-name">${item.name}</h3>
                    </a>
                    <small>${item.color}, Size ${item.size}</small>

                    <div class="item-price">KES ${item.price.toFixed(2)}</div>

                    <div class="item-actions">
                        <div class="cart-qty" data-index="${index}">
                            <button type="button" class="qty-btn minus">−</button>
                            <span class="qty-value">${item.qty}</span>
                            <button type="button" class="qty-btn plus">+</button>
                        </div>

                        ${stock === 0 ? "<small class='stock-warning'>Out of Stock</small>" : ""}

                        <button class="remove-btn" data-index="${index}" title="Remove item"><i class="fa-solid fa-trash"></i> Remove</button>
                    </div>
                </div>
            </div>
        `;
    });

    // Append cart items section
    cartLayout.appendChild(cartItems);

    // Render order summary
    const shipping = 300; // Example shipping cost
    const tax = Math.round(subtotal * 0.16); // 16% tax example
    const total = subtotal + shipping + tax;

    const summary = document.createElement("div");
    summary.classList.add("cart-summary");
    summary.innerHTML = `
        <h2 class="summary-title">Order Summary</h2>
        <div class="summary-row"><span>Subtotal</span><span>KES ${subtotal.toFixed(2)}</span></div>
        <div class="summary-row"><span>Shipping</span><span>KES ${shipping.toFixed(2)}</span></div>
        <div class="summary-row"><span>Tax</span><span>KES ${tax.toFixed(2)}</span></div>
        <div class="summary-row summary-total"><span>Total</span><span>KES ${total.toFixed(2)}</span></div>

        <a href="../pages/checkout.html"><button class="checkout-btn"  title="Proceed to Checkout">Proceed to Checkout</button></a>
        
        <div class="continue-shopping">
            <a href="../index.html" title="Home">← Continue Shopping</a>
        </div>
    `;
    cartLayout.appendChild(summary);

    if (totalEl) totalEl.textContent = total.toFixed(2);
    attachCartEventHandlers();
}

/* -----------------------------
   🔹 Quantity and Remove Controls
----------------------------- */
function attachCartEventHandlers() {
    // Quantity update
    document.querySelectorAll(".cart-qty").forEach(container => {
        const index = container.dataset.index;
        const minusBtn = container.querySelector(".minus");
        const plusBtn = container.querySelector(".plus");
        const qtyValue = container.querySelector(".qty-value");

        const cart = getCart();
        const item = cart[index];
        const product = productsData.find(p => p.id === item.productId);
        const variant = product?.variants[item.variantIndex];
        const sizeObj = variant?.sizes[item.sizeIndex];
        const stock = sizeObj?.stock_quantity ?? 1;

        updateQtyButtonState(minusBtn, plusBtn, item.qty, stock);

        minusBtn.addEventListener("click", () => {
            const newQty = parseInt(qtyValue.textContent) - 1;
            updateQuantityLive(index, newQty, container);
        });

        plusBtn.addEventListener("click", () => {
            const newQty = parseInt(qtyValue.textContent) + 1;
            updateQuantityLive(index, newQty, container);
        });
    });

    // Remove item
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            const index = e.target.dataset.index;
            if (confirm("Remove this item from cart?")) {
                const cart = getCart();
                cart.splice(index, 1);
                setCart(cart);
                renderCart();
                updateCartCount();
                updateCartTotal();
            }
        });
    });
}

function updateQtyButtonState(minusBtn, plusBtn, qty, stock) {
    minusBtn.disabled = qty <= 1;
    plusBtn.disabled = qty >= stock;
}

/* -----------------------------
   🔹 Live Quantity Update
----------------------------- */
function updateQuantityLive(index, newQty, container) {
    const cart = getCart();
    const item = cart[index];

    const product = productsData.find(p => p.id === item.productId);
    const variant = product?.variants[item.variantIndex];
    const sizeObj = variant?.sizes[item.sizeIndex];
    const stock = sizeObj?.stock_quantity ?? 1;

    const qty = Math.max(1, Math.min(newQty, stock));
    cart[index].qty = qty;
    setCart(cart);

    // Update UI
    const qtyValue = container.querySelector(".qty-value");
    qtyValue.textContent = qty;
    updateQtyButtonState(container.querySelector(".minus"), container.querySelector(".plus"), qty, stock);

    updateCartTotal();
    updateCartCount();
}

/* -----------------------------
   🔹 Update Total Live
----------------------------- */
function updateCartTotal() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const shipping = 300; 
    const tax = Math.round(subtotal * 0.16); // Example 16% VAT
    const total = subtotal + shipping + tax;

    // Update any summary rows if present
    const subtotalEl = document.querySelector(".summary-row span:nth-child(2)");
    const shippingEl = document.querySelector(".summary-row:nth-child(3) span:nth-child(2)");
    const taxEl = document.querySelector(".summary-row:nth-child(4) span:nth-child(2)");
    const totalEl = document.querySelector(".summary-total span:nth-child(2)");

    if (subtotalEl) subtotalEl.textContent = `KES ${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `KES ${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `KES ${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `KES ${total.toFixed(2)}`;
}


/* -----------------------------
   🔹 Clear Cart
----------------------------- */
const clearBtn = document.getElementById("clear-cart-btn");
if (clearBtn) {
    clearBtn.addEventListener("click", () => {
        if (confirm("Clear your cart?")) {
            localStorage.removeItem("cart");
            renderCart();
            updateCartCount();
        }
    });
}
