// Orders Page Management
class OrdersPage {
    constructor() {
        this.orders = [];
        this.filteredOrders = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.currentPage = 1;
        this.ordersPerPage = 5; // You can adjust this number
        this.init();
    }

    init() {
        this.loadOrders();
        this.setupEventListeners();
        this.filterOrders(); // This will trigger initial render
    }

    loadOrders() {
        try {
            const savedOrders = localStorage.getItem('orders');
            this.orders = savedOrders ? JSON.parse(savedOrders) : [];
            // Sort by date descending (newest first)
            this.orders.sort((a, b) => new Date(b.date) - new Date(a.date));
        } catch (error) {
            console.error('Error loading orders:', error);
            this.orders = [];
        }
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Search input
        const searchInput = document.getElementById('order-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.currentPage = 1; // Reset to first page when searching
                this.filterOrders();
            });
        }

        // Pagination event listeners will be added in renderPagination()
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.currentPage = 1; // Reset to first page when changing filter
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        this.filterOrders();
    }

    filterOrders() {
        this.filteredOrders = this.orders.filter(order => {
            // Apply status filter
            if (this.currentFilter !== 'all' && order.status !== this.currentFilter) {
                return false;
            }

            // Apply search filter
            if (this.searchTerm) {
                const searchFields = [
                    order.id,
                    order.shippingAddress?.fullname,
                    ...order.items.map(item => item.name)
                ].filter(Boolean).join(' ').toLowerCase();

                if (!searchFields.includes(this.searchTerm)) {
                    return false;
                }
            }

            return true;
        });

        this.renderOrders();
        this.renderPagination();
        this.renderOrdersCounter();
    }

    getPaginatedOrders() {
        const startIndex = (this.currentPage - 1) * this.ordersPerPage;
        const endIndex = startIndex + this.ordersPerPage;
        return this.filteredOrders.slice(startIndex, endIndex);
    }

    renderOrders() {
        const ordersList = document.getElementById('orders-list');
        const noOrders = document.getElementById('no-orders');

        if (this.filteredOrders.length === 0) {
            ordersList.style.display = 'none';
            noOrders.style.display = 'block';
            
            // Update empty state message based on filter and search
            this.renderEmptyState();
            return;
        }

        ordersList.style.display = 'block';
        noOrders.style.display = 'none';

        const paginatedOrders = this.getPaginatedOrders();
        ordersList.innerHTML = paginatedOrders.map(order => this.createOrderCard(order)).join('');
        
        // Add click events to order cards
        document.querySelectorAll('.order-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.order-actions')) {
                    const orderId = card.dataset.orderId;
                    window.location.href = `order-details.html?orderId=${orderId}`;
                }
            });
        });

        // Add event listeners for action buttons
        this.setupActionButtons();
    }

    renderEmptyState() {
        const noOrders = document.getElementById('no-orders');
        let message = '';
        let icon = 'ri-shopping-bag-line';
        let buttonText = 'Start Shopping';
        let buttonLink = '../index.html';

        if (this.searchTerm) {
            // Search results empty
            message = `No orders found matching "${this.searchTerm}"`;
            icon = 'ri-search-line';
            buttonText = 'Clear Search';
            buttonLink = 'javascript:void(0)';
        } else if (this.currentFilter !== 'all') {
            // Filter results empty
            const filterNames = {
                'pending': 'pending',
                'processing': 'processing', 
                'shipped': 'shipped',
                'delivered': 'delivered',
                'cancelled': 'cancelled'
            };
            const filterName = filterNames[this.currentFilter] || this.currentFilter;
            message = `You don't have any ${filterName} orders yet`;
            icon = 'ri-time-line';
        } else {
            // No orders at all
            message = "You haven't placed any orders yet. Start shopping to see your orders here.";
            icon = 'ri-shopping-bag-line';
        }

        noOrders.innerHTML = `
            <div class="empty-state">
                <i class="${icon}"></i>
                <h3>No Orders Found</h3>
                <p>${message}</p>
                <a href="${buttonLink}" class="btn btn-primary" id="empty-state-btn">
                    <i class="ri-shopping-bag-line"></i> ${buttonText}
                </a>
            </div>
        `;

        // Add event listener for clear search button
        const emptyStateBtn = document.getElementById('empty-state-btn');
        if (this.searchTerm && emptyStateBtn) {
            emptyStateBtn.addEventListener('click', () => {
                document.getElementById('order-search').value = '';
                this.searchTerm = '';
                this.filterOrders();
            });
        }
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredOrders.length / this.ordersPerPage);
        
        // Remove existing pagination
        const existingPagination = document.getElementById('orders-pagination');
        if (existingPagination) {
            existingPagination.remove();
        }

        if (totalPages <= 1) return;

        const ordersContainer = document.querySelector('.orders-container');
        const paginationHTML = this.createPaginationHTML(totalPages);
        
        // Create and insert pagination container
        const paginationContainer = document.createElement('div');
        paginationContainer.id = 'orders-pagination';
        paginationContainer.className = 'orders-pagination';
        paginationContainer.innerHTML = paginationHTML;
        
        ordersContainer.appendChild(paginationContainer);

        // Add event listeners to pagination buttons
        this.setupPaginationListeners(totalPages);
    }

    createPaginationHTML(totalPages) {
        let paginationHTML = '';
        
        
        // Previous button
        paginationHTML += `
            <button class="pagination-btn ${this.currentPage === 1 ? 'disabled' : ''}" 
                    data-page="${this.currentPage - 1}">
                <i class="ri-arrow-left-line"></i> Previous
            </button>
        `;
        // Page counter - "Page X of Y"
        paginationHTML += `
            <div class="page-counter">
                Page ${this.currentPage} of ${totalPages}
            </div>
        `;

        // Page numbers
        // for (let i = 1; i <= totalPages; i++) {
        //     if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
        //         paginationHTML += `
        //             <button class="pagination-btn ${this.currentPage === i ? 'active' : ''}" 
        //                     data-page="${i}">
        //                 ${i}
        //             </button>
        //         `;
        //     } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
        //         paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        //     }
        // }

        // Next button
        paginationHTML += `
            <button class="pagination-btn ${this.currentPage === totalPages ? 'disabled' : ''}" 
                    data-page="${this.currentPage + 1}">
                Next <i class="ri-arrow-right-line"></i>
            </button>
        `;

        return paginationHTML;
    }

    setupPaginationListeners(totalPages) {
        document.querySelectorAll('.pagination-btn:not(.disabled)').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.target.dataset.page);
                if (page >= 1 && page <= totalPages) {
                    this.currentPage = page;
                    this.filterOrders();
                    // Scroll to top of orders list
                    document.getElementById('orders-list').scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    renderOrdersCounter() {
        // Remove existing counter
        const existingCounter = document.getElementById('orders-counter');
        if (existingCounter) {
            existingCounter.remove();
        }

        if (this.filteredOrders.length === 0) return;

        const ordersContainer = document.querySelector('.orders-container');
        const counterHTML = `
            <div class="orders-counter" id="orders-counter">
                Showing ${this.getPaginatedOrders().length} of ${this.filteredOrders.length} 
                ${this.currentFilter !== 'all' ? this.currentFilter : ''} 
                order${this.filteredOrders.length !== 1 ? 's' : ''}
                ${this.searchTerm ? ` matching "${this.searchTerm}"` : ''}
            </div>
        `;

        // Insert counter before orders list
        const ordersList = document.getElementById('orders-list');
        ordersContainer.insertAdjacentHTML('beforeend', counterHTML);
    }

    setupActionButtons() {
        // Reorder buttons
        document.querySelectorAll('.reorder-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const orderId = e.target.closest('.reorder-btn').dataset.orderId;
                this.reorderItems(orderId);
            });
        });

        // Cancel order buttons
        document.querySelectorAll('.cancel-order-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const orderId = e.target.closest('.cancel-order-btn').dataset.orderId;
                this.cancelOrder(orderId);
            });
        });
    }

    reorderItems(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const items = order.items || [];
        
        try {
            const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
            let itemsAdded = 0;

            items.forEach(item => {
                const existingItem = currentCart.find(cartItem => 
                    cartItem.id === item.id && 
                    cartItem.color === item.color && 
                    cartItem.size === item.size
                );
                
                if (existingItem) {
                    existingItem.qty += item.qty || item.quantity || 1;
                    itemsAdded++;
                } else {
                    currentCart.push({
                        ...item,
                        qty: item.qty || item.quantity || 1
                    });
                    itemsAdded++;
                }
            });
            
            localStorage.setItem('cart', JSON.stringify(currentCart));
            window.dispatchEvent(new Event('cartUpdated'));
            
            if (confirm(`${itemsAdded} items added to cart! Would you like to proceed to checkout?`)) {
                window.location.href = 'checkout.html';
            } else {
                window.location.href = '../index.html';
            }
        } catch (error) {
            console.error('Error adding items to cart:', error);
            alert('Error adding items to cart. Please try again.');
        }
    }

    cancelOrder(orderId) {
        if (!confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            const orderIndex = this.orders.findIndex(order => order.id === orderId);
            if (orderIndex !== -1) {
                this.orders[orderIndex].status = 'cancelled';
                localStorage.setItem('orders', JSON.stringify(this.orders));
                
                // Update the filtered orders and re-render
                const filteredIndex = this.filteredOrders.findIndex(order => order.id === orderId);
                if (filteredIndex !== -1) {
                    this.filteredOrders[filteredIndex].status = 'cancelled';
                }
                
                this.filterOrders();
                alert('Order has been cancelled successfully.');
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Error cancelling order. Please try again.');
        }
    }

    createOrderCard(order) {
        const items = order.items || [];
        const total = order.total || this.calculateOrderTotal(order);
        const status = order.status || 'pending';
        const date = new Date(order.date).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <div class="order-card" data-order-id="${order.id}">
                <div class="order-card-header">
                    <div class="order-info">
                        <h3>Order ${order.id}</h3>
                        <div class="order-meta">
                            <span class="order-date">Placed on ${date}</span>
                            <span class="items-count">${items.length} item${items.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                    <span class="order-status status-${status}">${status}</span>
                </div>

                <div class="order-items-preview">
                    ${items.slice(0, 3).map(item => this.createItemPreview(item)).join('')}
                    ${items.length > 3 ? `<div class="order-item-preview">
                        <div class="item-image">
                            <div style="width:100%;height:100%;background:var(--gray-shade-color);display:flex;align-items:center;justify-content:center;color:var(--neutral-dark-color);font-size:0.8rem;">
                                +${items.length - 3} more
                            </div>
                        </div>
                        <div class="item-details">
                            <h4>Additional Items</h4>
                        </div>
                    </div>` : ''}
                </div>

                <div class="order-footer">
                    <div class="order-total">Total: ${this.formatCurrency(total)}</div>
                    <div class="order-actions">
                        <a href="order-details.html?orderId=${order.id}" class="btn btn-outline">
                            <i class="ri-eye-line"></i> View Details
                        </a>
                        ${status === 'delivered' ? `
                            <button class="btn btn-outline reorder-btn" data-order-id="${order.id}">
                                <i class="ri-shopping-cart-line"></i> Reorder
                            </button>
                        ` : ''}
                        ${status === 'pending' || status === 'processing' ? `
                            <button class="btn btn-danger cancel-order-btn" data-order-id="${order.id}">
                                <i class="ri-close-line"></i> Cancel
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    createItemPreview(item) {
        const imageSrc = item.image || this.getFallbackImage();
        const name = item.name || 'Unnamed Product';
        const color = item.color || '-';
        const size = item.size || '-';
        const qty = item.qty || item.quantity || 1;

        return `
            <div class="order-item-preview">
                <div class="item-image">
                    <img src="${imageSrc}" alt="${name}" onerror="this.src='${this.getFallbackImage()}'">
                </div>
                <div class="item-details">
                    <h4>${name}</h4>
                    <p>Color: ${color}, Size: ${size}</p>
                    <p>Qty: ${qty}</p>
                </div>
            </div>
        `;
    }

    calculateOrderTotal(order) {
        const items = order.items || [];
        const subtotal = items.reduce((total, item) => {
            const qty = item.qty || item.quantity || 1;
            const price = item.price || 0;
            return total + (qty * price);
        }, 0);
        
        const shipping = order.shipping || 300;
        const tax = order.tax || subtotal * 0.16;
        
        return subtotal + shipping + tax;
    }

    formatCurrency(amount) {
        return `KES ${parseFloat(amount).toFixed(2)}`;
    }

    getFallbackImage() {
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' text-anchor='middle' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
    }
}

// Initialize orders page
document.addEventListener('DOMContentLoaded', () => {
    window.ordersPage = new OrdersPage();
});