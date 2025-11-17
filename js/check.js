function renderHeader() {
    const context = getPageContext();
    const homeContext = getHomePageContext();

    const headerHTML = `
    <header>
        <div class="header">
            <!-- Logo -->
            <div class="logo">
                <a href="${homeContext.homeBase}index.html">
                    <img src="${context.imageBase}logo2.svg" alt="KickStar" width="70px" title="KickStar Home">
                </a>
            </div>

            <!-- Desktop Search -->
            <div class="search-bar desktop">
                <form action="${context.linkBase}search.html" method="get">
                    <input type="search" placeholder="Search Products, Categories, Brands..." name="q"
                        class="search-input" required>
                    <i class="ri-search-line"></i>
                    <input type="submit" value="Search" class="search-btn">
                </form>
            </div>

            <!-- Header Items -->
            <div class="header-items-container">
                <!-- Mobile Search Toggle -->
                <div class="search-toggle mobile-only">
                    <i class="ri-search-line" title="Search"></i>
                </div>
                <div class="header-items">
                    
                    <div class="help" title="Find Help">
                        <i class="ri-questionnaire-line" aria-hidden="true"></i>
                    </div>

                    <!-- Desktop Auth Section -->
                    <div id="auth-section" class="auth-section desktop">
                        <a href="${context.linkBase}login.html" class="auth-link signin" aria-label="Sign in to your account">
                            <i class="ri-user-line"></i>
                            <span>Sign In</span>
                        </a>
                        <a href="${context.linkBase}register.html" class="auth-link register" aria-label="Create a new account">
                            <span>Register</span>
                        </a>
                    </div>

                    <!-- Mobile Auth Dropdown -->
                    <div class="auth-dropdown" id="auth-dropdown">
                        <button class="auth-dropdown-toggle" id="auth-dropdown-toggle" aria-label="Authentication menu">
                            <i class="ri-user-line"></i>
                        </button>
                        <div class="auth-dropdown-menu" id="auth-dropdown-menu">
                            <a href="${context.linkBase}login.html" class="auth-dropdown-item">
                                <i class="ri-login-box-line"></i>
                                Sign In
                            </a>
                            <a href="${context.linkBase}register.html" class="auth-dropdown-item">
                                <i class="ri-user-add-line"></i>
                                Register
                            </a>
                        </div>
                    </div>

                    <!-- User Section (hidden by default) -->
                    <div id="user-section" class="user-section" style="display: none;">
                        <div class="user-menu">
                            <button class="user-toggle" id="user-toggle" aria-expanded="false" aria-haspopup="true" aria-label="User menu">
                                <div class="user-avatar" aria-hidden="true">U</div>
                                <span id="user-name">User Name</span>
                                <i class="ri-arrow-down-s-line" aria-hidden="true"></i>
                            </button>
                            <div class="user-dropdown" role="menu" aria-labelledby="user-toggle">
                                <a href="${context.linkBase}account.html" class="dropdown-item" role="menuitem">
                                    <i class="ri-user-line" aria-hidden="true"></i>
                                    My Account
                                </a>
                                <a href="${context.linkBase}orders.html" class="dropdown-item" role="menuitem">
                                    <i class="ri-shopping-bag-line" aria-hidden="true"></i>
                                    My Orders
                                </a>
                                <a href="${context.linkBase}wishlist.html" class="dropdown-item" role="menuitem">
                                    <i class="ri-heart-line" aria-hidden="true"></i>
                                    Wishlist
                                </a>
                                <div class="dropdown-divider" role="separator"></div>
                                <a href="#" class="dropdown-item logout" id="logout-btn" role="menuitem">
                                    <i class="ri-logout-box-line" aria-hidden="true"></i>
                                    Logout
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="wishlist">
                        <a href="${context.linkBase}wishlist.html">
                            <i class="ri-heart-line" title="Wishlist"></i>
                            <span id="wishlist-count" class="wishlist-count">0</span>
                        </a>
                    </div>

                    <div class="cart">
                        <a href="${context.linkBase}cart.html">
                            <i class="ri-shopping-cart-line"title="Cart"></i>
                            <span id="cart-count" class="cart-count">0</span>
                        </a>
                    </div>

                    <button class="nav-toggle" id="nav-toggler">
                        <i class="ri-menu-line"></i>
                    </button>
                </div>
                
            </div>
        </div>

        <!-- Mobile Search -->
        <div class="search-bar mobile">
            <form action="${context.linkBase}search.html" method="get">
                <input type="search" class="search-input"
                    placeholder="Search Products, Categories, Brands..." name="q" required>
                <i class="ri-search-line"></i>
            </form>
        </div>

        <!-- Navigation -->
        <nav>
            <ul class="nav-links">
                <li><a href="${homeContext.homeBase}index.html" title="Home">Home</a></li>
                <li><a href="${context.linkBase}category.html?cat=all" title="All Products">All</a></li>
                <li><a href="${context.linkBase}category.html?cat=featured" title="Featured Products">Featured</a></li>
                <li><a href="${context.linkBase}category.html?cat=women" title="Women's Shoes">Women</a></li>
                <li><a href="${context.linkBase}category.html?cat=men" title="Men's Shoes">Men</a></li>
                <li><a href="${context.linkBase}category.html?cat=kids" title="Kids Shoes">Kids</a></li>
                <li><a href="${context.linkBase}category.html?cat=unisex" title="Unisex Shoes">Unisex</a></li>
                <li><a href="${context.linkBase}category.html?cat=new" title="New in Store">New</a></li>
                <li><a href="${context.linkBase}category.html?cat=deals" title="Deals">Deals</a></li>
                <li><a href="${context.linkBase}brands.html" title="Brands">Brands</a></li>
            </ul>
        </nav>
    </header>

    <!-- Mobile Side Navigation -->
    <div class="mobile-side-nav" id="mobile-side-nav">
        <div class="mobile-nav-header">
            <a href="${homeContext.homeBase}index.html" class="logo">
                <img src="${context.imageBase}logo2.svg" alt="KickStar" width="70px">
            </a>
            <button class="mobile-nav-close" id="mobile-nav-close">
                <i class="ri-close-line"></i>
            </button>
        </div>
        
        <ul class="mobile-nav-links">
            <li><a href="${homeContext.homeBase}index.html" title="Home">Home</a></li>
            <li><a href="${context.linkBase}category.html?cat=all" title="All Products">All</a></li>
            <li><a href="${context.linkBase}category.html?cat=featured" title="Featured Products">Featured</a></li>
            <li><a href="${context.linkBase}category.html?cat=women" title="Women's Shoes">Women</a></li>
            <li><a href="${context.linkBase}category.html?cat=men" title="Men's Shoes">Men</a></li>
            <li><a href="${context.linkBase}category.html?cat=kids" title="Kids Shoes">Kids</a></li>
            <li><a href="${context.linkBase}category.html?cat=unisex" title="Unisex Shoes">Unisex</a></li>
            <li><a href="${context.linkBase}category.html?cat=new" title="New in Store">New</a></li>
            <li><a href="${context.linkBase}category.html?cat=deals" title="Deals">Deals</a></li>
            <li><a href="${context.linkBase}brands.html" title="Brands">Brands</a></li>
        </ul>
        
        <div class="mobile-nav-auth">
            <div id="mobile-auth-section" class="mobile-auth-section">
                <a href="${context.linkBase}login.html" class="mobile-auth-link signin" aria-label="Sign in to your account">
                    <span>Sign In</span>
                </a>
                <a href="${context.linkBase}register.html" class="mobile-auth-link register" aria-label="Create a new account">
                    <span>Register</span>
                </a>
            </div>

            <div id="mobile-user-section" class="mobile-user-section">
                <div class="mobile-user-info">
                    <div class="user-avatar" id="mobile-user-avatar">U</div>
                    <span id="mobile-user-name">User Name</span>
                </div>
                <div class="mobile-user-menu">
                    <a href="${context.linkBase}account.html" class="mobile-dropdown-item" role="menuitem">
                        <i class="ri-user-line" aria-hidden="true"></i>
                        My Account
                    </a>
                    <a href="${context.linkBase}orders.html" class="mobile-dropdown-item" role="menuitem">
                        <i class="ri-shopping-bag-line" aria-hidden="true"></i>
                        My Orders
                    </a>
                    <a href="${context.linkBase}wishlist.html" class="mobile-dropdown-item" role="menuitem">
                        <i class="ri-heart-line" aria-hidden="true"></i>
                        Wishlist
                    </a>
                    <a href="#" class="mobile-dropdown-item logout" id="mobile-logout-btn" role="menuitem">
                        <i class="ri-logout-box-line" aria-hidden="true"></i>
                        Logout
                    </a>
                </div>
            </div>
        </div>
    </div>
    <!-- Overlay -->
    <div class="overlay" id="overlay"></div>

    <div class="header-after"></div>
    `;

    const container = document.querySelector(".container");
    container.insertAdjacentHTML("afterbegin", headerHTML);

    // Initialize all functionality
    initializeHeaderFunctionality();
}

