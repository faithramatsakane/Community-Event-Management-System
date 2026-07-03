// Contact Form Validation

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactForm");

    form.addEventListener("submit", async function(event) {

        event.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        if (
            fullName === "" ||
            email === "" ||
            subject === "" ||
            message === ""
        ) {
            alert("Please fill in all fields.");
            return;
        }

        // Email validation
        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Send to backend API
        const result = await API.contact.submitForm(fullName, email, message);

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        if (result.success) {
            alert(
                "Thank you, " +
                fullName +
                "! Your message has been sent successfully."
            );
            form.reset();
        } else {
            alert("Failed to send message. Please try again: " + result.error);
        }
    });

});