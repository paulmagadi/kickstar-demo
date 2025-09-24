document.addEventListener("DOMContentLoaded", () => {
document.querySelectorAll(".product-card").forEach((card) => {
    const mainImage = card.querySelector(".product-img");
    const swatches = card.querySelectorAll(".swatch");
    const container = card.querySelector(".swatches");
    const leftBtn = card.querySelector(".swatch-scroll-left");
    const rightBtn = card.querySelector(".swatch-scroll-right");

    const getScrollAmount = () => swatches[0]?.offsetWidth + 10;

    function updateScrollButtons() {
        if (!container) return;
        const { scrollLeft, scrollWidth, clientWidth } = container;
        leftBtn?.classList.toggle("hidden", scrollLeft <= 0);
        rightBtn?.classList.toggle("hidden", scrollLeft >= scrollWidth - clientWidth - 1);
    }

    swatches.forEach((swatch) => {
        swatch.addEventListener("click", () => {
            mainImage.style.opacity = 0;
            setTimeout(() => {
                mainImage.src = swatch.src;
                mainImage.dataset.default = swatch.src;
                mainImage.style.opacity = 1;
            }, 150);

            swatches.forEach(s => s.classList.remove("active"));
            swatch.classList.add("active");
        });
    });

    leftBtn?.addEventListener("click", () => {
        container.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
    });

    rightBtn?.addEventListener("click", () => {
        container.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
    });

    container?.addEventListener("scroll", () => {
        clearTimeout(container._scrollTimeout);
        container._scrollTimeout = setTimeout(updateScrollButtons, 100);
    });

    window.addEventListener("resize", updateScrollButtons);
    updateScrollButtons();
});
});