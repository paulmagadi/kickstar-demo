
document.addEventListener("DOMContentLoaded", () => {
    function getMaxDiscount(products) {
        let maxDiscount = 0;
        products.forEach(product => {
            product.variants.forEach(variant => {
                variant.sizes.forEach(size => {
                    if (size.sale_price && size.price) {
                        const discount = Math.round(((size.price - size.sale_price) / size.price) * 100);
                        if (discount > maxDiscount) maxDiscount = discount;
                    }
                });
            });
        });
        return maxDiscount;
    }

    const dealsHeader = document.getElementById("deals-header");
    if (dealsHeader) {
        dealsHeader.innerHTML = `Deals - Up to <span style="color: #e53935;">${getMaxDiscount(productsData)}% Off</span>`;
    }

    function renderProducts(productsList, targetContainer, limit = null) {
        if (!targetContainer || !window.ProductCard) return;
        const list = limit ? productsList.slice(0, limit) : productsList;

        // Clear previous content
        targetContainer.innerHTML = "";

        // Append product cards as DOM elements
        list.forEach((product, i) => {
            const card = new ProductCard(product, i);
            targetContainer.appendChild(card.render());
        });
    }


    // Example render calls
    renderProducts(productsData.filter(p => p.featured), document.querySelector("#featured-products"), 8);
    renderProducts(productsData.filter(p => p.variants.some(v => v.sizes.some(s => s.sale_price))), document.querySelector("#deals-products"), 8);
    renderProducts(productsData.filter(p => p.new), document.querySelector("#new-products"), 8);
    renderProducts(productsData.filter(p => p.category.toLowerCase() === "men"), document.querySelector("#men-products"), 8);
    renderProducts(productsData.filter(p => p.category.toLowerCase() === "women"), document.querySelector("#women-products"), 8);
    renderProducts(productsData.filter(p => p.category.toLowerCase() === "kids"), document.querySelector("#kids-products"), 8);
});