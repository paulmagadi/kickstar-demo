
// document.addEventListener("DOMContentLoaded", () => {
//     const searchToggle = document.querySelector(".search-toggle");
//     const mobileSearchBar = document.querySelector(".search-bar.mobile");

//     if (searchToggle && mobileSearchBar) {
//         searchToggle.addEventListener("click", () => {
//             mobileSearchBar.classList.toggle("active");
//         });
//     }
// });

// document.addEventListener("DOMContentLoaded", () => {
//     const searchToggle = document.querySelector(".search-toggle");
//     const mobileSearchBar = document.querySelector(".search-bar.mobile");
//     const mobileSearchInput = mobileSearchBar?.querySelector("input[type=search]");

//     if (searchToggle && mobileSearchBar) {
//         searchToggle.addEventListener("click", () => {
//             mobileSearchBar.classList.toggle("active");

//             // If active, focus on the input
//             if (mobileSearchBar.classList.contains("active") && mobileSearchInput) {
//                 setTimeout(() => mobileSearchInput.focus(), 300); 
//                 // timeout matches CSS transition for smooth UX
//             }
//         });
//     }
// });



// Mobile Search Toggle
// document.addEventListener("DOMContentLoaded", () => {
//   const searchToggle = document.querySelector(".header-items i"); // Target the <i> inside button
//   const mobileSearchBar = document.querySelector(".search-bar.mobile");
//   const mobileSearchInput = mobileSearchBar?.querySelector("input[type=search]");

//   if (searchToggle && mobileSearchBar) {
//     searchToggle.parentElement.addEventListener("click", () => {
//       mobileSearchBar.classList.toggle("active");

//       if (mobileSearchBar.classList.contains("active")) {
//         // Change to close icon
//         searchToggle.classList.remove("ri-search-line");
//         searchToggle.classList.add("ri-close-line");

//         if (mobileSearchInput) {
//           setTimeout(() => mobileSearchInput.focus(), 300);
//         }
//       } else {
//         // Change back to search icon
//         searchToggle.classList.remove("ri-close-line");
//         searchToggle.classList.add("ri-search-line");
//       }
//     });
//   }
// });


document.addEventListener("DOMContentLoaded", () => {
    const searchToggle = document.querySelector(".search-toggle");
    const mobileSearchBar = document.querySelector(".search-bar.mobile");
    const mobileSearchInput = mobileSearchBar?.querySelector("input[type=search]");
    const searchClose = mobileSearchBar?.querySelector(".ri-close-line");

    if (searchToggle && mobileSearchBar) {
        searchToggle.addEventListener("click", (e) => {
            e.stopPropagation(); // prevent immediate close
            mobileSearchBar.classList.toggle("active");

            if (mobileSearchBar.classList.contains("active") && mobileSearchInput) {
                setTimeout(() => mobileSearchInput.focus(), 300);
            }
        });
    }

    if (searchClose) {
        searchClose.addEventListener("click", (e) => {
            e.stopPropagation();
            mobileSearchBar.classList.remove("active");
        });
    }

    // Auto-close if click outside
    document.addEventListener("click", (e) => {
        if (
            mobileSearchBar?.classList.contains("active") &&
            !mobileSearchBar.contains(e.target) &&
            !searchToggle.contains(e.target)
        ) {
            mobileSearchBar.classList.remove("active");
        }
    });
});

