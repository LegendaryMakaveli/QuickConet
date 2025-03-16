// Get the scroll button
const scrollTopBtn = document.getElementById("scrollTopBtn");

// Function to check scroll position and show/hide the button
function toggleScrollButton() {
    let scrollPosition = window.scrollY || document.documentElement.scrollTop;

    if (scrollPosition > 300) {
        scrollTopBtn.style.display = "block";
    } else {
        scrollTopBtn.style.display = "none";
    }
}

// Event listener for scrolling (works on both desktop & mobile)
window.addEventListener("scroll", toggleScrollButton);
window.addEventListener("touchmove", toggleScrollButton); // For mobile touch scrolling

// Scroll to the top smoothly when clicked
scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

