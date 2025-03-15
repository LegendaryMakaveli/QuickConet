document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chatBox");
    const messageInput = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");
    const chatUser = document.getElementById("chatUser");
    const backBtn = document.getElementById("backBtn");

    // Load selected user from previous page
    let selectedUser = localStorage.getItem("selectedChatUser") || "Chat";
    chatUser.textContent = selectedUser;

   // Simulate Business Online Status
   function updateStatus(isOnline) {
    if (!statusIndicator) {
        console.error("Status Indicator not found!");
        return;
    }
    if (isOnline) {
        statusIndicator.textContent = "Online";
        statusIndicator.classList.add("online");
        statusIndicator.classList.remove("offline");
    } else {
        statusIndicator.textContent = "Offline";
        statusIndicator.classList.add("offline");
        statusIndicator.classList.remove("online");
    }
}

     // Simulate business online/offline
     let isBusinessOnline = Math.random() > 0.3; // 70% chance online
     updateStatus(isBusinessOnline);
 
     // Function to get current time
     function getCurrentTime() {
         let now = new Date();
         return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
     }

     // Function to play message sound
     function playSound() {
        let sound = new Audio("message.mp3"); // Add message.mp3 to your project folder
        sound.play();
    }

    // Function to get current time
    function getCurrentTime() {
        let now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

   // Function to add message with timestamp
   function addMessage(text, isUser = true) {
    let message = document.createElement("div");
    message.classList.add("message");
    message.classList.add(isUser ? "user-msg" : "business-msg");
    message.textContent = text;

    // Add timestamp
    let time = document.createElement("span");
    time.classList.add("timestamp");
    time.textContent = getCurrentTime();
    message.appendChild(time);

// Add checkmark (✓ single for sent, later updated to ✓✓ for read)
if (isUser) {
    let checkmark = document.createElement("span");
    checkmark.classList.add("checkmark");
    checkmark.textContent = "✓";
    message.appendChild(checkmark);
}

    chatBox.appendChild(message);

    // Play sound
    playSound();

    // Smooth scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
    return message; // Return the message element to update later
}

    // Function to simulate typing animation
    function showTyping() {
        let typingDiv = document.createElement("div");
        typingDiv.classList.add("typing");
        typingDiv.innerHTML = "<span></span><span></span><span></span>";
        chatBox.appendChild(typingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        // Remove typing animation after 1.5s
        setTimeout(() => {
            typingDiv.remove();
        }, 1500);
    }

    // Send message event
    sendBtn.addEventListener("click", function () {
        let msg = messageInput.value.trim();
        if (msg) {
            addMessage(msg, true);
            messageInput.value = "";

            // Simulate business reply with a delay
            showTyping();
            setTimeout(() => {
                addMessage("Thank you for reaching out!", false);
            }, 2000);
        }
    });

    // Back button
    backBtn.addEventListener("click", function () {
        window.location.href = "chat-selection.html"; // Navigate back
    });

    // Send message on Enter key press
    messageInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendBtn.click();
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const chatWith = localStorage.getItem("chatWith");
    if (!chatWith) {
        alert("No business selected for chat.");
        window.history.back();
    } else {
        document.getElementById("chatHeader").innerText = `Chat with ${chatWith}`;
    }
});
