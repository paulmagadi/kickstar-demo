// ========================================
// WISHLIST PAGE FUNCTIONALITY
// ========================================
const WISHLIST_STORAGE_KEY = 'user_wishlist';

// Get page context for proper paths
window.getPageContext = getPageContext;
const { imageBase, linkBase } = getPageContext();

// Modal state variables
let currentModalProduct = null;
let currentModalVariantIndex = null;
let selectedSizeIndex = null;
let modalMaxQuantity = 1;

// ========================================
// STORAGE FUNCTIONS
// ========================================

function getWishlist() {
    const wishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return wishlist ? JSON.parse(wishlist) : [];
}

function saveWishlist(wishlist) {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
}

function removeFromWishlist(productId, variantIndex = 0) {
    const wishlist = getWishlist();
    const itemId = `${productId}-${variantIndex}`;
    const updatedWishlist = wishlist.filter(item => item.id !== itemId);

    saveWishlist(updatedWishlist);
    renderWishlist();
    renderWishlist(0, 'wishlist-preview');
    updateWishlistCount();
    return true;
}

function clearWishlist() {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
        saveWishlist([]);
        renderWishlist();
        renderWishlist(0, 'wishlist-preview');
        updateWishlistCount();
    }
}

// ========================================
// UI UPDATE FUNCTIONS
// ========================================

function updateWishlistCount() {
    const wishlist = getWishlist();
    const countElement = document.getElementById('wishlist-count');
    const headerCountElement = document.getElementById('wishlist-header-count');
    const wishlistItemsCount = document.getElementById('wishlist-items-count account');
    const wishlistNavBadge = document.getElementById('wishlist-badge');

    if (countElement) countElement.textContent = wishlist.length;
    if (headerCountElement) headerCountElement.textContent = wishlist.length;
    if(wishlistItemsCount) wishlistItemsCount.textContent = wishlist.length;
    if(wishlistNavBadge) wishlistNavBadge.textContent = wishlist.length;
}

