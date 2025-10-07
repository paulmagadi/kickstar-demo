document.addEventListener("DOMContentLoaded", () => {
  const scrollSections = document.querySelectorAll(".products-scroll-container");

  scrollSections.forEach(section => {
    const productList = section.querySelector(".product-scroll");
    const leftBtn = section.querySelector(".scroll-left");
    const rightBtn = section.querySelector(".scroll-right");

    if (!productList) return;

    const getScrollAmount = () => {
      const firstCard = productList.querySelector(".product-card");
      return firstCard ? firstCard.offsetWidth + 24 : 300; // 24px gap
    };

    const updateScrollButtons = () => {
      const noScrollNeeded = productList.scrollWidth <= productList.clientWidth + 1;

      if (noScrollNeeded) {
        leftBtn?.classList.add("hidden");
        rightBtn?.classList.add("hidden");
        return;
      }

      const atStart = productList.scrollLeft <= 0;
      const atEnd = productList.scrollLeft >= productList.scrollWidth - productList.clientWidth - 1;

      leftBtn?.classList.toggle("hidden", atStart);
      rightBtn?.classList.toggle("hidden", atEnd);
    };

    leftBtn?.addEventListener("click", () => {
      productList.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
    });

    rightBtn?.addEventListener("click", () => {
      productList.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
    });

    // Throttled scroll event
    let scrollTimeout;
    productList.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateScrollButtons, 50);
    });

    window.addEventListener("resize", updateScrollButtons);
    updateScrollButtons();
  });
});
