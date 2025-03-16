document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("myBusinessList")) {
        displayBusinessListings();
    }

    if (document.getElementById("businessName")) {
        loadBusinessDetails();
        displayReviews();
    }
});

// ✅ Function to display business listings
function displayBusinessListings() {
    let businessList = document.getElementById("myBusinessList");

    if (!businessList) {
        console.error("Error: 'myBusinessList' element not found!");
        return;
    }

    businessList.innerHTML = ""; // Clear previous listings

    let businesses = JSON.parse(localStorage.getItem("businesses")) || [];

    businesses.forEach((business) => {
        let businessItem = document.createElement("div");
        businessItem.classList.add("business-item");

        businessItem.innerHTML = `
            <h3>${business.name}</h3>
            <p><strong>Category:</strong> ${business.category}</p>
            <p><strong>Address:</strong> ${business.address}</p>
            <button onclick="openBusinessDetails(${business.id})">View Details</button>
        `;

        businessList.appendChild(businessItem);
    });
}

// ✅ Function to open business details page
function openBusinessDetails(businessId) {
    let businesses = JSON.parse(localStorage.getItem("businesses")) || [];
    let selectedBusiness = businesses.find(b => b.id === businessId);

    if (selectedBusiness) {
        localStorage.setItem("selectedBusiness", JSON.stringify(selectedBusiness));
        window.location.href = "business-details.html"; // Redirect to details page
    } else {
        console.error("❌ Business not found");
    }
}

// ✅ Function to load and display selected business details
function loadBusinessDetails() {
    const businessData = JSON.parse(localStorage.getItem("selectedBusiness"));

    if (!businessData) {
        console.error("Error: No business selected.");
        return;
    }

    document.getElementById("businessName").textContent = businessData.name;
    document.getElementById("businessCategory").textContent = businessData.category;
    document.getElementById("businessAddress").textContent = businessData.address;
    document.getElementById("businessDetails").textContent = businessData.details;
    document.getElementById("businessPrice").textContent = businessData.price || "Not specified";

    // ✅ Set up WhatsApp and Website links
    const whatsappBtn = document.getElementById("businessWhatsApp");
    if (businessData.whatsapp) {
        whatsappBtn.href = businessData.whatsapp;
        whatsappBtn.style.display = "inline-block";
    } else {
        whatsappBtn.style.display = "none";
    }

    const websiteBtn = document.getElementById("businessWebsite");
    if (businessData.website) {
        websiteBtn.href = businessData.website;
        websiteBtn.style.display = "inline-block";
    } else {
        websiteBtn.style.display = "none";
    }

    // ✅ Display business images
    const imagesContainer = document.getElementById("businessImages");
    imagesContainer.innerHTML = ""; // Clear previous images
    if (businessData.images.length > 0) {
        businessData.images.forEach(imgSrc => {
            let imgElement = document.createElement("img");
            imgElement.src = imgSrc;
            imgElement.classList.add("business-image");
            imagesContainer.appendChild(imgElement);
        });
    } else {
        imagesContainer.innerHTML = "<p>No images available</p>";
    }
}

// ✅ Function to display reviews
function displayReviews() {
    const businessData = JSON.parse(localStorage.getItem("selectedBusiness"));
    if (!businessData) {
        console.error("Error: No business selected.");
        return;
    }

    const reviewsKey = `reviews_${businessData.id}`;
    let reviews = JSON.parse(localStorage.getItem(reviewsKey)) || [];

    const reviewsList = document.getElementById("reviewsList");
    reviewsList.innerHTML = ""; // Clear previous reviews

    if (reviews.length === 0) {
        reviewsList.innerHTML = "<p>No reviews yet. Be the first to leave one!</p>";
        return;
    }

    reviews.forEach((review, index) => {
        let reviewItem = document.createElement("div");
        reviewItem.classList.add("review-item");

        let stars = "⭐".repeat(review.rating) + "☆".repeat(5 - review.rating);
        const reviewDate = new Date(review.timestamp).toLocaleString();

        reviewItem.innerHTML = `
            <strong>${review.name}</strong> <span class="review-date">${reviewDate}</span>
            <p id="reviewText-${index}">${review.text}</p>
            <p class="review-stars">${stars}</p>
            <button class="edit-btn" onclick="editReview(${index})">✏️ Edit</button>
            <button class="delete-btn" onclick="deleteReview(${index})">❌ Delete</button>
        `;

        reviewsList.appendChild(reviewItem);
    });

    updateAverageRating(); // Update rating for this business
}

