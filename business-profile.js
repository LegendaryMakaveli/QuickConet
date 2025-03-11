document.addEventListener("DOMContentLoaded", function () {
    const profileForm = document.getElementById("businessProfileForm");
    const profilePicInput = document.getElementById("profilePicInput");
    const profilePic = document.getElementById("profilePic");

    // Load business user data
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser || loggedInUser.userType !== "business") {
        alert("No business user logged in. Redirecting to login...");
        window.location.href = "login.html";
    }

    // Display current business data
    document.getElementById("businessName").value = loggedInUser.fullName;
    document.getElementById("email").value = loggedInUser.email;
    document.getElementById("businessAddress").value = loggedInUser.businessAddress || "";
    document.getElementById("businessContact").value = loggedInUser.businessContact || "";
    document.getElementById("businessDetails").value = loggedInUser.businessDetails || "";
    document.getElementById("businessCategory").value = loggedInUser.businessCategory || "";

    // Load profile picture if exists
    if (loggedInUser.profilePic) {
        profilePic.src = loggedInUser.profilePic;
    }

    // Handle profile picture upload
    profilePicInput.addEventListener("change", function () {
        const file = profilePicInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePic.src = e.target.result;
                loggedInUser.profilePic = e.target.result; // Save as base64
                localStorage.setItem(loggedInUser.email, JSON.stringify(loggedInUser));
                localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    profileForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const businessName = document.getElementById("businessName").value.trim();
        const businessAddress = document.getElementById("businessAddress").value.trim();
        const businessContact = document.getElementById("businessContact").value.trim();
        const businessDetails = document.getElementById("businessDetails").value.trim();
        const businessCategory = document.getElementById("businessCategory").value;
        const newPassword = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        if (!businessName || !businessAddress || !businessContact || !businessDetails || !businessCategory) {
            alert("Please fill in all required fields.");
            return;
        }

        if (newPassword && newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Update business user info
        loggedInUser.fullName = businessName;
        loggedInUser.businessAddress = businessAddress;
        loggedInUser.businessContact = businessContact;
        loggedInUser.businessDetails = businessDetails;
        loggedInUser.businessCategory = businessCategory;
        if (newPassword) {
            loggedInUser.password = newPassword; // Update password only if changed
        }

        // Save updated user data in localStorage
        localStorage.setItem(loggedInUser.email, JSON.stringify(loggedInUser));
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

        alert("Business profile updated successfully!");
        window.location.href = "businessdashboard.html";
    });
});
