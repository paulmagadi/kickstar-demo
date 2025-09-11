const productListInstance = document.querySelector('.product-list');

let productCard = `<div class="product-card">
                    <a href="#" title="View product">
                        <div class="product-image-wrapper">
                            <div class="product-image">
                                <img src="../images/1.png" class="product-img" alt="product" />
                            </div>
                        </div>
                    </a>

                    <div class="product-info">
                        <a href="#" title="Giannis Freak 4 Basketball Shoes">
                            <div class="product-title">Giannis Freak 4 Basketball Shoes</div>
                        </a>

                        <div class="product-price">
                            <span class="sale-price">KES 2000 </span>
                            <span class="price original-price"><del>KES <del>2500</del></del></span>

                        </div>
                        <br>
                        <div class="swatch-wrapper">
                            <div class="swatch-scroll-btn swatch-scroll-left hidden">&#10094;</div>
                            <div class="swatches">
                                <img src="../images/1.png" alt="Red" title="Red" class="swatch active" />
                                <img src="../images/2.png" alt="Blue" title="Blue" class="swatch" />
                                <img src="../images/3.jpg" alt="Green" title="Green" class="swatch" />
                                <img src="../images/4.jpg" alt="Yellow" title="Yellow" class="swatch" />
                            </div>
                            <div class="swatch-scroll-btn swatch-scroll-right">&#10095;</div>
                        </div>
                    </div>

                </div>`;

for (let i = 0; i < 10; i++) {
    productListInstance.innerHTML += productCard;
}