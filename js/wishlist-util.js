// ========================================
// UNIFIED WISHLIST FUNCTIONALITY
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
        // FIX: Check if productId is not null/undefined, not just truthy
        if (productId === null || productId === undefined) {
            console.error('Invalid product ID:', productId);
            return false;
        }
        
        const product = productsData.find(p => p.id === productId);
        if (!product) {
            console.error('Product not found:', productId);
            return false;
        }
        
        const variant = product.variants[variantIndex];
        if (!variant) {
            console.error('Variant not found:', variantIndex);
            return false;
        }
        
        // Store the image path relative to the images folder
        const imagePath = variant.images[0].replace(/^\.?\/?images\//, "");
        
        wishlist.push({
            id: itemId,
            productId: productId,
            variantIndex: variantIndex,
            name: product.name,
            color: variant.color,
            price: variant.sizes[0].sale_price || variant.sizes[0].price,
            image: imagePath,
            addedAt: new Date().toISOString()
        });
        
        saveWishlist(wishlist);
        updateWishlistUI();
        showWishlistToast('Product added to wishlist');
        return true;
    }
    
    showWishlistToast('Product already in wishlist', 'info');
    return false;
}

// Remove product from wishlist
function removeFromWishlist(productId, variantIndex = 0) {
    const wishlist = getWishlist();
    const itemId = `${productId}-${variantIndex}`;
    const updatedWishlist = wishlist.filter(item => item.id !== itemId);
    
    saveWishlist(updatedWishlist);
    updateWishlistUI();
    showWishlistToast('Product removed from wishlist', 'info');
    return true;
}

// Check if product is in wishlist
function isInWishlist(productId, variantIndex = 0) {
    const wishlist = getWishlist();
    const itemId = `${productId}-${variantIndex}`;
    return wishlist.some(item => item.id === itemId);
}

// Toggle product in wishlist
function toggleWishlist(productId, variantIndex = 0) {
    if (isInWishlist(productId, variantIndex)) {
        return removeFromWishlist(productId, variantIndex);
    } else {
        return addToWishlist(productId, variantIndex);
    }
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
function updateWishlistButton(button, productId, variantIndex) {
    if (!button) {
        console.log("not there");
        return;
    }
    
    if (isInWishlist(productId, variantIndex)) {
        button.classList.add('active');
        button.innerHTML = '<i class="ri-heart-fill"></i>';
        button.title = "Remove from Wishlist";
    } else {
        button.classList.remove('active');
        button.innerHTML = '<i class="ri-heart-line"></i>';
        button.title = "Add to Wishlist";
    }
}

// Update wishlist badges on product cards
function updateWishlistBadges() {
    document.querySelectorAll('.product-card').forEach(card => {
        const productId = parseInt(card.dataset.product);
        const activeSwatch = card.querySelector('.swatch.active');
        if (activeSwatch) {
            const variantIndex = parseInt(activeSwatch.dataset.variant);
            const wishlistBadge = card.querySelector('.wishlist-badge');
            
            if (wishlistBadge) {
                // Only update the badge for the currently active variant
                updateWishlistButton(wishlistBadge, productId, variantIndex);
            }
        }
    });
}

// Update product details wishlist button
function updateProductDetailsWishlistButton() {
    const wishlistBtn = document.getElementById('add-to-wishlist-btn');
    const productId = getCurrentProductId();
    const variantIndex = getCurrentVariantIndex();
    
    // FIX: Check for null/undefined, not just truthy
    if (wishlistBtn && productId !== null && productId !== undefined) {
        updateWishlistButton(wishlistBtn, productId, variantIndex);
        
        // Update button text for product details page
        if (isInWishlist(productId, variantIndex)) {
            wishlistBtn.innerHTML = 'Remove from Wishlist <i class="ri-heart-fill"></i>';
        } else {
            wishlistBtn.innerHTML = 'Add to Wishlist <i class="ri-heart-line"></i>';
        }
    }
}

// Get current variant index (for product details page)
function getCurrentVariantIndex() {
    // Check if currentVariantIndex is available globally
    if (typeof window.currentVariantIndex !== 'undefined') {
        return window.currentVariantIndex;
    }
    return 0; // Default to first variant
}

// Get current product ID from URL (for product details page)
function getCurrentProductId() {
    // Check if productId is available globally
    if (typeof window.productId !== 'undefined') {
        return window.productId;
    }
    
    // Fallback to URL parsing
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get("id"));
    
    // FIX: Return 0 if productId is 0, null only if it's NaN
    return isNaN(productId) ? null : productId;
}

