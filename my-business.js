document.addEventListener("DOMContentLoaded", function () {
    const businessForm = document.getElementById("businessForm");
    const myBusinessList = document.getElementById("myBusinessList");

    // ✅ Firebase references
    const db = firebase.firestore();
    const storage = firebase.storage();

    // ✅ Load existing businesses from Firestore
    loadMyBusinesses();

    businessForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const businessName = document.getElementById("businessName").value.trim();
        const businessCategory = document.getElementById("businessCategory").value.trim();
        const businessAddress = document.getElementById("businessAddress").value.trim();
        const businessDetails = document.getElementById("businessDetails").value.trim();
        const businessPrice = document.getElementById("businessPrice").value.trim();
        const businessWhatsApp = document.getElementById("businessWhatsApp").value.trim();
        const businessWebsite = document.getElementById("businessWebsite").value.trim();
        const images = document.getElementById("businessImages").files;

        if (!businessName || !businessCategory || !businessAddress) {
            alert("⚠️ Please fill in all required fields.");
            return;
        }

        let imageUrls = [];
        let imagesProcessed = 0;

        if (images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                const imageFile = images[i];
                const storageRef = storage.ref(`business_images/${Date.now()}_${imageFile.name}`);
                const uploadTask = storageRef.put(imageFile);

                uploadTask.on(
                    "state_changed",
                    null,
                    (error) => console.error("❌ Image upload failed:", error),
                    async () => {
                        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                        imageUrls.push(downloadURL);
                        imagesProcessed++;

                        if (imagesProcessed === images.length) {
                            saveBusinessToFirestore(imageUrls);
                        }
                    }
                );
            }
        } else {
            saveBusinessToFirestore(imageUrls);
        }

        function saveBusinessToFirestore(imageUrls) {
            db.collection("businesses")
                .add({
                    name: businessName,
                    category: businessCategory,
                    address: businessAddress,
                    details: businessDetails,
                    price: businessPrice,
                    whatsapp: businessWhatsApp,
                    website: businessWebsite,
                    images: imageUrls,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .then(() => {
                    alert("✅ Business posted successfully!");
                    businessForm.reset();
                    loadMyBusinesses(); // Refresh list
                })
                .catch((error) => console.error("❌ Error adding business:", error));
        }
    });

    function loadMyBusinesses() {
        myBusinessList.innerHTML = "<p>Loading businesses...</p>";

        db.collection("businesses")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => {
                myBusinessList.innerHTML = "";

                if (snapshot.empty) {
                    myBusinessList.innerHTML = "<p>No business listings found.</p>";
                    return;
                }

                snapshot.forEach((doc) => {
                    let business = doc.data();
                    let businessId = doc.id;
                    let firstImage = business.images.length > 0 ? business.images[0] : "placeholder.jpg";

                    let businessCard = document.createElement("div");
                    businessCard.classList.add("business-card");

                    businessCard.innerHTML = `
                        <img src="${firstImage}" alt="Business Image" class="business-image">
                        <h3>${business.name}</h3>
                        <p><strong>Category:</strong> ${business.category}</p>
                        <p><strong>Price:</strong> ₦${business.price || "Not specified"}</p>
                        <p><strong>Address:</strong> ${business.address}</p>
                        <button onclick="deleteBusiness('${businessId}', ${JSON.stringify(business.images)})">❌ Delete</button>
                    `;

                    myBusinessList.appendChild(businessCard);
                });
            });
    }
});

// ✅ Function to delete a business from Firestore and Storage
function deleteBusiness(businessId, imageUrls) {
    if (!confirm("Are you sure you want to delete this business?")) return;

    const db = firebase.firestore();
    const storage = firebase.storage();

    db.collection("businesses")
        .doc(businessId)
        .delete()
        .then(() => {
            alert("❌ Business deleted successfully!");
            imageUrls.forEach((url) => {
                let imageRef = storage.refFromURL(url);
                imageRef.delete().catch((error) => console.error("❌ Error deleting image:", error));
            });
        })
        .catch((error) => console.error("❌ Error deleting business:", error));
}
