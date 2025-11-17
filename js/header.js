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


class AuthHeader {
    static updateAuthUI() {
        const desktopAuthSection = document.getElementById('desktop-auth-section');
        const userSection = document.getElementById('user-section');
        const userName = document.getElementById('user-name');
        
        const mobileAuthToggle = document.querySelector('.mobile-auth-toggle');
        
        const isAuthenticated = AuthHelper.isAuthenticated();
        const currentUser = AuthHelper.getCurrentUser();

        if (desktopAuthSection && userSection) {
            if (isAuthenticated && currentUser) {
                desktopAuthSection.style.display = 'none';
                userSection.style.display = 'flex';
                if (userName) {
                    userName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
                }
            } else {
                desktopAuthSection.style.display = 'flex';
                userSection.style.display = 'none';
            }
        }

        if(isAuthenticated && currentUser) {
            mobileAuthToggle.classList.add("display-none");
        }

        else {
            mobileAuthToggle.classList.add("display-flex");
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


const context = getPageContext();


// User Dropdown Management
class UserDropdown {
    constructor() {
        this.userToggle = document.getElementById('user-toggle');
        this.userDropdown = document.querySelector('.user-dropdown');
        this.isOpen = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Toggle dropdown
        if (this.userToggle) {
            this.userToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.userToggle.contains(e.target) && !this.userDropdown.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // Close dropdown on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeDropdown();
            }
        });

        // Prevent dropdown from closing when clicking inside it
        if (this.userDropdown) {
            this.userDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    toggleDropdown() {
        if (this.isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    openDropdown() {
        if (this.userToggle && this.userDropdown) {
            this.userToggle.classList.add('active');
            this.userDropdown.classList.add('show');
            this.isOpen = true;
            
            // Update aria-expanded for accessibility
            this.userToggle.setAttribute('aria-expanded', 'true');
        }
    }

    closeDropdown() {
        if (this.userToggle && this.userDropdown) {
            this.userToggle.classList.remove('active');
            this.userDropdown.classList.remove('show');
            this.isOpen = false;
            
            // Update aria-expanded for accessibility
            this.userToggle.setAttribute('aria-expanded', 'false');
        }
    }
}

// Initialize user dropdown when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if user is logged in
    if (AuthHelper.isAuthenticated()) {
        window.userDropdown = new UserDropdown();
    }
});


document.addEventListener("DOMContentLoaded", () => {
// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const mobileSideNav = document.getElementById('mobile-side-nav');
const mobileNavClose = document.getElementById('mobile-nav-close');
const overlay = document.getElementById('overlay');
const userToggle = document.getElementById('user-toggle');
const userSection = document.getElementById('user-section');
const authSection = document.getElementById('desktop-auth-section');
const mobileUserSection = document.getElementById('mobile-user-section');
const mobileAuthSection = document.getElementById('mobile-auth-section');
const mobileAuthToggle = document.querySelector(".mobile-auth-toggle");
const mobileAuthDropdown = document.getElementById("mobile-auth-dropdown");

        // Toggle mobile auth 
        mobileAuthToggle.addEventListener('click', () => {
            // mobileAuthDropdown.style.display = "block";
            mobileAuthDropdown.classList.add("show")
        });

        // Toggle mobile side navigation
        navToggle.addEventListener('click', () => {
            mobileSideNav.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close mobile side navigation
        mobileNavClose.addEventListener('click', () => {
            mobileSideNav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close mobile side navigation when clicking overlay
        overlay.addEventListener('click', () => {
            mobileSideNav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Toggle user dropdown
        if (userToggle) {
            userToggle.addEventListener('click', () => {
                const userMenu = userToggle.closest('.user-menu');
                userMenu.classList.toggle('active');
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (userToggle && !userToggle.contains(e.target)) {
                const userMenu = userToggle.closest('.user-menu');
                if (userMenu) {
                    userMenu.classList.remove('active');
                }
            }
        });

})

