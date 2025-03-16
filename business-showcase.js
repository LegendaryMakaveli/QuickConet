document.addEventListener("DOMContentLoaded", function () {
    const businessList = document.getElementById("businessList");
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");

    loadBusinesses();

    // Attach event listeners
    searchInput.addEventListener("input", filterBusinesses);
    categoryFilter.addEventListener("change", filterBusinesses);
    priceFilter.addEventListener("change", filterBusinesses);

    function loadBusinesses() {
        let businesses = JSON.parse(localStorage.getItem("businesses")) || [];
        displayBusinesses(businesses);
    }

    function displayBusinesses(businesses) {
        businessList.innerHTML = "";
        if (businesses.length === 0) {
            businessList.innerHTML = "<p>No businesses available.</p>";
            return;
        }

        businesses.forEach((business, index) => {
            let businessCard = document.createElement("div");
            businessCard.classList.add("business-card");

            let firstImage = business.images && business.images.length > 0 ? business.images[0] : "placeholder.jpg";
            let isFavorite = checkIfFavorite(index) ? "❤️" : "🤍";

            businessCard.innerHTML = `
                <img src="${firstImage}" alt="Business Image" class="business-image">
                <h3>${business.name}</h3>
                <p><strong>Category:</strong> ${business.category}</p>
                <p><strong>Price:</strong> ₦${business.price}</p>
                <p><strong>Address:</strong> ${business.address}</p>
                <button onclick="viewBusinessDetails(${index})">View More</button>
                <button class="fav-btn" data-id="${index}">${isFavorite}</button>
            `;

            businessList.appendChild(businessCard);
        });

        // Attach event listeners for favorite buttons
        document.querySelectorAll(".fav-btn").forEach((btn) => {
            btn.addEventListener("click", function () {
                toggleFavorite(parseInt(this.dataset.id));
            });
        });
    }

    function filterBusinesses() {
        let businesses = JSON.parse(localStorage.getItem("businesses")) || [];
        let searchTerm = searchInput.value.toLowerCase();
        let selectedCategory = categoryFilter.value;
        let selectedPrice = priceFilter.value;

        let filteredBusinesses = businesses.filter((business) => {
            let matchesSearch = business.name.toLowerCase().includes(searchTerm) || business.category.toLowerCase().includes(searchTerm);
            let matchesCategory = selectedCategory === "all" || business.category === selectedCategory;
            let matchesPrice = selectedPrice === "all" || parseInt(business.price) <= parseInt(selectedPrice);
            return matchesSearch && matchesCategory && matchesPrice;
        });

        displayBusinesses(filteredBusinesses);
    }

    function checkIfFavorite(businessIndex) {
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        return favorites.includes(businessIndex);
    }

    function toggleFavorite(businessIndex) {
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        if (favorites.includes(businessIndex)) {
            favorites = favorites.filter((id) => id !== businessIndex);
        } else {
            favorites.push(businessIndex);
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));
        loadBusinesses(); // Refresh the list
    }
});

function viewBusinessDetails(businessIndex) {
    let businesses = JSON.parse(localStorage.getItem("businesses")) || [];
    let selectedBusiness = businesses[businessIndex];

    if (selectedBusiness) {
        localStorage.setItem("selectedBusiness", JSON.stringify(selectedBusiness));
        window.location.href = "business-details.html";
    } else {
        console.error("❌ Business not found!");
    }
}
