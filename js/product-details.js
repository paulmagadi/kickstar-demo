// ========================================
// WISHLIST FUNCTIONALITY
// ========================================
// const WISHLIST_STORAGE_KEY = 'user_wishlist';

// Get wishlist from localStorage
function getWishlist() {
    const wishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return wishlist ? JSON.parse(wishlist) : [];
}

// Save wishlist to localStorage
function saveWishlist(wishlist) {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
}

// Add product to wishlist
function addToWishlist(productId, variantIndex = 0) {
    const wishlist = getWishlist();
    const itemId = `${productId}-${variantIndex}`;
    
    // Check if item is already in wishlist
    if (!wishlist.some(item => item.id === itemId)) {
        const product = productsData.find(p => p.id === productId);
        const variant = product.variants[variantIndex];
        
        wishlist.push({
            id: itemId,
            productId: productId,
            variantIndex: variantIndex,
            name: product.name,
            color: variant.color,
            price: variant.sizes[0].sale_price || variant.sizes[0].price,
            image: variant.images[0],
            addedAt: new Date().toISOString()
        });
        
        saveWishlist(wishlist);
        updateWishlistUI();
        showWishlistMessage('Product added to wishlist', 'success');
        return true;
    }
    
    showWishlistMessage('Product already in wishlist', 'info');
    return false;
}

// Remove product from wishlist
function removeFromWishlist(productId, variantIndex = 0) {
    const wishlist = getWishlist();
    const itemId = `${productId}-${variantIndex}`;
    const updatedWishlist = wishlist.filter(item => item.id !== itemId);
    
    saveWishlist(updatedWishlist);
    updateWishlistUI();
    showWishlistMessage('Product removed from wishlist', 'info');
    return true;
}

// Check if product is in wishlist
function isInWishlist(productId, variantIndex = 0) {
    const wishlist = getWishlist();
    const itemId = `${productId}-${variantIndex}`;
    return wishlist.some(item => item.id === itemId);
}

// Update wishlist count in header
function updateWishlistCount() {
    const wishlist = getWishlist();
    const countElement = document.getElementById('wishlist-count');
    if (countElement) {
        countElement.textContent = wishlist.length;
    }
}

// Update wishlist button state
function updateWishlistButton() {
    const wishlistBtn = document.getElementById('add-to-wishlist-btn');
    if (!wishlistBtn) return;
    
    if (isInWishlist(productId, currentVariantIndex)) {
        wishlistBtn.innerHTML = 'Remove from Wishlist <i class="ri-heart-fill"></i>';
        wishlistBtn.title = "Remove from Wishlist";
        wishlistBtn.classList.add('in-wishlist');
    } else {
        wishlistBtn.innerHTML = 'Add to Wishlist <i class="ri-heart-line"></i>';
        wishlistBtn.title = "Add to Wishlist";
        wishlistBtn.classList.remove('in-wishlist');
    }
}

// Update all wishlist UI elements
function updateWishlistUI() {
    updateWishlistCount();
    updateWishlistButton();
}

// Show wishlist message
function showWishlistMessage(message, type = 'info') {
    const messageEl = document.getElementById('add-wishlist-message');
    if (!messageEl) return;
    
    messageEl.textContent = message;
    messageEl.className = `wishlist-message ${type}`;
    messageEl.style.display = 'block';
    
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 3000);
}

// Initialize wishlist functionality
function initWishlistFunctionality() {
    // Update UI on page load
    updateWishlistUI();
    
    // Add individual click handler for wishlist button
    const wishlistBtn = document.getElementById('add-to-wishlist-btn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent form submission
            
            if (isInWishlist(productId, currentVariantIndex)) {
                removeFromWishlist(productId, currentVariantIndex);
            } else {
                addToWishlist(productId, currentVariantIndex);
            }
        });
    }
}

// ========================================
// MODIFIED FORM SUBMISSION HANDLER
// ========================================

function setupFormHandler() {
    const form = document.getElementById("variant-form");
    if (!form) return;
    
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Check which button was clicked
        const submitter = e.submitter;
        
        if (submitter && submitter.id === 'add-to-wishlist-btn') {
            // Wishlist button was clicked - already handled by individual click handler
            return;
        }
        
        // Otherwise, handle add to cart
        const opt = sizeSelect.selectedOptions[0];
        const sizeIndex = sizeSelect.value;
        const qty = parseInt(qtyInput.value, 10);
        const stock = opt ? parseInt(opt.dataset.stock, 10) : 0;
        const message = document.getElementById("add-cart-message");
        const messageErr = document.getElementById("add-cart-message-err");

        if (!sizeIndex) {
            messageErr.style.display = "block";
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
        qtyInput.value = 1; // reset quantity to default (1)

        message.textContent = `Added ${qty} item(s) of ${product.name} (${variant.color}, Size ${sizeObj.size}) to cart!`;
        setTimeout(() => message.textContent = "", 3000);
    });
}

