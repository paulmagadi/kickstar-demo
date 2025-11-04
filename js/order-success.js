document.addEventListener("DOMContentLoaded", () => {
    // Initialize the thank you page
    initOrderSuccessPage();
});

function initOrderSuccessPage() {
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
    const subtotal = order.subtotal || calculateSubtotal(order.items || order.cart || []);
    const tax = order.tax || subtotal * 0.16; // 16% tax
    const total = order.total || (subtotal + shippingFee + tax);

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
        'order-subtotal': formatCurrency(subtotal),
        'order-shipping': formatCurrency(shippingFee),
        'order-tax': formatCurrency(tax),
        'order-total': formatCurrency(total)
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
        // img.crossOrigin = "anonymous";
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

    downloadBtn.addEventListener("click", () => {
        // Store original button state
        const originalHTML = downloadBtn.innerHTML;

        try {
            // Show loading state
            downloadBtn.innerHTML = '<i class="ri-loader-4-line spin"></i> Generating PDF...';
            downloadBtn.disabled = true;

            // Generate PDF 
            generatePDF(order);

        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Sorry, we couldn't generate your receipt. Please try again.");
        } finally {
            // Reset button state after a small delay to ensure UI updates
            setTimeout(() => {
                downloadBtn.innerHTML = '<i class="ri-download-line"></i> Download Receipt (PDF)';
                downloadBtn.disabled = false;
            }, 1000);
        }
    });
}

function generatePDF(order) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const items = order.items || order.cart || [];
    const shippingFee = 300;
    const subtotal = order.subtotal || calculateSubtotal(items);
    const tax = order.tax || subtotal * 0.16;
    const total = order.total || (subtotal + shippingFee + tax);
    const shipping = order.shippingAddress;

    let yPosition = 20;

    // Header Section
    doc.setFontSize(24);
    doc.setTextColor(0, 168, 150); // Secondary color
    doc.text("KICKSTAR", 105, yPosition, { align: 'center' });

    yPosition += 10;
    doc.setFontSize(16);
    doc.setTextColor(253, 48, 8); // Primary color
    doc.text("ORDER CONFIRMATION", 105, yPosition, { align: 'center' });

    yPosition += 15;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Thank you for your order! Your purchase supports sustainable fashion.", 105, yPosition, { align: 'center' });

    yPosition += 20;

    // Order Information
    doc.setFontSize(14);
    doc.setTextColor(45, 45, 45); // Dark color
    doc.text("ORDER DETAILS", 20, yPosition);

    yPosition += 10;
    doc.setFontSize(10);
    doc.text(`Order ID: ${order.id || "#12345"}`, 20, yPosition);
    doc.text(`Date: ${new Date().toLocaleString('en-KE')}`, 120, yPosition);

    yPosition += 6;
    doc.text(`Payment Method: ${order.paymentMethod || "MPesa"}`, 20, yPosition);

    yPosition += 15;

    // Shipping Information
    if (shipping) {
        doc.setFontSize(14);
        doc.text("SHIPPING ADDRESS", 20, yPosition);

        yPosition += 8;
        doc.setFontSize(10);
        doc.text(`${shipping.fullname}`, 20, yPosition);
        yPosition += 5;
        doc.text(`${shipping.phone}`, 20, yPosition);
        yPosition += 5;
        doc.text(`${shipping.address}, ${shipping.city}`, 20, yPosition);

        yPosition += 15;
    }

    // Order Items Table
    doc.setFontSize(14);
    doc.text("ORDER ITEMS", 20, yPosition);
    yPosition += 10;

    // Table Headers - Adjusted for images
    doc.setFillColor(244, 246, 246); // Light gray background
    doc.rect(20, yPosition, 170, 8, 'F');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Product", 35, yPosition + 6); // Moved right to accommodate image
    doc.text("Details", 90, yPosition + 6);
    doc.text("Qty", 140, yPosition + 6);
    doc.text("Price", 150, yPosition + 6);
    doc.text("Subtotal", 170, yPosition + 6);

    yPosition += 12;

    // Order Items with Images
    if (items.length > 0) {
        // Process items sequentially to handle async image loading
        processItemsForPDF(doc, items, yPosition, subtotal, tax, shippingFee, total, shipping, order);
    } else {
        doc.text("No items in this order", 22, yPosition);
        yPosition += 10;
        completePDF(doc, yPosition, subtotal, tax, shippingFee, total, order);
    }
}

