// Account Page Management
class AccountPage {
    constructor() {
        this.currentUser = null;
        this.currentTab = 'dashboard';
        this.addressManager = null;
        this.init();
        this.setupDeleteAccount();
    }

    init() {
        this.loadUserData();
        this.setupAddressManagement(); 
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

        // Password change
        document.getElementById('change-password-btn').addEventListener('click', () => {
            this.openPasswordModal();
        });

        // Logout
        document.getElementById('logout-btn-acc').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Delete account
        const deleteAccountBtn = document.getElementById('delete-account-btn');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', () => {
                this.openDeleteAccountModal();
            });
        }

        // Modal close handlers
        this.setupModalHandlers();
    }

    setupAddressManagement() {
        this.addressManager = new ShippingAddressManager({
            containerId: "addresses-grid",
            modalId: "address-modal", 
            addButtonId: "add-address-btn",
            formId: "address-form",
            onAddressUpdate: (addresses) => {
                // Update stats when addresses change
                this.updateStats();
                
                // If we're on the addresses tab, refresh the display
                if (this.currentTab === 'addresses') {
                    this.loadAddresses();
                }
            },
            onAddressChange: (addresses) => {
                // Handle address selection changes if needed
                console.log('Address selection changed:', addresses);
            }
        });
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
                break;
        }
    }

    loadDashboardData() {
        this.updateStats();
        this.loadRecentActivity();
    }

    updateStats() {
        const orders = this.getUserOrders();
        const addresses = this.addressManager ? this.addressManager.getAddresses() : [];
        // const wishlist = this.getUserWishlist();

        // Update stats cards
        document.getElementById('total-orders').textContent = orders.length;
        document.getElementById('pending-orders').textContent = 
            orders.filter(order => order.status === 'pending' || order.status === 'processing').length;
        document.getElementById('saved-addresses').textContent = addresses.length;
        // document.getElementById('wishlist-items').textContent = wishlist.length;

        // Update nav badges
        document.getElementById('orders-badge').textContent = orders.length;
        // document.getElementById('wishlist-badge').textContent = wishlist.length;
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

    // Simplified addresses loading - now handled by addressManager
    loadAddresses() {
        // The addressManager automatically handles rendering
        // This method is kept for compatibility with tab switching
        if (this.addressManager) {
            this.addressManager.renderAddresses();
        }
    }



    loadWishlist() {
        renderWishlist(4, 'wishlist-preview'); // container with ID "wishlist-preview"
    }


    setupModalHandlers() {
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

    // getUserWishlist() {
    //     try {
    //         return JSON.parse(localStorage.getItem('user_wishlist') || '[]');
    //     } catch (error) {
    //         console.error('Error loading wishlist:', error);
    //         return [];
    //     }
    // }

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
        document.getElementById('password-modal').style.display = 'none';
        this.showNotification('Password updated successfully!', 'success');
    }


    // Call the AuthHelper on logout
    logout() {
        if (confirm('Are you sure you want to logout?')) {
            AuthHelper.logout();
        }
    }

    showOrderDetails(orderId) {
        const orders = this.getUserOrders();
        const order = orders.find(o => o.id === orderId);
        
        if (!order) return;

        // Redirect to order details page
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

    // Delete Account functionality remains the same
    setupDeleteAccount() {
        const deleteAccountBtn = document.getElementById('delete-account-btn');
        const deleteAccountModal = document.getElementById('delete-account-modal');
        const confirmDeleteBtn = document.getElementById('confirm-delete-account');
        const cancelDeleteBtn = document.getElementById('cancel-delete-account');
        const confirmDeletionCheckbox = document.getElementById('confirm-deletion');
        const confirmEmailInput = document.getElementById('confirm-email');

        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', () => {
                this.openDeleteAccountModal();
            });
        }

        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', () => {
                this.closeDeleteAccountModal();
            });
        }

        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', () => {
                this.confirmAccountDeletion();
            });
        }

        // Real-time validation for confirmation
        if (confirmDeletionCheckbox && confirmEmailInput) {
            const validateConfirmation = () => {
                const isChecked = confirmDeletionCheckbox.checked;
                const emailMatches = confirmEmailInput.value === this.currentUser.email;
                confirmDeleteBtn.disabled = !(isChecked && emailMatches);
            };

            confirmDeletionCheckbox.addEventListener('change', validateConfirmation);
            confirmEmailInput.addEventListener('input', validateConfirmation);
        }

        // Close modal on background click
        if (deleteAccountModal) {
            deleteAccountModal.addEventListener('click', (e) => {
                if (e.target === deleteAccountModal) {
                    this.closeDeleteAccountModal();
                }
            });
        }

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && deleteAccountModal.style.display === 'flex') {
                this.closeDeleteAccountModal();
            }
        });
    }

    openDeleteAccountModal() {
        const modal = document.getElementById('delete-account-modal');
        if (!modal) return;

        // Reset confirmation fields
        document.getElementById('confirm-deletion').checked = false;
        document.getElementById('confirm-email').value = '';
        document.getElementById('confirm-delete-account').disabled = true;

        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        
        // Focus on the first interactive element for accessibility
        document.getElementById('confirm-deletion').focus();
    }

    closeDeleteAccountModal() {
        const modal = document.getElementById('delete-account-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    async confirmAccountDeletion() {
        const confirmBtn = document.getElementById('confirm-delete-account');
        const userEmail = document.getElementById('confirm-email').value;

        // Final validation
        if (userEmail !== this.currentUser.email) {
            this.showNotification('Email does not match. Please enter your exact email address.', 'error');
            return;
        }

        if (!document.getElementById('confirm-deletion').checked) {
            this.showNotification('Please confirm that you understand this action is irreversible.', 'error');
            return;
        }

        // Show loading state
        confirmBtn.classList.add('loading');
        confirmBtn.disabled = true;

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Perform account deletion
            await this.deleteUserAccount();

            // Show success message and redirect
            this.showDeletionSuccess();

        } catch (error) {
            console.error('Account deletion error:', error);
            this.showNotification('Failed to delete account. Please try again.', 'error');
            
            // Reset button state
            confirmBtn.classList.remove('loading');
            confirmBtn.disabled = false;
        }
    }

    async deleteUserAccount() {
        try {
            const userId = this.currentUser.id;
            
            // Remove user from users list
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const updatedUsers = users.filter(user => user.id !== userId);
            localStorage.setItem('users', JSON.stringify(updatedUsers));

            // Remove user data
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userProfile');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('lastLogin');
            localStorage.removeItem('rememberedEmail');

            // Remove user-specific data using addressManager
            this.removeUserOrders(userId);
            this.removeUserAddresses(userId);
            this.removeUserWishlist(userId);

            // Track deletion for analytics
            this.trackAccountDeletion(userId);

            return true;

        } catch (error) {
            console.error('Error deleting user account:', error);
            throw new Error('Failed to delete account data');
        }
    }

    removeUserOrders(userId) {
        try {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const userOrders = orders.filter(order => order.userId === userId);
            
            if (userOrders.length > 0) {
                const updatedOrders = orders.map(order => {
                    if (order.userId === userId) {
                        return {
                            ...order,
                            userId: 'DELETED_USER',
                            customerEmail: 'deleted@user.com',
                            shippingAddress: null
                        };
                    }
                    return order;
                });
                localStorage.setItem('orders', JSON.stringify(updatedOrders));
            }
        } catch (error) {
            console.error('Error removing user orders:', error);
        }
    }

    removeUserAddresses(userId) {
        try {
            // Clear all addresses for this user
            localStorage.removeItem('addresses');
        } catch (error) {
            console.error('Error removing user addresses:', error);
        }
    }

    removeUserWishlist(userId) {
        try {
            localStorage.removeItem('wishlist');
        } catch (error) {
            console.error('Error removing user wishlist:', error);
        }
    }

    trackAccountDeletion(userId) {
        console.log(`Account deleted: ${userId}`);
        
        const deletionLog = JSON.parse(localStorage.getItem('accountDeletions') || '[]');
        deletionLog.push({
            userId: userId,
            deletedAt: new Date().toISOString(),
            reason: 'user_initiated'
        });
        localStorage.setItem('accountDeletions', JSON.stringify(deletionLog));
    }

    showDeletionSuccess() {
        const accountPage = document.querySelector('.account-page');
        
        accountPage.innerHTML = `
            <div class="account-deletion-success">
                <i class="ri-checkbox-circle-fill"></i>
                <h2>Account Successfully Deleted</h2>
                <p>Your account and all associated data have been permanently deleted from our systems.<br>
                We're sorry to see you go and hope you'll consider rejoining us in the future.</p>
                <div class="success-actions">
                    <a href="../index.html" class="btn btn-primary">
                        <i class="ri-home-line"></i> Return to Homepage
                    </a>
                    <a href="register.html" class="btn btn-outline">
                        <i class="ri-user-add-line"></i> Create New Account
                    </a>
                </div>
                <div class="deletion-feedback" style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--gray-shade-color);">
                    <p style="font-size: 0.9rem; opacity: 0.7;">
                        If you have any feedback about why you left, we'd appreciate 
                        <a href="mailto:feedback@kickstar.com" style="color: var(--primary-color);">hearing from you</a>.
                    </p>
                </div>
            </div>
        `;

        const successActions = accountPage.querySelector('.success-actions');
        if (successActions) {
            successActions.style.cssText = `
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            `;
        }

        window.dispatchEvent(new Event('userLoggedOut'));
    }
}

// Initialize account page
document.addEventListener('DOMContentLoaded', () => {
    window.accountPage = new AccountPage();
});