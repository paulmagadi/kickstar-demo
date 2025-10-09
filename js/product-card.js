/**
 * Resolves image paths automatically depending on page depth.
 * - Keeps absolute URLs unchanged.
 * - Works for any directory level (/, /pages/, /pages/brands/).
 * - Cleans redundant "./" or "../" parts.
 * - Falls back to a default "no-image.png" if missing or broken.
 */
window.resolveImagePath = function (imgPath) {
    const fallbackImage = "no-image.png"; // you can place this in your /images folder
    if (!imgPath) return getResolvedPath(fallbackImage);

    // ✅ Leave absolute URLs or data URIs untouched
    if (/^(https?:\/\/|data:image\/)/i.test(imgPath)) {
        return imgPath;
    }

    // 🧹 Clean the path to avoid double prefixes like ./images/images/
    let cleanPath = imgPath.replace(/^(\.\/|\.{1,2}\/|\/)?(images\/)?/, "");

    return getResolvedPath(cleanPath);
};

/**
 * Determines proper path depth prefix and resolves the final image path.
 */
function getResolvedPath(fileName) {
    const pathDepth = window.location.pathname.split("/").filter(Boolean).length;
    const prefix = "../".repeat(Math.max(0, pathDepth - 1));
    return `${prefix}images/${fileName}`;
}

/**
 * Attaches an error handler to replace broken images with the fallback.
 * @param {HTMLImageElement} imgElement
 */
window.attachImageFallback = function (imgElement) {
    if (!imgElement) return;
    const fallback = getResolvedPath("no-image.png");
    imgElement.onerror = () => {
        if (imgElement.src !== fallback) {
            imgElement.src = fallback;
        }
    };
};



window.ProductCard = class ProductCard {

    constructor(product, productIndex) {
        this.product = product;
        this.productIndex = productIndex;
        this.element = this.createCardElement();
        this.attachEventListeners();
    }
    // Build the HTML for the product card
    createCardElement() {
        const firstVariant = this.product.variants[0];
        const firstSize = firstVariant.sizes[0];

        const allPrices = this.product.variants.flatMap(v =>
            v.sizes.map(s => s.sale_price || s.price)
        );
        const minPrice = Math.min(...allPrices);
        const maxPrice = Math.max(...allPrices);

        const discount = firstSize.sale_price
            ? Math.round(((firstSize.price - firstSize.sale_price) / firstSize.price) * 100)
            : 0;

        // Build card
        const card = document.createElement("div");
        card.classList.add("product-card");
        card.innerHTML = `
            <a href="pages/product-details.html?id=${this.productIndex}" title="View product">
                <div class="product-image-wrapper">
                    <div class="product-image">
                        <img src="${resolveImagePath(firstVariant.images[0])}" />
                        <div class="product-color">Color: <span>${firstVariant.color}</span></div>
                    </div>
                </div>
            </a>

            <div class="product-info">
                <a href="pages/product-details.html?id=${this.productIndex}" title="${this.product.name}">
                    <div class="product-title">${this.product.name}</div>
                </a>

                <div class="product-price">
                    <span class="sale-price">KES ${minPrice.toFixed(2)}</span>
                    ${minPrice !== maxPrice
                        ? `<span class="price-range price original-price"> - KES ${maxPrice.toFixed(2)}</span>`
                        : ""}
                </div>

                ${discount ? `<div class="product-card-sale-badge"><p>-${discount}%</p></div>` : ""}

                <div class="swatch-wrapper">
                    <div class="swatch-scroll-btn swatch-scroll-left hidden">&#10094;</div>
                    <div class="swatches">
                        ${this.product.variants.map((variant, i) => `
                            <img src="${resolveImagePath(variant.images[0])}" 

                                alt="${variant.color}" 
                                title="${variant.color}" 
                                class="swatch ${i === 0 ? "active" : ""}" 
                                data-variant="${i}" />
                        `).join("")}
                    </div>
                    <div class="swatch-scroll-btn swatch-scroll-right">&#10095;</div>
                </div>
            </div>
        `;
        return card;
    }

    attachEventListeners() {
        const card = this.element;
        const container = card.querySelector(".swatches");
        const leftBtn = card.querySelector(".swatch-scroll-left");
        const rightBtn = card.querySelector(".swatch-scroll-right");
        const swatches = card.querySelectorAll(".swatch");

        const getScrollAmount = () => swatches[0]?.offsetWidth + 10;

        // Scroll buttons
        const updateScrollButtons = () => {
            if (!container || !leftBtn || !rightBtn) return;
            const { scrollLeft, scrollWidth, clientWidth } = container;
            leftBtn.classList.toggle("hidden", scrollLeft <= 0);
            rightBtn.classList.toggle("hidden", scrollLeft >= scrollWidth - clientWidth - 1);
        };

        if (leftBtn && container) {
            leftBtn.addEventListener("click", () => {
                container.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
            });
        }
        if (rightBtn && container) {
            rightBtn.addEventListener("click", () => {
                container.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
            });
        }
        if (container) {
            container.addEventListener("scroll", () => {
                clearTimeout(container._scrollTimeout);
                container._scrollTimeout = setTimeout(updateScrollButtons, 100);
            });
            // Swatch click
            container.addEventListener("click", (e) => {
                const swatch = e.target.closest(".swatch");
                if (!swatch) return;
                const variantIndex = parseInt(swatch.dataset.variant);
                this.updateVariant(variantIndex);
            });
        }
        window.addEventListener("resize", updateScrollButtons);
        updateScrollButtons();
    }

    updateVariant(variantIndex) {
        const variant = this.product.variants[variantIndex];
        const allPrices = variant.sizes.map(s => s.sale_price || s.price);
        const minPrice = Math.min(...allPrices);
        const maxPrice = Math.max(...allPrices);

        const img = this.element.querySelector(".product-img");
        img.src = variant.images[0];

        const colorHolder = this.element.querySelector(".product-color span");
        if (colorHolder) colorHolder.textContent = variant.color;

        const priceContainer = this.element.querySelector(".product-price");
        priceContainer.innerHTML = `
            <span class="sale-price">KES ${minPrice.toFixed(2)}</span>
            ${minPrice !== maxPrice
                ? `<span class="price-range price original-price"> - KES ${maxPrice.toFixed(2)}</span>`
                : ""}
        `;

        // Update discount badge
        const firstSize = variant.sizes[0];
        const discount = firstSize.sale_price
            ? Math.round(((firstSize.price - firstSize.sale_price) / firstSize.price) * 100)
            : 0;

        const badge = this.element.querySelector(".product-card-sale-badge");
        if (discount) {
            if (badge) badge.innerHTML = `<p>-${discount}%</p>`;
            else {
                const newBadge = document.createElement("div");
                newBadge.classList.add("product-card-sale-badge");
                newBadge.innerHTML = `<p>-${discount}%</p>`;
                this.element.querySelector(".product-info").prepend(newBadge);
            }
        } else if (badge) {
            badge.remove();
        }

        // Update active swatch
        this.element.querySelectorAll(".swatch").forEach((s) => s.classList.remove("active"));
        this.element.querySelector(`.swatch[data-variant="${variantIndex}"]`)?.classList.add("active");
    }

    render() {
        return this.element;
    }
}

