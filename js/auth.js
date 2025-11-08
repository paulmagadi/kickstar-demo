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

    static getUserInitials() {
        const user = this.getCurrentUser();
        if (user && user.firstName && user.lastName) {
            return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
        }
        return 'U';
    }

    static updateAuthUI() {
        const authSection = document.getElementById('auth-section');
        const userSection = document.getElementById('user-section');
        const userName = document.getElementById('user-name');
        const userToggle = document.getElementById('user-toggle');
        
        const isAuthenticated = this.isAuthenticated();
        const currentUser = this.getCurrentUser();

        if (authSection && userSection) {
            if (isAuthenticated && currentUser) {
                authSection.style.display = 'none';
                userSection.style.display = 'flex';
                
                // Update user name
                if (userName) {
                    userName.textContent, userName.title = `${currentUser.firstName} ${currentUser.lastName}`;
                }
                
                // Add avatar to user toggle
                if (userToggle) {
                    const avatar = document.querySelector(".user-avatar");
                    avatar.title = `${currentUser.firstName} ${currentUser.lastName}`;
                    avatar.textContent = this.getUserInitials();
                    userToggle.insertBefore(avatar, userToggle.firstChild);
                    userToggle.classList.add('with-avatar');
                }
                
                // Initialize dropdown if not already initialized
                if (!window.userDropdown) {
                    window.userDropdown = new UserDropdown();
                }
            } else {
                authSection.style.display = 'flex';
                userSection.style.display = 'none';
                
                // Clean up dropdown
                if (window.userDropdown) {
                    window.userDropdown.closeDropdown();
                    window.userDropdown = null;
                }
            }
        }
    }

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
    AuthHelper.updateAuthUI();
});

// window.addEventListener('userLoggedOut', () => {
//     AuthHelper.updateAuthUI();
// });

// Initialize auth UI on page load
document.addEventListener('DOMContentLoaded', () => {
    AuthHelper.updateAuthUI();
});

// // Make it globally available
window.AuthHelper = AuthHelper;