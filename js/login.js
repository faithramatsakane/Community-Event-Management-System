window.onload = function () {
  google.accounts.id.initialize({
    client_id: "387286970232-or2mfsk2sbv2s7ssg61bcikmk6ehqv98.apps.googleusercontent.com",
    callback: handleCredentialResponse
  });

  google.accounts.id.renderButton(
    document.getElementById("googleBtn"),
    { theme: "outline", size: "large" }
  );

  google.accounts.id.prompt();
};

function handleCredentialResponse(response) {
  console.log("ID Token: " + response.credential);

  // Send token to backend for verification
  fetch("/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: response.credential })
  });
}
