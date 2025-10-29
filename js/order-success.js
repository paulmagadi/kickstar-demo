document.addEventListener("DOMContentLoaded", () => {
    // Initialize the thank you page
    initOrderSucessPage();
});

function initOrderSucessPage() {
    try {
        const order = JSON.parse(localStorage.getItem("lastOrder") || "{}");
        const items = order.items || order.cart || [];
        const shippingFee = 300;

        // Update order details
        updateOrderDetails(order, shippingFee);
        
        // Render order items
        renderOrderItems(items);
        
        // Update shipping details
        updateShippingDetails(order.shippingAddress);
        
        // Setup PDF download
        setupPDFDownload(order);
        
        // Setup additional actions
        setupAdditionalActions();
        
        // Clear cart after successful order
        clearCart();
        
        // Show success animation
        showSuccessAnimation();

    } catch (error) {
        console.error("Error initializing thank you page:", error);
        showErrorState();
    }
}

function updateOrderDetails(order, shippingFee) {
    const elements = {
        'order-id': order.id || "#12345",
        'order-date': new Date().toLocaleString('en-KE', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        'order-payment': order.paymentMethod || "MPesa",
        'order-subtotal': formatCurrency(order.subtotal || calculateSubtotal(order.items || order.cart || [])),
        'order-shipping': formatCurrency(shippingFee),
        'order-tax': formatCurrency(order.tax || 0),
        'order-total': formatCurrency(order.total || (calculateSubtotal(order.items || order.cart || []) + shippingFee))
    };

    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

function renderOrderItems(items) {
    const itemsEl = document.getElementById("receipt-items");
    if (!itemsEl) return;

    itemsEl.innerHTML = "";

    if (items.length === 0) {
        itemsEl.innerHTML = `
            <tr>
                <td colspan="5" class="no-items">
                    <i class="ri-shopping-bag-line"></i>
                    <span>No items found in this order</span>
                </td>
            </tr>
        `;
        return;
    }

    items.forEach(item => {
        const row = createOrderItemRow(item);
        itemsEl.appendChild(row);
    });

    // Add loading state for images
    preloadImages(items);
}

function createOrderItemRow(item) {
    const imageSrc = item.image || item.product || "";
    const name = item.name || item.product || "Unnamed Product";
    const qty = item.qty || item.quantity || 1;
    const price = item.price || 0;
    const color = item.color || "-";
    const size = item.size || "-";
    const subtotal = qty * price;

    const row = document.createElement("tr");
    row.className = "order-item-row";

    // Image and name cell
    const tdImage = document.createElement("td");
    tdImage.className = "product-info";
    
    const imgContainer = document.createElement("div");
    imgContainer.className = "product-image-container";
    
    const img = document.createElement("img");
    img.alt = name;
    img.className = "product-image";
    
    if (imageSrc) {
        img.crossOrigin = "anonymous";
        img.src = imageSrc;
        img.onerror = () => {
            img.src = getFallbackImage();
        };
        img.onload = () => {
            imgContainer.classList.add('loaded');
        };
    } else {
        img.src = getFallbackImage();
    }
    
    imgContainer.appendChild(img);
    tdImage.appendChild(imgContainer);
    
    const nameSpan = document.createElement("span");
    nameSpan.className = "product-name";
    nameSpan.textContent = name;
    tdImage.appendChild(nameSpan);
    
    row.appendChild(tdImage);

    // Details cell
    const tdDetails = document.createElement("td");
    tdDetails.className = "product-details";
    tdDetails.innerHTML = `
        <span class="color">Color: ${color}</span>
        <span class="size">Size: ${size}</span>
    `;
    row.appendChild(tdDetails);

    // Quantity cell
    const tdQty = document.createElement("td");
    tdQty.className = "quantity";
    tdQty.textContent = qty;
    row.appendChild(tdQty);

    // Price cell
    const tdPrice = document.createElement("td");
    tdPrice.className = "price";
    tdPrice.textContent = formatCurrency(price);
    row.appendChild(tdPrice);

    // Subtotal cell
    const tdSubtotal = document.createElement("td");
    tdSubtotal.className = "subtotal";
    tdSubtotal.textContent = formatCurrency(subtotal);
    row.appendChild(tdSubtotal);

    return row;
}

function updateShippingDetails(shipping) {
    const shippingEl = document.getElementById("shipping-details");
    if (!shippingEl) return;

    if (shipping) {
        shippingEl.innerHTML = `
            <div class="shipping-header">
                <i class="ri-truck-line"></i>
                <strong>Shipping To:</strong>
            </div>
            <div class="shipping-info">
                <div class="shipping-name">${shipping.fullname}</div>
                <div class="shipping-phone">
                    <i class="ri-phone-line"></i>
                    ${shipping.phone}
                </div>
                <div class="shipping-address">
                    <i class="ri-map-pin-line"></i>
                    ${shipping.address}, ${shipping.city}
                </div>
            </div>
        `;
    } else {
        shippingEl.innerHTML = `
            <div class="no-shipping">
                <i class="ri-map-pin-line"></i>
                <em>No shipping address provided</em>
            </div>
        `;
    }
}

function setupPDFDownload(order) {
    const downloadBtn = document.getElementById("download-receipt-btn");
    if (!downloadBtn) return;

    downloadBtn.addEventListener("click", async () => {
        try {
            // Show loading state
            downloadBtn.innerHTML = '<i class="ri-loader-4-line spin"></i> Generating PDF...';
            downloadBtn.disabled = true;

            const element = document.getElementById("order-receipt");
            const options = {
                margin: 10,
                filename: `KickStar_Receipt_${order.id || Date.now()}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2, 
                    useCORS: true, 
                    allowTaint: false,
                    logging: false,
                    backgroundColor: '#ffffff'
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait' 
                }
            };

            await html2pdf().set(options).from(element).save();
            
            // Track download event
            trackEvent('receipt_downloaded', { orderId: order.id });

        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Sorry, we couldn't generate your receipt. Please try again.");
        } finally {
            // Reset button state
            downloadBtn.innerHTML = '<i class="ri-download-line"></i> Download Receipt';
            downloadBtn.disabled = false;
        }
    });
}

function setupAdditionalActions() {
    // Continue shopping button
    const continueBtn = document.getElementById("continue-shopping-btn");
    if (continueBtn) {
        continueBtn.addEventListener("click", () => {
            window.location.href = "../index.html";
        });
    }

    // Track order button
    const trackBtn = document.getElementById("track-order-btn");
    if (trackBtn) {
        trackBtn.addEventListener("click", () => {
            const order = JSON.parse(localStorage.getItem("lastOrder") || "{}");
            alert(`Your order ${order.id} has been confirmed! You will receive tracking information via SMS.`);
        });
    }

    // Share receipt button
    const shareBtn = document.getElementById("share-receipt-btn");
    if (shareBtn && navigator.share) {
        shareBtn.style.display = 'block';
        shareBtn.addEventListener("click", async () => {
            try {
                await navigator.share({
                    title: `My KickStar Order Receipt`,
                    text: `Check out my order from KickStar!`,
                    url: window.location.href
                });
            } catch (error) {
                console.log('Sharing cancelled or failed');
            }
        });
    }
}

function clearCart() {
    try {
        localStorage.removeItem("cart");
        // Dispatch event for other parts of the app
        window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
        console.error("Error clearing cart:", error);
    }
}

function showSuccessAnimation() {
    const successIcon = document.querySelector('.success-animation');
    if (successIcon) {
        successIcon.classList.add('animate');
        setTimeout(() => {
            successIcon.classList.remove('animate');
        }, 2000);
    }
}

function showErrorState() {
    const receiptEl = document.getElementById("order-receipt");
    if (receiptEl) {
        receiptEl.innerHTML = `
            <div class="error-state">
                <i class="ri-error-warning-line"></i>
                <h3>Unable to Load Order Details</h3>
                <p>There was a problem loading your order information.</p>
                <button onclick="window.location.href='../index.html'" class="btn-primary">
                    Continue Shopping
                </button>
            </div>
        `;
    }
}

// Utility functions
function formatCurrency(amount) {
    return `KES ${parseFloat(amount).toFixed(2)}`;
}

function calculateSubtotal(items) {
    return items.reduce((total, item) => {
        const qty = item.qty || item.quantity || 1;
        const price = item.price || 0;
        return total + (qty * price);
    }, 0);
}

function getFallbackImage() {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' text-anchor='middle' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
}

function preloadImages(items) {
    items.forEach(item => {
        const imageSrc = item.image || item.product;
        if (imageSrc) {
            const img = new Image();
            img.src = imageSrc;
        }
    });
}

function trackEvent(eventName, properties = {}) {
    // In a real app, you would send this to your analytics service
    console.log(`Tracking: ${eventName}`, properties);
}

// Add some basic CSS for the new elements
const additionalStyles = `
    .success-animation.animate {
        animation: bounce 0.6s ease-in-out;
    }
    
    @keyframes bounce {
        0%, 20%, 60%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        80% { transform: translateY(-5px); }
    }
    
    .spin {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .product-image-container {
        position: relative;
        width: 50px;
        height: 50px;
        border-radius: 8px;
        overflow: hidden;
        background: #f8f9fa;
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
    }
    
    .product-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: opacity 0.3s ease;
    }
    
    .product-image-container:not(.loaded) .product-image {
        opacity: 0.5;
    }
    
    .no-items, .no-shipping {
        text-align: center;
        padding: 20px;
        color: #718096;
    }
    
    .error-state {
        text-align: center;
        padding: 40px 20px;
        color: #718096;
    }
    
    .error-state i {
        font-size: 48px;
        color: #e53e3e;
        margin-bottom: 20px;
    }
    
    .shipping-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
    }
    
    .shipping-info {
        line-height: 1.6;
    }
    
    .shipping-phone, .shipping-address {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 5px;
    }
`;

// Inject additional styles
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);