// let productsData = JSON.parse(localStorage.getItem("products")) || 
let productsData = [ 
  {
    "name": "Nike Air Max 270",
    "description": "The Nike Air Max 270 features the biggest heel Air unit yet for a super-soft ride that feels as impossible as it looks.",
    "brand": "Nike",
    "variants": [
      {
        "color": "Black/White",
        "size": "US 9",
        "price": 150.00,
        "sale_price": 135.00,
        "stock_quantity": 5,
        "image": "/images/nike-air-max-270.jpg",
        "thumbnails": [
          "/images/nike-air-max-270.jpg",
          "/images/nike-air-max-270-1.jpg",
          "/images/nike-air-max-270-2.jpg",
          "/images/nike-air-max-270-3.jpg"
        ]
      },
      {
        "color": "Red/Black",
        "size": "US 10",
        "price": 155.00,
        "sale_price": 140.00,
        "stock_quantity": 3,
        "image": "/images/nike-air-max-270-red.jpg",
        "thumbnails": [
          "/images/nike-air-max-270-red.jpg",
          "/images/nike-air-max-270-red-1.jpg",
          "/images/nike-air-max-270-red-2.jpg"
        ]
      }
    ]
  },
  {
    "name": "Adidas Ultraboost 22",
    "description": "Experience next-level comfort with Adidas Ultraboost 22, featuring responsive Boost cushioning and a Primeknit upper.",
    "brand": "Adidas",
    "variants": [
      {
        "color": "Black/Cloud White/Signal Orange",
        "size": "US 8",
        "price": 180.00,
        "sale_price": 160.00,
        "stock_quantity": 4,
        "image": "/images/adidas-ultraboost-22.jpg",
        "thumbnails": [
          "/images/adidas-ultraboost-22.jpg",
          "/images/adidas-ultraboost-22-1.jpg",
          "/images/adidas-ultraboost-22-2.jpg"
        ]
      },
      {
        "color": "Grey/Blue",
        "size": "US 9",
        "price": 185.00,
        "sale_price": 165.00,
        "stock_quantity": 5,
        "image": "/images/adidas-ultraboost-22-grey.jpg",
        "thumbnails": [
          "/images/adidas-ultraboost-22-grey.jpg",
          "/images/adidas-ultraboost-22-grey-1.jpg"
        ]
      }
    ]
  },
  {
    "name": "Puma RS-X",
    "description": "The Puma RS-X combines retro vibes with futuristic design for an everyday sneaker that stands out.",
    "brand": "Puma",
    "variants": [
      {
        "color": "White/Blue",
        "size": "US 9",
        "price": 130.00,
        "sale_price": 110.00,
        "stock_quantity": 5,
        "image": "/images/puma-rsx.jpg",
        "thumbnails": [
          "/images/puma-rsx.jpg",
          "/images/puma-rsx-1.jpg",
          "/images/puma-rsx-2.jpg"
        ]
      },
      {
        "color": "Black/Red",
        "size": "US 10",
        "price": 135.00,
        "sale_price": 115.00,
        "stock_quantity": 2,
        "image": "/images/puma-rsx-black.jpg",
        "thumbnails": [
          "/images/puma-rsx-black.jpg",
          "/images/puma-rsx-black-1.jpg"
        ]
      }
    ]
  },
  {
    "name": "Reebok Classic Leather",
    "description": "A timeless design, the Reebok Classic Leather offers unmatched style and comfort.",
    "brand": "Reebok",
    "variants": [
      {
        "color": "White",
        "size": "US 8",
        "price": 90.00,
        "sale_price": 75.00,
        "stock_quantity": 10,
        "image": "/images/reebok-classic-leather.jpg",
        "thumbnails": [
          "/images/reebok-classic-leather.jpg",
          "/images/reebok-classic-leather-1.jpg"
        ]
      },
      {
        "color": "Black",
        "size": "US 9",
        "price": 95.00,
        "sale_price": 80.00,
        "stock_quantity": 5,
        "image": "/images/reebok-classic-leather-black.jpg",
        "thumbnails": [
          "/images/reebok-classic-leather-black.jpg",
          "/images/reebok-classic-leather-black-1.jpg"
        ]
      }
    ]
  },
  {
    "name": "New Balance 574",
    "description": "A classic silhouette with modern cushioning, the New Balance 574 is perfect for everyday wear.",
    "brand": "New Balance",
    "variants": [
      {
        "color": "Grey/White",
        "size": "US 9",
        "price": 100.00,
        "sale_price": 85.00,
        "stock_quantity": 2,
        "image": "/images/new-balance-574-1.jpg",
        "thumbnails": [
          "/images/new-balance-574-1.jpg",
          "/images/new-balance-574-2.jpg"
        ]
      },
      {
        "color": "Navy/White",
        "size": "US 10",
        "price": 105.00,
        "sale_price": 90.00,
        "stock_quantity": 1,
        "image": "/images/new-balance-574-navy.jpg",
        "thumbnails": [
          "/images/new-balance-574-navy.jpg",
          "/images/new-balance-574-navy-1.jpg"
        ]
      }
    ]
  },
  {
    "name": "Jordan 1 Retro High OG",
    "description": "The Jordan 1 Retro High OG is an icon, bringing basketball heritage and street style together.",
    "brand": "Jordan",
    "variants": [
      {
        "color": "Red/Black/White",
        "size": "US 9",
        "price": 200.00,
        "sale_price": 180.00,
        "stock_quantity": 3,
        "image": "/images/jordan-1-retro.jpg",
        "thumbnails": [
          "/images/jordan-1-retro.jpg",
          "/images/jordan-1-retro-1.jpg"
        ]
      },
      {
        "color": "Blue/White",
        "size": "US 10",
        "price": 210.00,
        "sale_price": 190.00,
        "stock_quantity": 3,
        "image": "/images/jordan-1-retro-blue.jpg",
        "thumbnails": [
          "/images/jordan-1-retro-blue.jpg",
          "/images/jordan-1-retro-blue-1.jpg"
        ]
      }
    ]
  },
  {
    "name": "Converse Chuck Taylor All Star",
    "description": "The Converse Chuck Taylor All Star is a classic sneaker that never goes out of style.",
    "brand": "Converse",
    "variants": [
      {
        "color": "Black/White",
        "size": "US 8",
        "price": 70.00,
        "sale_price": 60.00,
        "stock_quantity": 5,
        "image": "/images/converse-chuck-taylor.jpg",
        "thumbnails": [
          "/images/converse-chuck-taylor.jpg",
          "/images/converse-chuck-taylor-1.jpg"
        ]
      },
      {
        "color": "White",
        "size": "US 9",
        "price": 72.00,
        "sale_price": 62.00,
        "stock_quantity": 5,
        "image": "/images/converse-chuck-taylor-white.jpg",
        "thumbnails": [
          "/images/converse-chuck-taylor-white.jpg",
          "/images/converse-chuck-taylor-white-1.jpg"
        ]
      }
    ]
  },
  {
    "name": "Vans Old Skool",
    "description": "The Vans Old Skool is an iconic skate shoe with a durable suede and canvas upper.",
    "brand": "Vans",
    "variants": [
      {
        "color": "Black/White",
        "size": "US 9",
        "price": 75.00,
        "sale_price": 65.00,
        "stock_quantity": 1,
        "image": "/images/vans-old-skool.jpg",
        "thumbnails": [
          "/images/vans-old-skool.jpg",
          "/images/vans-old-skool-1.jpg"
        ]
      },
      {
        "color": "Blue/White",
        "size": "US 10",
        "price": 78.00,
        "sale_price": 68.00,
        "stock_quantity": 1,
        "image": "/images/vans-old-skool-blue.jpg",
        "thumbnails": [
          "/images/vans-old-skool-blue.jpg",
          "/images/vans-old-skool-blue-1.jpg"
        ]
      }
    ]
  }
//   {
//     "name": "Asics Gel-Kayano 28",
//     "description": "The Asics Gel-Kayano 28 provides excellent stability and cushioning for long-distance running.",
//     "brand": "Asics",
//     "variants": [
//       {
//         "color": "Blue/Orange",
//         "size": "US 9",
//         "price": 160.00,
//         "sale_price": 140.00,
//         "stock_quantity": 3,
//         "image": "/images/asics-gel-kayano.jpg",
//         "thumbnails": [
//           "/images/asics-gel-kayano.jpg",
//           "/images/asics-gel-kayano-1.jpg"
//         ]
//       },
//       {
//         "color": "Black/Yellow",
//         "size": "US 10",
//         "price": 165.00,
//         "sale_price": 145.00,
//         "stock_quantity": 2,
//         "image": "/images/asics-gel-kayano-black.jpg",
//         "thumbnails": [
//           "/images/asics-gel-kayano-black.jpg",
//           "/images/asics-gel-kayano-black-1.jpg"
//         ]
//       }
//     ]
//   },
//   {
//     "name": "Under Armour HOVR Phantom 2",
//     "description": "The Under Armour HOVR Phantom 2 is designed for high-performance training and running.",
//     "brand": "Under Armour",
//     "variants": [
//       {
//         "color": "Red/Black",
//         "size": "US 9",
//         "price": 140.00,
//         "sale_price": 120.00,
//         "stock_quantity": 1,
//         "image": "/images/under-armour-hovr.jpg",
//         "thumbnails": [
//           "/images/under-armour-hovr.jpg",
//           "/images/under-armour-hovr-1.jpg"
//         ]
//       },
//       {
//         "color": "Grey/White",
//         "size": "US 10",
//         "price": 145.00,
//         "sale_price": 125.00,
//         "stock_quantity": 1,
//         "image": "/images/under-armour-hovr-grey.jpg",
//         "thumbnails": [
//           "/images/under-armour-hovr-grey.jpg",
//           "/images/under-armour-hovr-grey-1.jpg"
//         ]
//       }
//     ]
//   }
];


document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".products-cards-container");

    const renderProducts = (productsList) => {
        container.innerHTML = productsList.map((product, productIndex) => {
            // Use the first variant as default
            const firstVariant = product.variants[0];

            // Compute "starting from" price (cheapest sale_price or price)
            const minPrice = Math.min(...product.variants.map(v => v.sale_price || v.price));
            const maxPrice = Math.max(...product.variants.map(v => v.sale_price || v.price));

            // Discount calculation (from first variant for badge display)
            const discount = firstVariant.sale_price
                ? Math.round(((firstVariant.price - firstVariant.sale_price) / firstVariant.price) * 100)
                : 0;

            return `
                <div class="product-card">
                    <a href="pages/product-details.html?id=${productIndex}" title="View product">
                        <div class="product-image-wrapper">
                            <div class="product-image">
                                <img src="${firstVariant.image}" class="product-img" alt="${product.name}" />
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
                                        src="${variant.image}" 
                                        alt="${variant.color}" 
                                        title="${variant.color} ${variant.size}" 
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

    // Initial render
    renderProducts(productsData);
});

