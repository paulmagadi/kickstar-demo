// Order Detail Page Management
class OrderDetailPage {
    constructor() {
        this.order = null;
        this.init();
    }

    init() {
        this.loadOrder();
        this.setupEventListeners();
    }

    loadOrder() {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId');
        
        if (!orderId) {
            this.showError('Order ID not specified');
            return;
        }

        try {
            const savedOrders = localStorage.getItem('orders');
            const orders = savedOrders ? JSON.parse(savedOrders) : [];
            this.order = orders.find(order => order.id === orderId);

            if (!this.order) {
                this.showError('Order not found');
                return;
            }

            this.renderOrder();
        } catch (error) {
            console.error('Error loading order:', error);
            this.showError('Error loading order details');
        }
    }

    renderOrder() {
        this.renderOrderHeader();
        this.renderOrderItems();
        this.renderOrderSummary();
        this.renderShippingAddress();
        this.renderPaymentDetails();
        this.renderOrderTimeline();
        this.setupActionButtons();
    }

    renderOrderHeader() {
        document.getElementById('order-id-display').textContent = `#${this.order.id}`;
        
        const orderDate = new Date(this.order.date).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('order-date-display').textContent = `Placed on ${orderDate}`;
        
        const status = this.order.status || 'pending';
        const statusElement = document.getElementById('order-status');
        statusElement.textContent = status;
        statusElement.className = `order-status status-${status}`;
    }

    renderOrderItems() {
        const itemsContainer = document.getElementById('order-items');
        const items = this.order.items || [];

        if (items.length === 0) {
            itemsContainer.innerHTML = '<div class="no-items">No items in this order</div>';
            return;
        }

        itemsContainer.innerHTML = items.map(item => this.createOrderItem(item)).join('');
    }

    createOrderItem(item) {
        const imageSrc = item.image || this.getFallbackImage();
        const name = item.name || 'Unnamed Product';
        const color = item.color || '-';
        const size = item.size || '-';
        const qty = item.qty || item.quantity || 1;
        const price = item.price || 0;
        const subtotal = qty * price;

        return `
            <div class="order-item">
                <div class="item-image">
                    <img src="${imageSrc}" alt="${name}" onerror="this.src='${this.getFallbackImage()}'">
                </div>
                <div class="item-details">
                    <h4>${name}</h4>
                    <div class="item-variants">
                        <span class="item-variant">Color: ${color}</span>
                        <span class="item-variant">Size: ${size}</span>
                    </div>
                    <div class="item-price">${this.formatCurrency(price)}</div>
                </div>
                <div class="item-quantity">
                    <span>Qty: ${qty}</span>
                </div>
                <div class="item-total">
                    ${this.formatCurrency(subtotal)}
                </div>
            </div>
        `;
    }

    renderOrderSummary() {
        const items = this.order.items || [];
        const subtotal = this.order.subtotal || this.calculateSubtotal(items);
        const shipping = this.order.shipping || 300;
        const tax = this.order.tax || subtotal * 0.16;
        const total = this.order.total || (subtotal + shipping + tax);

        document.getElementById('summary-subtotal').textContent = this.formatCurrency(subtotal);
        document.getElementById('summary-shipping').textContent = this.formatCurrency(shipping);
        document.getElementById('summary-tax').textContent = this.formatCurrency(tax);
        document.getElementById('summary-total').textContent = this.formatCurrency(total);
    }

    renderShippingAddress() {
        const shipping = this.order.shippingAddress;
        const container = document.getElementById('shipping-address');

        if (!shipping) {
            container.innerHTML = '<p>No shipping address provided</p>';
            return;
        }

        container.innerHTML = `
            <strong>${shipping.fullname}</strong>
            <p>${shipping.phone}</p>
            <p>${shipping.address}</p>
            <p>${shipping.city}</p>
        `;
    }

    renderPaymentDetails() {
        const paymentMethod = this.order.paymentMethod || 'Cash on Delivery';
        const container = document.getElementById('payment-details');
        
        container.innerHTML = `
            <strong>${paymentMethod}</strong>
            <p>Paid on ${new Date(this.order.date).toLocaleDateString()}</p>
        `;
    }

    renderOrderTimeline() {
        const status = this.order.status || 'pending';
        const timeline = document.getElementById('order-timeline');
        
        const timelineEvents = this.getTimelineEvents(status);
        timeline.innerHTML = timelineEvents.map(event => this.createTimelineItem(event)).join('');
    }

