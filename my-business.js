document.addEventListener("DOMContentLoaded", function () {
    const businessForm = document.getElementById("businessForm");

    // Initialize IndexedDB
    const dbRequest = indexedDB.open("BusinessDB", 1);

    dbRequest.onupgradeneeded = function (event) {
        let db = event.target.result;
        if (!db.objectStoreNames.contains("businesses")) {
            let store = db.createObjectStore("businesses", { keyPath: "id", autoIncrement: true });
            store.createIndex("category", "category", { unique: false });
        }
    };

    dbRequest.onerror = function () {
        console.error("❌ Error opening IndexedDB");
    };

    dbRequest.onsuccess = function () {
        let db = dbRequest.result;
        console.log("✅ IndexedDB initialized successfully");

        businessForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const businessName = document.getElementById("businessName").value.trim();
            const businessCategory = document.getElementById("businessCategory").value.trim();
            const businessAddress = document.getElementById("businessAddress").value.trim();
            const businessDetails = document.getElementById("businessDetails").value.trim();
            const businessPrice = document.getElementById("businessPrice").value.trim();
            const businessWhatsApp = document.getElementById("businessWhatsApp").value.trim();
            const businessWebsite = document.getElementById("businessWebsite").value.trim();
            const images = document.getElementById("businessImages").files;

            let imageArray = [];
            let imagesProcessed = 0;

            if (images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    const reader = new FileReader();
                    reader.readAsDataURL(images[i]);

                    reader.onload = function (e) {
                        imageArray.push(e.target.result);
                        imagesProcessed++;

                        if (imagesProcessed === images.length) {
                            saveBusinessListing(imageArray);
                        }
                    };
                }
            } else {
                saveBusinessListing(imageArray);
            }

            function saveBusinessListing(imageArray) {
                let newBusiness = {
                    name: businessName,
                    category: businessCategory,
                    address: businessAddress,
                    details: businessDetails,
                    price: businessPrice,
                    whatsapp: businessWhatsApp,
                    website: businessWebsite,
                    images: imageArray
                };

                let transaction = db.transaction(["businesses"], "readwrite");
                let store = transaction.objectStore("businesses");
                let request = store.add(newBusiness);

                request.onsuccess = function () {
                    alert("✅ Business posted successfully!");
                    businessForm.reset();
                };

                request.onerror = function () {
                    console.error("❌ Error saving business");
                };
            }
        });
    };
});
