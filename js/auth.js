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


    static logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userProfile');
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