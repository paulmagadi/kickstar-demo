function getHomePageContext() {
    const indexContainer = document.querySelector('.container.index');
    const pagesContainer = document.querySelector('.container.pages');

    if (indexContainer) {
        return {
            homeBase: '',
        };
    } else if (pagesContainer) {
        return {
            homeBase: '../',
        };
    } else {
        return {
            homeBase: '',
        };
    }
}

window.getHomePageContext = getHomePageContext;
// window.getPageContext = getPageContext;



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
                    
                    <div class="help">
                        <i class="ri-questionnaire-line"></i>
                    </div>

                    <!-- Auth Section -->
                    <div id="auth-section" class="auth-section">
                        <a href="${context.linkBase}login.html" class="auth-link">
                            <i class="ri-user-line"></i>
                            <span>Sign In</span>
                        </a>
                        <a href="${context.linkBase}register.html" class="auth-link register">
                            <span>Register</span>
                        </a>
                    </div>

                    <!-- User Section (hidden by default) -->
                    <div id="user-section" class="user-section" style="display: none;">
                        <div class="user-menu">
                            <button class="user-toggle" id="user-toggle">
                                <i class="ri-user-line"></i>
                                <span id="user-name">User Name</span>
                                <i class="ri-arrow-down-s-line"></i>
                            </button>
                            <div class="user-dropdown">
                                <a href="${context.linkBase}account.html" class="dropdown-item">
                                    <i class="ri-user-line"></i>
                                    My Account
                                </a>
                                <a href="${context.linkBase}orders.html" class="dropdown-item">
                                    <i class="ri-shopping-bag-line"></i>
                                    My Orders
                                </a>
                                <a href="${context.linkBase}wishlist.html" class="dropdown-item">
                                    <i class="ri-heart-line"></i>
                                    Wishlist
                                </a>
                                <div class="dropdown-divider"></div>
                                <a href="#" class="dropdown-item logout" id="logout-btn">
                                    <i class="ri-logout-box-line"></i>
                                    Logout
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="cart">
                        <a href="${context.linkBase}cart.html">
                            <i class="ri-shopping-cart-line" title="Cart"></i>
                            <span id="cart-count" class="cart-count">0</span>
                        </a>
                    </div>
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
    <div class="header-after"></div>
    `;

    // headerContainer.innerHTML = headerHTML;
    const container = document.querySelector(".container");
    container.insertAdjacentHTML("afterbegin", headerHTML);


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
}

window.renderHeader = renderHeader;

// Auto-render on load
document.addEventListener("DOMContentLoaded", renderHeader);
