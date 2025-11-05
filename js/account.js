// Account Page Management
class AccountPage {
    constructor() {
        this.currentUser = null;
        this.currentTab = 'dashboard';
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.setupTabs();
        this.loadDashboardData();
    }

    loadUserData() {
        try {
            // Load user data from localStorage
            const userData = localStorage.getItem('userProfile');
            this.currentUser = userData ? JSON.parse(userData) : this.getDefaultUser();
            
            this.updateUserProfile();
        } catch (error) {
            console.error('Error loading user data:', error);
            this.currentUser = this.getDefaultUser();
        }
    }

    getDefaultUser() {
        return {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+254712345678',
            avatar: '',
            memberSince: new Date().getFullYear(),
            preferences: {
                marketingEmails: true,
                orderUpdates: true,
                smsNotifications: false
            }
        };
    }

    updateUserProfile() {
        // Update sidebar profile
        document.getElementById('user-fullname').textContent = 
            `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        document.getElementById('user-email').textContent = this.currentUser.email;
        document.getElementById('member-since').textContent = this.currentUser.memberSince;
        
        // Update profile form
        document.getElementById('first-name').value = this.currentUser.firstName;
        document.getElementById('last-name').value = this.currentUser.lastName;
        document.getElementById('email').value = this.currentUser.email;
        document.getElementById('phone').value = this.currentUser.phone || '';
        
        // Update preferences
        document.getElementById('marketing-emails').checked = this.currentUser.preferences.marketingEmails;
        document.getElementById('order-updates').checked = this.currentUser.preferences.orderUpdates;
        document.getElementById('sms-notifications').checked = this.currentUser.preferences.smsNotifications;
    }

    setupEventListeners() {
        // Profile form
        document.getElementById('profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile();
        });

        document.getElementById('cancel-profile').addEventListener('click', () => {
            this.updateUserProfile(); // Reset form
        });

        // Address management
        document.getElementById('add-address-btn').addEventListener('click', () => {
            this.openAddressModal();
        });

        // Password change
        document.getElementById('change-password-btn').addEventListener('click', () => {
            this.openPasswordModal();
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Modal close handlers
        this.setupModalHandlers();
    }

    setupTabs() {
        const navItems = document.querySelectorAll('.nav-item[data-tab]');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                const tabName = item.dataset.tab;
                if (tabName === 'logout') return;
                
                this.switchTab(tabName);
            });
        });

        // Handle URL hash
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.replace('#', '');
            if (hash && this.isValidTab(hash)) {
                this.switchTab(hash);
            }
        });

        // Initial tab from URL hash
        const initialHash = window.location.hash.replace('#', '');
        if (initialHash && this.isValidTab(initialHash)) {
            this.switchTab(initialHash);
        }
    }

    isValidTab(tabName) {
        const validTabs = ['dashboard', 'profile', 'orders', 'addresses', 'wishlist', 'settings'];
        return validTabs.includes(tabName);
    }

    switchTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`.nav-item[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Update URL hash
        window.location.hash = tabName;

        // Load tab-specific data
        this.loadTabData(tabName);
    }

    loadTabData(tabName) {
        switch(tabName) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'orders':
                this.loadOrders();
                break;
            case 'addresses':
                this.loadAddresses();
                break;
            case 'wishlist':
                this.loadWishlist();
                break;
            case 'settings':
                // Settings doesn't need additional data loading
                break;
        }
    }

    loadDashboardData() {
        this.updateStats();
        this.loadRecentActivity();
    }

    updateStats() {
        const orders = this.getUserOrders();
        const addresses = this.getUserAddresses();
        const wishlist = this.getUserWishlist();

        // Update stats cards
        document.getElementById('total-orders').textContent = orders.length;
        document.getElementById('pending-orders').textContent = 
            orders.filter(order => order.status === 'pending' || order.status === 'processing').length;
        document.getElementById('saved-addresses').textContent = addresses.length;
        document.getElementById('wishlist-items').textContent = wishlist.length;

        // Update nav badges
        document.getElementById('orders-badge').textContent = orders.length;
        document.getElementById('wishlist-badge').textContent = wishlist.length;
    }

