// let productsData = JSON.parse(localStorage.getItem("products")) || 
const productsData = [
    {
        "id": 0,
        "name": "Nike Air Max 270",
        "brand": "Nike",
        "category": "kids", 
        "featured" : true,
        "new": true,
        "description": "The Nike Air Max 270 features the biggest heel Air unit yet for a super-soft ride.",
        "variants": [
            {
                "color": "Black/White",
                "images": [
                    "./images/nike-air-max-270.jpg",
                    "./images/nike-air-max-270-1.jpg",
                    "./images/nike-air-max-270-2.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 150.00, "sale_price": 135.00, "stock_quantity": 5 },
                    { "size": 41, "price": 150.00, "sale_price": null, "stock_quantity": 2 },
                    { "size": 42, "price": 155.00, "sale_price": 140.00, "stock_quantity": 0 }
                ]
            },
            {
                "color": "Red/Black",
                "images": [
                    "./images/nike-air-max-270-3.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 155.00, "sale_price": 140.00, "stock_quantity": 3 },
                    { "size": 41, "price": 160.00, "sale_price": null, "stock_quantity": 1 },
                    { "size": 42, "price": 160.00, "sale_price": 145.00, "stock_quantity": 4 }
                ]
            }
        ]
    },
    {
        "id": 1,
        "name": "Adidas Ultraboost 22",
        "brand": "Adidas",
        "category": "kids", 
        "featured" : true,
        "new": false,
        "description": "Experience next-level comfort with Adidas Ultraboost 22 and responsive Boost cushioning.",
        "variants": [
            {
                "color": "Black/Cloud White/Signal Orange",
                "images": [
                    "./images/adidas-ultraboost-22.jpg",
                    "./images/adidas-ultraboost-22-1.jpg",
                    "./images/adidas-ultraboost-22-2.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 180.00, "sale_price": 160.00, "stock_quantity": 2 },
                    { "size": 41, "price": 185.00, "sale_price": null, "stock_quantity": 0 },
                    { "size": 42, "price": 190.00, "sale_price": 170.00, "stock_quantity": 6 }
                ]
            },
            {
                "color": "Grey/Blue",
                "images": [
                    "./images/adidas-ultraboost-22-3.jpg",
                    "./images/adidas-ultraboost-22-4.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 185.00, "sale_price": 165.00, "stock_quantity": 4 },
                    { "size": 41, "price": 190.00, "sale_price": null, "stock_quantity": 7 }
                ]
            }, 
            {
                "color": "White/Blue",
                "images": [
                    "./images/adidas-ultraboost-22-5.jpg",
                    "./images/adidas-ultraboost-22-6.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 185.00, "sale_price": 165.00, "stock_quantity": 10 },
                    { "size": 41, "price": 190.00, "sale_price": 180.00, "stock_quantity": 5 }
                ]
            }
        ]
    },
    {
        "id": 2,
        "name": "Puma RS-X",
        "brand": "Puma",
        "category": "Men", 
        "featured" : true,
        "new": true,
        "description": "The Puma RS-X brings retro style with bulky design and bold colors.",
        "variants": [
            {
                "color": "White/Blue/Red",
                "images": [
                    "./images/puma-rsx.jpg",
                    "./images/puma-rsx-1.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 120.00, "sale_price": null, "stock_quantity": 4 },
                    { "size": 41, "price": 125.00, "sale_price": 115.00, "stock_quantity": 2 },
                    { "size": 42, "price": 130.00, "sale_price": null, "stock_quantity": 0 }
                ]
            },
            {
                "color": "Black/Yellow",
                "images": [
                    "./images/puma-rsx-2.jpg",
                    "./images/puma-rsx-4.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 125.00, "sale_price": 110.00, "stock_quantity": 5 },
                    { "size": 41, "price": 130.00, "sale_price": null, "stock_quantity": 1 }
                ]
            },
            {
                "color": "Red/White",
                "images": [
                    "./images/puma-rsx-5.jpg",
                    "./images/puma-rsx-4.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 120.00, "sale_price": null, "stock_quantity": 4 },
                    { "size": 41, "price": 125.00, "sale_price": 115.00, "stock_quantity": 2 },
                    { "size": 42, "price": 130.00, "sale_price": null, "stock_quantity": 0 }
                ]
            }
        ]
    },
    {
        "id": 3,
        "name": "New Balance 574",
        "brand": "New Balance",
        "category": "Men", 
        "featured" : true,
        "new": false,
        "description": "The iconic New Balance 574 is a versatile and stylish everyday sneaker.",
        "variants": [
            {
                "color": "Grey/White",
                "images": [
                    "./images/new-balance-574-1.jpg",
                    "./images/new-balance-574-2.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 100.00, "sale_price": 90.00, "stock_quantity": 2 },
                    { "size": 41, "price": 105.00, "sale_price": null, "stock_quantity": 3 },
                    { "size": 42, "price": 110.00, "sale_price": null, "stock_quantity": 0 }
                ]
            },
            {
                "color": "Navy/White",
                "images": [
                    "./images/new-balance-574-3.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 105.00, "sale_price": 95.00, "stock_quantity": 1 },
                    { "size": 41, "price": 110.00, "sale_price": null, "stock_quantity": 4 }
                ]
            }
        ]
    },
    {
        "id": 4,
        "name": "Reebok Classic Leather",
        "brand": "Reebok",
        "category": "kids", 
        "featured" : false,
        "new": true,
        "description": "Timeless style with the Reebok Classic Leather, built with soft leather for comfort.",
        "variants": [
            {
                "color": "White",
                "images": [
                    "./images/reebok-classic-leather.jpg",
                    "./images/reebok-classic-leather-1.jpg",
                    "./images/reebok-classic-leather-2.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 95.00, "sale_price": 85.00, "stock_quantity": 3 },
                    { "size": 41, "price": 100.00, "sale_price": null, "stock_quantity": 2 },
                    { "size": 42, "price": 105.00, "sale_price": null, "stock_quantity": 0 }
                ]
            },
            {
                "color": "Black",
                "images": [
                    "./images/reebok-classic-leather-3.jpg",
                    "./images/reebok-classic-leather-4.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 100.00, "sale_price": 90.00, "stock_quantity": 5 },
                    { "size": 41, "price": 105.00, "sale_price": null, "stock_quantity": 1 }
                ]
            }
        ]
    },
    {
        "id": 5,
        "name": "Converse Chuck Taylor All Star",
        "brand": "Converse",
        "category": "Men", 
        "featured" : true,
        "new": false,
        "description": "An undisputed classic sneaker with a canvas upper and iconic design.",
        "variants": [
            {
                "color": "White",
                "images": [
                    "./images/converse-chuck-taylor.jpg",
                    "./images/converse-chuck-taylor-1.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 60.00, "sale_price": null, "stock_quantity": 2 },
                    { "size": 41, "price": 65.00, "sale_price": 55.00, "stock_quantity": 0 },
                    { "size": 42, "price": 70.00, "sale_price": null, "stock_quantity": 3 }
                ]
            },
            {
                "color": "Black",
                "images": [
                    "./images/converse-chuck-taylor-2.jpg",
                    "./images/converse-chuck-taylor-3.jpg",
                    "./images/converse-chuck-taylor-4.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 65.00, "sale_price": null, "stock_quantity": 1 },
                    { "size": 41, "price": 70.00, "sale_price": 60.00, "stock_quantity": 4 }
                ]
            }
        ]
    },
    {
        "id": 6,
        "name": "Vans Old Skool",
        "brand": "Vans",
        "category": "Women", 
        "featured" : true,
        "new": true,
        "description": "The Vans Old Skool features durable canvas and suede with the signature side stripe.",
        "variants": [
            {
                "color": "Black/White",
                "images": [
                    "./images/vans-old-skool.jpg",
                    "./images/vans-old-skool-1.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 70.00, "sale_price": null, "stock_quantity": 4 },
                    { "size": 41, "price": 75.00, "sale_price": 65.00, "stock_quantity": 2 },
                    { "size": 42, "price": 80.00, "sale_price": null, "stock_quantity": 0 }
                ]
            },
            {
                "color": "Blue/White",
                "images": [
                    "./images/vans-old-skool-2.jpg",
                    "./images/vans-old-skool-3.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 75.00, "sale_price": null, "stock_quantity": 3 },
                    { "size": 41, "price": 80.00, "sale_price": 70.00, "stock_quantity": 1 }
                ]
            }
        ]
    },
    {
        "id": 7,
        "name": "Asics Gel-Kayano 28",
        "brand": "Asics",
        "category": "Women",
        "featured" : true,
        "new": false,
        "description": "The Asics Gel-Kayano 28 offers stability and cushioning for long-distance runs.",
        "variants": [
            {
                "color": "Blue/White",
                "images": [
                    "./images/asics-kayano.jpg",
                    "./images/asics-kayano-1.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 160.00, "sale_price": 145.00, "stock_quantity": 2 },
                    { "size": 41, "price": 165.00, "sale_price": null, "stock_quantity": 0 },
                    { "size": 42, "price": 170.00, "sale_price": null, "stock_quantity": 5 }
                ]
            },
            {
                "color": "Black/Red",
                "images": [
                    "./images/asics-kayano-2.jpg",
                    "./images/asics-kayano-3.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 165.00, "sale_price": 150.00, "stock_quantity": 3 },
                    { "size": 41, "price": 170.00, "sale_price": null, "stock_quantity": 1 }
                ]
            },
            {
                "color": "Blue/White",
                "images": [
                    "./images/asics-kayano-4.jpg",
                    "./images/asics-kayano-5.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 165.00, "sale_price": 150.00, "stock_quantity": 3 },
                    { "size": 41, "price": 170.00, "sale_price": 150.00, "stock_quantity": 8 }
                ]
            }
        ]
    },
    {
        "id": 8,
        "name": "Jordan 1 Retro High",
        "brand": "Jordan",
        "category": "Women",
        "featured" : true,
        "new": true,
        "description": "The Jordan 1 Retro High is a timeless sneaker that defined sneaker culture.",
        "variants": [
            {
                "color": "Red/Black/White",
                "images": [
                    "./images/jordan-1-retro.jpg",
                    "./images/jordan-1-retro-1.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 200.00, "sale_price": 180.00, "stock_quantity": 1 },
                    { "size": 41, "price": 210.00, "sale_price": null, "stock_quantity": 2 },
                    { "size": 42, "price": 220.00, "sale_price": null, "stock_quantity": 0 }
                ]
            },
            {
                "color": "Blue/Black/White",
                "images": [
                    "./images/jordan-1-retro-2.jpg",
                    "./images/jordan-1-retro-3.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 210.00, "sale_price": 190.00, "stock_quantity": 4 },
                    { "size": 41, "price": 220.00, "sale_price": null, "stock_quantity": 3 }
                ]
            },
            {
                "color": "Red/Black",
                "images": [
                    "./images/jordan-1-retro-4.jpg",
                    "./images/jordan-1-retro-5.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 210.00, "sale_price": 190.00, "stock_quantity": 9 },
                    { "size": 41, "price": 220.00, "sale_price": 210.00, "stock_quantity": 8 }
                ]
            }
        ]
    },
    {
        "id": 9,
        "name": "Yeezy Boost 350 V2",
        "brand": "Adidas",
        "category": "Men",
        "featured" : false,
        "new": true,
        "description": "The Yeezy Boost 350 V2 combines Kanye West’s vision with Adidas innovation.",
        "variants": [
            {
                "color": "Zebra",
                "images": [
                    "./images/yeezy-350.jpg",
                    "./images/yeezy-350-1.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 220.00, "sale_price": 200.00, "stock_quantity": 2 },
                    { "size": 41, "price": 230.00, "sale_price": null, "stock_quantity": 0 },
                    { "size": 42, "price": 240.00, "sale_price": null, "stock_quantity": 5 }
                ]
            },
            {
                "color": "Black",
                "images": [
                    "./images/yeezy-350-2.jpg",
                    "./images/yeezy-350-3.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 230.00, "sale_price": 210.00, "stock_quantity": 1 },
                    { "size": 41, "price": 240.00, "sale_price": null, "stock_quantity": 3 }
                ]
            }
        ]
    }
];