// ========================================
// ADD CSS STYLES
// ========================================

// Add this CSS for the wishlist button states
const wishlistStyles = `
    <style>
        .add-to-wishlist-btn {
            background: #f8f9fa;
            color: #333;
            border: 2px solid #ddd;
            padding: 12px 20px;
            margin-top: 10px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
        }
        
        .add-to-wishlist-btn:hover {
            background: #e9ecef;
            border-color: #adb5bd;
        }
        
        .add-to-wishlist-btn.in-wishlist {
            background: #fff5f5;
            color: #e74c3c;
            border-color: #e74c3c;
        }
        
        .add-to-wishlist-btn.in-wishlist:hover {
            background: #ffe6e6;
        }
        
        .add-to-wishlist-btn i {
            font-size: 16px;
        }
        
        .wishlist-message {
            padding: 10px;
            margin-top: 10px;
            border-radius: 4px;
            font-size: 14px;
            display: none;
        }
        
        .wishlist-message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .wishlist-message.info {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
    </style>
`;

// Add the styles to the document
document.head.insertAdjacentHTML('beforeend', wishlistStyles);

// ========================================
// MODIFIED PRODUCT DETAILS LOGIC
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

// Move these variables to global scope
let currentVariantIndex = 0;
let sizeSelect, qtyInput, product;

// --- 🏷️ Product Details Logic ---
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));
product = productsData.find(p => p.id === productId);

if (!product) {
    document.querySelector(".product-details-container").innerHTML = "<h2>Product not found.</h2>";
} else {
    document.title = product.name;
    document.getElementById('product-breadcrumb').textContent = product.name;

    const mainImg = document.getElementById("main-product-img");
    const nameEl = document.getElementById("product-name");
    const brandEl = document.getElementById("product-brand");
    const descEl = document.getElementById("product-description");
    const priceEl = document.getElementById("product-price");
    const colorsWrapper = document.querySelector(".product-colors");
    sizeSelect = document.getElementById("variant-select"); // Now global
    const thumbnailsWrapper = document.querySelector(".product-thumbnails");
    const quantityContainer = document.querySelector('.quantity-container');
    qtyInput = document.getElementById("qty-input"); // Now global
    const decreaseBtn = document.getElementById("qty-decrease");
    const increaseBtn = document.getElementById("qty-increase");
    const leftScrollBtn = document.querySelector(".thumbnail-scroll-left");
    const rightScrollBtn = document.querySelector(".thumbnail-scroll-right");
    const selectedColor = document.getElementById("selected-color");
    const productCategoryEl = document.getElementById("product-category");
    

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
        brandEl.textContent = `${product.brand} |`;
    }

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
             width="60" height="60"
             class="color-btn ${i === 0 ? "selected" : ""}"
             style="border-radius: 4px; cursor: pointer;"
             data-variant-index="${i}">
    `).join("");

    // ✅ Attach color switching
    document.querySelectorAll(".color-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".color-btn").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            currentVariantIndex = parseInt(btn.dataset.variantIndex);
            updateVariantUI(currentVariantIndex);
            updateWishlistButton(); // Update wishlist button when variant changes
        });
    });

    // ✅ Initialize first variant
    updateVariantUI(currentVariantIndex);

    // --- 🔄 Update variant images, sizes, and price ---
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
            priceEl.innerHTML = `<strong style="color:red;">KES ${variant.sizes[0].sale_price}</strong> &nbsp; <span style="text-decoration:line-through; color:gray;">KES ${variant.sizes[0].price}</span>`;
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
        quantityContainer.style.display = "flex";
        const messageErr = document.getElementById("add-cart-message-err");
        messageErr.innerHTML = "";
        sizeSelect.style.border = "1px solid #ccc"; // reset red border when valid
        updatePriceUI(e.target.selectedOptions[0]);
        qtyInput.value = 1; // reset quantity to default (1)
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
        // update after a short delay to account for smooth scrolling start
        setTimeout(() => requestAnimationFrame(updateScrollButtons), 150);
    });

    rightScrollBtn.addEventListener("click", () => {
        thumbnailsWrapper.scrollBy({ left: 100, behavior: "smooth" });
        setTimeout(() => requestAnimationFrame(updateScrollButtons), 150);
    });

    // Update buttons while the user scrolls (fires continuously)
    thumbnailsWrapper.addEventListener("scroll", () => {
        requestAnimationFrame(updateScrollButtons);
    });

    // Recalculate on resize (layout changes)
    window.addEventListener("resize", () => {
        requestAnimationFrame(updateScrollButtons);
    });

    // Ensure correct initial state
    requestAnimationFrame(updateScrollButtons);

    // Initialize wishlist functionality and form handler
    initWishlistFunctionality();
    setupFormHandler();
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
}

if (product) {
    renderRelatedProducts(product);
}

// Make functions available globally
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.isInWishlist = isInWishlist;
window.getWishlist = getWishlist;