// Update all wishlist UI elements
function updateWishlistUI() {
    updateWishlistCount();
    updateWishlistBadges();
    updateProductDetailsWishlistButton();
}

// Show toast notification
function showWishlistToast(message, type = 'success') {
    // Create toast if it doesn't exist
    let toast = document.getElementById('wishlist-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'wishlist-toast';
        toast.className = 'toast';
        toast.innerHTML = `
            <i class="ri-heart-fill"></i>
            <span id="toast-message">${message}</span>
        `;
        document.body.appendChild(toast);
        
        // Add basic toast styles if not already in CSS
        if (!document.querySelector('#wishlist-toast-styles')) {
            const style = document.createElement('style');
            style.id = 'wishlist-toast-styles';
            style.textContent = `
                .toast {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #2c3e50;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 6px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transform: translateY(100px);
                    opacity: 0;
                    transition: all 0.3s;
                    z-index: 1000;
                }
                .toast.show {
                    transform: translateY(0);
                    opacity: 1;
                }
                .toast i {
                    font-size: 18px;
                    color: var(--primary-color);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    const toastMessage = document.getElementById('toast-message');
    if (toastMessage) {
        toastMessage.textContent = message;
    }
    
    // Set color based on type
    if (type === 'info') {
        toast.style.background = '#d1ecf1';
        toast.style.color = '#0c5460';
    } else {
        toast.style.background = '#2c3e50';
        toast.style.color = 'white';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize wishlist functionality for product cards
function initProductCardsWishlist() {
    document.addEventListener('click', function(e) {
        const wishlistBadge = e.target.closest('.wishlist-badge');
        if (wishlistBadge) {
            e.preventDefault();
            e.stopPropagation();
            
            const productCard = wishlistBadge.closest('.product-card');
            if (productCard) {
                const productId = parseInt(productCard.dataset.product);
                const activeSwatch = productCard.querySelector('.swatch.active');
                const variantIndex = activeSwatch ? parseInt(activeSwatch.dataset.variant) : 0;
                
                toggleWishlist(productId, variantIndex);
            }
        }
    });
}

// Initialize wishlist functionality for product details page
function initProductDetailsWishlist() {
    const wishlistBtn = document.getElementById('add-to-wishlist-btn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Important: prevent form submission
            
            const productId = getCurrentProductId();
            const variantIndex = getCurrentVariantIndex();
            
            console.log('Wishlist button clicked', { productId, variantIndex });
            
            // FIX: Check for null/undefined, not just truthy
            if (productId !== null && productId !== undefined) {
                toggleWishlist(productId, variantIndex);
            } else {
                console.error('No product ID found for wishlist');
            }
        });
        
        // Initial button state
        updateProductDetailsWishlistButton();
    } else {
        console.log('No wishlist button found on this page');
    }
}



// Global initialization function
function initWishlist() {
    updateWishlistUI();
    
    // Initialize based on page type
    if (document.querySelector('.product-card')) {
        initProductCardsWishlist();
    }
    
    if (document.getElementById('add-to-wishlist-btn')) {
        initProductDetailsWishlist();
    }
}

// ========================================
// Make functions available globally
// ========================================
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.isInWishlist = isInWishlist;
window.toggleWishlist = toggleWishlist;
window.getWishlist = getWishlist;
window.updateWishlistUI = updateWishlistUI;
window.initWishlist = initWishlist;

// ========================================
// Auto-initialize when DOM is loaded
// ========================================
document.addEventListener("DOMContentLoaded", function() {
    // Wait a bit for productsData to be available
    setTimeout(initWishlist, 100);
});