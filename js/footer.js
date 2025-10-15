window.getHeaderPageContext = getPageContext;

document.addEventListener("DOMContentLoaded", () => {
    const context = getPageContext();

    const footerTemplate = `
    <footer class="footer">
        <div class="footer-content">
            <!-- Logo / Brand -->
            <div class="footer-brand">
                <h2 class="logo">Kick<span>Star</span></h2>
                <p>Your trusted shop for sneakers and lifestyle shoes.</p>
                <div class="social-links">
                    <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                    <a href="#" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>
                    <a href="#" aria-label="TikTok"><i class="fab fa-tiktok"></i></a>
                    <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                </div>
            </div>

            <!-- Links -->
            <div class="footer-links">
                <h3>Shop</h3>
                <ul>
                    <li><a href="${context.linkBase}category.html?cat=men">Men</a></li>
                    <li><a href="${context.linkBase}category.html?cat=women">Women</a></li>
                    <li><a href="${context.linkBase}category.html?cat=kids">Kids</a></li>
                    <li><a href="${context.linkBase}category.html?cat=new">New Arrivals</a></li>
                    <li><a href="${context.linkBase}category.html?cat=deals">Sale</a></li>
                </ul>
            </div>

            <div class="footer-links">
                <h3>Support</h3>
                <ul>
                    <li><a href="#">Help Center</a></li>
                    <li><a href="#">Track Order</a></li>
                    <li><a href="#">Shipping & Returns</a></li>
                    <li><a href="#">Size Guide</a></li>
                    <li><a href="#">FAQs</a></li>
                </ul>
            </div>

            <div class="footer-links">
                <h3>Company</h3>
                <ul>
                    <li><a href="${context.linkBase}pages/about.html">About Us</a></li>
                    <li><a href="${context.linkBase}pages/sustainability.html">Sustainability</a></li>
                    <li><a href="${context.linkBase}pages/careers.html">Careers</a></li>
                    <li><a href="#">Press</a></li>
                    <li><a href="${context.linkBase}pages/contact.html">Contact</a></li>
                </ul>
            </div>

            <!-- Newsletter -->
            <div class="footer-newsletter">
                <h3>Stay Updated</h3>
                <p>Subscribe for exclusive offers and new releases.</p>
                <form>
                    <input type="email" placeholder="Enter your email" required>
                    <button type="submit">Subscribe</button>
                </form>
            </div>
        </div>

        <!-- Bottom -->
        <div class="footer-bottom">
            <div class="container">
                <p>&copy; 2025 KickStar. All rights reserved.</p>
            </div>
        </div>
    </footer>
    `;

    // Append footer at end of body
    const container = document.querySelector('.container');
    container.insertAdjacentHTML("beforeend", footerTemplate);
});