function processItemsForPDF(doc, items, startY, subtotal, tax, shippingFee, total, shipping, order) {
    let yPosition = startY;
    let processedItems = 0;

    items.forEach((item, index) => {
        const name = item.name || item.product || "Unnamed Product";
        const qty = item.qty || item.quantity || 1;
        const price = item.price || 0;
        const color = item.color || "-";
        const size = item.size || "-";
        const itemSubtotal = qty * price;
        const imageSrc = item.image || '';

        // Alternate row background
        if (index % 2 === 0) {
            doc.setFillColor(248, 249, 250);
            doc.rect(20, yPosition - 4, 170, 12, 'F');
        }

        doc.setTextColor(0, 0, 0);

        // Add product image if available
        if (imageSrc) {
            try {
                // Create a temporary image to check if it loads
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.onload = function () {
                    try {
                        // Add image to PDF (15x15px)
                        doc.addImage(img, 'JPEG', 22, yPosition - 3, 15, 15);
                        addTextToRow();
                    } catch (e) {
                        console.warn('Could not add image to PDF, using fallback:', e);
                        addFallbackImage();
                    }
                };
                img.onerror = function () {
                    addFallbackImage();
                };
                img.src = imageSrc;
            } catch (e) {
                addFallbackImage();
            }
        } else {
            addFallbackImage();
        }

        function addFallbackImage() {
            // Add a simple rectangle as fallback
            doc.setFillColor(220, 220, 220);
            doc.rect(22, yPosition - 3, 15, 15, 'F');
            doc.setTextColor(150, 150, 150);
            doc.setFontSize(6);
            doc.text("No", 26, yPosition + 3);
            doc.text("Img", 26, yPosition + 6);
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            addTextToRow();
        }

        function addTextToRow() {
            // Product name (starting after image)
            doc.text(name.substring(0, 20), 40, yPosition + 4);

            // Other details
            doc.text(`${color}, ${size}`, 90, yPosition + 4);
            doc.text(qty.toString(), 140, yPosition + 4);
            doc.text(`KES ${price.toFixed(2)}`, 150, yPosition + 4);
            doc.text(`KES ${itemSubtotal.toFixed(2)}`, 170, yPosition + 4);

            yPosition += 12;
            processedItems++;

            // Check if all items are processed
            if (processedItems === items.length) {
                completePDF(doc, yPosition, subtotal, tax, shippingFee, total, order);
            }

            // Page break check
            if (yPosition > 250 && processedItems < items.length) {
                doc.addPage();
                yPosition = 20;

                // Add table headers on new page
                doc.setFillColor(244, 246, 246);
                doc.rect(20, yPosition, 170, 8, 'F');
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                doc.text("Product", 35, yPosition + 6);
                doc.text("Details", 90, yPosition + 6);
                doc.text("Qty", 140, yPosition + 6);
                doc.text("Price", 150, yPosition + 6);
                doc.text("Subtotal", 170, yPosition + 6);
                yPosition += 12;
            }
        }
    });
}

function completePDF(doc, yPosition, subtotal, tax, shippingFee, total, order) {
    yPosition += 10;

    // Cost Summary
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 8;

    doc.setFontSize(11);
    doc.text("Subtotal:", 120, yPosition);
    doc.text(`KES ${subtotal.toFixed(2)}`, 170, yPosition, { align: 'right' });

    yPosition += 6;
    doc.text("Tax (16%):", 120, yPosition);
    doc.text(`KES ${tax.toFixed(2)}`, 170, yPosition, { align: 'right' });

    yPosition += 6;
    doc.text("Shipping:", 120, yPosition);
    doc.text(`KES ${shippingFee.toFixed(2)}`, 170, yPosition, { align: 'right' });

    yPosition += 10;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text("TOTAL:", 120, yPosition);
    doc.text(`KES ${total.toFixed(2)}`, 170, yPosition, { align: 'right' });

    yPosition += 20;

    // Footer Message
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);

    const footerText = [
        "We'll notify you once your order is on its way.",
        "If you chose Cash on Delivery, please have the amount ready upon delivery.",
        "",
        "Signed,",
        "The KickStar Team",
        "Thank you for supporting sustainable fashion"
    ];

    footerText.forEach(line => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }
        doc.text(line, 105, yPosition, { align: 'center' });
        yPosition += 5;
    });

    // Save the PDF
    doc.save(`KickStar_Receipt_${order.id || Date.now()}.pdf`);

    // Track download event
    trackEvent('receipt_downloaded', { orderId: order.id });
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
    const successIcon = document.querySelector('.success-animation i');
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
                <button onclick="window.location.href='../index.html'" class="btn btn-primary">
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