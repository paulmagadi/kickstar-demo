// let productsData = JSON.parse(localStorage.getItem("products")) || 
const productsData = [
    {
        "id": 0,
        "name": "Nike Air Max 270",
        "brand": "Nike",
        "category": "Kids", 
        "featured" : true,
        "new": true,
        "description": "The Nike Air Max 270 features the biggest heel Air unit yet for a super-soft ride.",
        "variants": [
            {
                "color": "Black/White",
                "images": [
                    "./images/nike-air-max-270.jpg",
                    "./images/nike-air-max-270-1.jpg",
                    "./images/nike-air-max-270-2.jpg",
                    "./images/nike-air-max-270.jpg",
                    "./images/nike-air-max-270-1.jpg",
                    "./images/nike-air-max-270-2.jpg",
                    "./images/nike-air-max-270.jpg",
                    "./images/nike-air-max-270-1.jpg",
                    "./images/nike-air-max-270-2.jpg",
                    "./images/nike-air-max-270.jpg",
                    "./images/nike-air-max-270-1.jpg",
                    "./images/nike-air-max-270-2.jpg",
                    "./images/nike-air-max-270.jpg",
                    "./images/nike-air-max-270-1.jpg",
                    "./images/nike-air-max-270-2.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 150.00, "sale_price": 135.00, "stock_quantity": 15 },
                    { "size": 41, "price": 150.00, "sale_price": null, "stock_quantity": 12 },
                    { "size": 42, "price": 155.00, "sale_price": 140.00, "stock_quantity": 0 }
                ]
            },
            {
                "color": "Red/Black",
                "images": [
                    "./images/nike-air-max-270-3.jpg"
                ],
                "sizes": [
                    { "size": 40, "price": 155.00, "sale_price": 120.00, "stock_quantity": 3 },
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
        "category": "Kids", 
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
        "new": false,
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
                    { "size": 41, "price": 125.00, "sale_price": 115.00, "stock_quantity": 2, "featured" : true },
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
        "category": "Kids", 
        "featured" : true,
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
        "category": "unisex", 
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



const brandsData = {
        "Nike": {
        logo: "../images/brands/nike.png",
        description: "Just Do It."
    },
        "Adidas": {
        logo: "./images/brands/adidas.png",
        description: "Impossible is Nothing."
    },
        "Puma": {
        logo: "./images/brands/puma.png",
        description: "Forever Faster."
    },
        "New Balance": {
        logo: "./images/brands/new-balance.png",
        description: "Fearlessly Independent Since 1906."
    },
        "Reebok": {
        logo: "./images/brands/reebok.png",
        description: "Be More Human."
    },
        "Converse": {
        logo: "./images/brands/converse.png",
        description: "Shoes are Boring. Wear Sneakers."
    },
        "Vans": {
        logo: "./images/brands/vans.png",
        description: "Off The Wall."
    },
        "Asics": {
        logo: "./images/brands/asics.png",
        description: "Sound Mind, Sound Body."
    },
        "Jordan": {
        logo: "./images/brands/jordan.png",
        description: "Be Like Mike."
    },
        "Yeezy": {
        logo: "./images/brands/yeezy.png",
        description: "Yeezy by Kanye West."
    }
}


function getMaxDiscount(products) {
    let maxDiscount = 0;
    products.forEach(product => {
        product.variants.forEach(variant => {
            variant.sizes.forEach(size => {
                if (size.sale_price && size.price) {
                    const discount = Math.round(((size.price - size.sale_price) / size.price) * 100);
                    if (discount > maxDiscount) maxDiscount = discount;
                }
            });
        });
    });
    return maxDiscount;
}