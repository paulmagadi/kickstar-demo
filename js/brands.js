const grid = document.getElementById("brands-grid");
// Get unique brands, handling null/undefined
const brands = [...new Set(productsData.map(p => p.brand || "Generic"))];

brands.forEach(brand => {
    const card = document.createElement("a");
    card.href = `brand.html?brand=${encodeURIComponent(brand)}`;
    card.title = brand;
    card.className = "brand-card";
    

    const logo = brandsData[brand]?.logo || "../images/brands/generic.png";

    card.innerHTML = `
        <img src="${logo}" alt="${brand} logo">
        <br>
        <span>${brand}</span>
    `;
    grid.appendChild(card);
});