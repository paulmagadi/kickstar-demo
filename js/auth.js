// Enhanced Authentication Helper
class AuthHelper {
    static isAuthenticated() {
        return localStorage.getItem('isAuthenticated') === 'true';
    }

    static getCurrentUser() {
        try {
            const userData = localStorage.getItem('currentUser');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    // static getUserInitials() {
    //     const user = this.getCurrentUser();
    //     if (user && user.firstName && user.lastName) {
    //         return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
    //     }
    //     return 'U';
    // }

    // static updateAuthUI() {
    //     const authSection = document.querySelector('desktop-auth-section');
    //     const userSection = document.getElementById('user-section');
    //     const userName = document.getElementById('user-name');
    //     const userAvatar = document.querySelector('.user-avatar');
    //     const authDropdown = document.getElementById('auth-dropdown');
    //     const mobileAuthSection = document.getElementById('mobile-auth-section');
    //     const mobileUserSection = document.getElementById('mobile-user-section');
    //     const mobileUserName = document.getElementById('mobile-user-name');
    //     const mobileUserAvatar = document.getElementById('mobile-user-avatar');
        
    //     const isAuthenticated = this.isAuthenticated();
    //     const currentUser = this.getCurrentUser();

    //     // Update desktop header
    //     if (authSection && userSection) {
    //         if (isAuthenticated && currentUser) {
    //             authSection.style.display = 'none';
    //             userSection.style.display = 'flex';
                
    //             // Update user name and avatar
    //             if (userName) {
    //                 userName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    //                 userName.title = `${currentUser.firstName} ${currentUser.lastName}`;
    //             }
                
    //             if (userAvatar) {
    //                 userAvatar.textContent = this.getUserInitials();
    //                 userAvatar.title = `${currentUser.firstName} ${currentUser.lastName}`;
    //             }
                
    //             // Hide auth dropdown
    //             if (authDropdown) {
    //                 authDropdown.style.display = 'none';
    //             }
                
    //             // Initialize dropdown if not already initialized
    //             if (!window.userDropdown) {
    //                 window.userDropdown = new UserDropdown();
    //             }
    //         } else {
    //             authSection.style.display = 'flex';
    //             userSection.style.display = 'none';
                
    //             // Show auth dropdown on mobile
    //             if (authDropdown) {
    //                 authDropdown.style.display = 'block';
    //             }
                
    //             // Clean up dropdown
    //             if (window.userDropdown) {
    //                 window.userDropdown.closeDropdown();
    //                 window.userDropdown = null;
    //             }
    //         }
    //     }

    //     // Update mobile sidebar
    //     if (mobileAuthSection && mobileUserSection) {
    //         if (isAuthenticated && currentUser) {
    //             mobileAuthSection.style.display = 'none';
    //             mobileUserSection.style.display = 'block';
                
    //             if (mobileUserName) {
    //                 mobileUserName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    //             }
                
    //             if (mobileUserAvatar) {
    //                 mobileUserAvatar.textContent = this.getUserInitials();
    //             }
    //         } else {
    //             mobileAuthSection.style.display = 'flex';
    //             mobileUserSection.style.display = 'none';
    //         }
    //     }
    // }

    static logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('lastLogin');
        window.dispatchEvent(new Event('userLoggedOut'));
        window.location.href = `${context.linkBase}login.html`;
    }

    static requireAuth(redirectUrl = `${context.linkBase}login.html`) {
        if (!this.isAuthenticated()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    static updateUserProfile(updatedData) {
        try {
            const currentUser = this.getCurrentUser();
            if (currentUser) {
                const updatedUser = { ...currentUser, ...updatedData };
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                localStorage.setItem('userProfile', JSON.stringify(updatedUser));
                
                // Update UI if needed
                this.updateAuthUI();
                
                window.dispatchEvent(new Event('userProfileUpdated'));
                return true;
            }
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
        return false;
    }
}

// Update auth UI when user logs in/out
window.addEventListener('userLoggedIn', () => {
    // AuthHelper.updateAuthUI();
});

window.addEventListener('userLoggedOut', () => {
    // AuthHelper.updateAuthUI();
});

// Initialize auth UI on page load
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AuthHelper !== 'undefined') {
        // AuthHelper.updateAuthUI();
    }
});

// Make it globally available
window.AuthHelper = AuthHelper;