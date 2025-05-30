const inputUsername = document.getElementById("username");
const inputPassword = document.getElementById("password");
const warningUsername = document.getElementById("usernameAlert");
const warningPassword = document.getElementById("passwordAlert");
inputUsername.addEventListener("blur", usernameFunction);

//lege gebruikersnaam
function usernameFunction() {
  if (inputUsername.value.trim() == "") {
    warningUsername.textContent =
      "Gelieve uw gebruikersnaam in te vullen a.u.b";
    inputUsername.classList.add("input-error");
  } else {
    warningUsername.textContent = "";
    inputUsername.classList.remove("input-error");
  }
}
inputPassword.addEventListener("blur", passwordFunction);
function passwordFunction() {
  if (inputPassword.value.trim() == "") {
    warningPassword.textContent = "Gelieve uw wachtwoord in te vullen a.u.b";
    inputPassword.classList.add("input-error");
  } else {
    warningPassword.textContent = "";
    inputPassword.classList.remove("input-error");
  }
}

const buttonLogin = document.getElementById("login");
buttonLogin.addEventListener("click", emptyInput);
function emptyInput(e) {
  e.preventDefault();
  usernameFunction();
  passwordFunction();
}

