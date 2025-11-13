// ========================================
// PRODUCT DETAILS LOGIC
// ========================================

// --- Cart Utilities ---
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

// let currentVariantIndex = 0;
let sizeSelect, qtyInput, product;

// --- Product Details Logic ---
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));
const variantParam = params.get("variant");
// Use the variant from URL or default to 0
let currentVariantIndex = variantParam !== null ? parseInt(variantParam) : 0;
product = productsData.find(p => p.id === productId);

// Make sure to update the global variable
window.currentVariantIndex = currentVariantIndex;
window.productId = productId;

if (!product) {
    document.querySelector(".product-details-container").innerHTML = "<h2>Product not found.</h2>";
} else {
    document.title = `${product.name} ${product.category ? `for ${product.category}` : ""} . Kickstar`;
    document.getElementById('product-breadcrumb').textContent = product.name;

    const mainImg = document.getElementById("main-product-img");
    const nameEl = document.getElementById("product-name");
    const brandEl = document.getElementById("product-brand");
    const descEl = document.getElementById("product-description");
    const priceEl = document.getElementById("product-price");
    const colorsWrapper = document.querySelector(".product-colors");
    sizeSelect = document.getElementById("variant-select");
    const thumbnailsWrapper = document.querySelector(".product-thumbnails");
    const quantityContainer = document.querySelector('.quantity-container');
    qtyInput = document.getElementById("qty-input");
    const decreaseBtn = document.getElementById("qty-decrease");
    const increaseBtn = document.getElementById("qty-increase");
    const leftScrollBtn = document.querySelector(".thumbnail-scroll-left");
    const rightScrollBtn = document.querySelector(".thumbnail-scroll-right");
    const selectedColor = document.getElementById("selected-color");
    const productCategoryEl = document.getElementById("product-category");

    // Get wishlist button
    const wishlistBtn = document.getElementById('add-to-wishlist-btn');
    
    nameEl.textContent = product.name;
    descEl.textContent = product.description;
    productCategoryEl.textContent = product.category;

    // Breadcrumb
    const categoryBreadcrumbEl = document.getElementById("category-breadcrumb");
    if (categoryBreadcrumbEl) {
        categoryBreadcrumbEl.textContent = product.category;
        categoryBreadcrumbEl.title = product.category;
        const href = `category.html?cat=${encodeURIComponent(product.category.toLowerCase())}`;
        categoryBreadcrumbEl.setAttribute("href", href);
    }

    if (product.brand) {
        brandEl.textContent = product.brand;
    }

    // ✅ Fix image paths
    product.variants.forEach(variant => {
        variant.images = variant.images.map(img => {
            if (img.startsWith("./images/")) return img.replace("./images/", "../images/");
            return img;
        });
    });

    // ✅ Render color swatches - use the currentVariantIndex from URL
    colorsWrapper.innerHTML = product.variants.map((variant, i) => `
        <img src="${variant.images[0] || ''}"
             title="${variant.color}"
             width="60" height="60"
             class="color-btn ${i === currentVariantIndex ? "selected" : ""}"
             style="border-radius: 4px; cursor: pointer;"
             data-variant-index="${i}">
    `).join("");

    // ✅ Attach color switching
    document.querySelectorAll(".color-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".color-btn").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            currentVariantIndex = parseInt(btn.dataset.variantIndex);

            window.currentVariantIndex = currentVariantIndex;

            updateVariantUI(currentVariantIndex);
            
            // Update wishlist button for the NEW current variant
            if (typeof updateProductDetailsWishlistButton === 'function') {
                updateProductDetailsWishlistButton();
            }
           
        });
    });

    updateVariantUI(currentVariantIndex);
    
    // --- Update variant images, sizes, and price ---
    function updateVariantUI(variantIndex) {
        const variant = product.variants[variantIndex];
        mainImg.src = variant.images[0];
        mainImg.dataset.default = variant.images[0];
        selectedColor.textContent = variant.color;

        // ✅ Build thumbnails
        thumbnailsWrapper.innerHTML = variant.images.map((src, index) => `
            <img src="${src}" 
            class="thumbnail-img ${index === 0 ? "selected" : ""}">
        `).join("");
        
        requestAnimationFrame(updateScrollButtons);

        thumbnailsWrapper.querySelectorAll(".thumbnail-img").forEach(img => {
            img.addEventListener("click", () => { 
                mainImg.src = img.src;
                document.querySelectorAll(".thumbnail-img").forEach(index => index.classList.remove("selected"));
                img.classList.add("selected");
            });
        });

        updateScrollButtons();

        // Populate size options as boxes instead of dropdown
        const sizeOptionsContainer = document.getElementById('size-options');
        sizeOptionsContainer.innerHTML = variant.sizes.map((size, i) => {
            const isOutOfStock = size.stock_quantity === 0;
            const isOnSale = size.sale_price && size.sale_price < size.price;
            const displayPrice = isOnSale ? size.sale_price : size.price;
            
            return `
                <div class="size-option ${isOutOfStock ? 'out-of-stock' : ''}" 
                    data-size-index="${i}"
                    data-price="${size.price}"
                    data-sale="${size.sale_price || ''}"
                    data-stock="${size.stock_quantity}"
                    ${isOutOfStock ? 'disabled' : ''}>
                    <div class="size-label">${size.size}</div>
                    <div class="size-price">KES ${displayPrice.toFixed(2)}</div>
                    ${isOnSale ? '<div class="size-info">SALE</div>' : ''}
                    <div class="size-stock">${isOutOfStock ? 'OUT OF STOCK' : `${size.stock_quantity} left`}</div>
                </div>
            `;
        }).join('');

        // Update the main price display to show the first available size
        const firstAvailableSize = variant.sizes.find(size => size.stock_quantity > 0);
        if (firstAvailableSize) {
            const isOnSale = firstAvailableSize.sale_price && firstAvailableSize.sale_price < firstAvailableSize.price;
            const displayPrice = isOnSale ? firstAvailableSize.sale_price : firstAvailableSize.price;
            const originalPrice = firstAvailableSize.price;
            
            const priceEl = document.getElementById("product-price");
            priceEl.innerHTML = isOnSale
                ? `<strong style="color:red;">KES ${displayPrice.toFixed(2)}</strong> <span style="text-decoration:line-through; color:gray;">KES ${originalPrice.toFixed(2)}</span>`
                : `<strong>KES ${displayPrice.toFixed(2)}</strong>`;
        }

        // Add click handlers for size options
        sizeOptionsContainer.querySelectorAll('.size-option:not(.out-of-stock)').forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all size options
                sizeOptionsContainer.querySelectorAll('.size-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Add selected class to clicked option
                option.classList.add('selected');
                
                // Show quantity container
                quantityContainer.style.display = "flex";
                const messageErr = document.getElementById("add-cart-message-err");
                messageErr.innerHTML = "";
                
                // Update price display
                updatePriceUI(option);
                qtyInput.value = 1; // reset quantity to default (1)
                setQtyInputMax();
            });
        });

        // Reset size selection
        sizeOptionsContainer.querySelectorAll('.size-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        quantityContainer.style.display = "none";

        // Update the global variable
        window.currentVariantIndex = variantIndex;
        
        // Update wishlist button for the NEW current variant
        if (typeof updateProductDetailsWishlistButton === 'function') {
            updateProductDetailsWishlistButton();
        }
    }


    // --- 🧮 Quantity + Stock Handling ---
    function setQtyInputMax() {
        const selectedSize = document.querySelector('.size-option.selected');
        if (selectedSize && selectedSize.dataset.stock) {
            const stock = parseInt(selectedSize.dataset.stock, 10);
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

    // --- Price UI ---
    function updatePriceUI(sizeOption) {
        if (!sizeOption) return;
        const price = sizeOption.dataset.price;
        const sale = sizeOption.dataset.sale;
        
        const priceEl = document.getElementById("product-price");
        priceEl.innerHTML = sale
            ? `<strong style="color:red;">KES ${sale}</strong> <span style="text-decoration:line-through; color:gray;">KES ${price}</span>`
            : `<strong>KES ${price}</strong>`;
    }

    // --- Thumbnail Scroll ---
    function updateScrollButtons() {
        const scrollWidth = thumbnailsWrapper.scrollWidth;
        const visibleWidth = thumbnailsWrapper.clientWidth;
        const scrollLeft = thumbnailsWrapper.scrollLeft;
        const maxScrollLeft = Math.max(0, scrollWidth - visibleWidth);
        const EPS = 5; // tolerance for small fractional scroll values

        // If there's nothing to scroll, hide both buttons
        if (scrollWidth <= visibleWidth) {
            leftScrollBtn.classList.add("hidden");
            rightScrollBtn.classList.add("hidden");
            return;
        }

        // Hide left when at (or very near) start, show otherwise
        if (scrollLeft <= EPS) {
            leftScrollBtn.classList.add("hidden");
        } else {
            leftScrollBtn.classList.remove("hidden");
        }

        // Hide right when at (or very near) end, show otherwise
        if (scrollLeft >= maxScrollLeft - EPS) {
            rightScrollBtn.classList.add("hidden");
        } else {
            rightScrollBtn.classList.remove("hidden");
        }
    }

    leftScrollBtn.addEventListener("click", () => {
        thumbnailsWrapper.scrollBy({ left: -100, behavior: "smooth" });
        setTimeout(() => requestAnimationFrame(updateScrollButtons), 150);
    });

    rightScrollBtn.addEventListener("click", () => {
        thumbnailsWrapper.scrollBy({ left: 100, behavior: "smooth" });
        setTimeout(() => requestAnimationFrame(updateScrollButtons), 150);
    });

    thumbnailsWrapper.addEventListener("scroll", () => {
        requestAnimationFrame(updateScrollButtons);
    });

    window.addEventListener("resize", () => {
        requestAnimationFrame(updateScrollButtons);
    });

    requestAnimationFrame(updateScrollButtons);

    // --- Add to Cart ---
    document.getElementById("variant-form").addEventListener("submit", e => {
        e.preventDefault();
        
        // Check which button was clicked
        const submitter = e.submitter;
        
        if (submitter && submitter.id === 'add-to-wishlist-btn') {
            // Wishlist button was clicked - let the unified script handle it
            return;
        }
        
        // Otherwise, handle add to cart
        const selectedSizeOption = document.querySelector('.size-option.selected');
        const sizeIndex = selectedSizeOption ? selectedSizeOption.dataset.sizeIndex : null;
        const qty = parseInt(qtyInput.value, 10);
        const stock = selectedSizeOption ? parseInt(selectedSizeOption.dataset.stock, 10) : 0;
        const message = document.getElementById("add-cart-message");
        const messageErr = document.getElementById("add-cart-message-err");

        if (!sizeIndex) {
            messageErr.style.display = "block";
            messageErr.innerHTML = "<small><i class='ri-error-warning-line'></i> Please select a size.</small>";
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
        qtyInput.value = 1; // reset quantity to default (1)

        message.textContent = `Added ${qty} item(s) of ${product.name} (${variant.color}, Size ${sizeObj.size}) to cart!`;
        setTimeout(() => message.textContent = "", 3000);
    });
}

// --- 🔃 Initialize Cart Count ---
updateCartCount();

// Related Products
function renderRelatedProducts(product) {
    const relatedContainer = document.getElementById("related-products");
    if (!relatedContainer) return;

    // Find products in the same category, exclude the current one
    const related = productsData
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 10);

    if (related.length === 0) {
        relatedContainer.innerHTML = "<p>No related products found.</p>";
        return;
    }

    // Render using your existing template function
    relatedContainer.innerHTML = related
        .map(p => createProductCardTemplate(p))
        .join("");

    // Reinitialize swatches + any card interactivity
    if (typeof initProductCardFunctions === "function") {
        initProductCardFunctions();
    }

    // Initialize wishlist functionality for product cards
    if (typeof initProductCardsWishlist === 'function') {
        initProductCardsWishlist();
    }
}

if (product) {
    renderRelatedProducts(product);
}

// Make currentVariantIndex available globally for the wishlist script
window.currentVariantIndex = currentVariantIndex;
window.productId = productId;