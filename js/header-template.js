function getHeaderPageContext() {
    const indexContainer = document.querySelector('.container.index');
    const pagesContainer = document.querySelector('.container.pages');

    if (indexContainer) {
        return {
            type: 'index',
            homeLinkBase: '',
            imageBase: './images/',
            linkBase: 'pages/',
        };
    } else if (pagesContainer) {
        return {
            type: 'pages',
            homeLinkBase: '../',
            imageBase: '../images/',
            linkBase: '',
        };
    } else {
        // fallback for unknown containers
        return {
            type: 'default',
            homeLinkBase: '',
            imageBase: './images/',
            linkBase: '',
        };
    }
}

window.getHeaderPageContext = getHeaderPageContext;

/**
 * Injects a dynamic, path-aware header
**/
function renderHeader() {
    const { homeLinkBase, imageBase, linkBase, type } = getHeaderPageContext();
    const headerContainer = document.querySelector("#header-placeholder");
    if (!headerContainer) return;

    const headerHTML = `
    <header>
        <div class="header">
            <!-- Logo -->
            <div class="logo">
                <a href="${homeLinkBase}index.html">
                    <img src="${imageBase}logo2.svg" alt="KickStar" width="70px" title="KickStar Home">
                </a>
            </div>

            <!-- Desktop Search -->
            <div class="search-bar desktop">
                <form action="${linkBase}search.html" method="get">
                    <input type="search" placeholder="Search Products, Categories, Brands..." name="q"
                        class="search-input" required>
                    <i class="ri-search-line"></i>
                    <input type="submit" value="Search" class="search-btn">
                </form>
            </div>

            <!-- Header Items -->
            <div class="header-items">
                <!-- Mobile Search Toggle -->
                <div class="search-toggle mobile-only">
                    <i class="ri-search-line" title="Search"></i>
                </div>

                <div class="help">
                    <i class="ri-questionnaire-line"></i>
                </div>

                <div class="account">
                    <i class="ri-account-circle-line" title="Account"></i>
                    <div class="account-dropdown">
                        <p class="login"><a href="#">Login</a></p>
                        <p class="register"><a href="#">Register</a></p>
                    </div>
                </div>

                <div class="cart">
                    <a href="${linkBase}cart.html">
                        <i class="ri-shopping-cart-line" title="Cart"></i>
                        <span id="cart-count" class="cart-count">0</span>
                    </a>
                </div>
            </div>
        </div>

        <!-- Mobile Search -->
        <div class="search-bar mobile">
            <form action="${linkBase}search.html" method="get">
                <input type="search" class="search-input"
                    placeholder="Search Products, Categories, Brands..." name="q" required>
                <i class="ri-search-line"></i>
            </form>
        </div>

        <!-- Navigation -->
        <nav>
            <ul class="nav-links">
                <li><a href="${homeLinkBase}index.html" title="Home">Home</a></li>
                <li><a href="${linkBase}category.html?cat=all" title="All Products">All</a></li>
                <li><a href="${linkBase}category.html?cat=featured" title="Featured Products">Featured</a></li>
                <li><a href="${linkBase}category.html?cat=women" title="Women's Shoes">Women</a></li>
                <li><a href="${linkBase}category.html?cat=men" title="Men's Shoes">Men</a></li>
                <li><a href="${linkBase}category.html?cat=kids" title="Kids Shoes">Kids</a></li>
                <li><a href="${linkBase}category.html?cat=unisex" title="Unisex Shoes">Unisex</a></li>
                <li><a href="${linkBase}category.html?cat=new" title="New in Store">New</a></li>
                <li><a href="${linkBase}category.html?cat=deals" title="Deals">Deals</a></li>
                <li><a href="${linkBase}brands.html" title="Brands">Brands</a></li>
            </ul>
        </nav>
    </header>
    <div class="header-after"></div>
    `;

    headerContainer.innerHTML = headerHTML;

    console.log(`✅ Header rendered for ${type} page`);
}

window.renderHeader = renderHeader;

// Auto-render on load
document.addEventListener("DOMContentLoaded", renderHeader);
