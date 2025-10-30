
document.addEventListener("DOMContentLoaded", () => {
    // Update "Deals" header dynamically
    const dealsHeader = document.getElementById("deals-header");
    if (dealsHeader && typeof getMaxDiscount === "function") {
        const maxDiscount = getMaxDiscount(productsData);
        dealsHeader.innerHTML = `Deals - Up to <span style="color:#e53935;">${maxDiscount}% Off</span>`;
    }

    /**
     * Render products to a given container
     * @param {Array} productsList - List of product objects
     * @param {HTMLElement} container - Target container element
     * @param {number|null} limit - Max number of products to show (null for no limit)
     */
    function renderProducts(productsList, container, limit = null) {
        if (!container || !Array.isArray(productsList)) return;
        const list = limit ? productsList.slice(0, limit) : productsList;

        container.innerHTML = list
            .map(product => createProductCardTemplate(product))
            .join("");

        // Initialize product interactions after rendering
        if (typeof initProductCardFunctions === "function") {
            initProductCardFunctions();
        }
    }

    // const filteredProducts = productsData.filter(p => p.id === productId);

    // 🔹 Render product sections
    renderProducts(
        productsData.filter(p => p.featured),
        document.querySelector("#featured-products"),
        8
    );

    renderProducts(
        productsData.filter(p => p.new),
        document.querySelector("#new-products"),
        8
    );

    renderProducts(
        productsData.filter(p =>
            p.variants.some(v => v.sizes.some(s => s.sale_price))
        ),
        document.querySelector("#deals-products"),
        8
    );

    renderProducts(
        productsData.filter(p => p.category.toLowerCase() === "men"),
        document.querySelector("#men-products"),
        8
    );

    renderProducts(
        productsData.filter(p => p.category.toLowerCase() === "women"),
        document.querySelector("#women-products"),
        8
    );

    renderProducts(
        productsData.filter(p => p.category.toLowerCase() === "kids"),
        document.querySelector("#kids-products"),
        8
    );

    renderProducts(
        productsData.filter(p => p.category.toLowerCase() === "unisex"),
        document.querySelector("#unisex-products"),
        8
    );
});

