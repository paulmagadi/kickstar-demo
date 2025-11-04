// Order Success Page Logic
class OrderSuccessPage {
    constructor() {
        this.pdfGenerator = window.PDFGenerator;
        this.init();
    }

    init() {
        try {
            const order = JSON.parse(localStorage.getItem("lastOrder") || "{}");
            const items = order.items || order.cart || [];
            const shippingFee = 300;

            this.updateOrderDetails(order, shippingFee);
            this.renderOrderItems(items);
            this.updateShippingDetails(order.shippingAddress);
            this.setupEventListeners();
            this.clearCart();
            this.showSuccessAnimation();

        } catch (error) {
            console.error("Error initializing order success page:", error);
            this.showErrorState();
        }
    }

    updateOrderDetails(order, shippingFee) {
        const subtotal = order.subtotal || this.calculateSubtotal(order.items || order.cart || []);
        const tax = order.tax || subtotal * 0.16;
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
            'order-subtotal': this.formatCurrency(subtotal),
            'order-shipping': this.formatCurrency(shippingFee),
            'order-tax': this.formatCurrency(tax),
            'order-total': this.formatCurrency(total)
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    renderOrderItems(items) {
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
            const row = this.createOrderItemRow(item);
            itemsEl.appendChild(row);
        });

        this.preloadImages(items);
    }

    createOrderItemRow(item) {
        const imageSrc = item.image || item.product || "";
        const name = item.name || item.product || "Unnamed Product";
        const qty = item.qty || item.quantity || 1;
        const price = item.price || 0;
        const color = item.color || "-";
        const size = item.size || "-";
        const subtotal = qty * price;

        const row = document.createElement("tr");
        row.className = "order-item-row";

        row.innerHTML = `
            <td class="product-info">
                <div class="product-image-container">
                    <img src="${imageSrc || this.getFallbackImage()}" alt="${name}" class="product-image" 
                         onerror="this.src='${this.getFallbackImage()}'">
                </div>
                <span class="product-name">${name}</span>
            </td>
            <td class="product-details">
                <span class="color">Color: ${color}</span>
                <span class="size">Size: ${size}</span>
            </td>
            <td class="quantity">${qty}</td>
            <td class="price">${this.formatCurrency(price)}</td>
            <td class="subtotal">${this.formatCurrency(subtotal)}</td>
        `;

        return row;
    }

    updateShippingDetails(shipping) {
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

    setupEventListeners() {
        // PDF Download
        const downloadBtn = document.getElementById("download-receipt-btn");
        if (downloadBtn) {
            downloadBtn.addEventListener("click", () => this.handlePDFDownload());
        }

        // Continue shopping
        const continueBtn = document.getElementById("continue-shopping-btn");
        if (continueBtn) {
            continueBtn.addEventListener("click", () => {
                window.location.href = "../index.html";
            });
        }

        // Track order
        const trackBtn = document.getElementById("track-order-btn");
        if (trackBtn) {
            trackBtn.addEventListener("click", () => {
                const order = JSON.parse(localStorage.getItem("lastOrder") || "{}");
                alert(`Your order ${order.id} has been confirmed! You will receive tracking information via SMS.`);
            });
        }
    }

    async handlePDFDownload() {
        const downloadBtn = document.getElementById("download-receipt-btn");
        if (!downloadBtn) return;

        const originalHTML = downloadBtn.innerHTML;

        try {
            downloadBtn.innerHTML = '<i class="ri-loader-4-line spin"></i> Generating PDF...';
            downloadBtn.disabled = true;

            const order = JSON.parse(localStorage.getItem("lastOrder") || "{}");
            await this.pdfGenerator.generateReceiptPDF(order);

        } catch (error) {
            console.error("PDF download failed:", error);
            alert("Sorry, we couldn't generate your receipt. Please try again.");
        } finally {
            setTimeout(() => {
                downloadBtn.innerHTML = '<i class="ri-download-line"></i> Download Receipt (PDF)';
                downloadBtn.disabled = false;
            }, 1000);
        }
    }

    clearCart() {
        try {
            localStorage.removeItem("cart");
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    }

    showSuccessAnimation() {
        const successIcon = document.querySelector('.success-animation i');
        if (successIcon) {
            successIcon.classList.add('animate');
            setTimeout(() => {
                successIcon.classList.remove('animate');
            }, 2000);
        }
    }

    showErrorState() {
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

    // Utility methods
    formatCurrency(amount) {
        return `KES ${parseFloat(amount).toFixed(2)}`;
    }

    calculateSubtotal(items) {
        return items.reduce((total, item) => {
            const qty = item.qty || item.quantity || 1;
            const price = item.price || 0;
            return total + (qty * price);
        }, 0);
    }

    getFallbackImage() {
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' text-anchor='middle' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
    }

    preloadImages(items) {
        items.forEach(item => {
            const imageSrc = item.image || item.product;
            if (imageSrc) {
                const img = new Image();
                img.src = imageSrc;
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    window.orderSuccessPage = new OrderSuccessPage();
});