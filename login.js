document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const customerBtn = document.getElementById("customerBtn");
    const businessBtn = document.getElementById("businessBtn");

    let selectedRole = "customer"; // Default role

    // Toggle role selection
    customerBtn.addEventListener("click", function () {
        selectedRole = "customer";
        customerBtn.classList.add("active");
        businessBtn.classList.remove("active");
    });

    businessBtn.addEventListener("click", function () {
        selectedRole = "business";
        businessBtn.classList.add("active");
        customerBtn.classList.remove("active");
    });

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = loginForm.querySelector("input[placeholder='Email']").value.trim();
        const password = loginForm.querySelector("input[placeholder='Password']").value.trim();

        console.log("Logging in as:", selectedRole, { email, password });

        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        // Retrieve all users
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Find matching user
        const user = users.find(user => user.email === email && user.userType === selectedRole);

        if (!user || user.password !== password) {
            alert("Invalid email, password, or user type.");
            return;
        }

        // Store logged-in user globally
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        alert("Login successful! Redirecting...");

        // Redirect based on user type
        window.location.href = user.userType === "business" ? "businessdashboard.html" : "userdashboard.html";
    });
});
