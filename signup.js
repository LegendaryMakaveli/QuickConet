document.addEventListener("DOMContentLoaded", function () {
    if (typeof firebase === "undefined") {
        console.error("❌ Firebase SDK is not loaded!");
        return;
    }

    const businessForm = document.getElementById("businessForm");
    const customerForm = document.getElementById("customerForm");
    const businessTab = document.getElementById("businessTab");
    const customerTab = document.getElementById("customerTab");

    function showForm(type) {
        businessForm.classList.add("hidden");
        customerForm.classList.add("hidden");
        businessTab.classList.remove("active");
        customerTab.classList.remove("active");

        if (type === "business") {
            businessForm.classList.remove("hidden");
            businessTab.classList.add("active");
        } else {
            customerForm.classList.remove("hidden");
            customerTab.classList.add("active");
        }
    }

    businessTab.addEventListener("click", () => showForm("business"));
    customerTab.addEventListener("click", () => showForm("customer"));

    document.querySelectorAll(".signup-form").forEach(form => {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            // Get input values
            const fullName = form.querySelector("input[placeholder='Full Name']").value.trim();
            const email = form.querySelector("input[placeholder='Email Address']").value.trim();
            const password = form.querySelector("input[placeholder='Password']").value.trim();
            const confirmPassword = form.querySelector("input[placeholder='Confirm Password']").value.trim();
            const userType = form.id === "businessForm" ? "business" : "customer"; // Fixed userType assignment

            if (!fullName || !email || !password || !confirmPassword) {
                alert("⚠️ Please fill in all fields.");
                return;
            }

            if (password !== confirmPassword) {
                alert("⚠️ Passwords do not match.");
                return;
            }

            // Firebase authentication
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("✅ User registered with UID:", user.uid);
        
                // Store user data in Firestore
                return firebase.firestore().collection("users").doc(user.uid).set({
                    fullName: fullName,
                    email: email,
                    userType: userType,  // Corrected this part
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            })
            .then(() => {
                console.log("✅ User data stored in Firestore.");
                alert("Registration successful! You can now log in.");
                window.location.href = "login.html";
            })
            .catch((error) => {
                console.error("❌ Registration Error:", error.message);
                alert("Registration failed: " + error.message);
            });
        });
    });
});
