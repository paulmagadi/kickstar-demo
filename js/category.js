// category.js
// import { createProductCardTemplate } from "./components/productCard.js";
// import { getMaxDiscount } from "./utils/discountUtils.js";
// import { getPageContext } from "./utils/pageContext.js"; // Uncomment if needed
// import { initializeProductCards } from "./components/productCard.js"; // Uncomment if needed
// import productsData from "../data/products.json" assert { type: "json" }; // Uncomment if needed

// Main script to handle category page rendering
document.addEventListener("DOMContentLoaded", () => {

    // 1. Get category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("cat")?.toLowerCase() || "all";

    // 2. Target elements
    const categoryTitle = document.getElementById("categoryTitle");
    const categoryTitleNote = document.getElementById("categoryTitleNote");
    const categoryContainer = document.getElementById("categoryProducts");
    const breadcrumbCategory = document.getElementById("category-breadcrumb");

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 4;
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const viewLessBtn = document.getElementById("loadLessBtn");

    // 4. Main render function
    function renderProductsByCategory(cat) {
        if (!categoryContainer) return;
        categoryContainer.innerHTML = "";

        breadcrumbCategory.innerText = cat.charAt(0).toUpperCase() + cat.slice(1);

        let products = window.productsData || []; 
        products = productsData || []; 
        let filteredProducts = products;

        document.title = `Category - ${cat.charAt(0).toUpperCase() + cat.slice(1)}`;
        switch (cat) {
            case "featured":
                filteredProducts = products.filter(p => p.featured);
                categoryTitle.textContent = "Featured Items";
                categoryTitleNote.textContent = "Our handpicked selection of top-rated shoes"
                break;

            case "new":
                filteredProducts = products.filter(p => p.new);
                categoryTitle.textContent = "New in Store";
                categoryTitleNote.textContent = "Check out the latest additions to our collection"
                break;

            case "deals":
                filteredProducts = products.filter(p =>
                    p.variants.some(v => v.sizes.some(s => s.sale_price))
                );
                const maxDealDiscount = getMaxDiscount(filteredProducts);
                categoryTitle.innerHTML = maxDealDiscount
                    ? `Deals — Up to <span style="color: #e53935;">${maxDealDiscount}% Off</span>`
                    : "Deals";
                
                categoryTitleNote.textContent = "Don't miss out on our exclusive deals and discounts"
                break;

            case "men":
                filteredProducts = products.filter(p => p.category.toLowerCase() === "men");
                categoryTitle.textContent = "Men's Shoes";
                categoryTitleNote.textContent = "Explore our collection of stylish and comfortable men’s shoes"
                break;

            case "women":
                filteredProducts = products.filter(p => p.category.toLowerCase() === "women");
                categoryTitle.textContent = "Women's Shoes";
                categoryTitleNote.textContent = "Discover our range of fashionable and trendy women’s shoes"
                break;

            case "kids":
                filteredProducts = products.filter(p => p.category.toLowerCase() === "kids");
                categoryTitle.textContent = "Kids' Shoes";
                categoryTitleNote.textContent = "Find the perfect shoes for your little ones"
                break;

            case "unisex":
                filteredProducts = products.filter(p => p.category.toLowerCase() === "unisex");
                categoryTitle.textContent = "Unisex Shoes";
                categoryTitleNote.textContent = "Check out our collection of Unisex Shoes. Fit for all genders"
                break;

            case "all":
            default:
                filteredProducts = products;
                categoryTitle.textContent = "All Products";
                breadcrumbCategory.innerText = "All Products";
                break;
        }

        // 5. Handle no products
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

        // 6. Render product cards
        const cardsHTML = paginatedProducts
            .map((product, i) => createProductCardTemplate(product, i))
            .join("");

        categoryContainer.innerHTML = cardsHTML;

        // 7. Reinitialize product card interactions
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

        pageIndicator.innerHTML = `Page<span class="active"> ${currentPage}</span> of ${totalPages}`;
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

    // 8. Call render
    renderProductsByCategory(category);

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

