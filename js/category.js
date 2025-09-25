// Get category from URL
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get("cat");

// Update title
const categoryTitle = document.getElementById("categoryTitle");
categoryTitle.textContent = category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Products";

// Where products will be rendered
const categoryContainer = document.getElementById("categoryProducts");

// Render function (reuse your product-card template)
function renderProductsByCategory(cat) {
    categoryContainer.innerHTML = "";

    // let products = window.productsData || []; // Ensure productsData is accessible
    products = productsData || [];
    let filteredProducts = products;

    switch (cat.toLowerCase()) {
        case "featured":
            filteredProducts = products.filter(p => p.featured == true);
            break;
        case "new":
            filteredProducts = products.filter(p => p.new == true);
            break;
        case "deals":
            filteredProducts = products.filter(p => 
                p.variants.some(v => v.sizes.some(s => s.sale_price))
            );
            break;
        case "men":
        case "women":
        case "kids":
            filteredProducts = products.filter(p => 
                p.category.toLowerCase() === cat.toLowerCase()
            );
            break;
        default:
            filteredProducts = products; // all products
    }

    if (filteredProducts.length === 0) {
        categoryContainer.innerHTML = "<p>No products found in this category.</p>";
        return;
    }


    filteredProducts.forEach((product, productIndex) => {
        const firstVariant = product.variants[0];
        const prices = product.variants.map(v => v.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const discount = product.discount || null;

        const productCard = `
            <div class="product-card">
                <a href="product-details.html?id=${productIndex}" title="View product">
                    <div class="product-image-wrapper">
                        <div class="product-image">
                            <img src="../images/${firstVariant.images[0].replace(/^\.?\/?images\//, "")}" alt="${product.name}" class="product-img">
                        </div>
                    </div>
                </a>

                <div class="product-info">
                    <a href="product-details.html?id=${productIndex}" title="${product.name}">
                        <div class="product-title">${product.name}</div>
                    </a>

                    <div class="product-price">
                        <span class="sale-price">KES ${minPrice.toFixed(2)}</span>
                        ${minPrice !== maxPrice ? `<span class="price-range"> - KES ${maxPrice.toFixed(2)}</span>` : ""}
                    </div>
                    
                    ${discount ? `<div class="product-card-sale-badge"><p>-${discount}%</p></div>` : ""}

                    <br>
                    <div class="swatch-wrapper">
                        <div class="swatch-scroll-btn swatch-scroll-left hidden">&#10094;</div>
                        <div class="swatches">
                            ${product.variants.map((variant, index) => `
                                <img 
                                    src="../images/${variant.images[0].replace(/^\.?\/?images\//, "")}"
                                    alt="${variant.color}" 
                                    title="${variant.color}" 
                                    class="swatch ${index === 0 ? "active" : ""}" 
                                    data-product="${productIndex}" 
                                    data-variant="${index}" />
                            `).join("")}
                        </div>
                        <div class="swatch-scroll-btn swatch-scroll-right">&#10095;</div>
                    </div>
                </div>
            </div>
        `;

        categoryContainer.insertAdjacentHTML("beforeend", productCard);
    });
}

// Call it
renderProductsByCategory(category);
