document.addEventListener("DOMContentLoaded", function () {
    const businessForm = document.getElementById("businessForm");
    const myBusinessList = document.getElementById("myBusinessList");

    // Load existing businesses from localStorage on page load
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

        let imageArray = [];
        let imagesProcessed = 0;

        if (images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                const reader = new FileReader();
                reader.readAsDataURL(images[i]);

                reader.onload = function (e) {
                    imageArray.push(e.target.result);
                    imagesProcessed++;

                    if (imagesProcessed === images.length) {
                        saveBusinessListing(imageArray);
                    }
                };
            }
        } else {
            saveBusinessListing(imageArray);
        }

        function saveBusinessListing(imageArray) {
            let newBusiness = {
                id: Date.now(), // Unique ID using timestamp
                name: businessName,
                category: businessCategory,
                address: businessAddress,
                details: businessDetails,
                price: businessPrice,
                whatsapp: businessWhatsApp,
                website: businessWebsite,
                images: imageArray
            };

            let businesses = JSON.parse(localStorage.getItem("businesses")) || [];
            businesses.push(newBusiness);
            localStorage.setItem("businesses", JSON.stringify(businesses));

            alert("✅ Business posted successfully!");
            businessForm.reset();
            loadMyBusinesses(); // Refresh list
        }
    });

    function loadMyBusinesses() {
        myBusinessList.innerHTML = "";
        let businesses = JSON.parse(localStorage.getItem("businesses")) || [];

        if (businesses.length === 0) {
            myBusinessList.innerHTML = "<p>No business listings found.</p>";
            return;
        }

        businesses.forEach((business) => {
            let businessCard = document.createElement("div");
            businessCard.classList.add("business-card");

            let firstImage = business.images.length > 0 ? business.images[0] : "placeholder.jpg";

            businessCard.innerHTML = `
                <img src="${firstImage}" alt="Business Image" class="business-image">
                <h3>${business.name}</h3>
                <p><strong>Category:</strong> ${business.category}</p>
                <p><strong>Price:</strong> ₦${business.price}</p>
                <p><strong>Address:</strong> ${business.address}</p>
                <button onclick="deleteBusiness(${business.id})">❌ Delete</button>
            `;

            myBusinessList.appendChild(businessCard);
        });
    }
});

// Function to delete a business from localStorage
function deleteBusiness(businessId) {
    let businesses = JSON.parse(localStorage.getItem("businesses")) || [];
    businesses = businesses.filter((business) => business.id !== businessId);
    localStorage.setItem("businesses", JSON.stringify(businesses));
    alert("❌ Business deleted successfully!");
    location.reload();
}
