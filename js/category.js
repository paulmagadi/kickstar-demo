// // Get category from URL
// const urlParams = new URLSearchParams(window.location.search);
// const category = urlParams.get("cat");

// // Update title
// const categoryTitle = document.getElementById("categoryTitle");
// // categoryTitle.textContent = category ? category.charAt(0).toUpperCase() + category.slice(1) + " Shoes" : "All Products";

// // Where products will be rendered
// const categoryContainer = document.getElementById("categoryProducts");



// function getMaxDiscount(products) {
//     let maxDiscount = 0;

//     products.forEach(product => {
//         product.variants.forEach(variant => {
//             variant.sizes.forEach(size => {
//                 if (size.sale_price && size.price) {
//                     const discount = Math.round(((size.price - size.sale_price) / size.price) * 100);
//                     if (discount > maxDiscount) {
//                         maxDiscount = discount;
//                     }
//                 }
//             });
//         });
//     });

//     return maxDiscount;
// }


// // Render function (reuse your product-card template)
// function renderProductsByCategory(cat) {
//     categoryContainer.innerHTML = "";

//     // let products = window.productsData || []; // Ensure productsData is accessible
//     products = productsData || [];
//     let filteredProducts = products;

//     switch (cat.toLowerCase()) {
//         case "featured":
//             filteredProducts = products.filter(p => p.featured == true);
//             categoryTitle.textContent = "Featured Items";
//             break;
//         case "new":
//             filteredProducts = products.filter(p => p.new == true);
//             categoryTitle.textContent = "New in Store";
//             break;
//         case "deals":
//             filteredProducts = products.filter(p => 
//                 p.variants.some(v => v.sizes.some(s => s.sale_price))
//             );
//             const maxDealDiscount = getMaxDiscount(filteredProducts);
//             categoryTitle.innerHTML = maxDealDiscount
//             ? `Deals — Up to <span style="color: #e53935;">${maxDealDiscount}% Off</span>`
//             // ? `Deals — Up to ${maxDealDiscount}% Off`
//             : "Deals";
//             break;
//         case "men":
//             filteredProducts = products.filter(p => 
//                 p.category.toLowerCase() === cat.toLowerCase()
//             );
//             categoryTitle.textContent = "Men's Shoes";
//             break;
//         case "women":
//             filteredProducts = products.filter(p => 
//                 p.category.toLowerCase() === cat.toLowerCase()
//             );
//             categoryTitle.textContent = "Women's Shoes";
//             break;              
//         case "kids":
//             filteredProducts = products.filter(p => 
//                 p.category.toLowerCase() === cat.toLowerCase()
//             );
//             categoryTitle.textContent = "Kids' Shoes";
//             break;
//         case "unisex":
//             categoryTitle.textContent = "Unisex Shoes";
//             filteredProducts = products.filter(p => 
//                 p.category.toLowerCase() === cat.toLowerCase()
//             );
//             break;
//         case 'all':
//             filteredProducts = products; 
//             categoryTitle.textContent = "All Products";
//             break;
//         default:
//             filteredProducts = [];
//     }

//     if (filteredProducts.length === 0) {
//         categoryContainer.innerHTML = "<p>No products found in this category.</p>";
//         return;
//     }


//     filteredProducts.forEach((product, productIndex) => {

//         // Use first variant and size for defaults
//             const firstVariant = product.variants[0];
//             const firstSize = firstVariant.sizes[0];

//             // Collect all prices (consider sale_price if exists)
//             const allPrices = product.variants.flatMap(variant =>
//                 variant.sizes.map(size => size.sale_price || size.price)
//             );

//             const minPrice = Math.min(...allPrices);
//             const maxPrice = Math.max(...allPrices);

//             // Discount calculation (badge)
//             const discount = firstSize.sale_price
//                 ? Math.round(((firstSize.price - firstSize.sale_price) / firstSize.price) * 100)
//                 : 0;

//         const productCard = `
//             <div class="product-card">
//                 <a href="product-details.html?id=${productIndex}" title="View product">
//                     <div class="product-image-wrapper">
//                         <div class="product-image">
//                             <img src="../images/${firstVariant.images[0].replace(/^\.?\/?images\//, "")}" alt="${product.name}" class="product-img">
//                         </div>
//                     </div>
//                 </a>

