// search.js
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const queryParam = params.get("q")?.toLowerCase() || "";

  // 🔹 Global header forms (desktop + mobile)
  const headerForms = document.querySelectorAll("header form");
  headerForms.forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[name='q']" || "input[type='search']");
      if (input && input.value.trim()) {
        // window.location.href = `./pages/search.html?q=${encodeURIComponent(input.value.trim())}`;

        // Detect if current page is inside "pages/" or root
        const inPagesDir = window.location.pathname.includes("/pages/");

        // Redirect correctly
        if (inPagesDir) {
            window.location.href = `search.html?q=${encodeURIComponent(input.value.trim())}`;
        } else {
            window.location.href = `pages/search.html?q=${encodeURIComponent(input.value.trim())}`;
        }
      }
    });
  });


  // 🔹 Only run search logic if we’re on search.html
  const searchInput = document.getElementById("searchInput");
  const colorFilter = document.getElementById("colorFilter");
  const sizeFilter = document.getElementById("sizeFilter");
  const priceFilter = document.getElementById("priceFilter");
  const resultsContainer = document.getElementById("searchResults");
  const noResults = document.getElementById("noResults");
  const searchHeading = document.getElementById("searchHeading");

  if (!resultsContainer) return; // stop if not on search page

  if (searchInput) searchInput.value = queryParam;
  if (searchHeading) {
    searchHeading.textContent = queryParam
      ? `Results for "${queryParam}"`
      : "Search Products";
  }

  // 🔹 Build dropdown filters (unique colors/sizes)
  const colors = new Set();
  const sizes = new Set();
  productsData.forEach(p => {
    p.variants.forEach(v => {
      colors.add(v.color);
      v.sizes.forEach(s => sizes.add(s.size));
    });
  });

  if (colorFilter) {
    [...colors].sort().forEach(c => {
      colorFilter.innerHTML += `<option value="${c}">${c}</option>`;
    });
  }
  if (sizeFilter) {
    [...sizes].sort((a, b) => a - b).forEach(s => {
      sizeFilter.innerHTML += `<option value="${s}">${s}</option>`;
    });
  }

  // 🔹 Renderer with discount logic
  const renderSearchResults = (list) => {
    if (list.length === 0) {
      resultsContainer.innerHTML = "";
      if (noResults) noResults.style.display = "block";
      return;
    }
    if (noResults) noResults.style.display = "none";


   const context = getPageContext();
    resultsContainer.innerHTML = list.map(product =>
      createProductCardTemplate(product, product.id, context)
    ).join("");

   initProductCardFunctions();

  };

  // 🔹 Filtering logic
  const filterProducts = () => {
    const searchTerm = (searchInput?.value || queryParam).toLowerCase();
    const selectedColor = colorFilter?.value || "";
    const selectedSize = sizeFilter?.value || "";
    const selectedPrice = priceFilter?.value || "";

    const filtered = productsData.filter(product => {
      const matchesName = product.name.toLowerCase().includes(searchTerm) ||
                          product.brand?.toLowerCase().includes(searchTerm) ||
                          (
                            ["men", "women", "kids"].includes(product.category?.toLowerCase()) &&
                            product.category?.toLowerCase() === searchTerm
                          ) ||
                          product.variants.some(variant =>
                            variant.color.toLowerCase().includes(searchTerm) ||
                            variant.sizes.some(s => s.size.toString() === searchTerm)
                          );


      const matchesVariant = product.variants.some(variant => {
        const matchesColor = selectedColor ? variant.color === selectedColor : true;
        const matchesSize = selectedSize
          ? variant.sizes.some(s => s.size == selectedSize)
          : true;
        const matchesPrice = selectedPrice ? (() => {
          const [min, max] = selectedPrice.includes("-")
            ? selectedPrice.split("-").map(Number)
            : [Number(selectedPrice), Infinity];
          return variant.sizes.some(s =>
            (s.sale_price || s.price) >= min &&
            (s.sale_price || s.price) <= max
          );
        })() : true;

        return matchesColor && matchesSize && matchesPrice;
      });

      return matchesName && matchesVariant;
    });

    renderSearchResults(filtered);
  };

  // 🔹 Bind events
  if (searchInput) searchInput.addEventListener("input", filterProducts);
  if (colorFilter) colorFilter.addEventListener("change", filterProducts);
  if (sizeFilter) sizeFilter.addEventListener("change", filterProducts);
  if (priceFilter) priceFilter.addEventListener("change", filterProducts);

  // 🔹 Initial load
  filterProducts();

});
