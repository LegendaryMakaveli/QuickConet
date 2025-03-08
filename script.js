document.addEventListener("DOMContentLoaded", () => {
    fetchTestimonials();
});

document.getElementById("testimonialForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const message = document.getElementById("message").value;
    const imageFile = document.getElementById("image").files[0];

    if (!imageFile) {
        alert("Please upload an image!");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("message", message);
    formData.append("image", imageFile);

    const response = await fetch("/api/testimonials", {
        method: "POST",
        body: formData,
    });

    if (response.ok) {
        alert("Testimonial submitted!");
        fetchTestimonials();
    } else {
        alert("Error submitting testimonial.");
    }
});

// Fetch testimonials from backend and display them
async function fetchTestimonials() {
    const response = await fetch("/api/testimonials");
    const testimonials = await response.json();

    const container = document.getElementById("testimonials-container");
    container.innerHTML = "";

    testimonials.forEach((testimonial) => {
        const div = document.createElement("div");
        div.classList.add("testimonial");
        div.innerHTML = `
            <img src="${testimonial.image}" alt="User">
            <h3>${testimonial.name}</h3>
            <p>"${testimonial.message}"</p>
        `;
        container.appendChild(div);
    });
}