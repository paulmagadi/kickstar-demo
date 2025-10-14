// category.js
// import { createProductCardTemplate } from "./components/productCard.js";
// import { getMaxDiscount } from "./utils/discountUtils.js";
// import { getPageContext } from "./utils/pageContext.js"; // Uncomment if needed
// import { initializeProductCards } from "./components/productCard.js"; // Uncomment if needed
// import productsData from "../data/products.json" assert { type: "json" }; // Uncomment if needed

// Main script to handle category page rendering
document.addEventListener("DOMContentLoaded", () => {
    // const context = getPageContext();
    // console.log("Running in:", context.type);

    // ✅ 1. Get category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("cat")?.toLowerCase() || "all";

    // ✅ 2. Target elements
    const categoryTitle = document.getElementById("categoryTitle");
    const categoryContainer = document.getElementById("categoryProducts");

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 4;
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const viewLessBtn = document.getElementById("loadLessBtn");

    // ✅ 4. Main render function
    function renderProductsByCategory(cat) {
        if (!categoryContainer) return;
        categoryContainer.innerHTML = "";

        let products = window.productsData || []; 
        products = productsData || []; 
        let filteredProducts = products;
        // filteredProducts = productsData.filter(p => p.id === products.id);


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

        // Pagination for "all" category
        let paginatedProducts = filteredProducts;
        if (cat === "all") {
            loadMoreBtn.classList.add("hide");
            viewLessBtn.classList.add("hide");
            // Calculate start and end indices
            const startIdx = (currentPage - 1) * itemsPerPage;
            const endIdx = startIdx + itemsPerPage;
            paginatedProducts = filteredProducts.slice(startIdx, endIdx);
        }

        // ✅ 6. Render product cards
        const cardsHTML = paginatedProducts
            .map((product, i) => createProductCardTemplate(product, i))
            .join("");

        categoryContainer.innerHTML = cardsHTML;

        // ✅ 7. Reinitialize product card interactions
        if (typeof initializeProductCards === "function") {
            initializeProductCards();
        }

        // Render pagination controls for "all" category
        if (cat === "all") {
            renderPagination(filteredProducts.length);
        }
    }

    // Pagination controls rendering
    function renderPagination(totalItems) {
        let paginationContainer = document.getElementById("pagination");
        if (!paginationContainer) return;
        paginationContainer.innerHTML = "";

        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (totalPages <= 1) {
            paginationContainer.style.display = "none";
            return;
        }
        paginationContainer.style.display = "block";

        // Previous button
        const prevBtn = document.createElement("button");
        prevBtn.textContent = "Previous";
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderProductsByCategory("all");
            }
        };
        paginationContainer.appendChild(prevBtn);

        // Page indicator (e.g., "1 of 12")
        const pageIndicator = document.createElement("span");

        const currentPageDisplay = document.createElement("span");
        currentPageDisplay.className = "current-page";
        currentPageDisplay.textContent = currentPage;

        pageIndicator.innerHTML = `<span class="active">${currentPage}</span> of ${totalPages}`;
        pageIndicator.className = "page-indicator";
        paginationContainer.appendChild(pageIndicator);

        // Next button
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Next";
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderProductsByCategory("all");
            }
        };
        paginationContainer.appendChild(nextBtn);

        // Re-initialize product card functions
        // Ensure product card interactions work after pagination
        // initProductCardFunctions();
        if (typeof initProductCardFunctions === "function") {
            initProductCardFunctions();
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

    // Optional: Load More button functionality (for non-"all" categories)
    
    let itemsToShow = 4;   // Initial items to show
    const incrementBy = 4; // Items to add on each load more   
    function updateProductVisibility() {
        if (category === "all") return; // Disable for "all" (pagination used)
        const productCards = categoryContainer.querySelectorAll(".product-card");
        productCards.forEach((card, index) => {
            card.style.display = index < itemsToShow ? "block" : "none";
        });
        if (productCards.length > itemsToShow) {
            loadMoreBtn.classList.remove("hide");
        } else {
            loadMoreBtn.classList.add("hide");
        }   
        if (itemsToShow > incrementBy) {
            viewLessBtn.classList.remove("hide");
        } else {
            viewLessBtn.classList.add("hide");
        }
    }
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
            itemsToShow += incrementBy;
            updateProductVisibility();
        });
    }
    if (viewLessBtn) {
        viewLessBtn.addEventListener("click", () => {
            itemsToShow -= incrementBy;
            if (itemsToShow < incrementBy) itemsToShow = incrementBy;
            updateProductVisibility();
        });
    }
    // Initial visibility update
    updateProductVisibility();

});

