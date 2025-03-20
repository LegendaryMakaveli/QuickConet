import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCp0HTLV-w6oy8W2Y333_yK3Q6uA9HucpE",
    authDomain: "quickconet.firebaseapp.com",
    projectId: "quickconet",
    storageBucket: "quickconet.firebasestorage.app",
    messagingSenderId: "760043432939",
    appId: "1:760043432939:web:cac068874f7c8a24b307ae",
    measurementId: "G-L36F8YWRR2"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Function to load business details
export async function loadBusinessDetails() {
    const businessId = localStorage.getItem("currentBusinessId");

    if (!businessId) {
        console.error("❌ Error: No business ID found.");
        alert("No business selected. Redirecting to listings...");
        window.location.href = "business-showcase.html"; // Redirect to main listing
        return;
    }

    const docRef = doc(db, "businesses", businessId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const businessData = docSnap.data();

        document.getElementById("businessName").textContent = businessData.name;
        document.getElementById("businessCategory").textContent = businessData.category;
        document.getElementById("businessAddress").textContent = businessData.address;
        document.getElementById("businessDetails").textContent = businessData.details;
        document.getElementById("businessPrice").textContent = businessData.price || "Not specified";

        document.getElementById("businessWhatsApp").href = businessData.whatsapp || "#";
        document.getElementById("businessWebsite").href = businessData.website || "#";

        const imagesContainer = document.getElementById("businessImages");
        imagesContainer.innerHTML = "";

        if (businessData.images && businessData.images.length > 0) {
            businessData.images.forEach(imgSrc => {
                let imgElement = document.createElement("img");
                imgElement.src = imgSrc;
                imgElement.classList.add("business-image");
                imagesContainer.appendChild(imgElement);
            });
        } else {
            imagesContainer.innerHTML = "<p>No images available</p>";
        }
    } else {
        console.error("❌ Business not found in database.");
    }
}

// ✅ Function to display reviews
export async function displayReviews() {
    const businessId = localStorage.getItem("currentBusinessId");

    if (!businessId) {
        console.error("❌ Error: No business ID found.");
        return;
    }

    const docRef = doc(db, "businesses", businessId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        let businessData = docSnap.data();
        let reviews = businessData.reviews || [];

        const reviewsList = document.getElementById("reviewsList");
        reviewsList.innerHTML = "";

        if (reviews.length === 0) {
            reviewsList.innerHTML = "<p>No reviews yet. Be the first to leave one!</p>";
            return;
        }

        reviews.forEach(review => {
            let reviewItem = document.createElement("div");
            reviewItem.classList.add("review-item");

            let stars = "⭐".repeat(review.rating) + "☆".repeat(5 - review.rating);
            const reviewDate = new Date(review.timestamp).toLocaleString();

            reviewItem.innerHTML = `
                <strong>${review.name}</strong> <span class="review-date">${reviewDate}</span>
                <p>${review.text}</p>
                <p class="review-stars">${stars}</p>
            `;

            reviewsList.appendChild(reviewItem);
        });
    }
}