function initializeHeaderFunctionality() {
    // Cart count utility
    function getCart() {
        return JSON.parse(localStorage.getItem("cart") || "[]");
    }

    function updateCartCount() {
        const cart = getCart();
        const count = cart.reduce((sum, item) => sum + item.qty, 0);
        const cartCountEl = document.getElementById("cart-count");
        if (cartCountEl) cartCountEl.textContent = count;
    }

    updateCartCount();

    const WISHLIST_STORAGE_KEY = 'user_wishlist';

    function getWishlist() {
        const wishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
        return wishlist ? JSON.parse(wishlist) : [];
    }

    function updateWishlistCount() {
        const wishlist = getWishlist();
        const countElement = document.getElementById('wishlist-count');
        if (countElement) {
            countElement.textContent = wishlist.length;
        }
    }

    updateWishlistCount();

    // Initialize auth dropdown
    initializeAuthDropdown();
    
    // Update auth UI
    AuthHelper.updateAuthUI();
}

function initializeAuthDropdown() {
    const authDropdownToggle = document.getElementById('auth-dropdown-toggle');
    const authDropdownMenu = document.getElementById('auth-dropdown-menu');
    
    if (authDropdownToggle && authDropdownMenu) {
        let isOpen = false;
        
        authDropdownToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            isOpen = !isOpen;
            
            if (isOpen) {
                authDropdownMenu.classList.add('show');
            } else {
                authDropdownMenu.classList.remove('show');
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (isOpen && !authDropdownToggle.contains(e.target) && !authDropdownMenu.contains(e.target)) {
                authDropdownMenu.classList.remove('show');
                isOpen = false;
            }
        });
        
        // Close dropdown on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                authDropdownMenu.classList.remove('show');
                isOpen = false;
            }
        });
    }
}

window.renderHeader = renderHeader;