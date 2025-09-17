let products = JSON.parse(localStorage.getItem("products")) || [
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
        "../../images/nike-air-max-270.jpg",
        "../../images/nike-air-max-270-1.jpg",
        "../../images/nike-air-max-270-2.jpg",
        "../../images/nike-air-max-270-3.jpg"
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
    "image": "../../images/adidas-ultraboost-22.jpg",
    "thumbnails": [
        "../../images/adidas-ultraboost-22.jpg",
        "../../images/adidas-ultraboost-22-1.jpg",
        "../../images/adidas-ultraboost-22-2.jpg",
        "../../images/adidas-ultraboost-22-3.jpg",
        "../../images/adidas-ultraboost-22-4.jpg",
        "../../images/adidas-ultraboost-22-5.jpg",
        "../../images/adidas-ultraboost-22-6.jpg"
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
    "image": "../images/new-balance-574.jpg",
    "thumbnails": [
        "../images/new-balance-574.jpg",
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
    },
    {
    "id": 9,
    "name": "Asics Gel-Kayano 28",
    "price": 160.00,
    "sale_price": 140.00,
    "description": "The Asics Gel-Kayano 28 provides excellent stability and cushioning for long-distance running.",
    "brand": "Asics",
    "color": "Blue/Orange",
    "stock_quantity" : 15,
    "image": "../images/asics-gel-kayano.jpg",
    "thumbnails": [
        "../images/asics-gel-kayano.jpg",
        "../images/asics-gel-kayano-1.jpg",
        "../images/asics-gel-kayano-2.jpg",
        "../images/asics-gel-kayano-3.jpg"
    ]
    },
    {
    "id": 10,
    "name": "Under Armour HOVR Phantom 2",
    "price": 140.00,
    "sale_price": 120.00,
    "description": "The Under Armour HOVR Phantom 2 is designed for high-performance training and running.",
    "brand": "Under Armour",
    "color": "Red/Black",
    "stock_quantity" : 4,
    "image": "../images/under-armour-hovr.jpg",
    "thumbnails": [
        "../images/under-armour-hovr.jpg",
        "../images/under-armour-hovr-1.jpg",
        "../images/under-armour-hovr-2.jpg",
        "../images/under-armour-hovr-3.jpg",
        "../images/under-armour-hovr-4.jpg"
    ]
    }
];
localStorage.setItem("products", JSON.stringify(products));

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".products-cards-container");
    const cartCountDisplay = document.querySelector(".cart-count");
    const searchInput = document.getElementById("product-search");

    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    let products = JSON.parse(localStorage.getItem("products")) || [];

    // Function to render products
    const renderProducts = (productsList) => {
        container.innerHTML = productsList.map(product => {
            const discount = product.sale_price ? Math.round(((product.price - product.sale_price) / product.price) * 100) : 0;
            return `
                <div class="product-card">
                    <div class="product-card-image">
                        <a href="product.html?id=${product.id}" title="View Product">
                            <img src="${product.image}" alt="${product.name}">
                        </a>
                    </div>
                    <div class="product-card-details">
                        <div class="product-card-product-name product-name">
                            <a href="product.html?id=${product.id}" title="View Product">${product.name}</a>
                        </div>
                        <div class="product-card-price-cart">
                            <span class="product-card-price product-price">
                                ${product.sale_price ? 
                                    `<p class="price"><del>$${product.price.toFixed(2)}</del></p>
                                    <p class="sale-price product-sale-price">$${product.sale_price.toFixed(2)}</p>` 
                                    : `<p class="price">$${product.price.toFixed(2)}</p>`}
                            </span>
                            <span class="product-card-add-to-cart add-to-cart">
                                <button data-id="${products.id}">Add to cart</button>
                            </span>
                        </div>
                        ${product.sale_price ? `<div class="product-card-sale-badge"><p>${discount}%</p></div>` : ""}
                    </div>
                </div>`;
        }).join("");

        attachCartEventListeners(); // Ensure buttons work after rendering
    };

    // Function to update cart count
    const updateCartCount = () => {
        let totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartCountDisplay.textContent = totalItems;
        cartCountDisplay.style.display = totalItems > 0 ? "inline-block" : "none";
        localStorage.setItem("cartCount", totalItems);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    };

    // Function to attach event listeners to Add to Cart buttons
    const attachCartEventListeners = () => {
        document.querySelectorAll(".add-to-cart button").forEach(button => {
            button.addEventListener("click", (event) => {
                const productId = parseInt(event.target.dataset.id);
                const product = products.find(p => p.id === productId);
                if (!product) return;

                let existingProduct = cartItems.find(item => item.id === productId);
                if (existingProduct) {
                    existingProduct.quantity++;
                } else {
                    cartItems.push({ ...product, quantity: 1 });
                }
                updateCartCount();
            });
        });
    };

    // Search functionality
    searchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.color.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
    });

    // Initial render
    renderProducts(products);
    updateCartCount();
});
