document.addEventListener("DOMContentLoaded", function () {
    const profileForm = document.getElementById("userProfileForm");
    const profilePicInput = document.getElementById("profilePicInput");
    const profilePic = document.getElementById("profilePic");

    // Load user data
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser || loggedInUser.userType !== "customer") {
        alert("No user logged in. Redirecting to login...");
        window.location.href = "login.html";
    }

    // Display current user data
    document.getElementById("fullName").value = loggedInUser.fullName;
    document.getElementById("email").value = loggedInUser.email;
    document.getElementById("address").value = loggedInUser.address || "";
    document.getElementById("contact").value = loggedInUser.contact || "";
    document.getElementById("bio").value = loggedInUser.bio || "";

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

        const fullName = document.getElementById("fullName").value.trim();
        const address = document.getElementById("address").value.trim();
        const contact = document.getElementById("contact").value.trim();
        const bio = document.getElementById("bio").value.trim();
        const newPassword = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        if (!fullName || !address || !contact || !bio) {
            alert("Please fill in all required fields.");
            return;
        }

        if (newPassword && newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Update user info
        loggedInUser.fullName = fullName;
        loggedInUser.address = address;
        loggedInUser.contact = contact;
        loggedInUser.bio = bio;
        if (newPassword) {
            loggedInUser.password = newPassword; // Update password only if changed
        }

        // Save updated user data in localStorage
        localStorage.setItem(loggedInUser.email, JSON.stringify(loggedInUser));
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

        window.location.href = "userdashboard.html";
    });
});
