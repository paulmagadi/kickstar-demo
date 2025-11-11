// PRODUCT CARD FUNCTIONALITIES
// ========================================
window.getPageContext = getPageContext; 
const { imageBase } = getPageContext();

// Initialize product card interactions
function initProductCardFunctions() {
    const cards = document.querySelectorAll(".product-card");

    cards.forEach(card => {
        const swatches = card.querySelectorAll(".swatch");
        const image = card.querySelector(".product-img");
        const colorLabel = card.querySelector(".product-color span");
        const scrollWrapper = card.querySelector(".swatches");

        // ==========================
        // 1. Handle swatch click
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
                
                // Update wishlist badge for current variant
                const productId = parseInt(card.dataset.product);
                const wishlistBadge = card.querySelector('.wishlist-badge');
                if (wishlistBadge && typeof updateWishlistButton === 'function') {
                    updateWishlistButton(wishlistBadge, productId, variantIndex);
                }

                // Update the main product link to point to the selected variant
                const productLinks = card.querySelectorAll('a[href*="product-details.html"]');
                const detailsUrl = swatch.dataset.detailsUrl;
                productLinks.forEach(link => {
                    link.href = detailsUrl;
                });
                
            });
        });

        // ==========================
        // 2. Swatch scroll buttons
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

// ========================================
// Run automatically if cards exist
// ========================================
document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector(".product-card")) {
        initProductCardFunctions();
    }
});