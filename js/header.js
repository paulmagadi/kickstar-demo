// Mobile Search Toggle
document.addEventListener("DOMContentLoaded", () => {
  const searchToggle = document.querySelector(".search-toggle"); // Target the <i> inside button
  const mobileSearchBar = document.querySelector(".search-bar.mobile");
  const mobileSearchInput = mobileSearchBar?.querySelector("input[type=search]");

  if (searchToggle && mobileSearchBar) {
    searchToggle.parentElement.addEventListener("click", () => {
      mobileSearchBar.classList.toggle("active");

      if (mobileSearchBar.classList.contains("active")) {
        // Change to close icon
        searchToggle.classList.remove("ri-search-line");
        searchToggle.classList.add("ri-close-line");
        searchToggle.attributes.title.value = "Close Search";

        if (mobileSearchInput) {
          setTimeout(() => mobileSearchInput.focus(), 300);
        }
      } else {
        // Change back to search icon
        searchToggle.classList.remove("ri-close-line");
        searchToggle.classList.add("ri-search-line");
        searchToggle.attributes.title.value = "Open Search";
      }
    });
  }
});