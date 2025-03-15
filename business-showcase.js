document.addEventListener("DOMContentLoaded", function () {
    const businessList = document.getElementById("businessList");
    const businesses = JSON.parse(localStorage.getItem("businesses")) || [];

    if (businesses.length === 0) {
        businessList.innerHTML = "<p>No businesses available.</p>";
        return;
    }

    businesses.forEach((business, index) => {
        let businessCard = document.createElement("div");
        businessCard.classList.add("business-card");

        // Fix: Ensure images exist
        let firstImage = business.images && business.images.length > 0 ? business.images[0] : "placeholder.jpg";

        businessCard.innerHTML = `
            <img src="${firstImage}" alt="Business Image" class="business-image">
            <h3>${business.name}</h3>
            <p><strong>Category:</strong> ${business.category}</p>
            <p><strong>Address:</strong> ${business.address}</p>
            <button onclick="viewBusinessDetails(${index})">View More</button>
        `;

        businessList.appendChild(businessCard);
    });
});

function viewBusinessDetails(index) {
    const businesses = JSON.parse(localStorage.getItem("businesses")) || [];
    localStorage.setItem("selectedBusiness", JSON.stringify(businesses[index]));
    window.location.href = "business-details.html";
}