// Brand metadata
const brandsData = {
  "Nike": {
    logo: "../images/brands/nike.png",
    description: "Nike inspires athletes worldwide with innovative footwear designed for performance and style."
  },
  "Adidas": {
    logo: "../images/brands/adidas.png",
    description: "Adidas is known for cutting-edge sportswear, merging comfort and technology for athletes."
  },
  "Puma": {
    logo: "../images/brands/puma.png",
    description: "Puma blends fashion and sport, offering iconic shoes for everyday wear and training."
  },
  // Add more as you expand
};

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".products-cards-container");

    // ✅ Render function (reusable)
    const renderProducts = (productsList, targetContainer, limit = null) => {
        if (!targetContainer) return;
        const list = limit ? productsList.slice(0, limit) : productsList;
        targetContainer.innerHTML = list.map((product, productIndex) => {
            // Use first variant and size for defaults
            const firstVariant = product.variants[0];
            const firstSize = firstVariant.sizes[0];

            // Collect all prices (consider sale_price if exists)
            const allPrices = product.variants.flatMap(variant =>
                variant.sizes.map(size => size.sale_price || size.price)
            );

            const minPrice = Math.min(...allPrices);
            const maxPrice = Math.max(...allPrices);

            // Discount calculation (badge)
            const discount = firstSize.sale_price
                ? Math.round(((firstSize.price - firstSize.sale_price) / firstSize.price) * 100)
                : 0;

            return `
                <div class="product-card">
                    <a href="pages/product-details.html?id=${productIndex}" title="View product">
                        <div class="product-image-wrapper">
                            <div class="product-image">
                                <img src="${firstVariant.images[0]}" class="product-img" alt="${product.name}" />
                            </div>
                        </div>
                    </a>

                    <div class="product-info">
                        <a href="pages/product-details.html?id=${productIndex}" title="${product.name}">
                            <div class="product-title">${product.name}</div>
                        </a>

                        <div class="product-price">
                            <span class="sale-price">KES ${minPrice.toFixed(2)}</span>
                            ${minPrice !== maxPrice ? 
                                `<span class="price-range"> - KES ${maxPrice.toFixed(2)}</span>` 
                                : ""}
                        </div>
                        
                        ${discount ? `<div class="product-card-sale-badge"><p>-${discount}%</p></div>` : ""}

                        <br>
                        <div class="swatch-wrapper">
                            <div class="swatch-scroll-btn swatch-scroll-left hidden">&#10094;</div>
                            <div class="swatches">
                                ${product.variants.map((variant, index) => `
                                    <img 
                                        src="${variant.images[0]}" 
                                        alt="${variant.color}" 
                                        title="${variant.color}" 
                                        class="swatch ${index === 0 ? "active" : ""}" 
                                        data-product="${productIndex}" 
                                        data-variant="${index}" />
                                `).join("")}
                            </div>
                            <div class="swatch-scroll-btn swatch-scroll-right">&#10095;</div>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    };


    // ✅ Featured products
    const featuredContainer = document.querySelector("#featured-products");
    const featuredProducts = productsData.filter(p => p.featured);
    renderProducts(featuredProducts, featuredContainer, 4);

    // ✅ New arrivals
    const newContainer = document.querySelector("#new-products");
    const newProducts = productsData.filter(p => p.new);
    renderProducts(newProducts, newContainer, 4);

    // ✅ Deals (products with any sale_price)
    const dealsContainer = document.querySelector("#deals-products");
    const dealsProducts = productsData.filter(p =>
        p.variants.some(v => v.sizes.some(s => s.sale_price))
    );
    renderProducts(dealsProducts, dealsContainer, 8);

    // ✅ Men’s Shoes
    const menContainer = document.querySelector("#men-products");
    const menProducts = productsData.filter(p => p.category.toLowerCase() === "men");
    renderProducts(menProducts, menContainer, 4);

    // ✅ Women’s Shoes
    const womenContainer = document.querySelector("#women-products");
    const womenProducts = productsData.filter(p => p.category.toLowerCase() === "women");
    renderProducts(womenProducts, womenContainer, 4);

    // ✅ Kids
    const kidsContainer = document.querySelector("#kids-products");
    const kidsProducts = productsData.filter(p => p.category.toLowerCase() === "kids");
    renderProducts(kidsProducts, kidsContainer, 4);

    // ✅ Default full listing (if needed)
    // if (container) {
    //     renderProducts(productsData, container);
    // }
});
