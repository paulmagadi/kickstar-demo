document.addEventListener("DOMContentLoaded", () => {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"));
  const container = document.querySelector(".product-page-container");
  
  if (!productId || !products.length) {
      container.innerHTML = "<h2>Product Not Found</h2>";
      return;
  }
  
  const product = products.find(p => p.id === productId);
  if (!product) {
      container.innerHTML = "<h2>Product Not Found</h2>";
      return;
  }

  document.querySelector(".product-page-image img").src = product.image;
  document.querySelector(".product-page-product-name").textContent = product.name;
  document.querySelector(".product-page-product-description").textContent = product.description;
  document.querySelector(".product-page-product-brand").textContent = `Brand: ${product.brand}`;
  document.querySelector(".product-page-product-color").textContent = product.color;

  const priceElement = document.querySelector(".product-page-product-price .price");
  const salePriceElement = document.querySelector(".product-page-product-price .sale-price");
  
  if (product.sale_price && product.sale_price < product.price) {
      priceElement.innerHTML = `<del>$${product.price.toFixed(2)}</del>`;
      salePriceElement.textContent = `$${product.sale_price.toFixed(2)}`;
  } else {
      priceElement.textContent = `$${product.price.toFixed(2)}`;
      salePriceElement.style.display = "none";
  }
  
  const stockText = document.querySelector(".stock-quantity");
  stockText.textContent = product.stock_quantity === 1 ? "Only 1 item available" : 
      product.stock_quantity <= 5 ? `Only ${product.stock_quantity} items available` : 
      `We have ${product.stock_quantity} items available`;
  
  // Populate Thumbnails
  const thumbnailsContainer = document.querySelector(".product-page-thumbnails-container");
  thumbnailsContainer.innerHTML = product.thumbnails.map(thumb => 
      `<div class="product-page-thumbnail">
          <img src="${thumb}" alt="${product.name}" width="100%">
      </div>`
  ).join("");
  
  thumbnailsContainer.querySelectorAll(".product-page-thumbnail img").forEach(img => {
      img.addEventListener("click", () => {
          document.querySelector(".product-page-image img").src = img.src;
      });
      img.addEventListener("mouseover", () => {
          document.querySelector(".product-page-image img").src = img.src;
      });
  });
});

// Thumbnails Scroll Control
const scrollContainer = document.querySelector(".product-page-thumbnails-container");
const scrollLeft = document.querySelector(".product-page-thumbnail-scroll-left");
const scrollRight = document.querySelector(".product-page-thumbnail-scroll-right");

scrollLeft?.addEventListener("click", () => scrollContainer.scrollBy({ left: -300, behavior: "smooth" }));
scrollRight?.addEventListener("click", () => scrollContainer.scrollBy({ left: 300, behavior: "smooth" }));

document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") scrollContainer.scrollBy({ left: -300, behavior: "smooth" });
  if (event.key === "ArrowRight") scrollContainer.scrollBy({ left: 300, behavior: "smooth" });
});

// Product Quantity Management
document.addEventListener("DOMContentLoaded", () => {
  const stockQuantity = parseInt(document.querySelector('.stock-quantity').textContent.match(/\d+/)?.[0] || "0", 10);
  const productQuantity = document.querySelector('.product-page-product-quantity .quantity');
  const minusQuantity = document.querySelector('.product-page-product-quantity .quantity-minus');
  const plusQuantity = document.querySelector('.product-page-product-quantity .quantity-plus');

  let qty = 1;

  const updateQuantity = () => {
      productQuantity.textContent = qty;

      minusQuantity.disabled = qty <= 1;
      plusQuantity.disabled = qty >= stockQuantity;
  };

  plusQuantity.addEventListener('click', () => {
      if (qty < stockQuantity) {
          qty++;
          updateQuantity();
      }
  });

  minusQuantity.addEventListener('click', () => {
      if (qty > 1) {
          qty--;
          updateQuantity();
      }
  });

  updateQuantity();
});

// Add to Cart
document.addEventListener("DOMContentLoaded", () => {
  const cartCountDisplay = document.querySelector(".cart-count");
  const addToCartButton = document.querySelector(".product-page-add-to-cart");
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const updateCartCount = () => {
      const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
      cartCountDisplay.textContent = totalItems;
      cartCountDisplay.style.display = totalItems > 0 ? "inline-block" : "none";
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
  };

  addToCartButton?.addEventListener("click", () => {
      const productName = document.querySelector(".product-page-product-name").textContent;
      const productPrice = parseFloat(
          document.querySelector(".product-page-product-price .sale-price")?.textContent.replace("$", "") ||
          document.querySelector(".product-page-product-price .price").textContent.replace("$", "")
      );
      const productImage = document.querySelector(".product-page-image img").src;
      const quantity = parseInt(document.querySelector(".quantity").textContent) || 1;

      const existingProduct = cartItems.find(item => item.name === productName);
      if (existingProduct) {
          existingProduct.quantity += quantity;
      } else {
          cartItems.push({ name: productName, price: productPrice, image: productImage, quantity });
      }
      updateCartCount();
  });

  updateCartCount();
});