    getTimelineEvents(status) {
        const baseEvents = [
            {
                icon: 'ri-shopping-cart-line',
                title: 'Order Placed',
                description: 'Your order has been received',
                date: new Date(this.order.date).toLocaleDateString(),
                completed: true
            },
            {
                icon: 'ri-money-dollar-circle-line',
                title: 'Payment Confirmed',
                description: 'Payment has been processed successfully',
                date: new Date(this.order.date).toLocaleDateString(),
                completed: true
            }
        ];

        const statusEvents = {
            pending: [
                ...baseEvents,
                {
                    icon: 'ri-tools-line',
                    title: 'Order Processing',
                    description: 'We are preparing your order',
                    date: 'In progress',
                    completed: false
                }
            ],
            processing: [
                ...baseEvents,
                {
                    icon: 'ri-tools-line',
                    title: 'Order Processing',
                    description: 'We are preparing your order',
                    date: new Date().toLocaleDateString(),
                    completed: true
                },
                {
                    icon: 'ri-truck-line',
                    title: 'Shipped',
                    description: 'Your order is on the way',
                    date: 'Estimated 2-3 days',
                    completed: false
                }
            ],
            shipped: [
                ...baseEvents,
                {
                    icon: 'ri-tools-line',
                    title: 'Order Processing',
                    description: 'We prepared your order',
                    date: new Date(this.order.date).toLocaleDateString(),
                    completed: true
                },
                {
                    icon: 'ri-truck-line',
                    title: 'Shipped',
                    description: 'Your order is on the way',
                    date: new Date().toLocaleDateString(),
                    completed: true
                },
                {
                    icon: 'ri-map-pin-line',
                    title: 'Out for Delivery',
                    description: 'Your order will be delivered today',
                    date: 'Today',
                    completed: false
                }
            ],
            delivered: [
                ...baseEvents,
                {
                    icon: 'ri-tools-line',
                    title: 'Order Processing',
                    description: 'We prepared your order',
                    date: new Date(this.order.date).toLocaleDateString(),
                    completed: true
                },
                {
                    icon: 'ri-truck-line',
                    title: 'Shipped',
                    description: 'Your order was shipped',
                    date: new Date(this.order.date).toLocaleDateString(),
                    completed: true
                },
                {
                    icon: 'ri-check-double-line',
                    title: 'Delivered',
                    description: 'Your order has been delivered',
                    date: new Date().toLocaleDateString(),
                    completed: true
                }
            ],
            cancelled: [
                ...baseEvents,
                {
                    icon: 'ri-close-circle-line',
                    title: 'Order Cancelled',
                    description: 'This order has been cancelled',
                    date: new Date().toLocaleDateString(),
                    completed: true
                }
            ]
        };

        return statusEvents[status] || statusEvents.pending;
    }

    createTimelineItem(event) {
        const iconClass = event.completed ? 'completed' : '';
        
        return `
            <div class="timeline-item">
                <div class="timeline-icon ${iconClass}">
                    <i class="${event.icon}"></i>
                </div>
                <div class="timeline-content">
                    <h5>${event.title}</h5>
                    <p>${event.description}</p>
                </div>
                <div class="timeline-date">${event.date}</div>
            </div>
        `;
    }

    setupActionButtons() {
        const status = this.order.status || 'pending';
        
        // Show cancel button only for pending/processing orders
        const cancelBtn = document.getElementById('cancel-order-btn');
        if (cancelBtn) {
            cancelBtn.style.display = (status === 'pending' || status === 'processing') ? 'block' : 'none';
            cancelBtn.addEventListener('click', () => this.cancelOrder());
        }

        // Setup download invoice button
        const downloadBtn = document.getElementById('download-invoice-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadInvoice());
        }

        // Setup track order button
        const trackBtn = document.getElementById('track-order-btn');
        if (trackBtn) {
            trackBtn.addEventListener('click', () => this.trackOrder());
        }

        // Setup reorder button
        const reorderBtn = document.getElementById('reorder-btn');
        if (reorderBtn) {
            reorderBtn.addEventListener('click', () => this.reorder());
        }
    }

    cancelOrder() {
        if (!confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            const savedOrders = localStorage.getItem('orders');
            const orders = savedOrders ? JSON.parse(savedOrders) : [];
            const orderIndex = orders.findIndex(order => order.id === this.order.id);
            
            if (orderIndex !== -1) {
                orders[orderIndex].status = 'cancelled';
                localStorage.setItem('orders', JSON.stringify(orders));
                this.order.status = 'cancelled';
                this.renderOrder();
                alert('Order has been cancelled successfully.');
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Error cancelling order. Please try again.');
        }
    }

    async downloadInvoice() {
        try {
            if (window.pdfGenerator) {
                await window.pdfGenerator.generateReceiptPDF(this.order);
            } else {
                alert('PDF generator not available. Please try again later.');
            }
        } catch (error) {
            console.error('Error generating invoice:', error);
            alert('Error generating invoice. Please try again.');
        }
    }

    trackOrder() {
        alert(`Your order ${this.order.id} is currently ${this.order.status}. You will receive tracking updates via SMS.`);
    }

    reorder() {
        const items = this.order.items || [];
        
        // Add items to cart
        try {
            const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
            items.forEach(item => {
                const existingItem = currentCart.find(cartItem => 
                    cartItem.id === item.id && 
                    cartItem.color === item.color && 
                    cartItem.size === item.size
                );
                
                if (existingItem) {
                    existingItem.qty += item.qty || item.quantity || 1;
                } else {
                    currentCart.push({
                        ...item,
                        qty: item.qty || item.quantity || 1
                    });
                }
            });
            
            localStorage.setItem('cart', JSON.stringify(currentCart));
            window.dispatchEvent(new Event('cartUpdated'));
            
            if (confirm('Items added to cart! Would you like to proceed to checkout?')) {
                window.location.href = 'checkout.html';
            } else {
                window.location.href = '../index.html';
            }
        } catch (error) {
            console.error('Error adding items to cart:', error);
            alert('Error adding items to cart. Please try again.');
        }
    }

    calculateSubtotal(items) {
        return items.reduce((total, item) => {
            const qty = item.qty || item.quantity || 1;
            const price = item.price || 0;
            return total + (qty * price);
        }, 0);
    }

    formatCurrency(amount) {
        return `KES ${parseFloat(amount).toFixed(2)}`;
    }

    getFallbackImage() {
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' text-anchor='middle' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
    }

    showError(message) {
        const orderDetailPage = document.querySelector('.order-detail-page');
        orderDetailPage.innerHTML = `
            <div class="error-state">
                <i class="ri-error-warning-line"></i>
                <h3>${message}</h3>
                <p>We couldn't load the order details. Please check the order ID and try again.</p>
                <a href="orders.html" class="btn btn-primary">
                    <i class="ri-arrow-left-line"></i> Back to Orders
                </a>
            </div>
        `;
    }
}

// Initialize order detail page
document.addEventListener('DOMContentLoaded', () => {
    window.orderDetailPage = new OrderDetailPage();
});