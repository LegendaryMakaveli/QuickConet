document.addEventListener("DOMContentLoaded", function () {
    const businessId = parseInt(localStorage.getItem("selectedBusinessId"));
    if (isNaN(businessId)) {
        alert("Business details not found.");
        window.location.href = "business-showcase.html"; // Redirect back
        return;
    }

    const dbRequest = indexedDB.open("BusinessDB", 1);
    dbRequest.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("businesses", "readonly");
        const store = transaction.objectStore("businesses");
        const getRequest = store.get(businessId);

        getRequest.onsuccess = function () {
            const business = getRequest.result;
            if (!business) {
                alert("Business details not found.");
                window.location.href = "business-showcase.html";
                return;
            }

            displayBusinessDetails(business);
        };
    };
});

// Function to display business details
function displayBusinessDetails(business) {
    document.getElementById("businessName").textContent = business.name;
    document.getElementById("businessCategory").textContent = business.category;
    document.getElementById("businessAddress").textContent = business.address;
    document.getElementById("businessDetails").textContent = business.details;
    document.getElementById("businessPrice").textContent = business.price || "Not Available";

    // WhatsApp and Website Links
    const whatsappLink = document.getElementById("businessWhatsApp");
    whatsappLink.href = business.whatsapp ? `https://wa.me/${business.whatsapp.replace(/\D/g, "")}` : "#";
    document.getElementById("businessWebsite").href = business.website || "#";
    
    if (!business.website) {
        document.getElementById("businessWebsite").style.display = "none";
    }

    // Display images with slider
    setupImageSlider(business.images);

    // Load reviews from IndexedDB
    loadReviews(business.id);

    // Check if this business is already in favorites
    checkFavoriteStatus(business.id);
}

// Function to handle image slider
function setupImageSlider(images) {
    const imagesContainer = document.getElementById("businessImagesContainer");
    imagesContainer.innerHTML = "";

    if (images.length > 0) {
        let index = 0;
        const img = document.createElement("img");
        img.src = images[index];
        img.classList.add("business-image");
        imagesContainer.appendChild(img);

        const prevBtn = document.createElement("button");
        prevBtn.textContent = "◀";
        prevBtn.onclick = () => {
            index = (index - 1 + images.length) % images.length;
            img.src = images[index];
        };

        const nextBtn = document.createElement("button");
        nextBtn.textContent = "▶";
        nextBtn.onclick = () => {
            index = (index + 1) % images.length;
            img.src = images[index];
        };

        imagesContainer.prepend(prevBtn);
        imagesContainer.appendChild(nextBtn);
    } else {
        imagesContainer.innerHTML = "<p>No images available.</p>";
    }
}

// Function to load reviews from IndexedDB
function loadReviews(businessId) {
    const dbRequest = indexedDB.open("BusinessDB", 1);
    dbRequest.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("reviews", "readonly");
        const store = transaction.objectStore("reviews");
        const request = store.get(businessId);

        request.onsuccess = function () {
            const reviews = request.result ? request.result.reviews : [];
            displayReviews(reviews);
        };
    };
}

// Function to display reviews
function displayReviews(reviews) {
    const reviewsList = document.getElementById("reviewsList");
    reviewsList.innerHTML = reviews.length > 0 
        ? reviews.map(review => `<div class="review"><p><strong>Rating:</strong> ${"⭐".repeat(review.rating)}</p><p>${review.text}</p></div>`).join("")
        : "<p>No reviews yet.</p>";
}

// Submit review form
document.getElementById("reviewForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const rating = parseInt(document.getElementById("rating").value);
    const reviewText = document.getElementById("reviewText").value.trim();
    if (!reviewText) {
        alert("Please enter a review.");
        return;
    }

    const businessId = parseInt(localStorage.getItem("selectedBusinessId"));
    const dbRequest = indexedDB.open("BusinessDB", 1);
    
    dbRequest.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("reviews", "readwrite");
        const store = transaction.objectStore("reviews");

        store.get(businessId).onsuccess = function (event) {
            const existingReviews = event.target.result || { id: businessId, reviews: [] };
            existingReviews.reviews.push({ rating, text: reviewText });

            store.put(existingReviews);
            loadReviews(businessId);
            document.getElementById("reviewForm").reset();
        };
    };
});

// Favorite business
document.getElementById("favoriteBtn").addEventListener("click", function () {
    const businessId = parseInt(localStorage.getItem("selectedBusinessId"));
    const dbRequest = indexedDB.open("BusinessDB", 1);
    
    dbRequest.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("favorites", "readwrite");
        const store = transaction.objectStore("favorites");

        store.get(businessId).onsuccess = function (event) {
            if (event.target.result) {
                store.delete(businessId);
                document.getElementById("favoriteBtn").textContent = "Add to Favorites";
            } else {
                store.put({ id: businessId });
                document.getElementById("favoriteBtn").textContent = "Remove from Favorites";
            }
        };
    };
});

// Check if business is favorited
function checkFavoriteStatus(businessId) {
    const dbRequest = indexedDB.open("BusinessDB", 1);
    
    dbRequest.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("favorites", "readonly");
        const store = transaction.objectStore("favorites");

        store.get(businessId).onsuccess = function (event) {
            document.getElementById("favoriteBtn").textContent = event.target.result ? "Remove from Favorites" : "Add to Favorites";
        };
    };
}
