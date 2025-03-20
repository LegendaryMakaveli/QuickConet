document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM fully loaded.");

    // Check if Firebase is loaded
    if (typeof firebase === "undefined") {
        console.error("❌ Firebase SDK is not loaded!");
        return;
    }

    // Get elements
    const loginForm = document.getElementById("loginForm");
    const emailField = document.getElementById("email");
    const passwordField = document.getElementById("password");
    const customerBtn = document.getElementById("customerBtn");
    const businessBtn = document.getElementById("businessBtn");

    if (!loginForm || !emailField || !passwordField) {
        console.error("❌ Login form or input fields not found in the DOM.");
        return;
    }

    let selectedRole = "customer"; // Default role

    // Role selection event listeners
    if (customerBtn && businessBtn) {
        function setActiveRole(role) {
            selectedRole = role;
            customerBtn.classList.toggle("active", role === "customer");
            businessBtn.classList.toggle("active", role === "business");
        }

        customerBtn.addEventListener("click", () => setActiveRole("customer"));
        businessBtn.addEventListener("click", () => setActiveRole("business"));
    }

    // Login form submission
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = emailField.value.trim();
        const password = passwordField.value.trim();

        if (!email || !password) {
            alert("⚠️ Please fill in all fields.");
            return;
        }

        console.log("🔄 Attempting login...");

        // Firebase Authentication
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("🔍 Logged in user UID:", user.uid);

                return firebase.firestore().collection("users").doc(user.uid).get()
                    .then((doc) => {
                        return { doc, user };  // ✅ Pass both doc and user
                    });
            })
            .then(({ doc, user }) => {
                if (doc.exists) {
                    const userData = doc.data();
                    console.log("✅ User Data from Firestore:", userData);

                    localStorage.setItem("userData", JSON.stringify(userData));

                    if (userData.userType === "business") {
                        window.location.href = "Businessdashboard.html";
                    } else if (userData.userType === "customer") {
                        window.location.href = "userdashboard.html";
                    } else {
                        alert("⚠️ Unknown user type. Please contact support.");
                    }
                } else {
                    console.warn("⚠️ No Firestore data found for UID:", user.uid);
                    
                    // Offer the user a way to complete their profile instead of just erroring out
                    alert("⚠️ Your account exists but has no profile data. Please complete your profile.");
                    window.location.href = "complete-profile.html"; // Redirect to a profile completion page
                }
            })
            .catch((error) => {
                console.error("❌ Login Error:", error.message);
                alert("Login failed: " + error.message);
            });
    });
});
