document.addEventListener("DOMContentLoaded", function () {
    const businessList = document.getElementById("businessList");
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");

    let db;
    const dbVersion = 2; // Increment this version to trigger an upgrade

    // Open IndexedDB
    const dbRequest = indexedDB.open("BusinessDB", dbVersion);

    dbRequest.onupgradeneeded = function (event) {
        console.log("⏳ Upgrading IndexedDB...");
        db = event.target.result;

        if (!db.objectStoreNames.contains("businesses")) {
            let store = db.createObjectStore("businesses", { keyPath: "id", autoIncrement: true });
            store.createIndex("category", "category", { unique: false });
            store.createIndex("price", "price", { unique: false });
            console.log("✅ Object store 'businesses' created.");
        } else {
            console.log("ℹ️ Object store 'businesses' already exists.");
        }
    };

    dbRequest.onsuccess = function (event) {
        console.log("✅ IndexedDB opened successfully.");
        db = event.target.result;

        if (!db.objectStoreNames.contains("businesses")) {
            console.error("❌ Object store 'businesses' not found. Database may need an upgrade.");
            return;
        }

        loadBusinesses();

        // Attach event listeners
        searchInput.addEventListener("input", filterBusinesses);
        categoryFilter.addEventListener("change", filterBusinesses);
        priceFilter.addEventListener("change", filterBusinesses);
    };

    dbRequest.onerror = function () {
        console.error("❌ Error opening IndexedDB");
    };

    function loadBusinesses() {
        if (!db.objectStoreNames.contains("businesses")) {
            console.error("❌ Object store 'businesses' not found. Try refreshing after database upgrade.");
            return;
        }

        let transaction = db.transaction(["businesses"], "readonly");
        let store = transaction.objectStore("businesses");
        let request = store.getAll();

        request.onsuccess = function () {
            displayBusinesses(request.result);
        };

        request.onerror = function () {
            console.error("❌ Error fetching businesses from IndexedDB");
        };
    }

    function displayBusinesses(businesses) {
        businessList.innerHTML = "";
        if (businesses.length === 0) {
            businessList.innerHTML = "<p>No businesses available.</p>";
            return;
        }

        businesses.forEach((business) => {
            let businessCard = document.createElement("div");
            businessCard.classList.add("business-card");

            let firstImage = business.images && business.images.length > 0 ? business.images[0] : "placeholder.jpg";
            let isFavorite = checkIfFavorite(business.id) ? "❤️" : "🤍";

            businessCard.innerHTML = `
                <img src="${firstImage}" alt="Business Image" class="business-image">
                <h3>${business.name}</h3>
                <p><strong>Category:</strong> ${business.category}</p>
                <p><strong>Price:</strong> ₦${business.price}</p>
                <p><strong>Address:</strong> ${business.address}</p>
                <button onclick="viewBusinessDetails(${business.id})">View More</button>
                <button class="fav-btn" data-id="${business.id}">${isFavorite}</button>
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
        if (!db) {
            console.error("❌ Database not initialized yet.");
            return;
        }

        let transaction = db.transaction(["businesses"], "readonly");
        let store = transaction.objectStore("businesses");
        let request = store.getAll();

        request.onsuccess = function () {
            let businesses = request.result;
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
        };

        request.onerror = function () {
            console.error("❌ Error filtering businesses");
        };
    }

    function checkIfFavorite(businessId) {
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        return favorites.includes(businessId);
    }

    function toggleFavorite(businessId) {
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        if (favorites.includes(businessId)) {
            favorites = favorites.filter((id) => id !== businessId);
        } else {
            favorites.push(businessId);
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));
        loadBusinesses(); // Refresh the list
    }
});

function viewBusinessDetails(businessId) {
    const dbRequest = indexedDB.open("BusinessDB", 2);

    dbRequest.onsuccess = function () {
        let db = dbRequest.result;
        if (!db.objectStoreNames.contains("businesses")) {
            console.error("❌ Object store 'businesses' does not exist.");
            return;
        }

        let transaction = db.transaction(["businesses"], "readonly");
        let store = transaction.objectStore("businesses");
        let request = store.get(businessId);

        request.onsuccess = function () {
            if (request.result) {
                localStorage.setItem("selectedBusiness", JSON.stringify(request.result));
                window.location.href = "business-details.html";
            } else {
                console.error("❌ Business not found!");
            }
        };

        request.onerror = function () {
            console.error("❌ Error retrieving business details");
        };
    };
}

const dbVersion = 1;
const dbRequest = indexedDB.open("BusinessDB", dbVersion);

dbRequest.onupgradeneeded = function (event) {
    let db = event.target.result;

    if (!db.objectStoreNames.contains("businesses")) {
        let store = db.createObjectStore("businesses", { keyPath: "id", autoIncrement: true });
        store.createIndex("name", "name", { unique: false });
        store.createIndex("category", "category", { unique: false });
        store.createIndex("price", "price", { unique: false });

        console.log("✅ Object store 'businesses' created.");
    }
};

dbRequest.onsuccess = function () {
    console.log("✅ IndexedDB opened successfully.");
};

dbRequest.onerror = function (event) {
    console.error("❌ Error opening IndexedDB:", event.target.error);
};
