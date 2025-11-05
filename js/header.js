document.addEventListener("DOMContentLoaded", () => {
    const searchToggle = document.querySelector(".search-toggle"); // the button with icon
    const searchIcon = searchToggle?.querySelector("i"); // the <i> inside
    const mobileSearchBar = document.querySelector(".search-bar.mobile");
    const mobileSearchInput = mobileSearchBar?.querySelector("input[type=search]");

    if (searchToggle && mobileSearchBar && searchIcon) {
        searchToggle.addEventListener("click", (e) => {
            e.stopPropagation(); // prevent auto-close on same click
            mobileSearchBar.classList.toggle("active");

            if (mobileSearchBar.classList.contains("active")) {
                // switch icon to close
                searchIcon.classList.remove("ri-search-line");
                searchIcon.classList.add("ri-close-line");

                if (mobileSearchInput) {
                    setTimeout(() => mobileSearchInput.focus(), 300);
                }
            } else {
                // switch icon back to search
                searchIcon.classList.remove("ri-close-line");
                searchIcon.classList.add("ri-search-line");
            }
        });

        // Close search bar when clicking outside
        document.addEventListener("click", (event) => {
            if (
                mobileSearchBar.classList.contains("active") &&
                !mobileSearchBar.contains(event.target) &&
                !searchToggle.contains(event.target)
            ) {
                mobileSearchBar.classList.remove("active");
                searchIcon.classList.remove("ri-close-line");
                searchIcon.classList.add("ri-search-line");
            }
        });
    }
});



// Add to your existing header.js file
class AuthHeader {
    static updateAuthUI() {
        const authSection = document.getElementById('auth-section');
        const userSection = document.getElementById('user-section');
        const userName = document.getElementById('user-name');
        
        const isAuthenticated = AuthHelper.isAuthenticated();
        const currentUser = AuthHelper.getCurrentUser();

        if (authSection && userSection) {
            if (isAuthenticated && currentUser) {
                authSection.style.display = 'none';
                userSection.style.display = 'flex';
                if (userName) {
                    userName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
                }
            } else {
                authSection.style.display = 'flex';
                userSection.style.display = 'none';
            }
        }
    }

    static setupAuthListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Are you sure you want to logout?')) {
                    AuthHelper.logout();
                }
            });
        }

        // Listen for auth changes
        window.addEventListener('userLoggedIn', this.updateAuthUI);
        window.addEventListener('userLoggedOut', this.updateAuthUI);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    AuthHeader.updateAuthUI();
    AuthHeader.setupAuthListeners();
});





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

