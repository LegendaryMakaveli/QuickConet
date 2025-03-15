document.addEventListener("DOMContentLoaded", function () {
    const businessForm = document.getElementById("businessForm");

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
            let businesses = JSON.parse(localStorage.getItem("businesses")) || [];
            const business = {
                name: businessName,
                category: businessCategory,
                address: businessAddress,
                details: businessDetails,
                price: businessPrice,
                whatsapp: businessWhatsApp,
                website: businessWebsite,
                images: imageArray
            };

            businesses.push(business);
            localStorage.setItem("businesses", JSON.stringify(businesses));
            alert("Business posted successfully!");
            businessForm.reset();
        }
    });
});
