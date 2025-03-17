document.addEventListener("DOMContentLoaded", function () {
  // html elementen
  const startButton = document.getElementById("startButton");
  const backToMenuButton = document.getElementById("backToMenuButton");
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

  // variabelen
  const quotes = [];
  const characters = [];
  let gebruikteQuotes = [];
  let score = 0;
  let geselecteerdeKnop = null;
  let juisteCharacterId = null;
  let checkMode = true;
  let huidigeVraagIndex = 0;
  const maxVragen = 10;
  startButton.disabled = true;

  const motivationalMessages = [
    "Je hebt de wijsheid van Gandalf! Goed gedaan 🧙‍♂️!",
    "Dat was een machtig antwoord, waardig voor een koning 👑!",
    "Eén antwoord om ze allemaal te verslaan! Je hebt het goed 💍🔥!",
    "Zelf Elrond zou onder de indruk zijn van jouw kennis 📜!",
    "Net als Legolas’ pijlen, raakte jouw antwoord doel 🏹!",
    "De weg gaat altijd verder, en jij bewandelt hem met wijsheid 🛤️!",
    "Dat was een legendarisch antwoord, waardig voor de Zaal van Gondor 🏰!",
    "Zelf Sauron zou niet kunnen ontkennen dat dit juist was 👁️!",
    "Bij het licht van Eärendil, jij bent echt slim 🌟!",
    "Je hebt bewezen zo wijs te zijn als de elfen van Rivendel 🌿!",
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
    "De Nazgûl naderen... Wees voorzichtig! 🐉",
  ];

  const headers = {
    Accept: "application/json",
    Authorization: "Bearer UCTCCx7EBG3IuHh7Cfst",
  };

  // hier wordt de audio gestart
  function startAudio() {
    lotrAudio.play().catch((error) => {
      console.log("Autoplay geblokkeerd, gebruiker moet handmatig starten.");
    });
  }

  // popups
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
    showPopup("Weet je zeker dat je de quiz wilt pauzeren?");
  });

  exitButton.addEventListener("click", function () {
    showPopup("Weet je zeker dat je de quiz wilt verlaten?", function () {
      window.location.reload();
    });
  });

  // melding tonen
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

  // vragen
  function laadVraag() {
    if (huidigeVraagIndex >= maxVragen) {
      beëindigQuiz();
      return;
    }

    reset();
    toonMelding("");

    let vraagInhoud;

    do {
      vraagInhoud = quotes[Math.floor(Math.random() * quotes.length)];
    } while (gebruikteQuotes.includes(vraagInhoud._id));

    gebruikteQuotes.push(vraagInhoud._id);
    vraagElement.textContent = `Vraag ${huidigeVraagIndex + 1}: ${
      vraagInhoud.dialog
    }`;

    juisteCharacterId = vraagInhoud.character;
    const juisteCharacter = characters.find((c) => c._id === juisteCharacterId);

    if (!juisteCharacter) {
      console.error(
        "Juiste character niet gevonden voor ID:",
        juisteCharacterId
      );
      laadVraag();
      return;
    }

    let fouteCharacters = characters
      .filter((c) => c._id !== juisteCharacterId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    let antwoorden = [...fouteCharacters, juisteCharacter].sort(
      () => 0.5 - Math.random()
    );

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

    antwoordKnoppen.forEach((knop) => {
      knop.style.background = "";
      knop.style.color = "#eeeed4";
    });

    button.style.background = "gray";
    button.style.color = "black";
  }

  function controleerAntwoord() {
    if (!geselecteerdeKnop) {
      toonMelding("Kies eerst een antwoord voordat je checkt!");
      return;
    }

    antwoordKnoppen.forEach((knop) => (knop.disabled = true));

    const gekozenId = geselecteerdeKnop.gekozenId;

    // Het juiste antwoord
    if (gekozenId === juisteCharacterId) {
      geselecteerdeKnop.button.style.background =
        "linear-gradient(to bottom, #2d8f2d, #1e691e)"; // Groen voor juist
      geselecteerdeKnop.button.style.color = "white"; // De tekstkleur wordt wit

      score++;
      showMotivationalMessage();
    } else {
      // Foute knop: rood
      geselecteerdeKnop.button.style.background =
        "linear-gradient(to bottom, #d14343, #b32b2b)";
      geselecteerdeKnop.button.style.color = "white"; // Witte tekst voor de foute knop

      // juiste karakter wordt gezogd
      const juisteCharacter = characters.find(
        (c) => c._id === juisteCharacterId
      );

      // Zet de juiste knop op groen
      antwoordKnoppen.forEach((knop) => {
        if (knop.textContent === juisteCharacter.name) {
          knop.style.background =
            "linear-gradient(to bottom, #2d8f2d, #1e691e)";
          knop.style.color = "white"; // Witte tekst voor de juiste knop
        }
      });

      showFailMessage();
    }

    nextButton.textContent = "Volgende";
    checkMode = false;
  }

  function beëindigQuiz() {
    vraagElement.textContent = `Quiz voltooid! Je score: ${score}/${maxVragen}`;
    antwoordKnoppen.forEach((knop) => (knop.style.display = "none"));
    nextButton.style.display = "none";
    toonMelding("");
  }

  function reset() {
    antwoordKnoppen.forEach((btn) => {
      btn.style.backgroundColor = "#464038";
      btn.style.color = "#eeeed4";
      btn.style.background = "";
      btn.disabled = false;
      btn.style.display = "inline-block";
    });

    geselecteerdeKnop = null;
  }

  // event listener
  nextButton.addEventListener("click", () => {
    if (checkMode) {
      if (!geselecteerdeKnop) {
        toonMelding("Kies eerst een antwoord voordat je checkt!");
        return;
      }
      controleerAntwoord();
    } else {
      huidigeVraagIndex++;
      laadVraag();
    }
  });

  startButton.addEventListener("click", function () {
    startButton.style.display = "none";
    backToMenuButton.style.display = "none";
    quizContainer.style.display = "block";
    controlButtons.style.display = "block";
    startAudio();
    huidigeVraagIndex = 0;
    score = 0;
    gebruikteQuotes = [];
    laadVraag();
  });

  // api wordt opgehaald van The one api
  async function main() {
    try {
      let responseQuotes = await fetch("https://the-one-api.dev/v2/quote", {
        headers: headers,
      });
      let responseCharacters = await fetch(
        "https://the-one-api.dev/v2/character",
        { headers: headers }
      );

      let quotesData = await responseQuotes.json();
      let charactersData = await responseCharacters.json();

      quotes.push(...quotesData.docs);
      characters.push(...charactersData.docs);
      console.log("Quotes geladen:", quotes.length);
      console.log("Characters geladen:", characters.length);
      startButton.disabled = false;
    } catch (error) {
      console.log("Fout bij ophalen van data:", error);
    }
  }

  main();
});
