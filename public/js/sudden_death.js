document.addEventListener("DOMContentLoaded", function () {
  // html elementen
  const startButton = document.getElementById("startButton");
  const backToMenuButton = document.getElementById("backToMenuButton");
  const quizContainer = document.getElementById("quizContainer");
  const controlButtons = document.getElementById("controlButtons");
  const restartButton = document.getElementById("restartButton");
  const lotrAudio = document.getElementById("lotrAudio");
  const exitButton = document.getElementById("exitButton");

  const popup = document.getElementById("popup");
  const popupBackground = document.getElementById("popupBackground");
  const popupMessage = document.getElementById("popupMessage");
  const confirmButton = document.getElementById("confirmButton");
  const cancelButton = document.getElementById("cancelButton");

  const vraagElement = document.querySelector("h2");
  const antwoordKnoppen = document.querySelectorAll(".btn");
  const movieKnoppen = document.querySelectorAll(".een");
  const characterKnoppen = document.querySelectorAll(".twee");
  const nextButton = document.querySelector(".next");
  const motivationalSection = document.getElementById("motivationalMessage");
  const introText = document.getElementById("introText");
  const introTitle = document.getElementById("introTitle");
  const feedbackIcon = document.getElementById("feedbackIcon");
  const feedbackOverlay = document.getElementById("feedbackOverlay");
  const feedbackPopup = document.getElementById("feedbackPopup");
  const closeFeedback = document.getElementById("closeFeedback");
  const sendFeedback = document.getElementById("sendFeedback");
  const likeIcon = document.getElementById("likeIcon");
  const dislikeIcon = document.getElementById("dislikeIcon");
  const feedbackReason = document.getElementById("feedbackReason");
  const feedbackError = document.getElementById("feedbackError");

  // Variabele
  let quotes = [];
  let characters = [];
  let movies = [];
  let gebruikteQuotes = [];
  let score = 0;
  let geselecteerdeCharacter = null;
  let geselecteerdeMovie = null;
  let geselecteerdeKnop = null;
  let juisteCharacterId = null;
  let juisteMovieId = null;
  let checkMode = true;
  let selectedFeedback = null;
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

  const dataDiv = document.getElementById("game-data");
  if (!dataDiv) {
    console.error("Kan #game-data niet vinden!");
    return;
  }
  try {
    const rawData = decodeURIComponent(dataDiv.dataset.json);
    const gameData = JSON.parse(rawData);
    quotes = gameData.quotes;
    characters = gameData.characters;
    movies = gameData.movies;
    console.log("Data geladen via EJS:", gameData);
    startButton.disabled = false;
  } catch (err) {
    console.error("Fout bij parsen van gameData:", err);
  }

  // audio starten bij opstarten van het spel
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

  /*pauseButton.addEventListener("click", function () {
    showPopup("Weet je zeker dat je de quiz wilt pauzeren?");
  });*/

  exitButton.addEventListener("click", function () {
    showPopup("Weet je zeker dat je de quiz wilt verlaten?", function () {
      window.location.href = "/gameMode";
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
    reset();
    toonMelding("");
    let vraagInhoud;

    do {
      vraagInhoud = quotes[Math.floor(Math.random() * quotes.length)];
    } while (gebruikteQuotes.includes(vraagInhoud._id));

    gebruikteQuotes.push(vraagInhoud._id);
    vraagElement.innerHTML = `${vraagInhoud.dialog} <ion-icon id="feedbackIcon" 
       name="chatbubble-ellipses-outline"
       style="font-size:28px;cursor:pointer;margin-left:10px;"
       tabindex="0" role="button"></ion-icon>`;
    setTimeout(() => {
      const newFeedbackIcon = document.getElementById("feedbackIcon");
      if (newFeedbackIcon) {
        newFeedbackIcon.addEventListener("click", () => {
          feedbackPopup.style.display = "block";
          feedbackOverlay.style.display = "block";
        });
      }
    }, 0);

    juisteCharacterId = vraagInhoud.character;
    const juisteCharacter = characters.find((c) => c._id === juisteCharacterId);

    juisteMovieId = vraagInhoud.movie;
    const juisteMovie = movies.find((m) => m._id === juisteMovieId);

    if (!juisteCharacter || !juisteMovie) {
      console.error(
        "Juiste character niet gevonden voor ID:",
        juisteCharacterId
      );
      laadVraag();
      return;
    }
    let fouteMovies = movies
      .filter((m) => m._id !== juisteMovieId)
      .sort(() => 0.5 - Math.random());
    let fouteCharacters = characters
      .filter((c) => c._id !== juisteCharacterId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    let antwoordenCharacters = [...fouteCharacters, juisteCharacter].sort(
      () => 0.5 - Math.random()
    );

    let antwoordenMovies = [...fouteMovies, juisteMovie].sort(
      () => 0.5 - Math.random()
    );

    characterKnoppen.forEach((knop, index) => {
      knop.textContent = antwoordenCharacters[index].name;
      knop.onclick = () =>
        selecteerCharacter(knop, antwoordenCharacters[index]._id);
    });

    movieKnoppen.forEach((knop, index) => {
      knop.textContent = antwoordenMovies[index].name;
      knop.onclick = () => selecteerMovie(knop, antwoordenMovies[index]._id);
    });

    nextButton.innerHTML =
      '<ion-icon name="checkmark"style="font-size: 40px;"></ion-icon>';
    checkMode = true;
    geselecteerdeKnop = null;
  }

  function selecteerCharacter(knop, gekozenId) {
    geselecteerdeCharacter = { knop, gekozenId };
    characterKnoppen.forEach((btn) => {
      btn.style.background = "";
      btn.style.color = "white";
    });
    knop.style.background = "gray";
    knop.style.color = "black";
  }

  function selecteerMovie(knop, gekozenId) {
    geselecteerdeMovie = { knop, gekozenId };
    movieKnoppen.forEach((btn) => {
      btn.style.background = "";
      btn.style.color = "white";
    });
    knop.style.background = "gray";
    knop.style.color = "black";
  }

  function controleerAntwoord() {
    if (!geselecteerdeCharacter || !geselecteerdeMovie) {
      toonMelding("Kies een character én een film voordat je checkt!");
      return;
    }

    characterKnoppen.forEach((knop) => (knop.disabled = true));
    movieKnoppen.forEach((knop) => (knop.disabled = true));
    const juistCharacter =
      geselecteerdeCharacter.gekozenId === juisteCharacterId;
    const juisteMovie = geselecteerdeMovie.gekozenId === juisteMovieId;

    if (juistCharacter && juisteMovie) {
      geselecteerdeCharacter.knop.style.background =
        "linear-gradient(to bottom, #2d8f2d, #1e691e)"; // Groen voor juist
      geselecteerdeCharacter.knop.style.color = "white"; // De tekstkleur wordt wit
      geselecteerdeMovie.knop.style.background =
        "linear-gradient(to bottom, #2d8f2d, #1e691e)";
      geselecteerdeMovie.knop.style.color = "white";
      score++;
      nextButton.innerHTML =
        '<ion-icon name="arrow-forward-outline" style="font-size: 32px;"></ion-icon>';
      checkMode = false;
      showMotivationalMessage();
    } else {
      characterKnoppen.forEach((knop) => {
        const char = characters.find((c) => c.name === knop.textContent);
        if (char && char._id === juisteCharacterId) {
          knop.style.background = "green";
          knop.style.color = "white";
        }
      });
      movieKnoppen.forEach((knop) => {
        const mov = movies.find((m) => m.name === knop.textContent);
        if (mov && mov._id === juisteMovieId) {
          knop.style.background = "green";
          knop.style.color = "white";
        }
      });

      vraagElement.textContent = `Game Over! Je eindscore is ${score}.`;
      antwoordKnoppen.forEach((knop) => (knop.style.display = "none"));
      nextButton.style.display = "none";

      showFailMessage();
      saveSuddenDeathResult(score);
    }
  }

  function reset() {
    [...characterKnoppen, ...movieKnoppen].forEach((btn) => {
      btn.style.backgroundColor = "";
      btn.style.background = "";
      btn.style.color = "#eeeed4";
      btn.disabled = false;
      btn.style.display = "inline-block";
    });

    geselecteerdeCharacter = null;
    geselecteerdeMovie = null;
  }

  // eventListener
  nextButton.addEventListener("click", () => {
    if (checkMode) {
      if (!geselecteerdeCharacter || !geselecteerdeMovie) {
        toonMelding("Kies een character én een film voordat je checkt!");
        return;
      }
      controleerAntwoord();
    } else {
      laadVraag();
    }
  });

  startButton.addEventListener("click", function () {
    startButton.style.display = "none";

    backToMenuButton.style.display = "none";
    quizContainer.style.display = "block";
    controlButtons.style.display = "block";
    //restartButton.style.display = "none";
    introTitle.style.display = "none";
    introText.style.display = "none";

    startAudio();
    laadVraag();
  });

  // herstart knop voor na de quiz
  restartButton.addEventListener("click", function () {
    nextButton.style.display = "block";
    laadVraag();
  });
  // main();
  feedbackOverlay.addEventListener("click", closeFeedbackPopup);
  closeFeedback.addEventListener("click", closeFeedbackPopup);

  likeIcon.addEventListener("click", () => {
    selectedFeedback = "like";
    likeIcon.style.color = "green";
    dislikeIcon.style.color = "";
  });

  dislikeIcon.addEventListener("click", () => {
    selectedFeedback = "dislike";
    dislikeIcon.style.color = "red";
    likeIcon.style.color = "";
  });

  sendFeedback.addEventListener("click", () => {
    const reason = feedbackReason.value.trim();
    if (!selectedFeedback || reason === "") {
      feedbackError.textContent = "Kies een reactie en geef een reden op.";
      feedbackError.style.display = "block";
      return;
    }

    feedbackError.textContent = "";
    feedbackError.style.display = "none";
    console.log("Feedback:", selectedFeedback, "Reden:", reason);
    closeFeedbackPopup();
  });

  function closeFeedbackPopup() {
    feedbackPopup.style.display = "none";
    feedbackOverlay.style.display = "none";
    selectedFeedback = null;
    likeIcon.style.color = "";
    dislikeIcon.style.color = "";
    document.getElementById("feedbackReason").value = "";
  }

  // main();
});

async function saveSuddenDeathResult(score) {
  try {
    const response = await fetch("/save-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameMode: "sudden_death",
        score: score,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP-fout! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Sudden death score opgeslagen:", data);
  } catch (err) {
    console.error("Fout bij opslaan sudden death score:", err);
  }
}
