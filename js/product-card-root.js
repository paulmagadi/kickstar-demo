function initProductCardFunctions() {
    // ========================================================
    // Handle scroll buttons and swatch hover/click per card
    // ========================================================
    document.querySelectorAll(".product-card").forEach((card) => {
        const mainImage = card.querySelector(".product-img");
        const swatches = card.querySelectorAll(".swatch");
        const container = card.querySelector(".swatches");
        const leftBtn = card.querySelector(".swatch-scroll-left");
        const rightBtn = card.querySelector(".swatch-scroll-right");

        // Smooth scroll distance per click
        const getScrollAmount = () => swatches[0]?.offsetWidth + 10 || 60;

        // Update visibility of scroll buttons
        const updateScrollButtons = () => {
            if (!container) return;
            const { scrollLeft, scrollWidth, clientWidth } = container;
            leftBtn?.classList.toggle("hidden", scrollLeft <= 0);
            rightBtn?.classList.toggle("hidden", scrollLeft >= scrollWidth - clientWidth - 1);
        };

        // Swatch click: update image + active state
        swatches.forEach((swatch) => {
            swatch.addEventListener("click", () => {
                // Smooth image fade transition
                mainImage.style.opacity = 0;
                setTimeout(() => {
                    mainImage.src = swatch.src;
                    mainImage.dataset.default = swatch.src;
                    mainImage.style.opacity = 1;
                }, 150);

                swatches.forEach(s => s.classList.remove("active"));
                swatch.classList.add("active");
            });
        });

        // Scroll buttons
        leftBtn?.addEventListener("click", () =>
            container.scrollBy({ left: -getScrollAmount(), behavior: "smooth" })
        );
        rightBtn?.addEventListener("click", () =>
            container.scrollBy({ left: getScrollAmount(), behavior: "smooth" })
        );

        // Scroll listener (debounced)
        container?.addEventListener("scroll", () => {
            clearTimeout(container._scrollTimeout);
            container._scrollTimeout = setTimeout(updateScrollButtons, 100);
        });

        window.addEventListener("resize", updateScrollButtons);
        updateScrollButtons();
    });

    // ========================================================
    // Handle variant switch across all product cards
    // ========================================================
    document.addEventListener("click", (e) => {
        const swatch = e.target.closest(".swatch");
        if (!swatch) return;

        const productIndex = parseInt(swatch.dataset.product);
        const variantIndex = parseInt(swatch.dataset.variant);

        const product = productsData?.[productIndex];
        const variant = product?.variants?.[variantIndex];
        if (!product || !variant) return;

        const card = swatch.closest(".product-card");
        if (!card) return;

        // Active swatch state
        card.querySelectorAll(".swatch").forEach((s) => s.classList.remove("active"));
        swatch.classList.add("active");

        // Update image + color
        const img = card.querySelector(".product-img");
        img.src = `./images/${variant.images[0].replace(/^\.?\/?images\//, "")}`;
        const colorHolder = card.querySelector(".product-color span");
        if (colorHolder) colorHolder.textContent = variant.color;

        // Update price
        const allPrices = variant.sizes.map((s) => s.sale_price || s.price);
        const minPrice = Math.min(...allPrices);
        const maxPrice = Math.max(...allPrices);
        const priceContainer = card.querySelector(".product-price");
        if (priceContainer) {
            priceContainer.innerHTML = `
                <span class="sale-price">KES ${minPrice.toFixed(2)}</span>
                ${minPrice !== maxPrice
                    ? `<span class="price-range price original-price"> - KES ${maxPrice.toFixed(2)}</span>`
                    : ""}
            `;
        }

        // Update discount badge
        const firstSize = variant.sizes[0];
        const discount = firstSize.sale_price
            ? Math.round(((firstSize.price - firstSize.sale_price) / firstSize.price) * 100)
            : 0;
        const badge = card.querySelector(".product-card-sale-badge");

        if (discount) {
            if (badge) badge.innerHTML = `<p>-${discount}%</p>`;
            else {
                const newBadge = document.createElement("div");
                newBadge.classList.add("product-card-sale-badge");
                newBadge.innerHTML = `<p>-${discount}%</p>`;
                card.querySelector(".product-info")?.prepend(newBadge);
            }
        } else if (badge) {
            badge.remove();
        }
    });
}

// Auto-init on load if product cards exist
document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector(".product-card")) {
        initProductCardFunctions();
    }
});
