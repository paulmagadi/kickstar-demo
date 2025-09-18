// let productsData = JSON.parse(localStorage.getItem("products")) || 
let productsData = [ 
    {
    "id": 1,
    "name": "Nike Air Max 270",
    "price": 150.00,
    "sale_price": null,
    "description": "The Nike Air Max 270 features the biggest heel Air unit yet for a super-soft ride that feels as impossible as it looks.",
    "brand": "Nike",
    "color": "Black/White",
    "stock_quantity" : 6,
    "image": "../images/nike-air-max-270.jpg",
    "thumbnails": [
        "../images/nike-air-max-270.jpg",
        "../images/nike-air-max-270-1.jpg",
        "../images/nike-air-max-270-2.jpg",
        "../images/nike-air-max-270-3.jpg"
    ]
    },
    {
    "id": 2,
    "name": "Adidas Ultraboost 22",
    "price": 180.00,
    "sale_price": 160.00,
    "description": "Experience next-level comfort with Adidas Ultraboost 22, featuring responsive Boost cushioning and a Primeknit upper.",
    "brand": "Adidas",
    "color": "Black/Cloud White/Signal Orange",
    "stock_quantity" : 4,
    "image": "../images/adidas-ultraboost-22.jpg",
    "thumbnails": [
        "../images/adidas-ultraboost-22.jpg",
        "../images/adidas-ultraboost-22-1.jpg",
        "../images/adidas-ultraboost-22-2.jpg",
        "../images/adidas-ultraboost-22-3.jpg",
        "../images/adidas-ultraboost-22-4.jpg",
        "../images/adidas-ultraboost-22-5.jpg",
        "../images/adidas-ultraboost-22-6.jpg"
    ]
    },
    {
    "id": 3,
    "name": "Puma RS-X",
    "price": 130.00,
    "sale_price": 110.00,
    "description": "The Puma RS-X combines retro vibes with futuristic design for an everyday sneaker that stands out.",
    "brand": "Puma",
    "color": "White/Blue",
    "stock_quantity" : 5,
    "image": "../images/puma-rsx.jpg",
    "thumbnails": [
        "../images/puma-rsx.jpg",
        "../images/puma-rsx-1.jpg",
        "../images/puma-rsx-2.jpg",
        "../images/puma-rsx-3.jpg",
        "../images/puma-rsx-4.jpg",
        "../images/puma-rsx-5.jpg"
    ]
    },
    {
    "id": 4,
    "name": "Reebok Classic Leather",
    "price": 90.00,
    "sale_price": 75.00,
    "description": "A timeless design, the Reebok Classic Leather offers unmatched style and comfort.",
    "brand": "Reebok",
    "color": "White",
    "stock_quantity" : 6,
    "image": "../images/reebok-classic-leather.jpg",
    "thumbnails": [
        "../images/reebok-classic-leather.jpg",
        "../images/reebok-classic-leather-1.jpg",
        "../images/reebok-classic-leather-2.jpg",
        "../images/reebok-classic-leather-3.jpg",
        "../images/reebok-classic-leather-4.jpg",
        "../images/reebok-classic-leather-5.jpg",
        "../images/reebok-classic-leather-6.jpg"
    ]
    },
    {
    "id": 5,
    "name": "New Balance 574",
    "price": 100.00,
    "sale_price": 85.00,
    "description": "A classic silhouette with modern cushioning, the New Balance 574 is perfect for everyday wear.",
    "brand": "New Balance",
    "color": "Grey/White",
    "stock_quantity" : 7,
    "image": "../images/new-balance-574-1.jpg",
    "thumbnails": [
        "../images/new-balance-574-1.jpg",
        "../images/new-balance-574-2.jpg",
        "../images/new-balance-574-3.jpg",
        "../images/new-balance-574-4.jpg",
        "../images/new-balance-574-5.jpg"
    ]
    },
    {
    "id": 6,
    "name": "Jordan 1 Retro High OG",
    "price": 200.00,
    "sale_price": 180.00,
    "description": "The Jordan 1 Retro High OG is an icon, bringing basketball heritage and street style together.",
    "brand": "Jordan",
    "color": "Red/Black/White",
    "stock_quantity" : 10,
    "image": "../images/jordan-1-retro.jpg",
    "thumbnails": [
        "../images/jordan-1-retro.jpg",
        "../images/jordan-1-retro-1.jpg",
        "../images/jordan-1-retro-2.jpg",
        "../images/jordan-1-retro-3.jpg",
        "../images/jordan-1-retro-4.jpg",
        "../images/jordan-1-retro-5.jpg",
        "../images/jordan-1-retro-6.jpg"
    ]
    },
    {
    "id": 7,
    "name": "Converse Chuck Taylor All Star",
    "price": 70.00,
    "sale_price": 60.00,
    "description": "The Converse Chuck Taylor All Star is a classic sneaker that never goes out of style.",
    "brand": "Converse",
    "color": "Black/White",
    "stock_quantity" : 2,
    "image": "../images/converse-chuck-taylor.jpg",
    "thumbnails": [
        "../images/converse-chuck-taylor.jpg",
        "../images/converse-chuck-taylor-1.jpg",
        "../images/converse-chuck-taylor-2.jpg",
        "../images/converse-chuck-taylor-3.jpg",
        "../images/converse-chuck-taylor-4.jpg",
        "../images/converse-chuck-taylor-5.jpg"
    ]
    },
    {
    "id": 8,
    "name": "Vans Old Skool",
    "price": 75.00,
    "sale_price": 65.00,
    "description": "The Vans Old Skool is an iconic skate shoe with a durable suede and canvas upper.",
    "brand": "Vans",
    "color": "Black/White",
    "stock_quantity" : 1,
    "image": "../images/vans-old-skool.jpg",
    "thumbnails": [
        "../images/vans-old-skool.jpg",
        "../images/vans-old-skool-1.jpg",
        "../images/vans-old-skool-2.jpg",
        "../images/vans-old-skool-3.jpg",
        "../images/vans-old-skool-4.jpg"
    ]
    }
    // {
    // "id": 9,
    // "name": "Under Armour HOVR Phantom 2",
    // "price": 140.00,
    // "sale_price": 120.00,
    // "description": "The Under Armour HOVR Phantom 2 is designed for high-performance training and running.",
    // "brand": "Under Armour",
    // "color": "Red/Black",
    // "stock_quantity" : 4,
    // "image": "../images/under-armour-hovr.jpg",
    // "thumbnails": [
    //     "../images/under-armour-hovr.jpg",
    //     "../images/under-armour-hovr-1.jpg",
    //     "../images/under-armour-hovr-2.jpg",
    //     "../images/under-armour-hovr-3.jpg",
    //     "../images/under-armour-hovr-4.jpg"
    // ]
    // }
];

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".products-cards-container");

    // let products = productsData;
    // Render products

    const renderProducts = (productsList) => {
    container.innerHTML = productsList.map(product => {
        const discount = product.sale_price
            ? Math.round(((product.price - product.sale_price) / product.price) * 100)
            : 0;

        // Use sale price if available, otherwise original price
        const finalPrice = product.sale_price || product.price;

        return `
            <div class="product-card">
                <a href="pages/product-details.html?id=${product.id}" title="View product">
                    <div class="product-image-wrapper">
                        <div class="product-image">
                            <img src="${product.image}" class="product-img" alt="${product.name}" />
                        </div>
                    </div>
                </a>

                <div class="product-info">
                    <a href="pages/product-details.html?id=${product.id}" title="${product.name}">
                        <div class="product-title">${product.name}</div>
                    </a>

                    <div class="product-price">
                        <span class="sale-price">KES ${finalPrice.toFixed(2)}</span>
                        ${product.sale_price ? 
                            `<span class="price original-price"><del>KES ${product.price.toFixed(2)}</del></span>` 
                            : ""}
                    </div>
                    
                    ${discount ? `<div class="product-card-sale-badge"><p>-${discount}%</p></div>` : ""}

                    <br>
                    <div class="swatch-wrapper">
                        <div class="swatch-scroll-btn swatch-scroll-left hidden">&#10094;</div>
                        <div class="swatches">
                            ${product.thumbnails.map((thumb, index) => `
                                <img 
                                    src="${thumb}" 
                                    alt="${product.color}" 
                                    title="${product.color}" 
                                    class="swatch ${index === 0 ? "active" : ""}" 
                                    data-id="${product.id}" 
                                    data-thumb="${thumb}" />
                            `).join("")}
                        </div>
                        <div class="swatch-scroll-btn swatch-scroll-right">&#10095;</div>
                    </div>

                </div>
            </div>
        `;
    }).join("");

};

    // Initial render
    renderProducts(productsData);
});
