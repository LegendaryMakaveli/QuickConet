// ✅ Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCp0HTLV-w6oy8W2Y333_yK3Q6uA9HucpE",
  authDomain: "quickconet.firebaseapp.com",
  projectId: "quickconet",
  storageBucket: "quickconet.firebasestorage.app",
  messagingSenderId: "760043432939",
  appId: "1:760043432939:web:cac068874f7c8a24b307ae",
  measurementId: "G-L36F8YWRR2"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ✅ Show Bookings in Calendar
document.addEventListener("DOMContentLoaded", async function () {
  var calendarEl = document.getElementById("calendar");

  var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      events: [],
  });

  // Fetch bookings from Firebase
  async function loadBookings() {
      const bookingsSnapshot = await db.collection("bookings").get();
      let events = [];

      bookingsSnapshot.forEach((doc) => {
          let data = doc.data();
          events.push({
              title: data.profession,
              start: `${data.date}T${data.time}`,
          });
      });

      calendar.addEventSource(events);
  }

  await loadBookings();
  calendar.render();
});

// ✅ Handle Booking Form Submission
document.addEventListener("DOMContentLoaded", function () {
  let bookingForm = document.getElementById("bookingForm");

  if (!bookingForm) {
      console.error("Booking form not found.");
      return;
  }

  bookingForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      let profession = document.getElementById("profession").value.trim();
      let date = document.getElementById("date").value;
      let time = document.getElementById("time").value;
      let userEmail = document.getElementById("email").value.trim(); // Get user email

      if (!profession || !date || !time || !userEmail) {
          alert("Please fill all fields.");
          return;
      }

      // ✅ Find the selected business in Firebase
      const businessSnapshot = await db.collection("businesses")
          .where("name", "==", profession)
          .get();

      if (businessSnapshot.empty) {
          alert("Business not found!");
          return;
      }

      let businessData;
      let businessId;
      businessSnapshot.forEach((doc) => {
          businessId = doc.id;
          businessData = doc.data();
      });

      // ✅ Save booking to Firebase
      await db.collection("bookings").add({
          profession,
          date,
          time,
          businessId,
          businessOwnerEmail: businessData.email, // Fetch business owner's email
          userEmail,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // ✅ Send email notification to the business
      sendEmailReminder(profession, date, time, businessData.email);

      alert("✅ Booking successful! A confirmation email has been sent.");
      bookingForm.reset();
      window.location.href = "userdashboard.html"; // Redirect to dashboard
  });
});

// ✅ Function to Send Email Notification
function sendEmailReminder(service, date, time, businessEmail) {
  emailjs.init("YOUR_USER_ID"); // Replace with your EmailJS User ID

  emailjs
      .send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
          service_name: service,
          appointment_date: date,
          appointment_time: time,
          user_email: businessEmail, // Send to business owner
      })
      .then(
          function (response) {
              console.log("✅ Email Sent!", response.status, response.text);
          },
          function (error) {
              console.log("❌ Failed to send email", error);
          }
      );
}
