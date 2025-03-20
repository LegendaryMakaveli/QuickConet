document.addEventListener("DOMContentLoaded", async function () {
    const profileForm = document.getElementById("businessProfileForm");
    const profilePicInput = document.getElementById("profilePicInput");
    const profilePic = document.getElementById("profilePic");

    // Ensure Firebase is properly initialized
    if (!firebase.apps.length) {
        console.error("❌ Firebase not initialized!");
        return;
    }

    // Firebase references
    const auth = firebase.auth();
    const db = firebase.firestore();
    const storage = firebase.storage();

    let currentUser;

    // Check if a user is logged in
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            await loadUserProfile(user.uid);
        } else {
            alert("No business user logged in. Redirecting to login...");
            window.location.href = "login.html";
        }
    });

    // Load user profile data from Firestore
    async function loadUserProfile(userId) {
        try {
            const userDoc = await db.collection("businessUsers").doc(userId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();

                document.getElementById("businessName").value = userData.fullName || "";
                document.getElementById("email").value = userData.email || "";
                document.getElementById("businessAddress").value = userData.businessAddress || "";
                document.getElementById("businessContact").value = userData.businessContact || "";
                document.getElementById("businessDetails").value = userData.businessDetails || "";
                document.getElementById("businessCategory").value = userData.businessCategory || "";

                if (userData.profilePic) {
                    profilePic.src = userData.profilePic;
                } else {
                    profilePic.src = "default-avatar.png"; // Fallback image
                }
            } else {
                console.log("❌ No business user document found.");
                await createEmptyProfile(userId);
            }
        } catch (error) {
            console.error("❌ Error loading profile:", error);
            alert("Failed to load profile. Please try again.");
        }
    }

    // Create an empty user profile if Firestore document doesn't exist
    async function createEmptyProfile(userId) {
        try {
            await db.collection("businessUsers").doc(userId).set({
                fullName: "",
                email: currentUser.email,
                businessAddress: "",
                businessContact: "",
                businessDetails: "",
                businessCategory: "",
                profilePic: "default-avatar.png",
            });

            console.log("✅ Empty profile created.");
            await loadUserProfile(userId);
        } catch (error) {
            console.error("❌ Error creating empty profile:", error);
        }
    }

    // Handle profile picture upload
    profilePicInput.addEventListener("change", function () {
        const file = profilePicInput.files[0];
        if (!file) return;

        const storageRef = storage.ref(`profilePictures/${currentUser.uid}`);
        const uploadTask = storageRef.put(file);

        uploadTask.on(
            "state_changed",
            null,
            (error) => {
                console.error("❌ Upload failed:", error);
                alert("Failed to upload image.");
            },
            async () => {
                const downloadURL = await storageRef.getDownloadURL();
                profilePic.src = downloadURL;

                // Update profile picture in Firestore
                try {
                    await db.collection("businessUsers").doc(currentUser.uid).update({
                        profilePic: downloadURL,
                    });
                    alert("✅ Profile picture updated!");
                } catch (error) {
                    console.error("❌ Error updating profile picture:", error);
                }
            }
        );
    });

    // Handle form submission
    profileForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const businessName = document.getElementById("businessName").value.trim();
        const businessAddress = document.getElementById("businessAddress").value.trim();
        const businessContact = document.getElementById("businessContact").value.trim();
        const businessDetails = document.getElementById("businessDetails").value.trim();
        const businessCategory = document.getElementById("businessCategory").value.trim();
        const newPassword = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        if (!businessName || !businessAddress || !businessContact || !businessDetails || !businessCategory) {
            alert("⚠️ Please fill in all required fields.");
            return;
        }

        if (newPassword && newPassword !== confirmPassword) {
            alert("⚠️ Passwords do not match.");
            return;
        }

        try {
            // Ensure document exists before updating
            const userDocRef = db.collection("businessUsers").doc(currentUser.uid);
            const userDoc = await userDocRef.get();

            if (!userDoc.exists) {
                console.log("❌ No existing user document found, creating one...");
                await createEmptyProfile(currentUser.uid);
            }

            // Update Firestore profile data
            await userDocRef.update({
                fullName: businessName,
                businessAddress: businessAddress,
                businessContact: businessContact,
                businessDetails: businessDetails,
                businessCategory: businessCategory,
            });

            // Update password if provided
            if (newPassword) {
                await currentUser.updatePassword(newPassword);
            }

            alert("✅ Business profile updated successfully!");
            window.location.href = "businessdashboard.html";
        } catch (error) {
            console.error("❌ Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    });
});
