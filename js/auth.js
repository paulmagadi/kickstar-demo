// Authentication Helper
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
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('lastLogin');
        // Keep remembered email for convenience
        window.dispatchEvent(new Event('userLoggedOut'));
        window.location.href = 'login.html';
    }

    static requireAuth(redirectUrl = 'login.html') {
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
                window.dispatchEvent(new Event('userProfileUpdated'));
                return true;
            }
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
        return false;
    }
}

// Make it globally available
window.AuthHelper = AuthHelper;