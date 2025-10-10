function createProductCardTemplate(product, productIndex, imageBase = "./images/") {
    const firstVariant = product.variants[0];
    const firstSize = firstVariant.sizes[0];

    const allPrices = product.variants.flatMap(v => v.sizes.map(s => s.sale_price || s.price));
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);

    const discount = firstSize.sale_price
        ? Math.round(((firstSize.price - firstSize.sale_price) / firstSize.price) * 100)
        : 0;

    const detailsUrl = `pages/product-details.html?id=${productIndex}`;

    return `
        <div class="product-card">
            <a href="${detailsUrl}" title="View product">
                <div class="product-image-wrapper">
                    <div class="product-image">
                        <img src="${imageBase}${firstVariant.images[0].replace(/^\.?\/?images\//, "")}" 
                             alt="${product.name}" 
                             class="product-img" />
                        <div class="product-color">Color: <span>${firstVariant.color}</span></div>
                    </div>
                </div>
            </a>

            <div class="product-info">
                <a href="${detailsUrl}" title="${product.name}">
                    <div class="product-title">${product.name}</div>
                </a>

                <div class="product-price">
                    <span class="sale-price">KES ${minPrice.toFixed(2)}</span>
                    ${minPrice !== maxPrice 
                        ? `<span class="price-range price original-price"> - KES ${maxPrice.toFixed(2)}</span>`
                        : ""}
                </div>

                ${discount ? `<div class="product-card-sale-badge"><p>-${discount}%</p></div>` : ""}

                <div class="swatch-wrapper">
                    <div class="swatch-scroll-btn swatch-scroll-left hidden">&#10094;</div>
                    <div class="swatches">
                        ${product.variants.map((variant, i) => `
                            <img src="${imageBase}${variant.images[0].replace(/^\.?\/?images\//, "")}" 
                                alt="${variant.color}" 
                                title="${variant.color}" 
                                class="swatch ${i === 0 ? "active" : ""}" 
                                data-product="${productIndex}" 
                                data-variant="${i}" />
                        `).join("")}
                    </div>
                    <div class="swatch-scroll-btn swatch-scroll-right">&#10095;</div>
                </div>
            </div>
        </div>
    `;
}
