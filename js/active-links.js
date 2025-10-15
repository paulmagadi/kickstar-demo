document.addEventListener("DOMContentLoaded", () => {
    const currentUrl = window.location.href.toLowerCase();
    const urlParams = new URLSearchParams(window.location.search);
    const currentCat = urlParams.get("cat")?.toLowerCase() || "";
    const currentPage = getCurrentPageName();

    const allLinks = document.querySelectorAll("nav a, .footer a");

    allLinks.forEach(link => {
        const href = link.getAttribute("href")?.toLowerCase();
        if (!href) return;

        // --- EXACT PAGE MATCH ---
        const isExactPage =
            currentUrl.endsWith(href) ||
            currentUrl.includes(href + "?") ||
            (href.endsWith("index.html") && currentPage === "index.html");

        // --- CATEGORY MATCH ---
        const hrefParams = new URLSearchParams(href.split("?")[1]);
        const hrefCat = hrefParams.get("cat")?.toLowerCase();

        const isCategoryMatch =
            href.includes("category.html") &&
            hrefCat &&
            hrefCat === currentCat;

        // --- PRODUCT DETAILS MATCH ---
        // Example: product-details.html?id=12&cat=men
        const isProductDetailsMatch =
            currentPage === "product-details.html" &&
            href.includes("category.html") &&
            hrefCat &&
            hrefCat === currentCat;

        // Apply active class if any rule matches
        if (isExactPage || isCategoryMatch || isProductDetailsMatch) {
            link.classList.add("active-url");
        } else {
            link.classList.remove("active-url");
        }
    });

    // Helper: get current filename (e.g. 'index.html', 'category.html', etc.)
    function getCurrentPageName() {
        const path = window.location.pathname.split("/");
        return path[path.length - 1] || "index.html";
    }
});
