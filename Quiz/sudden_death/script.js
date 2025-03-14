document.addEventListener("DOMContentLoaded", function () {

  // === ELEMENTEN ===
  const startButton = document.getElementById("startButton");
  const quizContainer = document.getElementById("quizContainer");
  const controlButtons = document.getElementById("controlButtons");
  const lotrAudio = document.getElementById("lotrAudio");
  const pauseButton = document.getElementById("pauseButton");
  const exitButton = document.getElementById("exitButton");

  const popup = document.getElementById("popup");
  const popupBackground = document.getElementById("popupBackground");
  const popupMessage = document.getElementById("popupMessage");
  const confirmButton = document.getElementById("confirmButton");
  const cancelButton = document.getElementById("cancelButton");

  const vraagElement = document.querySelector("h2");
  const antwoordKnoppen = document.querySelectorAll(".btn");
  const nextButton = document.querySelector(".next");
  const motivationalSection = document.getElementById("motivationalMessage");

  // === VARIABELEN ===
  const quotes = [];
  const characters = [];
  let gebruikteQuotes = [];
  let score = 0;
  let geselecteerdeKnop = null;
  let juisteCharacterId = null;
  let checkMode = true;
  startButton.disabled = true;

  const motivationalMessages = [
    "Je hebt de wijsheid van Gandalf! Goed gedaan 🧙‍♂️!",
    "Dat was een machtig antwoord, waardig voor een koning 👑!",
    "Eén antwoord om ze allemaal te verslaan! Je hebt het goed 💍🔥!",
    "Zelfs Elrond zou onder de indruk zijn van jouw kennis 📜!",
    "Net als Legolas’ pijlen, raakte jouw antwoord doel 🏹!",
    "De weg gaat altijd verder, en jij bewandelt hem met wijsheid 🛤️!",
    "Dat was een legendarisch antwoord, waardig voor de Zaal van Gondor 🏰!",
    "Zelf Sauron zou niet kunnen ontkennen dat dit juist was 👁️!",
    "Bij het licht van Eärendil, jij bent echt slim 🌟!",
    "Je hebt bewezen zo wijs te zijn als de elfen van Rivendel 🌿!"
  ];

  const failMessages = [
    "De duistere schaduwen van Mordor hebben je te pakken... 💀",
    "Zelf Gollum wist dit nog! 😱",
    "Dat was als dwalen in de mist van de Gevaarlijke Moerassen... 🌫️",
    "De Palantír toonde je de verkeerde weg! 🔮",
    "Saruman lacht in zijn toren... 🏰",
    "De Orcs vieren feest in de Black Gate... 😈",
    "Je vergat het advies van Gandalf! 📚",
    "Zelf een Hobbit zou dit weten... 🍃",
    "Sauron zag je fout en lacht vanuit Barad-dûr! 🔥",
    "De Nazgûl naderen... Wees voorzichtig! 🐉"
  ];

  const headers = {
    'Accept': 'application/json',
    'Authorization': 'Bearer UCTCCx7EBG3IuHh7Cfst'
  };

  // === AUDIO STARTEN ===
  function startAudio() {
    lotrAudio.play().catch(error => {
      console.log("Autoplay geblokkeerd, gebruiker moet handmatig starten.");
    });
  }

  // === POPUPS ===
  function showPopup(message, confirmAction) {
    popupMessage.textContent = message;
    popup.style.display = "block";
    popupBackground.style.display = "block";

    confirmButton.onclick = function () {
      confirmAction();
      closePopup();
    };

    cancelButton.onclick = closePopup;
    popupBackground.onclick = closePopup;
  }

  function closePopup() {
    popup.style.display = "none";
    popupBackground.style.display = "none";
  }

  pauseButton.addEventListener("click", function () {
    showPopup("Weet je zeker dat je de quiz wilt pauzeren?", function () {
      // Functionaliteit voor pauzeren kan hier toegevoegd worden.
    });
  });

  exitButton.addEventListener("click", function () {
    showPopup("Weet je zeker dat je de quiz wilt verlaten?", function () {
      window.location.reload();
    });
  });

  // === MELDING TONEN ===
  function toonMelding(tekst, kleur = "red") {
    motivationalSection.textContent = tekst;
    motivationalSection.style.display = "block";
    motivationalSection.style.color = kleur;
  }

  function showMotivationalMessage() {
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    toonMelding(motivationalMessages[randomIndex], "green");
  }

  function showFailMessage() {
    const randomIndex = Math.floor(Math.random() * failMessages.length);
    toonMelding(failMessages[randomIndex], "red");
  }

  // === VRAAG LADEN ===
  function laadVraag() {
    reset();
    toonMelding(""); // Reset meldingen
    let vraagInhoud;

    do {
      vraagInhoud = quotes[Math.floor(Math.random() * quotes.length)];
    } while (gebruikteQuotes.includes(vraagInhoud._id));

    gebruikteQuotes.push(vraagInhoud._id);
    vraagElement.textContent = vraagInhoud.dialog;

    juisteCharacterId = vraagInhoud.character;
    const juisteCharacter = characters.find(c => c._id === juisteCharacterId);

    if (!juisteCharacter) {
      console.error("Juiste character niet gevonden voor ID:", juisteCharacterId);
      laadVraag();
      return;
    }

    let fouteCharacters = characters
      .filter(c => c._id !== juisteCharacterId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    let antwoorden = [...fouteCharacters, juisteCharacter].sort(() => 0.5 - Math.random());

    antwoordKnoppen.forEach((knop, index) => {
      knop.textContent = antwoorden[index].name;
      knop.onclick = () => selecteerAntwoord(knop, antwoorden[index]._id);
    });

    nextButton.textContent = "Check";
    checkMode = true;
    geselecteerdeKnop = null;
  }

  function selecteerAntwoord(button, gekozenId) {
    geselecteerdeKnop = { button, gekozenId };

    antwoordKnoppen.forEach(knop => {
      knop.style.backgroundColor = "";
      knop.style.color = "white";
    });

    button.style.background = "gray";
    button.style.color = "black";
  }

  function controleerAntwoord() {
    if (!geselecteerdeKnop) {
      toonMelding("Kies eerst een antwoord voordat je checkt!");
      return;
    }

    antwoordKnoppen.forEach(knop => knop.disabled = true);

    const gekozenId = geselecteerdeKnop.gekozenId;

    if (gekozenId === juisteCharacterId) {
      geselecteerdeKnop.button.style.background = "linear-gradient(to bottom, #2d8f2d, #1e691e)"; // Groen voor juist
      geselecteerdeKnop.button.style.color = "white"; // De tekstkleur wordt wit
      score++;
      nextButton.textContent = "Next";
      checkMode = false;
      showMotivationalMessage();
    } else {

      const juisteCharacter = characters.find(c => c._id === juisteCharacterId);

      antwoordKnoppen.forEach(knop => {
        if (knop.textContent === juisteCharacter.name) {
          knop.style.backgroundColor = "green";
          knop.style.color = "white";
        }
      });

      vraagElement.textContent = `Game Over! Je eindscore is ${score}.`;
      antwoordKnoppen.forEach(knop => knop.style.display = "none");
      nextButton.style.display = "none";

      showFailMessage();
    }
  }

  function reset() {
    antwoordKnoppen.forEach(btn => {
      btn.style.backgroundColor = "";
      btn.style.background = "";
      btn.style.color = "#eeeed4";
      btn.disabled = false;
      btn.style.display = "inline-block";
    });

    geselecteerdeKnop = null;
  }

  // === BUTTON EVENTS ===
  nextButton.addEventListener("click", () => {
    if (checkMode) {
      if (!geselecteerdeKnop) {
        toonMelding("Kies eerst een antwoord voordat je checkt!");
        return;
      }
      controleerAntwoord();
    } else {
      laadVraag();
    }
  });

  startButton.addEventListener("click", function () {
    startButton.style.display = "none";
    quizContainer.style.display = "block";
    controlButtons.style.display = "block";
    startAudio();
    laadVraag();
  });

  // === API OPHALEN ===
  async function main() {
    try {
      let responseQuotes = await fetch("https://the-one-api.dev/v2/quote", { headers: headers });
      let responseCharacters = await fetch("https://the-one-api.dev/v2/character", { headers: headers });

      let quotesData = await responseQuotes.json();
      let charactersData = await responseCharacters.json();

      quotes.push(...quotesData.docs);
      characters.push(...charactersData.docs);
      console.log("Quotes geladen:", quotes.length);
      console.log("Characters geladen:", characters.length);
      console.log("Quotes en characters geladen!");
      startButton.disabled = false;
    } catch (error) {
      console.log("Fout bij ophalen van data:", error);
    }
  }

  main();

});
