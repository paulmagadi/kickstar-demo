
// cart-utils.js
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    if (document.getElementById("cart-body")) {
        renderCart();
    }
});

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
}


function renderCart() {
    const { linkBase } = getPageContext();
    const cart = getCart();
    const cartContainer = document.querySelector(".cart-container");
    const body = document.getElementById("cart-body");
    const totalEl = document.getElementById("cart-total");

    if (!body || !totalEl) return;

    body.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = `<tr><td colspan="6">Your cart is empty.</td></tr>`;
        totalEl.textContent = "0.00";
        return;
    }

    cart.forEach((item, index) => {
        // ✅ Safely get product info
        let stock = 1;
        try {
            const product = productsData.find(p => p.id === item.productId);
            const variant = product?.variants[item.variantIndex];
            const sizeObj = variant?.sizes[item.sizeIndex];
            stock = sizeObj?.stock_quantity ?? 1;
        } catch (e) {
            stock = 1;
        }

        // ✅ Clamp quantity
        if (item.qty > stock) item.qty = stock;

        const subtotal = item.qty * item.price;
        total += subtotal;

        // ✅ Render table row with correct quantity
        body.innerHTML += `
            <tr>
                <td>
                    <a href="${linkBase}product-details.html?id=${item.productId}" title="View Product">
                        <img src="${item.image}" alt="${item.name}">
                    </a>
                </td>
                <td>
                    <a href="${linkBase}product-details.html?id=${item.productId}" title="View Product">${item.name}</a>
                    <br><small>${item.color}, Size ${item.size}</small>
                </td>
                <td>KES ${item.price}</td>
                <td>
                    <div class="cart-qty" data-index="${index}">
                        <button type="button" class="qty-btn minus">−</button>
                        <span class="qty-value">${item.qty}</span>
                        <button type="button" class="qty-btn plus">+</button>
                    </div>
                    ${stock === 0 ? "<br><small style='color:red;'>Out of Stock</small>" : ""}
                </td>

                <td>KES ${subtotal.toFixed(2)}</td>
                <td><button class="remove-btn" data-index="${index}">X</button></td>
            </tr>
        `;
    });

    totalEl.textContent = total.toFixed(2);

    attachCartEventHandlers();
}


function attachCartEventHandlers() {
    // Quantity buttons (+/-)
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

    // Remove items
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            if (confirm(`Are you sure you want to remove this item from your cart?`)) {
            const index = e.target.dataset.index;
            const row = e.target.closest("tr");
            row.style.transition = "opacity 0.3s ease";
            row.style.opacity = "0";

            setTimeout(() => {
                let cart = getCart();
                cart.splice(index, 1);
                setCart(cart);
                renderCart();
                updateCartCount();
            }, 300);
            }
        });

    });
}

function updateQtyButtonState(minusBtn, plusBtn, qty, stock) {
    minusBtn.disabled = qty <= 1;
    plusBtn.disabled = qty >= stock;

    [minusBtn, plusBtn].forEach(btn => {
        if (btn.disabled) {
            btn.style.opacity = "0.5";
            btn.style.cursor = "not-allowed";
        } else {
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
        }
    });
}

// ✅ Live quantity update (no re-render)
function updateQuantityLive(index, newQty, container) {
    let cart = getCart();
    const item = cart[index];
    const product = productsData.find(p => p.id === item.productId);
    const variant = product?.variants[item.variantIndex];
    const sizeObj = variant?.sizes[item.sizeIndex];
    const stock = sizeObj?.stock_quantity ?? 1;

    const qty = Math.max(1, Math.min(newQty, stock));
    cart[index].qty = qty;
    setCart(cart);

    // Update DOM live
    const qtyValue = container.querySelector(".qty-value");
    const minusBtn = container.querySelector(".minus");
    const plusBtn = container.querySelector(".plus");
    qtyValue.textContent = qty;
    updateQtyButtonState(minusBtn, plusBtn, qty, stock);

    qtyValue.style.transition = "transform 0.2s ease";
    qtyValue.style.transform = "scale(1.2)";
    setTimeout(() => (qtyValue.style.transform = "scale(1)"), 150);

    // Update subtotal
    const row = container.closest("tr");
    const subtotalEl = row.querySelector("td:nth-child(5)");
    const subtotal = qty * item.price;
    subtotalEl.textContent = `KES ${subtotal.toFixed(2)}`;

    // Update total
    updateCartTotal();

    // Update header badge
    updateCartCount();
}

// ✅ Update overall total live
function updateCartTotal() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const totalEl = document.getElementById("cart-total");
    if (totalEl) totalEl.textContent = total.toFixed(2);
}


// Clear Cart Button
const clearBtn = document.getElementById("clear-cart-btn");
if (clearBtn) {
    clearBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear your cart?")) {
            localStorage.removeItem("cart");
            renderCart();
            updateCartCount();
        }
    });
}