// ✅ Function to submit a review

document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("businessName")) {
        loadBusinessDetails();
        displayReviews();
    }

    let reviewForm = document.getElementById("reviewForm");
    if (reviewForm) {
        reviewForm.addEventListener("submit", function (event) {
            event.preventDefault();
            submitReview();
        });
    } else {
        console.error("Error: 'reviewForm' not found!");
    }
});

function submitReview() {
    let reviewInput = document.getElementById("reviewText");

    // ✅ Check if the element exists
    if (!reviewInput) {
        console.error("Error: 'reviewText' input field not found!");
        return;
    }

    let businessId = localStorage.getItem("currentBusinessId");
    if (!businessId) {
        console.error("Error: No business ID found in localStorage.");
        return;
    }

    let reviewText = reviewInput.value.trim();
    if (reviewText === "") {
        alert("Please enter a review before submitting.");
        return;
    }

    // ✅ Fetch existing reviews from localStorage
    let reviews = JSON.parse(localStorage.getItem("reviews")) || {};

    // ✅ Ensure reviews array exists for the business
    if (!reviews[businessId]) {
        reviews[businessId] = [];
    }

    // ✅ Add the new review
    reviews[businessId].push(reviewText);
    
    // ✅ Save updated reviews to localStorage
    localStorage.setItem("reviews", JSON.stringify(reviews));

    // ✅ Clear input field
    reviewInput.value = "";

    // ✅ Update UI
    displayReviews();
}

// ✅ Function to edit a review
function editReview(index) {
    const businessData = JSON.parse(localStorage.getItem("selectedBusiness"));
    const reviewsKey = `reviews_${businessData.id}`;
    let reviews = JSON.parse(localStorage.getItem(reviewsKey)) || [];

    const newText = prompt("Edit your review:", reviews[index].text);
    if (newText !== null && newText.trim() !== "") {
        reviews[index].text = newText;
        localStorage.setItem(reviewsKey, JSON.stringify(reviews));
        displayReviews(); // Refresh review list
    }
}

// ✅ Function to delete a review
function deleteReview(index) {
    const businessData = JSON.parse(localStorage.getItem("selectedBusiness"));
    const reviewsKey = `reviews_${businessData.id}`;
    let reviews = JSON.parse(localStorage.getItem(reviewsKey)) || [];

    if (confirm("Are you sure you want to delete this review?")) {
        reviews.splice(index, 1); // Remove from array
        localStorage.setItem(reviewsKey, JSON.stringify(reviews));
        displayReviews(); // Refresh review list
    }
}

// ✅ Function to calculate and display average rating
function updateAverageRating() {
    const businessData = JSON.parse(localStorage.getItem("selectedBusiness"));
    const reviewsKey = `reviews_${businessData.id}`;
    let reviews = JSON.parse(localStorage.getItem(reviewsKey)) || [];

    if (reviews.length === 0) {
        document.getElementById("averageRating").innerHTML = "No ratings yet.";
        return;
    }

    let totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    let average = (totalRating / reviews.length).toFixed(1);
    let stars = "⭐".repeat(Math.round(average)) + "☆".repeat(5 - Math.round(average));

    document.getElementById("averageRating").innerHTML = `Average Rating: ${average} ${stars}`;
}
