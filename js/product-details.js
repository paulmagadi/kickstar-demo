// ========================================
// PRODUCT DETAILS LOGIC
// ========================================

// Cart Management Functions
function getCurrentUserId() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    return currentUser ? currentUser.id : 'guest';
}

function getCart() {
    const userId = getCurrentUserId();
    const userCarts = JSON.parse(localStorage.getItem("userCarts") || "{}");
    return userCarts[userId] || [];
}

function setCart(cart) {
    const userId = getCurrentUserId();
    const userCarts = JSON.parse(localStorage.getItem("userCarts") || "{}");
    userCarts[userId] = cart;
    localStorage.setItem("userCarts", JSON.stringify(userCarts));
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartCountEl = document.getElementById("cart-count");
    if (cartCountEl) cartCountEl.textContent = count;
}

// Product Details Initialization
class ProductDetails {
    constructor() {
        this.product = null;
        this.currentVariantIndex = 0;
        this.sizeSelect = null;
        this.qtyInput = null;
        this.init();
    }

    init() {
        this.loadProduct();
        this.setupEventListeners();
        updateCartCount();
    }

    loadProduct() {
        const params = new URLSearchParams(window.location.search);
        const productId = parseInt(params.get("id"));
        const variantParam = params.get("variant");
        
        this.currentVariantIndex = variantParam !== null ? parseInt(variantParam) : 0;
        this.product = productsData.find(p => p.id === productId);

        // Make available globally for wishlist script
        window.currentVariantIndex = this.currentVariantIndex;
        window.productId = productId;

        if (!this.product) {
            document.querySelector(".product-details-container").innerHTML = "<h2>Product not found.</h2>";
            return;
        }

        this.renderProduct();
        renderRelatedProducts(this.product);
    }

    renderProduct() {
        document.title = `${this.product.name} ${this.product.category ? `for ${this.product.category}` : ""} . Kickstar`;
        document.getElementById('product-breadcrumb').textContent = this.product.name;

        this.setupProductInfo();
        this.fixImagePaths();
        this.renderColorSwatches();
        this.updateVariantUI(this.currentVariantIndex);
    }

    setupProductInfo() {
        const elements = {
            name: document.getElementById("product-name"),
            brand: document.getElementById("product-brand"),
            description: document.getElementById("product-description"),
            category: document.getElementById("product-category"),
            breadcrumb: document.getElementById("category-breadcrumb")
        };

        elements.name.textContent = this.product.name;
        elements.description.textContent = this.product.description;
        elements.category.textContent = this.product.category;

        if (this.product.brand) {
            elements.brand.textContent = this.product.brand;
        }

        if (elements.breadcrumb) {
            elements.breadcrumb.textContent = this.product.category;
            elements.breadcrumb.title = this.product.category;
            const href = `category.html?cat=${encodeURIComponent(this.product.category.toLowerCase())}`;
            elements.breadcrumb.setAttribute("href", href);
        }
    }

    fixImagePaths() {
        this.product.variants.forEach(variant => {
            variant.images = variant.images.map(img => {
                if (img.startsWith("./images/")) return img.replace("./images/", "../images/");
                return img;
            });
        });
    }

    renderColorSwatches() {
        const colorsWrapper = document.querySelector(".product-colors");
        colorsWrapper.innerHTML = this.product.variants.map((variant, i) => `
            <img src="${variant.images[0] || ''}"
                 title="${variant.color}"
                 width="60" height="60"
                 class="color-btn ${i === this.currentVariantIndex ? "selected" : ""}"
                 style="border-radius: 4px; cursor: pointer;"
                 data-variant-index="${i}">
        `).join("");

        // Attach color switching
        document.querySelectorAll(".color-btn").forEach(btn => {
            btn.addEventListener("click", () => this.handleColorSwitch(btn));
        });
    }

