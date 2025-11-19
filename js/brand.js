document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const brandName = urlParams.get("brand");

  const brandHeader = document.getElementById("brandHeader");
  const brandProductsContainer = document.getElementById("brandProducts");
  const breadcrumbBrand = document.getElementById("breadcrumb-brand");
  const paginationContainer = document.getElementById("pagination");

  // Pagination settings
  const PRODUCTS_PER_PAGE = 4;
  let currentPage = 1;
  let filteredProducts = [];

  if (!brandName) {
    brandHeader.innerHTML = "<p>No brand selected.</p>";
    return;
  }

  document.title = `${brandName} - KickStar`;
  if(breadcrumbBrand) breadcrumbBrand.textContent = brandName;

  // Get brand info - handle "Generic" brand case
  const brandInfo = brandsData[brandName] || {};
  const logo = brandInfo.logo || "../images/brands/generic.png";
  const desc = brandInfo.description || `Explore products from ${brandName}.`;

  // Header section
  brandHeader.innerHTML = `
    <img src="${logo}" alt="${brandName} logo" class="brand-logo">
    <h1>${brandName}</h1>
    <p>${desc}</p>
  `;

  // Filter products - handle "Generic" brand case
  filteredProducts = productsData.filter(p => {
    const productBrand = p.brand || "Generic";
    return productBrand.toLowerCase() === brandName.toLowerCase();
  });

  if (filteredProducts.length === 0) {
    brandProductsContainer.innerHTML = "<p>No products found for this brand.</p>";
    return;
  }

  // Initialize pagination
  renderProducts();
  setupPagination();

  function renderProducts() {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Render products for current page
    brandProductsContainer.innerHTML = paginatedProducts
      .map(product => createProductCardTemplate(product))
      .join("");

    // Initialize product interactions after rendering
    if (typeof initProductCardFunctions === "function") {
      initProductCardFunctions();
    }
  }

  function setupPagination() {
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

    if (totalPages > 1) {
      createPagination(totalPages);
      paginationContainer.classList.remove('hide');
    } else {
      paginationContainer.classList.add('hide');
    }
  }

  function createPagination(totalPages) {
    const previousDisabled = currentPage === 1 ? 'disabled' : '';
    const nextDisabled = currentPage === totalPages ? 'disabled' : '';

    paginationContainer.innerHTML = `
      <button class="pagination-btn ${previousDisabled}" 
              ${previousDisabled ? 'disabled' : ''} 
              data-action="prev">
        Previous
      </button>
      
      <span class="pagination-info">Page <span class="active-page">${currentPage}</span> of ${totalPages}</span>
      
      <button class="pagination-btn ${nextDisabled}" 
              ${nextDisabled ? 'disabled' : ''} 
              data-action="next">
        Next
      </button>
    `;

    // Add event listeners
    const prevBtn = paginationContainer.querySelector('[data-action="prev"]');
    const nextBtn = paginationContainer.querySelector('[data-action="next"]');

    if (prevBtn) {
      prevBtn.addEventListener('click', goToPreviousPage);
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', goToNextPage);
    }
  }

  function goToPreviousPage() {
    if (currentPage > 1) {
      currentPage--;
      renderProducts();
      setupPagination();
      scrollToTop();
    }
  }

  function goToNextPage() {
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    if (currentPage < totalPages) {
      currentPage++;
      renderProducts();
      setupPagination();
      scrollToTop();
    }
  }

  function scrollToTop() {
    brandProductsContainer.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
});