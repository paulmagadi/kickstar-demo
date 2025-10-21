
// // --- Cart Utilities ---
// document.addEventListener("DOMContentLoaded", renderHeader);
// const cart = document.querySelector('.cart');
// function getCart() { return JSON.parse(localStorage.getItem("cart") || "[]"); }
// function setCart(cart) { localStorage.setItem("cart", JSON.stringify(cart)); }
// function updateCartCount() {
//     const cart = getCart();
//     const count = cart.reduce((sum, item) => sum + item.qty, 0);
//     document.getElementById("cart-count").textContent = count;
// }

// // --- Render Cart Page ---
// function renderCart() {
//     const cart = getCart();
//     const body = document.getElementById("cart-body");
//     const totalEl = document.getElementById("cart-total");
//     body.innerHTML = "";
//     let total = 0;

//     if (cart.length === 0) {
//         body.innerHTML = `<tr><td colspan="6">Your cart is empty.</td></tr>`;
//         totalEl.textContent = "0";
//         return;
//     }

//     cart.forEach((item, index) => {
//         // 🔗 Lookup actual stock from productsData
//         let stock = 1;
//         try {
//             const product = productsData[item.productIndex];
//             const variant = product.variants[item.variantIndex];
//             const sizeObj = variant.sizes[item.sizeIndex];
//             stock = sizeObj.stock_quantity;
//         } catch (e) {
//             stock = 1; // fallback if data not found
//         }

//         // Clamp qty if above stock
//         if (item.qty > stock) item.qty = stock;

//         const subtotal = item.qty * item.price;
//         total += subtotal;

//         body.innerHTML +=
//             `
//             <tr>
//             <td><a href="../pages/product-details.html?id=${index}" title="View Product"><img src="${item.image}" alt="${item.name}"></a></td>
//             <td><a href="../pages/product-details.html?id=${index}" title="View Product">${item.name}</a><br><small>${item.color}, Size ${item.size}</small></td>
//             <td>KES ${item.price}</td>
//             <td>
//                 <input type="number" class="qty-input" min="1" max="${stock}" value="${item.qty}" data-index="${index}">
//                 ${stock === 0 ? "<br><small style='color:red;'>Out of Stock</small>" : ""}
//             </td>
//             <td>KES ${subtotal}</td>
//             <td><button class="remove-btn" data-index="${index}">X</button></td>
//             </tr>
//             `;
//     });

//     totalEl.textContent = total;

//     // Quantity change events
//     document.querySelectorAll(".qty-input").forEach(input => {
//         input.addEventListener("change", (e) => {
//             const index = e.target.dataset.index;
//             let cart = getCart();
//             let newQty = parseInt(e.target.value, 10);
//             const product = productsData[cart[index].productIndex];
//             const variant = product.variants[cart[index].variantIndex];
//             const sizeObj = variant.sizes[cart[index].sizeIndex];
//             const stock = sizeObj.stock_quantity;

//             if (newQty < 1) newQty = 1;
//             if (newQty > stock) newQty = stock;

//             cart[index].qty = newQty;
//             setCart(cart);
//             renderCart();
//             updateCartCount();
//         });
//     });

//     // Remove item
//     document.querySelectorAll(".remove-btn").forEach(btn => {
//         btn.addEventListener("click", (e) => {
//             const index = e.target.dataset.index;
//             let cart = getCart();
//             cart.splice(index, 1);
//             setCart(cart);
//             renderCart();
//             updateCartCount();
//         });
//     });
// }

// // --- On Load ---
// updateCartCount();
// renderCart();





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


// window.getPageContext = getPageContext;
function renderCart() {
    const { linkBase } = getPageContext();
    const cart = getCart();
    const body = document.getElementById("cart-body");
    const totalEl = document.getElementById("cart-total");


    if (!body || !totalEl) return;

    body.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        body.innerHTML = `<tr><td colspan="6">Your cart is empty.</td></tr>`;
        totalEl.textContent = "0.00";
        return;
    }

    cart.forEach((item, index, id) => {
        // Fetch product data safely
        let stock = 1;
        try {
            const product = products.find(p => p.id === item.productId);
            const variant = product?.variants[item.variantIndex];
            const sizeObj = variant?.sizes[item.sizeIndex];
            stock = sizeObj?.stock_quantity ?? 1;
        } catch (e) { stock = 1; }

        // Clamp qty
        if (item.qty > stock) item.qty = stock;

        const subtotal = item.qty * item.price;
        total += subtotal;

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
                    <input type="number" class="qty-input" min="1" max="${stock}" value="${item.qty}" data-index="${index}">
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
    // Quantity updates
    document.querySelectorAll(".qty-input").forEach(input => {
        input.addEventListener("change", (e) => {
            const index = e.target.dataset.index;
            const newQty = Math.max(1, parseInt(e.target.value, 10) || 1);
            let cart = getCart();

            // Re-check stock
            const item = cart[index];
            const product = productsData.find(p => p.id === item.productId);
            const variant = product?.variants[item.variantIndex];
            const sizeObj = variant?.sizes[item.sizeIndex];
            const stock = sizeObj?.stock_quantity ?? 1;

            cart[index].qty = Math.min(newQty, stock);
            setCart(cart);
            renderCart();
            updateCartCount();
        });
    });

    // Remove items
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            let cart = getCart();
            cart.splice(index, 1);
            setCart(cart);
            renderCart();
            updateCartCount();
        });
    });
}
