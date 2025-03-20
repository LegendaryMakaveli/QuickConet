document.addEventListener("DOMContentLoaded", function () {
    if (typeof firebase === "undefined") {
        console.error("❌ Firebase SDK is not loaded!");
        return;
    }

    const auth = firebase.auth();
    const db = firebase.firestore();
    const form = document.getElementById("completeProfileForm");
    const emailField = document.getElementById("email");
    const fullNameField = document.getElementById("fullName");
    const userTypeField = document.getElementById("userType");

    // Get current user
    auth.onAuthStateChanged(user => {
        if (user) {
            emailField.value = user.email; // Prefill email
        } else {
            alert("⚠️ You are not logged in.");
            window.location.href = "login.html";
        }
    });

    // Handle form submission
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const fullName = fullNameField.value.trim();
        const userType = userTypeField.value;

        if (!fullName) {
            alert("⚠️ Please enter your full name.");
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            alert("⚠️ No authenticated user found.");
            return;
        }

        // Save data to Firestore
        db.collection("users").doc(user.uid).set({
            fullName: fullName,
            email: user.email,
            userType: userType,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }) // Merge ensures we don't overwrite existing data
        .then(() => {
            alert("✅ Profile completed successfully!");

            // Redirect user to the correct dashboard
            if (userType === "business") {
                window.location.href = "Businessdashboard.html";
            } else {
                window.location.href = "userdashboard.html";
            }
        })
        .catch(error => {
            console.error("❌ Error updating profile:", error.message);
            alert("Error saving profile: " + error.message);
        });
    });
});