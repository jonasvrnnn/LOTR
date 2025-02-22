const inputUsername = document.getElementById("username");
const inputPassword = document.getElementById("password");
inputUsername.addEventListener("blur", myFunction);
//lege gebruikersnaam
function myFunction() {
  if (inputUsername.value.trim() == "") {
    alert("Gelieve uw gebruikersnaam in te vullen a.u.b");
  }
}
inputPassword.addEventListener("blur", passwordFunction);
function passwordFunction() {
  if (inputPassword.value.trim() == "") {
    alert("Gelieve uw wachtwoord in te vullen a.u.b");
  }
}

//submitten bij lege gebruikersnaam en ww
const buttonLogin = document.getElementById("login");
buttonLogin.addEventListener("click", emptyInput);
function emptyInput(e) {
  if (inputUsername.value.trim() == "" && inputPassword.value.trim() == "") {
    e.preventDefault();
    alert("Gebruikersnaam en wachtwoord zijn vereist.");
  } else if (inputPassword.value.trim() == "") {
    alert("Wachtwoord is vereist.");
  } else if (inputUsername.value.trim() == "") {
    alert("Gebruikersnaam is vereist.");
  }
}

//liever een melding of tekst dat verschijnt als textcontent?