function getWishlistImagePath(storedImagePath) {
    if (storedImagePath.startsWith('http') || storedImagePath.startsWith('//')) {
        return storedImagePath;
    }
    if (storedImagePath.includes('images/')) {
        return storedImagePath;
    }
    const cleanPath = storedImagePath.replace(/^\.?\//, '');
    return `${imageBase}${cleanPath}`;
}


function renderWishlist(limit = null, containerId = 'wishlist-items') {
    const wishlist = getWishlist();
    const container = document.getElementById(containerId);
    const emptyState = document.getElementById('empty-wishlist');
    const actions = document.getElementById('wishlist-actions');
    const itemsCount = document.getElementById('wishlist-items-count');
    const totalPrice = document.getElementById('wishlist-total-price');
    const wishlistPreviewFooter = document.querySelector(".wishlist-preview-footer");

    if (!wishlist || wishlist.length === 0) {
        if(container) container.innerHTML = '';
        if(wishlistPreviewFooter) wishlistPreviewFooter.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        if (actions) actions.style.display = 'none';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (actions) actions.style.display = 'flex';

    let total = 0;
    let renderedItems = 0;
    if(container) container.innerHTML = '';

    // ✅ Apply limit if provided
    const itemsToRender = limit ? wishlist.slice(0, limit) : wishlist;

    itemsToRender.forEach(item => {
        if (!item || !item.name) {
            console.warn('Invalid wishlist item:', item);
            return;
        }

        total += parseFloat(item.price || 0);
        renderedItems++;

        const productUrl = `${linkBase}product-details.html?id=${item.productId}&variant=${item.variantIndex}`;
        const correctImagePath = getWishlistImagePath(item.image);

        const itemHTML = `
        <div class="wishlist-item" data-item-id="${item.id}">
            <button class="remove-wishlist-btn" onclick="removeFromWishlist(${item.productId}, ${item.variantIndex})" title="Remove from wishlist">
                <i class="ri-heart-fill"></i>
            </button>
            <img src="${correctImagePath}" alt="${item.name}" class="wishlist-item-image" onerror="this.src='${imageBase}placeholder.jpg'">
            <div class="wishlist-item-info">
                <h3 class="wishlist-item-title">${item.name}</h3>
                <div class="wishlist-item-color">Color: ${item.color || 'N/A'}</div>
                <div class="wishlist-item-price">KES ${parseFloat(item.price || 0).toFixed(2)}</div>
                <div class="wishlist-item-actions">
                    <button class="add-to-cart-btn" onclick="addToCartFromWishlist(${item.productId}, ${item.variantIndex})">
                        <i class="ri-shopping-cart-line"></i>
                        Add to Cart
                    </button>
                    <a href="${productUrl}" class="view-details-btn">
                        <i class="ri-eye-line"></i>
                        View Details
                    </a>
                </div>
            </div>
        </div>
        `;

        if(container) container.innerHTML += itemHTML;
    });

    if (itemsCount) itemsCount.textContent = renderedItems;
    if (totalPrice) totalPrice.textContent = `KES ${total.toFixed(2)}`;

    if (renderedItems === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (actions) actions.style.display = 'none';
    }
}


// ========================================
// MODAL FUNCTIONS
// ========================================

function openSizeModal(productId, variantIndex) {
    const product = productsData.find(p => p.id === productId);
    if (!product) {
        alert('Product not found!');
        return;
    }

    const variant = product.variants[variantIndex];
    if (!variant) {
        alert('Variant not found!');
        return;
    }

    currentModalProduct = product;
    currentModalVariantIndex = variantIndex;

    const imagePath = `.${variant.images[0]}`;

    // Update modal content
    document.getElementById('modal-product-image').src = imagePath;
    console.log(imagePath);
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-color').textContent = `Color: ${variant.color}`;

    // Populate size options
    const sizeOptionsContainer = document.getElementById('size-options-modal');
    sizeOptionsContainer.innerHTML = variant.sizes.map((size, i) => {
        const isOutOfStock = size.stock_quantity === 0;
        const isOnSale = size.sale_price && size.sale_price < size.price;
        const displayPrice = isOnSale ? size.sale_price : size.price;

        return `
    <div class="size-option-modal ${isOutOfStock ? 'out-of-stock' : ''}" 
            data-size-index="${i}"
            data-price="${size.price}"
            data-sale="${size.sale_price || ''}"
            data-stock="${size.stock_quantity}"
            ${isOutOfStock ? 'disabled' : ''}
            onclick="${isOutOfStock ? '' : `selectSize(${i}, ${size.stock_quantity})`}">
        <div>${size.size}</div>
        <div>KES ${displayPrice.toFixed(2)}</div>
        ${isOnSale ? '<small>SALE</small>' : ''}
    </div>
`;
    }).join('');

    // Reset selections
    selectedSizeIndex = null;
    document.getElementById('modal-qty-input').value = 1;
    document.getElementById('remove-from-wishlist-checkbox').checked = true;

    // Update price display
    const firstAvailableSize = variant.sizes.find(size => size.stock_quantity > 0);
    if (firstAvailableSize) {
        const isOnSale = firstAvailableSize.sale_price && firstAvailableSize.sale_price < firstAvailableSize.price;
        const displayPrice = isOnSale ? firstAvailableSize.sale_price : firstAvailableSize.price;
        document.getElementById('modal-product-price').textContent = `KES ${displayPrice.toFixed(2)}`;
    }

    document.getElementById('size-selection-modal').style.display = 'flex';
}

function closeSizeModal() {
    document.getElementById('size-selection-modal').style.display = 'none';
    currentModalProduct = null;
    currentModalVariantIndex = null;
    selectedSizeIndex = null;
}

function selectSize(sizeIndex, maxStock) {
    selectedSizeIndex = sizeIndex;
    modalMaxQuantity = maxStock;

    document.querySelectorAll('.size-option-modal').forEach(opt => {
        opt.classList.remove('selected');
    });
    event.target.closest('.size-option-modal').classList.add('selected');

    const currentQty = parseInt(document.getElementById('modal-qty-input').value);
    if (currentQty > maxStock) {
        document.getElementById('modal-qty-input').value = maxStock;
    }
}

function decreaseModalQty() {
    const qtyInput = document.getElementById('modal-qty-input');
    let qty = parseInt(qtyInput.value) || 1;
    if (qty > 1) {
        qtyInput.value = qty - 1;
    }
}

function increaseModalQty() {
    const qtyInput = document.getElementById('modal-qty-input');
    let qty = parseInt(qtyInput.value) || 1;
    if (selectedSizeIndex !== null && qty < modalMaxQuantity) {
        qtyInput.value = qty + 1;
    }
}

function confirmAddToCart() {
    if (selectedSizeIndex === null) {
        alert('Please select a size.');
        return;
    }

    const product = currentModalProduct;
    const variant = product.variants[currentModalVariantIndex];
    const sizeObj = variant.sizes[selectedSizeIndex];
    const qty = parseInt(document.getElementById('modal-qty-input').value);
    const shouldRemoveFromWishlist = document.getElementById('remove-from-wishlist-checkbox').checked;

    // Add to cart
    const cart = getCart();
    const cartKey = `${product.id}-${currentModalVariantIndex}-${selectedSizeIndex}`;
    const existing = cart.find(item => item.key === cartKey);

    const variantImage = `../${variant.images[0]}`;

    if (existing) {
        existing.qty = Math.min(existing.qty + qty, sizeObj.stock_quantity);
    } else {
        cart.push({
            key: cartKey,
            productId: product.id,
            variantIndex: currentModalVariantIndex,
            sizeIndex: parseInt(selectedSizeIndex),
            qty,
            name: product.name,
            color: variant.color,
            size: sizeObj.size,
            price: sizeObj.sale_price || sizeObj.price,
            image: variantImage
        });
    }

    setCart(cart);
    updateCartCount();

    // Remove from wishlist if checkbox is checked
    if (shouldRemoveFromWishlist) {
        removeFromWishlist(product.id, currentModalVariantIndex);
    }

    alert(`Added ${qty} item(s) of ${product.name} (${variant.color}, Size ${sizeObj.size}) to cart!${shouldRemoveFromWishlist ? ' Item removed from wishlist.' : ''}`);
    closeSizeModal();
}

function addToCartFromWishlist(productId, variantIndex) {
    openSizeModal(productId, variantIndex);
}

// ========================================
// CART FUNCTIONS
// ========================================

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

// ========================================
// INITIALIZATION
// ========================================

function waitForProductsData() {
    return new Promise((resolve) => {
        if (typeof productsData !== 'undefined' && productsData.length > 0) {
            resolve(productsData);
        } else {
            const storedProducts = localStorage.getItem('productsData');
            if (storedProducts) {
                window.productsData = JSON.parse(storedProducts);
                resolve(productsData);
            } else {
                setTimeout(() => {
                    if (typeof productsData !== 'undefined' && productsData.length > 0) {
                        resolve(productsData);
                    } else {
                        resolve(null);
                    }
                }, 500);
            }
        }
    });
}

function initializeWishlistPage() {
    renderWishlist();
    updateWishlistCount();
    updateCartCount();

    const clearBtn = document.getElementById('clear-wishlist-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearWishlist);
    }

    // Close modal when clicking outside
    document.getElementById('size-selection-modal').addEventListener('click', function (e) {
        if (e.target === this) {
            closeSizeModal();
        }
    });
}

// ========================================
// EVENT LISTENERS & GLOBAL EXPORTS
// ========================================

document.addEventListener('DOMContentLoaded', async function () {
    await waitForProductsData();
    initializeWishlistPage();
});

// Make functions available globally
window.removeFromWishlist = removeFromWishlist;
window.clearWishlist = clearWishlist;
window.addToCartFromWishlist = addToCartFromWishlist;