//                 <div class="product-info">
//                     <a href="product-details.html?id=${productIndex}" title="${product.name}">
//                         <div class="product-title">${product.name}</div>
//                     </a>

//                     <div class="product-price">
//                         <span class="sale-price">KES ${minPrice.toFixed(2)}</span>
//                         ${minPrice !== maxPrice ? `<span class="price-range"> - KES ${maxPrice.toFixed(2)}</span>` : ""}
//                     </div>
                    
//                     ${discount ? `<div class="product-card-sale-badge"><p>-${discount}%</p></div>` : ""}

//                     <br>
//                     <div class="swatch-wrapper">
//                         <div class="swatch-scroll-btn swatch-scroll-left hidden">&#10094;</div>
//                         <div class="swatches">
//                             ${product.variants.map((variant, index) => `
//                                 <img 
//                                     src="../images/${variant.images[0].replace(/^\.?\/?images\//, "")}"
//                                     alt="${variant.color}" 
//                                     title="${variant.color}" 
//                                     class="swatch ${index === 0 ? "active" : ""}" 
//                                     data-product="${productIndex}" 
//                                     data-variant="${index}" />
//                             `).join("")}
//                         </div>
//                         <div class="swatch-scroll-btn swatch-scroll-right">&#10095;</div>
//                     </div>
//                 </div>
//             </div>
//         `;

//         categoryContainer.insertAdjacentHTML("beforeend", productCard);
//     });
// }

// // Call it
// renderProductsByCategory(category);




document.addEventListener("DOMContentLoaded", () => {

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("cat");

    const categoryTitle = document.getElementById("categoryTitle");
    const categoryContainer = document.getElementById("categoryProducts");
    
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

    function renderProductsByCategory(cat) {
        // if (!categoryContainer || !window.ProductCard || !window.productsData) return;
        categoryContainer.innerHTML = "";

        let products = productsData;
        let filteredProducts = products;

        switch (cat?.toLowerCase()) {
            case "featured":
                filteredProducts = products.filter(p => p.featured);
                categoryTitle.textContent = "Featured Items";
                break;
            case "new":
                filteredProducts = products.filter(p => p.new);
                categoryTitle.textContent = "New in Store";
                break;
            case "deals":
                filteredProducts = products.filter(p =>
                    p.variants.some(v => v.sizes.some(s => s.sale_price))
                );
                const maxDealDiscount = getMaxDiscount(filteredProducts);
                categoryTitle.innerHTML = maxDealDiscount
                    ? `Deals — Up to <span style="color: #e53935;">${maxDealDiscount}% Off</span>`
                    : "Deals";
                break;
            case "men":
                filteredProducts = products.filter(p => p.category.toLowerCase() === "men");
                categoryTitle.textContent = "Men's Shoes";
                break;
            case "women":
                filteredProducts = products.filter(p => p.category.toLowerCase() === "women");
                categoryTitle.textContent = "Women's Shoes";
                break;
            case "kids":
                filteredProducts = products.filter(p => p.category.toLowerCase() === "kids");
                categoryTitle.textContent = "Kids' Shoes";
                break;
            case "unisex":
                filteredProducts = products.filter(p => p.category.toLowerCase() === "unisex");
                categoryTitle.textContent = "Unisex Shoes";
                break;
            case "all":
                filteredProducts = products;
                categoryTitle.textContent = "All Products";
                break;
            default:
                filteredProducts = [];
        }

        if (filteredProducts.length === 0) {
            categoryContainer.innerHTML = "<p>No products found in this category.</p>";
            return;
        }

        // ✅ Use ProductCard class instead of building HTML manually
        filteredProducts.forEach((product, i) => {
            const card = new ProductCard(product, i);
            const el = card.render();
            categoryContainer.appendChild(el);
        });


        // ✅ Optional: Fade-in animation when visible
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        document.querySelectorAll(".product-card").forEach(card => observer.observe(card));
    }

    renderProductsByCategory(category || "all");
    
});
