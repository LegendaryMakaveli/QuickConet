document.addEventListener("DOMContentLoaded", function () {
    // Ensure Firebase SDK is loaded
    if (typeof firebase === "undefined") {
        console.error("❌ Firebase SDK is not loaded!");
        return;
    }

    // Ensure Firebase is initialized properly
    if (!firebase.apps.length) {
        console.error("❌ Firebase not initialized!");
        return;
    }

    console.log("✅ Firebase is ready!");

    const auth = firebase.auth();
    const firestore = firebase.firestore();

    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log("User logged in:", user.uid);

            // Ensure the elements exist before modifying them
            const userNameElement = document.getElementById("userName");
            const profilePicElement = document.getElementById("dashboardProfilePic");

            if (!userNameElement || !profilePicElement) {
                console.error("❌ Required elements not found in the DOM.");
                return;
            }

            // Fetch user data from Firestore
            firestore.collection("users").doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
                        userNameElement.innerText = userData.fullName || "User";
                        profilePicElement.src = userData.profilePic || "https://via.placeholder.com/150";
                    } else {
                        console.log("⚠️ No user data found.");
                    }
                })
                .catch((error) => {
                    console.error("❌ Error fetching user data:", error);
                });
        } else {
            console.log("⚠️ No user is signed in. Redirecting...");
            window.location.href = "login.html"; // Redirect to login if not signed in
        }
    });
});
