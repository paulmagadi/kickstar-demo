
function resolvePageLink(page, params = {}) {
    // Normalize path: remove any leading './' or '/'
    page = page.replace(/^(\.\/|\/)+/, "");

    // Determine how deep the current page is
    const depth = window.location.pathname.split("/").filter(Boolean).length;
    let basePath = depth > 1 ? "../".repeat(depth - 1) : "./";

    // Ensure no double "pages/" in the path
    if (page.startsWith("pages/") && basePath.includes("pages/")) {
        page = page.replace(/^pages\//, "");
    }

    // Build final URL
    const url = new URL(basePath + page, window.location.href);

    // Append query params
    Object.entries(params).forEach(([key, value]) =>
        url.searchParams.set(key, value)
    );

    return url.href;
}


/**
 * Resolve image paths dynamically regardless of page depth.
 * Works for pages inside /pages/, subfolders, or at root.
 * Keeps absolute URLs intact.
 */

function resolveImagePath(imgPath) {
    if (!imgPath) return getResolvedPath("logo4.svg");

    // Keep external or inline images as-is
    if (/^(https?:\/\/|data:image\/)/i.test(imgPath)) return imgPath;

    // Normalize path (remove leading ./, ../, /, or images/)
    imgPath = imgPath.replace(/^(\.\/|\.{1,2}\/|\/)?(images\/)?/, "");

    return getResolvedPath(imgPath);
}

/**
 * Builds the correct path prefix depending on current depth.
 */
function getResolvedPath(fileName) {
    const currentPath = window.location.pathname;
    const parts = currentPath.split("/").filter(Boolean);

    // Example:
    // /index.html              -> depth = 1   -> prefix = "./"
    // /pages/category.html     -> depth = 2   -> prefix = "../"
    // /pages/shop/detail.html  -> depth = 3   -> prefix = "../../"
    const depth = parts.length;
    const prefix = depth > 1 ? "../".repeat(depth - 1) : "./";

    return `${prefix}images/${fileName}`;
}

/**
 * Site-wide fallback image handler.
 * If any <img> fails to load, it will automatically switch
 * to /images/no-image.png once (prevents infinite loop).
 */
document.addEventListener(
    "error",
    (e) => {
        const target = e.target;
        if (target.tagName === "IMG" && !target.dataset.fallbackApplied) {
            target.dataset.fallbackApplied = "true";
            target.src = getResolvedPath("logo4.svg");
            console.warn(`⚠️ Image not found, replaced with fallback:`, target.src);
        }
    },
    true
);

// Optional: preload fallback image for smoother UX
(() => {
    const preload = new Image();
    preload.src = getResolvedPath("no-image.png");
})();




window.ProductCard = class ProductCard {
    constructor(product, productIndex) {
        this.product = product;
        this.productIndex = productIndex;
        this.element = this.createCardElement();
        this.attachEventListeners();
    }

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

        const productLink = resolvePageLink('pages/product-details.html', { id: this.productIndex });
        console.log(productLink);

        const card = document.createElement("div");
        card.classList.add("product-card");
        card.innerHTML = `
            <a href="${productLink}" title="View product">
                <div class="product-image-wrapper">
                    <div class="product-image">
                        <img src="${resolveImagePath(firstVariant.images[0])}" 
                             alt="${this.product.name}" 
                             class="product-img" />
                        <div class="product-color">Color: <span>${firstVariant.color}</span></div>
                    </div>
                </div>
            </a>

            <div class="product-info">
                <a href="${productLink}" title="${this.product.name}">
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

        const updateScrollButtons = () => {
            if (!container || !leftBtn || !rightBtn) return;
            const { scrollLeft, scrollWidth, clientWidth } = container;
            leftBtn.classList.toggle("hidden", scrollLeft <= 0);
            rightBtn.classList.toggle("hidden", scrollLeft >= scrollWidth - clientWidth - 1);
        };

        // Scroll event listeners
        leftBtn?.addEventListener("click", () => {
            container.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
        });

        rightBtn?.addEventListener("click", () => {
            container.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
        });

        container?.addEventListener("scroll", () => {
            clearTimeout(container._scrollTimeout);
            container._scrollTimeout = setTimeout(updateScrollButtons, 100);
        });

        // Swatch selection
        container?.addEventListener("click", (e) => {
            const swatch = e.target.closest(".swatch");
            if (!swatch) return;
            const variantIndex = parseInt(swatch.dataset.variant);
            this.updateVariant(variantIndex);
        });

        window.addEventListener("resize", updateScrollButtons);
        updateScrollButtons();
    }

    updateVariant(variantIndex) {
        const variant = this.product.variants[variantIndex];
        if (!variant) return;

        const allPrices = variant.sizes.map(s => s.sale_price || s.price);
        const minPrice = Math.min(...allPrices);
        const maxPrice = Math.max(...allPrices);

        // Update main image
        const img = this.element.querySelector(".product-img");
        if (img) {
            img.src = resolveImagePath(variant.images[0]);
            img.alt = `${this.product.name} - ${variant.color}`;
        }

        // Update color text
        const colorHolder = this.element.querySelector(".product-color span");
        if (colorHolder) colorHolder.textContent = variant.color;

        // Update price
        const priceContainer = this.element.querySelector(".product-price");
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

        this.updateDiscountBadge(discount);

        // Update active swatch
        this.element.querySelectorAll(".swatch").forEach((s) => s.classList.remove("active"));
        this.element.querySelector(`.swatch[data-variant="${variantIndex}"]`)?.classList.add("active");
    }

    updateDiscountBadge(discount) {
        let badge = this.element.querySelector(".product-card-sale-badge");
        
        if (discount > 0) {
            if (badge) {
                badge.innerHTML = `<p>-${discount}%</p>`;
            } else {
                badge = document.createElement("div");
                badge.classList.add("product-card-sale-badge");
                badge.innerHTML = `<p>-${discount}%</p>`;
                this.element.querySelector(".product-info").prepend(badge);
            }
        } else if (badge) {
            badge.remove();
        }
    }

    render() {
        return this.element;
    }

    // Cleanup method for when card is removed
    destroy() {
        window.removeEventListener("resize", this.updateScrollButtons);
    }
};