    handleColorSwitch(btn) {
        document.querySelectorAll(".color-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        this.currentVariantIndex = parseInt(btn.dataset.variantIndex);
        window.currentVariantIndex = this.currentVariantIndex;

        this.updateVariantUI(this.currentVariantIndex);
        
        if (typeof updateProductDetailsWishlistButton === 'function') {
            updateProductDetailsWishlistButton();
        }
    }

    updateVariantUI(variantIndex) {
        const variant = this.product.variants[variantIndex];
        const mainImg = document.getElementById("main-product-img");
        const selectedColor = document.getElementById("selected-color");
        const quantityContainer = document.querySelector('.quantity-container');

        // Update main image and color
        mainImg.src = variant.images[0];
        mainImg.dataset.default = variant.images[0];
        selectedColor.textContent = variant.color;

        this.renderThumbnails(variant);
        this.renderSizeOptions(variant);
        this.updatePriceDisplay(variant);

        // Reset selection
        quantityContainer.style.display = "none";
        window.currentVariantIndex = variantIndex;
        
        if (typeof updateProductDetailsWishlistButton === 'function') {
            updateProductDetailsWishlistButton();
        }
    }

    renderThumbnails(variant) {
        const thumbnailsWrapper = document.querySelector(".product-thumbnails");
        thumbnailsWrapper.innerHTML = variant.images.map((src, index) => `
            <img src="${src}" class="thumbnail-img ${index === 0 ? "selected" : ""}">
        `).join("");

        thumbnailsWrapper.querySelectorAll(".thumbnail-img").forEach(img => {
            img.addEventListener("click", () => this.handleThumbnailClick(img));
        });

        this.setupThumbnailScroll();
    }

    handleThumbnailClick(img) {
        const mainImg = document.getElementById("main-product-img");
        mainImg.src = img.src;
        document.querySelectorAll(".thumbnail-img").forEach(thumb => thumb.classList.remove("selected"));
        img.classList.add("selected");
    }

    renderSizeOptions(variant) {
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

        this.attachSizeOptionHandlers();
    }

    attachSizeOptionHandlers() {
        const sizeOptionsContainer = document.getElementById('size-options');
        const quantityContainer = document.querySelector('.quantity-container');
        
        sizeOptionsContainer.querySelectorAll('.size-option:not(.out-of-stock)').forEach(option => {
            option.addEventListener('click', () => {
                sizeOptionsContainer.querySelectorAll('.size-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                option.classList.add('selected');
                quantityContainer.style.display = "flex";
                document.getElementById("add-cart-message-err").innerHTML = "";
                
                this.updatePriceUI(option);
                this.qtyInput.value = 1;
                this.setQtyInputMax();
            });
        });
    }

    updatePriceDisplay(variant) {
        const firstAvailableSize = variant.sizes.find(size => size.stock_quantity > 0);
        if (!firstAvailableSize) return;

        const isOnSale = firstAvailableSize.sale_price && firstAvailableSize.sale_price < firstAvailableSize.price;
        const displayPrice = isOnSale ? firstAvailableSize.sale_price : firstAvailableSize.price;
        const originalPrice = firstAvailableSize.price;
        
        const priceEl = document.getElementById("product-price");
        priceEl.innerHTML = isOnSale
            ? `<strong style="color:red;">KES ${displayPrice.toFixed(2)}</strong> <span style="text-decoration:line-through; color:gray;">KES ${originalPrice.toFixed(2)}</span>`
            : `<strong>KES ${displayPrice.toFixed(2)}</strong>`;
    }

    updatePriceUI(sizeOption) {
        if (!sizeOption) return;
        const price = sizeOption.dataset.price;
        const sale = sizeOption.dataset.sale;
        
        const priceEl = document.getElementById("product-price");
        priceEl.innerHTML = sale
            ? `<strong style="color:red;">KES ${sale}</strong> <span style="text-decoration:line-through; color:gray;">KES ${price}</span>`
            : `<strong>KES ${price}</strong>`;
    }

    setupThumbnailScroll() {
        const thumbnailsWrapper = document.querySelector(".product-thumbnails");
        const leftScrollBtn = document.querySelector(".thumbnail-scroll-left");
        const rightScrollBtn = document.querySelector(".thumbnail-scroll-right");

        const updateScrollButtons = () => {
            const scrollWidth = thumbnailsWrapper.scrollWidth;
            const visibleWidth = thumbnailsWrapper.clientWidth;
            const scrollLeft = thumbnailsWrapper.scrollLeft;
            const maxScrollLeft = Math.max(0, scrollWidth - visibleWidth);
            const EPS = 5;

            if (scrollWidth <= visibleWidth) {
                leftScrollBtn.classList.add("hidden");
                rightScrollBtn.classList.add("hidden");
                return;
            }

            leftScrollBtn.classList.toggle("hidden", scrollLeft <= EPS);
            rightScrollBtn.classList.toggle("hidden", scrollLeft >= maxScrollLeft - EPS);
        };

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
    }

    setupEventListeners() {
        // Quantity controls
        this.qtyInput = document.getElementById("qty-input");
        const decreaseBtn = document.getElementById("qty-decrease");
        const increaseBtn = document.getElementById("qty-increase");

        decreaseBtn.addEventListener("click", () => this.adjustQuantity(-1));
        increaseBtn.addEventListener("click", () => this.adjustQuantity(1));

        // Add to cart form
        document.getElementById("variant-form").addEventListener("submit", e => this.handleAddToCart(e));
    }

    adjustQuantity(change) {
        let qty = parseInt(this.qtyInput.value, 10) || 1;
        if (change === -1) {
            qty = Math.max(1, qty - 1);
        } else {
            const max = parseInt(this.qtyInput.dataset.max, 10) || 1;
            if (qty < max) qty += 1;
        }
        this.qtyInput.value = qty;
    }

    setQtyInputMax() {
        const selectedSize = document.querySelector('.size-option.selected');
        if (selectedSize && selectedSize.dataset.stock) {
            const stock = parseInt(selectedSize.dataset.stock, 10);
            this.qtyInput.dataset.max = stock;
            if (parseInt(this.qtyInput.value, 10) > stock) this.qtyInput.value = stock;
        }
    }

    handleAddToCart(e) {
        e.preventDefault();
        
        const submitter = e.submitter;
        if (submitter && submitter.id === 'add-to-wishlist-btn') {
            return; // Let wishlist script handle it
        }
        
        this.addToCart();
    }

    addToCart() {
        const selectedSizeOption = document.querySelector('.size-option.selected');
        const sizeIndex = selectedSizeOption ? selectedSizeOption.dataset.sizeIndex : null;
        const qty = parseInt(this.qtyInput.value, 10);
        const stock = selectedSizeOption ? parseInt(selectedSizeOption.dataset.stock, 10) : 0;
        const message = document.getElementById("add-cart-message");
        const messageErr = document.getElementById("add-cart-message-err");

        // Validation
        if (!sizeIndex) {
            messageErr.style.display = "block";
            messageErr.innerHTML = "<small><i class='ri-error-warning-line'></i> Please select a size.</small>";
            return;
        }

        if (qty > stock) {
            message.textContent = `Only ${stock} item(s) available.`;
            return;
        }

        if (qty < 1) {
            message.textContent = "Quantity must be at least 1.";
            return;
        }

        // Add to cart
        const cart = getCart();
        const variant = this.product.variants[this.currentVariantIndex];
        const sizeObj = variant.sizes[sizeIndex];
        const cartKey = `${this.product.id}-${this.currentVariantIndex}-${sizeIndex}`;
        const existing = cart.find(item => item.key === cartKey);

        if (existing) {
            existing.qty = Math.min(existing.qty + qty, stock);
        } else {
            cart.push({
                key: cartKey,
                productId: this.product.id,
                variantIndex: this.currentVariantIndex,
                sizeIndex: parseInt(sizeIndex),
                qty,
                name: this.product.name,
                color: variant.color,
                size: sizeObj.size,
                price: sizeObj.sale_price || sizeObj.price,
                image: variant.images[0],
                addedAt: new Date().toISOString()
            });
        }

        setCart(cart);
        updateCartCount();
        this.qtyInput.value = 1;

        // Success message
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        const userName = currentUser ? `, ${currentUser.firstName}` : '';
        message.textContent = `Added ${qty} item(s) of ${this.product.name} (${variant.color}, Size ${sizeObj.size}) to cart${userName}!`;
        setTimeout(() => message.textContent = "", 3000);
    }
}

// Related Products Function
function renderRelatedProducts(product) {
    const relatedContainer = document.getElementById("related-products");
    if (!relatedContainer) return;

    const related = productsData
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 10);

    if (related.length === 0) {
        relatedContainer.innerHTML = "<p>No related products found.</p>";
        return;
    }

    relatedContainer.innerHTML = related
        .map(p => createProductCardTemplate(p))
        .join("");

    if (typeof initProductCardFunctions === "function") {
        initProductCardFunctions();
    }

    if (typeof initProductCardsWishlist === 'function') {
        initProductCardsWishlist();
    }
}

// Initialize Product Details
document.addEventListener('DOMContentLoaded', () => {
    new ProductDetails();
});