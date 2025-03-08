 //  Show Bookings in the Calendar

 document.addEventListener("DOMContentLoaded", function () {
    var calendarEl = document.getElementById("calendar");

    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      events: [
        { title: "Lawyer Meeting", start: "2025-03-10T10:00:00" },
        { title: "Mechanic Service", start: "2025-03-12T14:00:00" },
      ],
    });

    calendar.render();
  });


document.addEventListener("DOMContentLoaded", function () {
    let bookingForm = document.getElementById("bookingForm");

    if (!bookingForm) {
        console.error("Booking form not found.");
        return;
    }

    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get form values safely
        let professionInput = document.getElementById("profession");
        let dateInput = document.getElementById("date");
        let timeInput = document.getElementById("time");

        if (!professionInput || !dateInput || !timeInput) {
            console.error("One or more input fields are missing.");
            return;
        }

        let profession = professionInput.value;
        let date = dateInput.value;
        let time = timeInput.value;

        if (!profession || !date || !time) {
            alert("Please fill all fields.");
            return;
        }

        // Save to localStorage for dashboard
        let userBookings = JSON.parse(localStorage.getItem("userBookings")) || [];
        userBookings.push({ profession, date, time });
        localStorage.setItem("userBookings", JSON.stringify(userBookings));

        window.location.href = "userdashboard.html"; // Redirect to dashboard
    });
});


 //  Email Reminder

 function sendEmailReminder(service, date, time, email) {
    emailjs.init("YOUR_USER_ID"); // Replace with your EmailJS User ID

    emailjs
      .send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        service_name: service,
        appointment_date: date,
        appointment_time: time,
        user_email: email,
      })
      .then(
        function (response) {
          console.log("Email Sent!", response.status, response.text);
        },
        function (error) {
          console.log("Failed to send email", error);
        }
      );
  }
