document.addEventListener("DOMContentLoaded", function () {
    const business = JSON.parse(localStorage.getItem("selectedBusiness"));

    if (!business) {
        alert("Business details not found.");
        window.location.href = "business-showcase.html"; // Redirect back
        return;
    }

    // Populate business details
    document.getElementById("businessName").textContent = business.businessName;
    document.getElementById("businessCategory").textContent = business.businessCategory;
    document.getElementById("businessAddress").textContent = business.businessAddress;
    document.getElementById("businessDetails").textContent = business.businessDetails;
    document.getElementById("businessPrice").textContent = business.businessPrice || "Not Available";

    // Populate WhatsApp and Website Links
    document.getElementById("businessWhatsApp").href = business.businessWhatsApp 
        ? `https://wa.me/${business.businessWhatsApp.replace(/\D/g, "")}`
        : "#";
    document.getElementById("businessWebsite").href = business.businessWebsite || "#";
    if (!business.businessWebsite) {
        document.getElementById("businessWebsite").style.display = "none";
    }

    // Display multiple images
    const imagesContainer = document.getElementById("businessImagesContainer");
    imagesContainer.innerHTML = ""; // Clear existing content
    if (business.businessImages && business.businessImages.length > 0) {
        business.businessImages.forEach(imageSrc => {
            const img = document.createElement("img");
            img.src = imageSrc;
            img.classList.add("business-image");
            imagesContainer.appendChild(img);
        });
    } else {
        imagesContainer.innerHTML = "<p>No images available.</p>";
    }

    // Load customer reviews
    loadReviews(business.businessName);
});

function loadReviews(businessName) {
    const reviews = JSON.parse(localStorage.getItem("reviews")) || {};
    const reviewsList = document.getElementById("reviewsList");
    reviewsList.innerHTML = "";

    const businessReviews = reviews[businessName] || [];
    if (businessReviews.length === 0) {
        reviewsList.innerHTML = "<p>No reviews yet.</p>";
    } else {
        businessReviews.forEach(review => {
            let reviewDiv = document.createElement("div");
            reviewDiv.classList.add("review");
            reviewDiv.innerHTML = `
                <p><strong>Rating:</strong> ${"⭐".repeat(review.rating)}</p>
                <p>${review.text}</p>
            `;
            reviewsList.appendChild(reviewDiv);
        });
    }
}

document.getElementById("reviewForm").addEventListener("submit", function (e) {
    e.preventDefault();
    
    const business = JSON.parse(localStorage.getItem("selectedBusiness"));
    if (!business) return;

    const rating = parseInt(document.getElementById("rating").value);
    const reviewText = document.getElementById("reviewText").value.trim();
    if (!reviewText) {
        alert("Please enter a review.");
        return;
    }

    const reviews = JSON.parse(localStorage.getItem("reviews")) || {};
    if (!reviews[business.businessName]) {
        reviews[business.businessName] = [];
    }
    reviews[business.businessName].push({ rating, text: reviewText });

    localStorage.setItem("reviews", JSON.stringify(reviews));

    loadReviews(business.businessName);
    document.getElementById("reviewForm").reset();
});
