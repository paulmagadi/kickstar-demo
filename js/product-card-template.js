function getPageContext() {
    const indexContainer = document.querySelector('.container.index');
    const pagesContainer = document.querySelector('.container.pages');

    if (indexContainer) {
        return {
            type: 'index',
            imageBase: './images/',
            linkBase: 'pages/',
        };
    } else if (pagesContainer) {
        return {
            type: 'pages',
            imageBase: '../images/',
            linkBase: '',
        };
    } else {
        // fallback for unknown containers
        return {
            type: 'default',
            imageBase: './images/',
            linkBase: '',
        };
    }
}

window.getPageContext = getPageContext;

// const products = window.productsData || [];

function createProductCardTemplate(product) {
    if (!product || product.id === undefined || product.id === null) return "";
    
    
    const firstVariant = product.variants[0];
    const firstSize = firstVariant.sizes[0];

    const sale_price = firstSize.sale_price;
    const price = firstSize.price;

    // const allPrices = product.variants.flatMap(v => v.sizes.map(s => s.sale_price || s.price));
    // const minPrice = Math.min(...allPrices);
    // const maxPrice = Math.max(...allPrices);

    const discount = firstSize.sale_price
        ? Math.round(((firstSize.price - firstSize.sale_price) / firstSize.price) * 100)
        : 0;


    const { imageBase, linkBase } = getPageContext();
    const detailsUrl = `${linkBase}product-details.html?id=${product.id}`;

    // Check if first variant is in wishlist
    const isFirstVariantInWishlist = typeof isInWishlist === 'function' ? 
        isInWishlist(product.id, 0) : false;

    return `
        <div class="product-card" data-product="${product.id}">
            <a href="${detailsUrl}" title="${product.name}">
                <div class="product-image-wrapper">
                    <div class="product-image">
                        <img 
                            src="${imageBase}${firstVariant.images[0].replace(/^\.?\/?images\//, "")}" 
                            alt="${product.name}" 
                            class="product-img"
                        />
                        <div class="product-color">Color: <span>${firstVariant.color}</span></div>
                    </div>
                </div>
            </a>

            <div class="product-info">
                <a href="${detailsUrl}" title="${product.name}">
                    <div class="product-title">${product.name}</div>
                </a>
                <div class="product-category">${product.category[0].toUpperCase()}${product.category.slice(1)}</div>

                <div class="product-price">
                    ${sale_price && sale_price < price 
                        ? `<span class="sale-price">KES ${sale_price}</span>
                        <span class="price-range price original-price"> - KES ${price}</span>`
                        : `<span class="price-range price original-price only">KES ${price}</span>`
                    }
                </div>

                <div class="wishlist-badge ${isFirstVariantInWishlist ? 'active' : ''}" 
                     title="${isFirstVariantInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}">
                    <i class="ri-${isFirstVariantInWishlist ? 'heart-fill' : 'heart-line'}"></i>
                </div>

                ${discount ? `<div class="product-card-sale-badge"><p>-${discount}%</p></div>` : ""}

                <div class="swatch-wrapper">
                    <div class="swatch-scroll-btn swatch-scroll-left hidden">&#10094;</div>
                    <div class="swatches">
                        ${product.variants.map((variant, i) => `
                            <img 
                                src="${imageBase}${variant.images[0].replace(/^\.?\/?images\//, "")}" 
                                alt="${variant.color}" 
                                title="${variant.color}" 
                                class="swatch ${i === 0 ? "active" : ""}" 
                                data-product="${product.id}" 
                                data-variant="${i}" 
                            />
                        `).join("")}
                    </div>
                    <div class="swatch-scroll-btn swatch-scroll-right">&#10095;</div>
                </div>
            </div>
        </div>

        <div class="toast" id="wishlist-toast">
            <i class="ri-heart-fill"></i>
            <span id="toast-message">Product added to wishlist</span>
        </div>
    `;
}

window.createProductCardTemplate = createProductCardTemplate;