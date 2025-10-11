// // pages/category.js
// document.addEventListener("DOMContentLoaded", () => {
//     const context = getPageContext();
//     console.log("Running in:", context.type);

//     // ✅ 1. Get category from URL
//     const urlParams = new URLSearchParams(window.location.search);
//     const category = urlParams.get("cat")?.toLowerCase() || "all";

//     // ✅ 2. Target elements
//     const categoryTitle = document.getElementById("categoryTitle");
//     const categoryContainer = document.getElementById("categoryProducts");


//     // ✅ 4. Main render function
//     function renderProductsByCategory(cat) {
//         if (!categoryContainer) return;
//         categoryContainer.innerHTML = "";

//         let products = window.productsData || []; 
//         // Ensure productsData is accessible 
//         products = productsData || []; 
//         let filteredProducts = products;

//         switch (cat) {
//             case "featured":
//                 filteredProducts = products.filter(p => p.featured == true);
//                 categoryTitle.textContent = "Featured Items";
//                 break;

//             case "new":
//                 filteredProducts = products.filter(p => p.new == true);
//                 categoryTitle.textContent = "New in Store";
//                 break;

//             case "deals":
//                 filteredProducts = products.filter(p =>
//                     p.variants.some(v => v.sizes.some(s => s.sale_price))
//                 );
//                 const maxDealDiscount = getMaxDiscount(filteredProducts);
//                 categoryTitle.innerHTML = maxDealDiscount
//                     ? `Deals — Up to <span style="color: #e53935;">${maxDealDiscount}% Off</span>`
//                     : "Deals";
//                 break;

//             case "men":
//                 filteredProducts = products.filter(p => p.category.toLowerCase() === "men");
//                 categoryTitle.textContent = "Men's Shoes";
//                 break;

//             case "women":
//                 filteredProducts = products.filter(p => p.category.toLowerCase() === "women");
//                 categoryTitle.textContent = "Women's Shoes";
//                 break;

//             case "kids":
//                 filteredProducts = products.filter(p => p.category.toLowerCase() === "kids");
//                 categoryTitle.textContent = "Kids' Shoes";
//                 break;

//             case "unisex":
//                 filteredProducts = products.filter(p => p.category.toLowerCase() === "unisex");
//                 categoryTitle.textContent = "Unisex Shoes";
//                 break;

//             case "all":
//             default:
//                 filteredProducts = products;
//                 categoryTitle.textContent = "All Products";
//                 break;
//         }

//         // ✅ 5. If no products
//         if (filteredProducts.length === 0) {
//             categoryContainer.innerHTML = "<p>No products found in this category.</p>";
//             return;
//         }

//         // ✅ 6. Render product cards using your template
//         const cardsHTML = filteredProducts
//             .map((product, index) => createProductCardTemplate(product, index))
//             .join("");

//         categoryContainer.innerHTML = cardsHTML;

//         // ✅ 7. Reinitialize card interactions (from product-card.js)
//         if (typeof initializeProductCards === "function") {
//             initializeProductCards();
//         }
//     }

//     // ✅ 8. Call render
//     renderProductsByCategory(category);
// });


// pages/category.js
document.addEventListener("DOMContentLoaded", () => {
    // const context = getPageContext();
    // console.log("Running in:", context.type);

    // ✅ 1. Get category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("cat")?.toLowerCase() || "all";

    // ✅ 2. Target elements
    const categoryTitle = document.getElementById("categoryTitle");
    const categoryContainer = document.getElementById("categoryProducts");

    // ✅ 4. Main render function
    function renderProductsByCategory(cat) {
        if (!categoryContainer) return;
        categoryContainer.innerHTML = "";

        let products = window.productsData || []; 
        // Ensure productsData is accessible 
        products = productsData || []; 
        let filteredProducts = products;

        switch (cat) {
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
            default:
                filteredProducts = products;
                categoryTitle.textContent = "All Products";
                break;
        }

        // ✅ 5. Handle no products
        if (filteredProducts.length === 0) {
            categoryContainer.innerHTML = "<p>No products found in this category.</p>";
            return;
        }

        // ✅ 6. Render product cards
        const cardsHTML = filteredProducts
            .map((product, i) => createProductCardTemplate(product, i))
            .join("");

        categoryContainer.innerHTML = cardsHTML;

        // ✅ 7. Reinitialize product card interactions
        if (typeof initializeProductCards === "function") {
            initializeProductCards();
        }
    }

    // ✅ 8. Call render
    renderProductsByCategory(category);

    // Highlight active nav link
    if (typeof category !== "undefined" && category) {
        document.querySelectorAll("nav .nav-links a").forEach(link => {
            if (link.href.includes(`cat=${category}`)) {
                link.classList.add("active-url");
            }
        });
    }
});
