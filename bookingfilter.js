document.addEventListener("DOMContentLoaded", function () {
    const bookingForm = document.getElementById("bookingForm");
    const serviceSelect = document.getElementById("profession");
    const businessResults = document.getElementById("businessResults");

    // Dummy Data: Businesses Registered
    const businesses = [
        { name: "John & Co Law Firm", service: "lawyer", rating: 4.8 },
        { name: "Speedy Auto Repairs", service: "mechanic", rating: 4.5 },
        { name: "Fresh Cuts Barber Shop", service: "barber", rating: 4.7 },
        { name: "Elite Tailoring", service: "tailor", rating: 4.9 },
    ];

    // Function to filter businesses
    document.getElementById("profession").addEventListener("change", function() {
        const selectedService = this.value;
        showBusinesses(selectedService);
    });
    
    function showBusinesses(service) {
        const businessResults = document.getElementById("businessResults");
        businessResults.innerHTML = ""; // Clear previous results
    
        const filtered = businesses.filter(b => b.service === service);
    
        if (filtered.length === 0) {
            businessResults.innerHTML = "<li>No businesses found for this service.</li>";
        } else {
            filtered.forEach((business, index) => {
                const li = document.createElement("li");
                li.innerHTML = `
                        <strong>${business.name}</strong> - ⭐ ${business.rating}
                        <button class="book-btn" onclick="bookService('${business.name}', '${service}')">Book Now</button>
            `;
                li.style.animationDelay = `${index * 0.1}s`; // Staggered animation
                businessResults.appendChild(li);
            });
        }
    }
    
    

    // Handle Form Submission
    bookingForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const selectedService = serviceSelect.value;

        if (selectedService) {
            showBusinesses(selectedService);
        } else {
            businessResults.innerHTML = "<li>Please select a service.</li>";
        }
    });
});

// Function to handle booking
function bookService(businessName, service) {
    alert(`Booking request sent to ${businessName} for ${service}.`);
    // Here you can redirect to a booking page or store booking details
}

// Function to redirect user to booking page with pre-filled details
function redirectToBooking(businessName, service) {
    // Store selected business and service in session storage
    sessionStorage.setItem("selectedBusiness", businessName);
    sessionStorage.setItem("selectedService", service);
    
    // Redirect to the booking page
    window.location.href = "booking.html";
}
