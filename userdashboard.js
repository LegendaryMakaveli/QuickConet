darkModeToggle = document.getElementById("darkModeToggle");
      const body = document.body;

      darkModeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
      });

      //notification

      function showNotification(message) {
        const notification = document.createElement("div");
        notification.classList.add("notification");
        notification.innerText = message;

        document.body.appendChild(notification);

        setTimeout(() => {
          notification.remove();
        }, 5000);
      }
      // Fetch stored bookings from localStorage
      let userBookings = JSON.parse(localStorage.getItem("userBookings")) || [];

      function updateBookings() {
        let bookingList = document.getElementById("bookingList");
        let bookingCount = document.getElementById("bookingCount");

        // Check if elements exist before modifying
        if (!bookingList || !bookingCount) {
          console.error("Booking elements not found.");
          return;
        }
        // Clear previous list
        bookingList.innerHTML = "";

        if (userBookings.length > 0) {
          userBookings.forEach((booking, index) => {
            let li = document.createElement("li");
            li.innerHTML = `
        📍 ${booking.profession} - ${booking.date} at ${booking.time}
        <button class="cancel-btn" onclick="cancelBooking(${index})">❌ Cancel</button>
      `;
            bookingList.appendChild(li);
          });
        } else {
          bookingList.innerHTML = "<p>No bookings yet.</p>";
        }

        // Update count
        bookingCount.innerText = userBookings.length;

        // Save changes to localStorage
        localStorage.setItem("userBookings", JSON.stringify(userBookings));
      }

      function cancelBooking(index) {
        userBookings.splice(index, 1); // Remove booking from array
        updateBookings(); // Refresh UI
      }

      // Initial load
      updateBookings();

      function toggleSidebar() {
        document.getElementById("sidebar").classList.toggle("active");
    }
    