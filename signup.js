function showForm(type) {
    document.getElementById("businessForm").classList.add("hidden");
    document.getElementById("customerForm").classList.add("hidden");
    document.getElementById("businessTab").classList.remove("active");
    document.getElementById("customerTab").classList.remove("active");

    if (type === "business") {
        document.getElementById("businessForm").classList.remove("hidden");
        document.getElementById("businessTab").classList.add("active");
    } else {
        document.getElementById("customerForm").classList.remove("hidden");
        document.getElementById("customerTab").classList.add("active");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".signup-form").forEach(form => {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            // Get input values from the specific form
            const fullName = form.querySelector("input[placeholder='Full Name']").value.trim();
            const email = form.querySelector("input[placeholder='Email Address']").value.trim();
            const password = form.querySelector("input[placeholder='Password']").value.trim();
            const confirmPassword = form.querySelector("input[placeholder='Confirm Password']").value.trim();
            const userType = form.id === "businessForm" ? "business" : "customer";

            console.log("Form Data:", { fullName, email, password, confirmPassword, userType });

            if (!fullName || !email || !password || !confirmPassword) {
                alert("Please fill in all fields.");
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            // Get existing users from localStorage
            let users = JSON.parse(localStorage.getItem("users")) || [];

            // Check if the email already exists
            if (users.some(user => user.email === email)) {
                alert("Email is already registered. Please log in.");
                return;
            }

            // Save user data
            const newUser = { fullName, email, password, userType };
            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));

            console.log("User saved successfully:", newUser);

            // Save the current user session
            localStorage.setItem("currentUser", JSON.stringify(newUser));

            // Redirect user based on type
            window.location.href = userType === "business" ? "businessdashboard.html" : "userdashboard.html";
        });
    });
});