    loadRecentActivity() {
        const orders = this.getUserOrders();
        const recentOrders = orders.slice(0, 5); // Last 5 orders
        const activityList = document.getElementById('recent-activity');

        if (recentOrders.length === 0) {
            activityList.innerHTML = `
                <div class="empty-state">
                    <i class="ri-shopping-bag-line"></i>
                    <p>No recent activity</p>
                </div>
            `;
            return;
        }

        activityList.innerHTML = recentOrders.map(order => this.createActivityItem(order)).join('');
    }

    createActivityItem(order) {
        const statusIcons = {
            'pending': 'ri-time-line',
            'processing': 'ri-tools-line',
            'shipped': 'ri-truck-line',
            'delivered': 'ri-check-double-line',
            'cancelled': 'ri-close-line'
        };

        const statusColors = {
            'pending': '#f57c00',
            'processing': '#1976d2',
            'shipped': '#7b1fa2',
            'delivered': '#2a7a55',
            'cancelled': '#d32f2f'
        };

        const date = new Date(order.date).toLocaleDateString('en-KE', {
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="activity-item">
                <div class="activity-icon" style="background: ${statusColors[order.status] || '#666'}">
                    <i class="${statusIcons[order.status] || 'ri-shopping-bag-line'}"></i>
                </div>
                <div class="activity-content">
                    <h4>Order ${order.id}</h4>
                    <p>${order.items.length} item${order.items.length !== 1 ? 's' : ''} • ${this.formatCurrency(order.total)}</p>
                </div>
                <div class="activity-date">${date}</div>
            </div>
        `;
    }

    loadOrders() {
        const orders = this.getUserOrders();
        const ordersList = document.getElementById('account-orders-list');

        if (orders.length === 0) {
            ordersList.innerHTML = `
                <div class="empty-state">
                    <i class="ri-shopping-bag-line"></i>
                    <h3>No Orders Yet</h3>
                    <p>You haven't placed any orders yet</p>
                    <a href="../index.html" class="btn btn-primary">
                        <i class="ri-shopping-bag-line"></i> Start Shopping
                    </a>
                </div>
            `;
            return;
        }

        // Show last 3 orders in account page
        const recentOrders = orders.slice(0, 3);
        ordersList.innerHTML = recentOrders.map(order => this.createOrderCard(order)).join('');

        // Setup order card click events
        document.querySelectorAll('.order-card').forEach(card => {
            card.addEventListener('click', () => {
                const orderId = card.dataset.orderId;
                // Use modal approach instead of URL
                this.showOrderDetails(orderId);
            });
        });
    }

    createOrderCard(order) {
        const items = order.items || [];
        const total = order.total || this.calculateOrderTotal(order);
        const status = order.status || 'pending';
        const date = new Date(order.date).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="order-card" data-order-id="${order.id}">
                <div class="order-card-header">
                    <div class="order-info">
                        <h4>Order ${order.id}</h4>
                        <div class="order-meta">
                            <span class="order-date">${date}</span>
                            <span class="items-count">${items.length} item${items.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                    <span class="order-status status-${status}">${status}</span>
                </div>
                <div class="order-footer">
                    <div class="order-total">${this.formatCurrency(total)}</div>
                    <button class="btn btn-outline view-order-btn">
                        <i class="ri-eye-line"></i> View Details
                    </button>
                </div>
            </div>
        `;
    }

    loadAddresses() {
        const addresses = this.getUserAddresses();
        const addressesGrid = document.getElementById('addresses-grid');

        if (addresses.length === 0) {
            addressesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="ri-map-pin-line"></i>
                    <h3>No Saved Addresses</h3>
                    <p>Add your first shipping address</p>
                </div>
            `;
            return;
        }

        addressesGrid.innerHTML = addresses.map(address => this.createAddressCard(address)).join('');
        this.setupAddressActions();
    }

    createAddressCard(address) {
        const isDefault = address.isDefault ? '<span class="default-badge">Default</span>' : '';

        return `
            <div class="address-card ${address.isDefault ? 'selected' : ''}">
                <h4>${address.fullname} ${isDefault}</h4>
                <p>${address.phone}</p>
                <p>${address.address}</p>
                <p>${address.city}</p>
                <div class="address-actions">
                    <button class="btn btn-outline edit-address" data-id="${address.id}">
                        <i class="ri-edit-line"></i> Edit
                    </button>
                    <button class="btn btn-outline set-default-address" data-id="${address.id}">
                        <i class="ri-check-line"></i> Set Default
                    </button>
                    <button class="btn btn-danger delete-address" data-id="${address.id}">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            </div>
        `;
    }

    setupAddressActions() {
        // Edit address
        document.querySelectorAll('.edit-address').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const addressId = btn.dataset.id;
                this.editAddress(addressId);
            });
        });

        // Set default address
        document.querySelectorAll('.set-default-address').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const addressId = btn.dataset.id;
                this.setDefaultAddress(addressId);
            });
        });

        // Delete address
        document.querySelectorAll('.delete-address').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const addressId = btn.dataset.id;
                this.deleteAddress(addressId);
            });
        });
    }

    loadWishlist() {
        const wishlist = this.getUserWishlist();
        const wishlistContainer = document.getElementById('wishlist-container');

        if (wishlist.length === 0) {
            return; // Keep the default empty state
        }

        wishlistContainer.innerHTML = `
            <div class="wishlist-grid">
                ${wishlist.map(item => this.createWishlistItem(item)).join('')}
            </div>
        `;

        this.setupWishlistActions();
    }

    createWishlistItem(item) {
        return `
            <div class="wishlist-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23f0f0f0%22/%3E%3Ctext x=%2250%22 y=%2255%22 font-family=%22Arial%22 font-size=%2212%22 text-anchor=%22middle%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'">
                <h4>${item.name}</h4>
                <div class="price">${this.formatCurrency(item.price)}</div>
                <div class="wishlist-actions">
                    <button class="btn btn-primary add-to-cart" data-id="${item.id}">
                        <i class="ri-shopping-cart-line"></i> Add to Cart
                    </button>
                    <button class="btn btn-outline remove-wishlist" data-id="${item.id}">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            </div>
        `;
    }

    setupWishlistActions() {
        // Add to cart
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = btn.dataset.id;
                this.addWishlistItemToCart(itemId);
            });
        });

        // Remove from wishlist
        document.querySelectorAll('.remove-wishlist').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = btn.dataset.id;
                this.removeFromWishlist(itemId);
            });
        });
    }

    // Address Management (reusing checkout functionality)
    openAddressModal() {
        document.getElementById('modal-title').textContent = 'Add New Address';
        document.getElementById('address-form').reset();
        document.getElementById('address-id').value = '';
        document.getElementById('address-modal').style.display = 'flex';
    }

    editAddress(addressId) {
        const addresses = this.getUserAddresses();
        const address = addresses.find(addr => addr.id === addressId);
        
        if (!address) return;

        document.getElementById('modal-title').textContent = 'Edit Address';
        document.getElementById('address-id').value = address.id;
        document.getElementById('fullname').value = address.fullname;
        document.getElementById('address').value = address.address;
        document.getElementById('city').value = address.city;
        document.getElementById('phone').value = address.phone;
        
        document.getElementById('address-modal').style.display = 'flex';
    }

    setDefaultAddress(addressId) {
        const addresses = this.getUserAddresses();
        const updatedAddresses = addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === addressId
        }));

        localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
        this.loadAddresses();
    }

    deleteAddress(addressId) {
        if (!confirm('Are you sure you want to delete this address?')) return;

        const addresses = this.getUserAddresses();
        const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
        
        localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
        this.loadAddresses();
        this.updateStats();
    }

    setupModalHandlers() {
        // Address modal
        const addressModal = document.getElementById('address-modal');
        const addressForm = document.getElementById('address-form');
        const closeAddressModal = document.getElementById('close-modal');
        const cancelAddress = document.getElementById('cancel-address');

        addressForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAddress();
        });

        closeAddressModal.addEventListener('click', () => {
            addressModal.style.display = 'none';
        });

        cancelAddress.addEventListener('click', () => {
            addressModal.style.display = 'none';
        });

        // Password modal
        const passwordModal = document.getElementById('password-modal');
        const passwordForm = document.getElementById('password-form');
        const closePasswordModal = document.getElementById('close-password-modal');
        const cancelPassword = document.getElementById('cancel-password');

        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.changePassword();
        });

        closePasswordModal.addEventListener('click', () => {
            passwordModal.style.display = 'none';
        });

        cancelPassword.addEventListener('click', () => {
            passwordModal.style.display = 'none';
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === addressModal) {
                addressModal.style.display = 'none';
            }
            if (e.target === passwordModal) {
                passwordModal.style.display = 'none';
            }
        });
    }

    openPasswordModal() {
        document.getElementById('password-form').reset();
        document.getElementById('password-modal').style.display = 'flex';
    }

    // Data Getters
    getUserOrders() {
        try {
            return JSON.parse(localStorage.getItem('orders') || '[]');
        } catch (error) {
            console.error('Error loading orders:', error);
            return [];
        }
    }

    getUserAddresses() {
        try {
            return JSON.parse(localStorage.getItem('addresses') || '[]');
        } catch (error) {
            console.error('Error loading addresses:', error);
            return [];
        }
    }

    getUserWishlist() {
        try {
            return JSON.parse(localStorage.getItem('wishlist') || '[]');
        } catch (error) {
            console.error('Error loading wishlist:', error);
            return [];
        }
    }

    // Action Methods
    saveProfile() {
        const formData = new FormData(document.getElementById('profile-form'));
        
        this.currentUser = {
            ...this.currentUser,
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            preferences: {
                marketingEmails: document.getElementById('marketing-emails').checked,
                orderUpdates: document.getElementById('order-updates').checked,
                smsNotifications: document.getElementById('sms-notifications').checked
            }
        };

        localStorage.setItem('userProfile', JSON.stringify(this.currentUser));
        this.updateUserProfile();
        
        // Show success message
        this.showNotification('Profile updated successfully!', 'success');
    }

    saveAddress() {
        const formData = new FormData(document.getElementById('address-form'));
        const addressId = document.getElementById('address-id').value;
        const addresses = this.getUserAddresses();

        const addressData = {
            id: addressId || 'ADDR' + Date.now(),
            fullname: formData.get('fullname'),
            address: formData.get('address'),
            city: formData.get('city'),
            phone: formData.get('phone'),
            isDefault: addresses.length === 0 // Set as default if first address
        };

        let updatedAddresses;
        if (addressId) {
            // Editing existing address
            updatedAddresses = addresses.map(addr => 
                addr.id === addressId ? { ...addressData, isDefault: addr.isDefault } : addr
            );
        } else {
            // Adding new address
            updatedAddresses = [...addresses, addressData];
        }

        localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
        document.getElementById('address-modal').style.display = 'none';
        
        // Reload addresses if we're on that tab
        if (this.currentTab === 'addresses') {
            this.loadAddresses();
        }
        
        this.updateStats();
        this.showNotification('Address saved successfully!', 'success');
    }

    changePassword() {
        const formData = new FormData(document.getElementById('password-form'));
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');

        // Basic validation
        if (newPassword !== confirmPassword) {
            this.showNotification('New passwords do not match!', 'error');
            return;
        }

        if (newPassword.length < 6) {
            this.showNotification('Password must be at least 6 characters long!', 'error');
            return;
        }

        // In a real app, you would verify current password with backend
        // For demo purposes, we'll just show success
        document.getElementById('password-modal').style.display = 'none';
        this.showNotification('Password updated successfully!', 'success');
    }

    addWishlistItemToCart(itemId) {
        const wishlist = this.getUserWishlist();
        const item = wishlist.find(wishItem => wishItem.id === itemId);
        
        if (!item) return;

        try {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingItem = cart.find(cartItem => cartItem.id === item.id);
            
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({ ...item, qty: 1 });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            window.dispatchEvent(new Event('cartUpdated'));
            this.showNotification('Item added to cart!', 'success');
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showNotification('Error adding item to cart', 'error');
        }
    }

    removeFromWishlist(itemId) {
        const wishlist = this.getUserWishlist();
        const updatedWishlist = wishlist.filter(item => item.id !== itemId);
        
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        
        if (this.currentTab === 'wishlist') {
            this.loadWishlist();
        }
        
        this.updateStats();
        this.showNotification('Item removed from wishlist', 'success');
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            // In a real app, you would clear authentication tokens
            // For demo, we'll just redirect to home page
            window.location.href = '../index.html';
        }
    }

    showOrderDetails(orderId) {
        const orders = this.getUserOrders();
        const order = orders.find(o => o.id === orderId);
        
        if (!order) return;

        // You can implement a modal for order details here
        // For now, redirect to order details page
        window.location.href = `order-details.html?orderId=${orderId}`;
    }

    // Utility Methods
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

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="ri-${type === 'success' ? 'check' : 'error-warning'}-line"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : 'var(--warning)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 1001;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Add notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// Initialize account page
document.addEventListener('DOMContentLoaded', () => {
    window.accountPage = new AccountPage();
});