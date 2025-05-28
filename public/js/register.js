document.addEventListener("DOMContentLoaded", () => {
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const registerButton = document.querySelector(".login-button");
  const form = document.getElementById("registerForm");

  // Maak een foutmeldingselement aan onder confirmPassword (of selecteer het als het al bestaat)
  let errorDiv = document.getElementById("password-error");
  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.id = "password-error";
    errorDiv.style.color = "red";
    errorDiv.style.fontSize = "0.9rem";
    errorDiv.style.marginTop = "0.3rem";
    confirmPassword.parentNode.appendChild(errorDiv);
  }

  // Start met knop uitgeschakeld
  registerButton.disabled = true;

  function validatePasswords() {
    const passwordsMatch =
      password.value === confirmPassword.value && password.value.length > 0;

    if (!passwordsMatch) {
      password.classList.add("input-error");
      confirmPassword.classList.add("input-error");
      registerButton.disabled = true;
      errorDiv.textContent = "De wachtwoorden komen niet overeen.";
    } else {
      password.classList.remove("input-error");
      confirmPassword.classList.remove("input-error");
      registerButton.disabled = false;
      errorDiv.textContent = "";
    }
  }

  // Validatie pas nadat gebruiker iets heeft ingevuld (niet direct bij laden)
  password.addEventListener("input", validatePasswords);
  confirmPassword.addEventListener("input", validatePasswords);

  // Extra: pas foutkleuren toe na submit-poging
  form.addEventListener("submit", (e) => {
    validatePasswords();

    if (
      password.value !== confirmPassword.value ||
      password.value.length === 0
    ) {
      e.preventDefault();
      password.classList.add("input-error");
      confirmPassword.classList.add("input-error");
      errorDiv.textContent = "De wachtwoorden komen niet overeen.";
    }
  });
});
