// ========================================
// WISHLIST FUNCTIONALITY
// ========================================
const WISHLIST_STORAGE_KEY = 'user_wishlist';

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
        wishlist.push({
            id: itemId,
            productId: productId,
            variantIndex: variantIndex,
            addedAt: new Date().toISOString()
        });
        
        saveWishlist(wishlist);
        updateWishlistUI();
        showToast('Product added to wishlist');
        return true;
    }
    
    return false;
}

// Remove product from wishlist
function removeFromWishlist(productId, variantIndex = 0) {
    const wishlist = getWishlist();
    const itemId = `${productId}-${variantIndex}`;
    const updatedWishlist = wishlist.filter(item => item.id !== itemId);
    
    saveWishlist(updatedWishlist);
    updateWishlistUI();
    showToast('Product removed from wishlist');
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

// Update wishlist badges on product cards
function updateWishlistBadges() {
    document.querySelectorAll('.product-card').forEach(card => {
        const productId = parseInt(card.dataset.productId);
        const variantIndex = parseInt(card.querySelector('.swatch.active').dataset.variant);
        const wishlistBadge = card.querySelector('.wishlist-badge');
        
        if (isInWishlist(productId, variantIndex)) {
            wishlistBadge.classList.add('active');
        } else {
            wishlistBadge.classList.remove('active');
        }
    });
}

// Update all wishlist UI elements
function updateWishlistUI() {
    updateWishlistCount();
    updateWishlistBadges();
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('wishlist-toast');
    const toastMessage = document.getElementById('toast-message');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========================================
// PRODUCT CARD FUNCTIONALITIES
// ========================================
function getPageContext() {
    return { imageBase };
}

window.getPageContext = getPageContext;

// Initialize product card interactions
function initProductCardFunctions() {
    const cards = document.querySelectorAll(".product-card");

    cards.forEach(card => {
        const swatches = card.querySelectorAll(".swatch");
        const image = card.querySelector(".product-img");
        const colorLabel = card.querySelector(".product-color span");
        const scrollWrapper = card.querySelector(".swatches");
        const wishlistBadge = card.querySelector(".wishlist-badge");

        // ==========================
        // 1. Handle wishlist badge click
        // ==========================
        wishlistBadge.addEventListener("click", (e) => {
            e.stopPropagation();
            const productId = parseInt(card.dataset.productId);
            const variantIndex = parseInt(card.querySelector('.swatch.active').dataset.variant);
            
            if (isInWishlist(productId, variantIndex)) {
                removeFromWishlist(productId, variantIndex);
            } else {
                addToWishlist(productId, variantIndex);
            }
        });

        // ==========================
        // 2. Handle swatch click
        // ==========================
        swatches.forEach(swatch => {
            swatch.addEventListener("click", () => {
                // Remove active class from other swatches
                swatches.forEach(s => s.classList.remove("active"));
                swatch.classList.add("active");

                // Get variant index
                const variantIndex = parseInt(swatch.dataset.variant);
                const productIndex = parseInt(swatch.dataset.product);

                // Get the variant data
                const product = productsData[productIndex];
                const variant = product.variants[variantIndex];

                // Update image + color text
                image.src = `${imageBase}${variant.images[0].replace(/^\.?\/?images\//, "")}`;
                colorLabel.textContent = variant.color;

                // Update product price and discount
                const allPrices = variant.sizes.map((s) => s.sale_price || s.price);
                const minPrice = Math.min(...allPrices);
                const maxPrice = Math.max(...allPrices);

                const priceContainer = card.querySelector(".product-price");
                priceContainer.innerHTML = `
                    <span class="sale-price">KES ${minPrice.toFixed(2)}</span>
                    ${minPrice !== maxPrice ? 
                        `<span class="price-range price original-price"> - KES ${maxPrice.toFixed(2)}</span>` 
                        : ""}
                `;

                // Update discount badge
                const firstSize = variant.sizes[0];
                const discount = firstSize.sale_price
                    ? Math.round(((firstSize.price - firstSize.sale_price) / firstSize.price) * 100)
                    : 0;

                const discountBadge = card.querySelector(".product-card-sale-badge");
                if (discount) {
                    if (discountBadge) {
                        discountBadge.innerHTML = `<p>-${discount}%</p>`;
                    } else {
                        const newBadge = document.createElement("div");
                        newBadge.classList.add("product-card-sale-badge");
                        newBadge.innerHTML = `<p>-${discount}%</p>`;
                        card.querySelector(".product-info").prepend(newBadge);
                    }
                } else if (discountBadge) {
                    discountBadge.remove();
                }
                
                // Update wishlist badge state
                const productId = parseInt(card.dataset.productId);
                if (isInWishlist(productId, variantIndex)) {
                    wishlistBadge.classList.add('active');
                } else {
                    wishlistBadge.classList.remove('active');
                }
            });
        });

        // ==========================
        // 3. Swatch scroll buttons
        // ==========================
        const btnLeft = card.querySelector(".swatch-scroll-left");
        const btnRight = card.querySelector(".swatch-scroll-right");

        if (scrollWrapper && btnLeft && btnRight) {
            const updateScrollButtons = () => {
                const maxScrollLeft = scrollWrapper.scrollWidth - scrollWrapper.clientWidth;
                btnLeft.classList.toggle("hidden", scrollWrapper.scrollLeft <= 0);
                btnRight.classList.toggle("hidden", scrollWrapper.scrollLeft >= maxScrollLeft - 2);
            };

            btnLeft.addEventListener("click", () => {
                scrollWrapper.scrollBy({ left: -80, behavior: "smooth" });
                setTimeout(updateScrollButtons, 300);
            });

            btnRight.addEventListener("click", () => {
                scrollWrapper.scrollBy({ left: 80, behavior: "smooth" });
                setTimeout(updateScrollButtons, 300);
            });

            scrollWrapper.addEventListener("scroll", updateScrollButtons);

            // Initialize scroll state
            updateScrollButtons();
        }
    });
}

// Generate product cards
function generateProductCards() {
    const container = document.getElementById('products-container');
    
    productsData.forEach((product, productIndex) => {
        const firstVariant = product.variants[0];
        const allPrices = firstVariant.sizes.map((s) => s.sale_price || s.price);
        const minPrice = Math.min(...allPrices);
        const maxPrice = Math.max(...allPrices);
        
        const discount = firstVariant.sizes[0].sale_price
            ? Math.round(((firstVariant.sizes[0].price - firstVariant.sizes[0].sale_price) / firstVariant.sizes[0].price) * 100)
            : 0;
        
        // Generate swatches HTML
        let swatchesHTML = '';
        product.variants.forEach((variant, variantIndex) => {
            swatchesHTML += `
                <div class="swatch ${variantIndex === 0 ? 'active' : ''}" 
                        data-variant="${variantIndex}" 
                        data-product="${productIndex}"
                        style="background-color: ${getColorValue(variant.color)}">
                </div>
            `;
        });
        
        const cardHTML = `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-img-container">
                    <img src="${imageBase}${firstVariant.images[0].replace(/^\.?\/?images\//, "")}" 
                            alt="${product.title}" class="product-img">
                    ${discount ? `<div class="product-card-sale-badge"><p>-${discount}%</p></div>` : ''}
                    <div class="wishlist-badge ${isInWishlist(product.id, 0) ? 'active' : ''}" title="Add to Wishlist">
                        <i class="ri-heart-line"></i>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-color">Color: <span>${firstVariant.color}</span></div>
                    <div class="product-price">
                        <span class="sale-price">KES ${minPrice.toFixed(2)}</span>
                        ${minPrice !== maxPrice ? 
                            `<span class="price-range price original-price"> - KES ${maxPrice.toFixed(2)}</span>` 
                            : ""}
                    </div>
                    <div class="swatches-container">
                        <div class="swatches">
                            ${swatchesHTML}
                        </div>
                        <button class="swatch-scroll-left hidden">
                            <i class="ri-arrow-left-s-line"></i>
                        </button>
                        <button class="swatch-scroll-right ${product.variants.length > 4 ? '' : 'hidden'}">
                            <i class="ri-arrow-right-s-line"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML += cardHTML;
    });
}

// Helper function to get color value for swatches
function getColorValue(colorName) {
    const colorMap = {
        'Black': '#000000',
        'White': '#ffffff',
        'Navy Blue': '#001f3f',
        'Dark Blue': '#003366',
        'Light Blue': '#7FDBFF',
        'Floral Print': 'linear-gradient(45deg, #ff9a9e, #fad0c4)',
        'Red': '#ff4136'
    };
    
    return colorMap[colorName] || '#cccccc';
}

// ========================================
// Initialize everything when DOM is loaded
// ========================================
document.addEventListener("DOMContentLoaded", () => {
    generateProductCards();
    updateWishlistUI();
    
    if (document.querySelector(".product-card")) {
        initProductCardFunctions();
    }
});