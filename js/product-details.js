// --- 🛒 Cart Utilities ---
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

// --- 🏷️ Product Details Logic ---
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));
const product = productsData.find(p => p.id === productId);

if (!product) {
    document.querySelector(".product-details-container").innerHTML = "<h2>Product not found.</h2>";
} else {
    const mainImg = document.getElementById("main-product-img");
    const nameEl = document.getElementById("product-name");
    const typeEl = document.getElementById("product-type");
    const descEl = document.getElementById("product-description");
    const priceEl = document.getElementById("product-price");
    const colorsWrapper = document.querySelector(".product-colors");
    const sizeSelect = document.getElementById("variant-select");
    const thumbnailsWrapper = document.querySelector(".product-thumbnails");
    const quantityContainer = document.querySelector('.quantity-container');
    const qtyInput = document.getElementById("qty-input");
    const decreaseBtn = document.getElementById("qty-decrease");
    const increaseBtn = document.getElementById("qty-increase");
    const leftScrollBtn = document.querySelector(".thumbnail-scroll-left");
    const rightScrollBtn = document.querySelector(".thumbnail-scroll-right");

    nameEl.textContent = product.name;
    typeEl.textContent = product.brand;
    descEl.textContent = product.description;

    let currentVariantIndex = 0;

    // ✅ Fix image paths
    product.variants.forEach(variant => {
        variant.images = variant.images.map(img => {
            if (img.startsWith("./images/")) return img.replace("./images/", "../images/");
            return img;
        });
    });

    // ✅ Render color swatches
    colorsWrapper.innerHTML = product.variants.map((variant, i) => `
        <img src="${variant.images[0] || ''}"
             title="${variant.color}"
             width="40" height="40"
             class="color-btn ${i === 0 ? "selected" : ""}"
             style="border-radius: 50%; cursor: pointer;"
             data-variant-index="${i}">
    `).join("");

    // ✅ Attach color switching
    document.querySelectorAll(".color-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".color-btn").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            currentVariantIndex = parseInt(btn.dataset.variantIndex);
            updateVariantUI(currentVariantIndex);
        });
    });

    // ✅ Initialize first variant
    updateVariantUI(currentVariantIndex);

    // --- 🔄 Update variant images, sizes, and price ---
    function updateVariantUI(variantIndex) {
        const variant = product.variants[variantIndex];
        mainImg.src = variant.images[0];
        mainImg.dataset.default = variant.images[0];

        // ✅ Build thumbnails
        thumbnailsWrapper.innerHTML = variant.images.map(src => `
            <img src="${src}" width="60" height="60"
                 class="thumbnail-img"
                 style="object-fit:cover; margin-right:5px; border:1px solid #ccc; padding:2px; cursor:pointer;">
        `).join("");

        thumbnailsWrapper.querySelectorAll(".thumbnail-img").forEach(img => {
            img.addEventListener("click", () => { mainImg.src = img.src; });
        });

        updateScrollButtons();

        // ✅ Populate size options with default "Select Size"
        sizeSelect.innerHTML = `
            <option value="" selected>Select Size</option>
            ${variant.sizes.map((s, i) => `
                <option value="${i}"
                        data-price="${s.price}"
                        data-sale="${s.sale_price || ""}"
                        data-stock="${s.stock_quantity}"
                        ${s.stock_quantity === 0 ? "disabled style='color:gray;background:#f5f5f5;'" : ""}>
                    Size: ${s.size} | KES ${s.sale_price || s.price} | Stock: ${s.stock_quantity}
                    ${s.stock_quantity === 0 ? " (OUT OF STOCK)" : ""}
                </option>
            `).join("")}
        `;

        if (variant.sizes[0].sale_price && variant.sizes[0].sale_price < variant.sizes[0].price) {
            priceEl.innerHTML = `<strong style="color:red;">KES ${variant.sizes[0].sale_price}</strong> <span style="text-decoration:line-through; color:gray;">KES ${variant.sizes[0].price}</span>`;
        } else {
            priceEl.innerHTML = `<strong>KES ${variant.sizes[0].price}</strong>`
        }

        sizeSelect.style.border = "1px solid #ccc";
        setQtyInputMax();
        
        quantityContainer.style.display = "none";
    }

    // --- 🧮 Quantity + Stock Handling ---
    function setQtyInputMax() {
        const opt = sizeSelect.selectedOptions[0];
        if (opt && opt.dataset.stock) {
            const stock = parseInt(opt.dataset.stock, 10);
            qtyInput.dataset.max = stock;
            if (parseInt(qtyInput.value, 10) > stock) qtyInput.value = stock;
        }
    }

    decreaseBtn.addEventListener("click", () => {
        let qty = parseInt(qtyInput.value, 10) || 1;
        qty = Math.max(1, qty - 1);
        qtyInput.value = qty;
    });

    increaseBtn.addEventListener("click", () => {
        let qty = parseInt(qtyInput.value, 10) || 1;
        const max = parseInt(qtyInput.dataset.max, 10) || 1;
        if (qty < max) qtyInput.value = qty + 1;

    });

    sizeSelect.addEventListener("change", e => {
        quantityContainer.style.display = "block";
        const messageErr = document.getElementById("add-cart-message-err");
        messageErr.innerHTML = "";
        sizeSelect.style.border = "1px solid #ccc"; // reset red border when valid
        updatePriceUI(e.target.selectedOptions[0]);
        setQtyInputMax();
    });

    // --- 💰 Price UI ---
    function updatePriceUI(opt) {
        if (!opt || !opt.dataset.price) return;
        const price = opt.dataset.price;
        const sale = opt.dataset.sale;
        priceEl.innerHTML = sale
            ? `<strong style="color:red;">KES ${sale}</strong> <span style="text-decoration:line-through; color:gray;">KES ${price}</span>`
            : `<strong>KES ${price}</strong>`;
    }

    // --- 🖼️ Thumbnail Scroll ---
    function updateScrollButtons() {
        const scrollWidth = thumbnailsWrapper.scrollWidth;
        const visibleWidth = thumbnailsWrapper.clientWidth;
        if (scrollWidth > visibleWidth) {
            leftScrollBtn.classList.remove("hidden");
            rightScrollBtn.classList.remove("hidden");
        } else {
            leftScrollBtn.classList.add("hidden");
            rightScrollBtn.classList.add("hidden");
        }
    }

    leftScrollBtn.addEventListener("click", () => thumbnailsWrapper.scrollBy({ left: -100, behavior: "smooth" }));
    rightScrollBtn.addEventListener("click", () => thumbnailsWrapper.scrollBy({ left: 100, behavior: "smooth" }));

    // --- 🛍️ Add to Cart ---
    document.getElementById("variant-form").addEventListener("submit", e => {
        e.preventDefault();
        const opt = sizeSelect.selectedOptions[0];
        const sizeIndex = sizeSelect.value;
        const qty = parseInt(qtyInput.value, 10);
        const stock = opt ? parseInt(opt.dataset.stock, 10) : 0;
        const message = document.getElementById("add-cart-message");
        const messageErr = document.getElementById("add-cart-message-err");

        if (!sizeIndex) {
            messageErr.innerHTML = "⚠️ Please select a size.";
            sizeSelect.style.border = "2px solid red";
            return;
        }

        if (qty > stock) return message.textContent = `Only ${stock} item(s) available.`;
        if (qty < 1) return message.textContent = "Quantity must be at least 1.";

        const cart = getCart();
        const variant = product.variants[currentVariantIndex];
        const sizeObj = variant.sizes[sizeIndex];
        const cartKey = `${product.id}-${currentVariantIndex}-${sizeIndex}`;
        const existing = cart.find(item => item.key === cartKey);

        if (existing) {
            existing.qty = Math.min(existing.qty + qty, stock);
        } else {
            cart.push({
                key: cartKey,
                productId,
                variantIndex: currentVariantIndex,
                sizeIndex: parseInt(sizeIndex),
                qty,
                name: product.name,
                color: variant.color,
                size: sizeObj.size,
                price: sizeObj.sale_price || sizeObj.price,
                image: variant.images[0]
            });
        }

        setCart(cart);
        updateCartCount();

        message.textContent = `✅ Added ${qty} item(s) of ${product.name} (${variant.color}, Size ${sizeObj.size}) to cart!`;
        setTimeout(() => message.textContent = "", 3000);
    });
}

// --- 🔃 Initialize Cart Count ---
updateCartCount();
