document.addEventListener("DOMContentLoaded", function () {
    const userList = document.getElementById("userList");
    const searchInput = document.getElementById("searchUser");
    let selectedType = "Business"; // Default selection

    // Sample data (We will replace this with actual registered users later)
    const users = {
        Business: ["John's Barber", "Lisa's Tailoring", "FixIt Auto", "Legal Solutions"],
        Customer: ["Mike Johnson", "Sarah Adams", "Emma Watson", "David Lee"]
    };

    // Function to display users
    function displayUsers(type) {
        userList.innerHTML = "";
        users[type].forEach(user => {
            let li = document.createElement("li");
            li.textContent = user;
            li.onclick = function () {
                localStorage.setItem("selectedChatUser", user);
                window.location.href = "chat.html"; // Redirect to chat page
            };
            userList.appendChild(li);
        });
    }

    // Event Listeners for buttons
    document.getElementById("selectBusiness").addEventListener("click", function () {
        selectedType = "Business";
        displayUsers(selectedType);
    });

    document.getElementById("selectCustomer").addEventListener("click", function () {
        selectedType = "Customer";
        displayUsers(selectedType);
    });

    // Filter users based on search input
    searchInput.addEventListener("input", function () {
        let filteredUsers = users[selectedType].filter(user => user.toLowerCase().includes(searchInput.value.toLowerCase()));
        userList.innerHTML = "";
        filteredUsers.forEach(user => {
            let li = document.createElement("li");
            li.textContent = user;
            li.onclick = function () {
                localStorage.setItem("selectedChatUser", user);
                window.location.href = "chat.html"; // Redirect to chat page
            };
            userList.appendChild(li);
        });
    });

    // Show default users on load
    displayUsers(selectedType);
});
