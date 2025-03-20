
// Ensure Firebase SDK is loaded before initializing
if (typeof firebase === "undefined") {
    console.error("❌ Firebase SDK is not loaded. Check your script imports.");
} else {
    if (!firebase.apps.length) {
        const firebaseConfig = {
            apiKey: "AIzaSyCp0HTLV-w6oy8W2Y333_yK3Q6uA9HucpE",
            authDomain: "quickconet.firebaseapp.com",
            projectId: "quickconet",
            storageBucket: "quickconet.appspot.com",
            messagingSenderId: "760043432939",
            appId: "1:760043432939:web:cac068874f7c8a24b307ae",
            measurementId: "G-L36F8YWRR2"
        };

        firebase.initializeApp(firebaseConfig);
        console.log("✅ Firebase initialized successfully!");
    } else {
        console.log("⚠️ Firebase already initialized.");
    }

    // Ensure Firebase services are available before using them
    try {
        window.auth = firebase.auth();
        window.firestore = firebase.firestore();
        
        if (firebase.storage) {
            window.storage = firebase.storage();
        } else {
            console.warn("⚠️ Firebase Storage is not available. Check your imports.");
        }

        console.log("✅ Firebase services initialized.");
    } catch (error) {
        console.error("❌ Firebase services failed to initialize:", error);
    }
}
