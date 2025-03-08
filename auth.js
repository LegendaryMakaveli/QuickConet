document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            const storedUser = localStorage.getItem(email);
            
            if (storedUser) {
                const user = JSON.parse(storedUser);

                if (user.password === password) {
                    alert("Login successful! Redirecting...");

                    // Redirect based on user type
                    if (user.userType === "business") {
                        window.location.href = "businessdashboard.html";
                    } else {
                        window.location.href = "userdashboard.html";
                    }
                } else {
                    alert("Incorrect password.");
                }
            } else {
                alert("User not found. Please sign up.");
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("currentUser");
            window.location.href = "Landingpage.html";
        });
    }
});
