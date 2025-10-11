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


