// Initialize Firebase (Ensure Firebase is only initialized once)
if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyCp0HTLV-w6oy8W2Y333_yK3Q6uA9HucpE",
        authDomain: "quickconet.firebaseapp.com",
        projectId: "quickconet",
        storageBucket: "quickconet.firebasestorage.app",
        messagingSenderId: "760043432939",
        appId: "1:760043432939:web:cac068874f7c8a24b307ae",
        measurementId: "G-L36F8YWRR2"
    });
}

// Initialize Firestore
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", function () {
    const businessList = document.getElementById("businessList");
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");

    loadBusinesses();

    // Attach event listeners for filtering
    searchInput.addEventListener("input", filterBusinesses);
    categoryFilter.addEventListener("change", filterBusinesses);
    priceFilter.addEventListener("change", filterBusinesses);

    async function loadBusinesses() {
        try {
            const snapshot = await db.collection("businesses").get();
            let businesses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            displayBusinesses(businesses);
        } catch (error) {
            console.error("❌ Error loading businesses:", error);
        }
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
                <button onclick="viewBusinessDetails('${business.id}')">View More</button>
                <button class="fav-btn" data-id="${business.id}">${isFavorite}</button>
            `;

            businessList.appendChild(businessCard);
        });

        // Attach event listeners for favorite buttons
        document.querySelectorAll(".fav-btn").forEach((btn) => {
            btn.addEventListener("click", function () {
                toggleFavorite(this.dataset.id);
            });
        });
    }

    async function filterBusinesses() {
        try {
            let searchTerm = searchInput.value.toLowerCase();
            let selectedCategory = categoryFilter.value;
            let selectedPrice = priceFilter.value;

            let query = db.collection("businesses");

            if (selectedCategory !== "all") {
                query = query.where("category", "==", selectedCategory);
            }

            if (selectedPrice !== "all") {
                query = query.where("price", "<=", parseInt(selectedPrice));
            }

            const snapshot = await query.get();
            let businesses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            businesses = businesses.filter((business) => {
                return business.name.toLowerCase().includes(searchTerm) || business.category.toLowerCase().includes(searchTerm);
            });

            displayBusinesses(businesses);
        } catch (error) {
            console.error("❌ Error filtering businesses:", error);
        }
    }

    async function checkIfFavorite(businessId) {
        const userId = firebase.auth().currentUser?.uid; 
        if (!userId) return false;

        const doc = await db.collection("favorites").doc(userId).get();
        return doc.exists && doc.data().favorites.includes(businessId);
    }

    async function toggleFavorite(businessId) {
        const userId = firebase.auth().currentUser?.uid; 
        if (!userId) {
            alert("You need to log in to add favorites!");
            return;
        }

        const favRef = db.collection("favorites").doc(userId);
        const doc = await favRef.get();

        let updatedFavorites = [];
        if (doc.exists) {
            updatedFavorites = doc.data().favorites.includes(businessId)
                ? doc.data().favorites.filter(id => id !== businessId)
                : [...doc.data().favorites, businessId];
        } else {
            updatedFavorites.push(businessId);
        }

        await favRef.set({ favorites: updatedFavorites }, { merge: true });
        loadBusinesses(); // Refresh list
    }
});

/**
 * ✅ Updated: Store business ID properly in localStorage and navigate to business-details.html
 */
function viewBusinessDetails(businessId) {
    localStorage.setItem("currentBusinessId", businessId); // Store selected business ID
    window.location.href = "business-details.html"; // Navigate to details page
}
