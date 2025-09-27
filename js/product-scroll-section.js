document.addEventListener("DOMContentLoaded", () => {
    // const scrollSections = document.querySelectorAll(".product-scroll-section");
        const productList = document.querySelector(".product-scroll");
        const leftBtn = document.getElementById("scrollLeft");
        const rightBtn = document.getElementById("scrollRight");

        const updateScrollButtons = () => {
            leftBtn.classList.toggle("hidden", productList.scrollLeft <= 0);
            rightBtn.classList.toggle(
                "hidden",
                productList.scrollLeft >= productList.scrollWidth - productList.clientWidth - 1
            );
        };

        const scrollAmount = () => {
            const firstCard = productList.querySelector(".product-card");
            return firstCard ? firstCard.offsetWidth + 24 : 300;
        };

        leftBtn.addEventListener("click", () => {
            productList.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
        });

        rightBtn.addEventListener("click", () => {
            productList.scrollBy({ left: scrollAmount(), behavior: "smooth" });
        });

        productList.addEventListener("scroll", () => {
            updateScrollButtons();
        });

        window.addEventListener("load", updateScrollButtons);
        window.addEventListener("resize", updateScrollButtons);
        updateScrollButtons();
});