document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("startButton");
  const backToMenuButton = document.getElementById("backToMenuButton");
  const quizContainer = document.getElementById("quizContainer");
  const controlButtons = document.getElementById("controlButtons");
  const lotrAudio = document.getElementById("lotrAudio");
  const restartButton = document.getElementById("restartButton");
  const exitButton = document.getElementById("exitButton");

  const popup = document.getElementById("popup");
  const popupBackground = document.getElementById("popupBackground");
  const popupMessage = document.getElementById("popupMessage");
  const confirmButton = document.getElementById("confirmButton");
  const cancelButton = document.getElementById("cancelButton");

  const vraagElement = document.querySelector("h2");
  const characterKnoppen = document.querySelectorAll(".twee");
  const movieKnoppen = document.querySelectorAll(".een");
  const nextButton = document.querySelector(".next");
  const motivationalSection = document.getElementById("motivationalMessage");
  const introText = document.getElementById("introText");
  const introTitle = document.getElementById("introTitle");
  const feedbackIcon = document.getElementById("feedbackIcon");
const feedbackPopup = document.getElementById("feedbackPopup");
const feedbackOverlay = document.getElementById("feedbackOverlay");
const closeFeedback = document.getElementById("closeFeedback");
const sendFeedback = document.getElementById("sendFeedback");
const likeIcon = document.getElementById("likeIcon");
const dislikeIcon = document.getElementById("dislikeIcon");
const errorEl = document.getElementById("feedbackError");

  let quotes = [];
  let characters = [];
  let movies = [];
  let gebruikteQuotes = [];
  let score = 0;
  let huidigeVraagIndex = 0;
  const maxVragen = 10;

  let geselecteerdeCharacter = null;
  let geselecteerdeMovie = null;
  let juisteCharacterId = null;
  let juisteMovieId = null;
  let checkMode = true;
  startButton.disabled = true;
  let selectedFeedback = null;


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

  function startAudio() {
    lotrAudio.play().catch(() => {
      console.log("Autoplay geblokkeerd.");
    });
  }

  function showPopup(message, confirmAction) {
    popupMessage.textContent = message;
    popup.style.display = "block";
    popupBackground.style.display = "block";
    confirmButton.onclick = () => {
      confirmAction?.();
      closePopup();
    };
    cancelButton.onclick = closePopup;
    popupBackground.onclick = closePopup;
  }

  function closePopup() {
    popup.style.display = "none";
    popupBackground.style.display = "none";
  }

  exitButton.addEventListener("click", () => {
    showPopup("Weet je zeker dat je de quiz wilt verlaten?", () => {
      window.location.href = "/gameMode";
    });
  });

  function toonMelding(tekst, kleur = "red") {
    motivationalSection.textContent = tekst;
    motivationalSection.style.display = "block";
    motivationalSection.style.color = kleur;
  }

  function showMotivationalMessage() {
    const msg =
      motivationalMessages[
        Math.floor(Math.random() * motivationalMessages.length)
      ];
    toonMelding(msg, "green");
  }

  function showFailMessage() {
    const msg = failMessages[Math.floor(Math.random() * failMessages.length)];
    toonMelding(msg, "red");
  }

  function reset() {
    [...characterKnoppen, ...movieKnoppen].forEach((btn) => {
      btn.style.background = "";
      btn.style.color = "white";
      btn.disabled = false;
      btn.style.display = "inline-block";
    });
    geselecteerdeCharacter = null;
    geselecteerdeMovie = null;
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
    vraagElement.innerHTML = `Vraag ${huidigeVraagIndex + 1}: ${vraagInhoud.dialog} <ion-icon id="feedbackIcon" name="chatbubble-ellipses-outline" style="font-size: 28px; cursor: pointer; margin-left: 10px;" tabindex="0" role="button"></ion-icon>`;
    document.querySelector("#feedbackIcon")?.addEventListener("click", () => {
      feedbackPopup.style.display = "block";
      feedbackOverlay.style.display = "block";
    });
    
    juisteCharacterId = vraagInhoud.character;
    juisteMovieId = vraagInhoud.movie;

    const juisteCharacter = characters.find((c) => c._id === juisteCharacterId);
    const juisteMovie = movies.find((m) => m._id === juisteMovieId);

    if (!juisteCharacter || !juisteMovie) {
      laadVraag();
      return;
    }

    const fouteCharacters = characters
      .filter((c) => c._id !== juisteCharacterId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    const fouteMovies = movies
      .filter((m) => m._id !== juisteMovieId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const antwoordenCharacters = [...fouteCharacters, juisteCharacter].sort(
      () => 0.5 - Math.random()
    );
    const antwoordenMovies = [...fouteMovies, juisteMovie].sort(
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

    nextButton.innerHTML = '<ion-icon name="checkmark"style="font-size: 40px;"></ion-icon>';
    checkMode = true;
  }

  function controleerAntwoord() {
    if (!geselecteerdeCharacter || !geselecteerdeMovie) {
      toonMelding("Kies een character én een film!");
      return;
    }

    characterKnoppen.forEach((knop) => (knop.disabled = true));
    movieKnoppen.forEach((knop) => (knop.disabled = true));

    const juistCharacter =
      geselecteerdeCharacter.gekozenId === juisteCharacterId;
    const juisteMovie = geselecteerdeMovie.gekozenId === juisteMovieId;

    if (juistCharacter && juisteMovie) {
      geselecteerdeCharacter.knop.style.background =
        "linear-gradient(to bottom, #2d8f2d, #1e691e)";
      geselecteerdeMovie.knop.style.background =
        "linear-gradient(to bottom, #2d8f2d, #1e691e)";
      geselecteerdeCharacter.knop.style.color = "white";
      geselecteerdeMovie.knop.style.color = "white";
      score++;
      showMotivationalMessage();
    } else {
      if (!juistCharacter) {
        geselecteerdeCharacter.knop.style.background =
          "linear-gradient(to bottom, #d14343, #b32b2b)";
        geselecteerdeCharacter.knop.style.color = "white";
      } else {
        geselecteerdeCharacter.knop.style.background =
          "linear-gradient(to bottom, #2d8f2d, #1e691e)";
        geselecteerdeCharacter.knop.style.color = "white";
      }

      if (!juisteMovie) {
        geselecteerdeMovie.knop.style.background =
          "linear-gradient(to bottom, #d14343, #b32b2b)";
        geselecteerdeMovie.knop.style.color = "white";
      } else {
        geselecteerdeMovie.knop.style.background =
          "linear-gradient(to bottom, #2d8f2d, #1e691e)";
        geselecteerdeMovie.knop.style.color = "white";
      }

      // Highlight juiste antwoorden
      characterKnoppen.forEach((knop) => {
        const char = characters.find((c) => c.name === knop.textContent);
        if (char && char._id === juisteCharacterId) {
          knop.style.background =
            "linear-gradient(to bottom, #2d8f2d, #1e691e)";
          knop.style.color = "white";
        }
      });

      movieKnoppen.forEach((knop) => {
        const mov = movies.find((m) => m.name === knop.textContent);
        if (mov && mov._id === juisteMovieId) {
          knop.style.background =
            "linear-gradient(to bottom, #2d8f2d, #1e691e)";
          knop.style.color = "white";
        }
      });

      showFailMessage();
    }
nextButton.innerHTML = '<ion-icon name="arrow-forward-outline" style="font-size: 32px;"></ion-icon>';
    checkMode = false;
  }

  function beëindigQuiz() {
    vraagElement.textContent = `Quiz voltooid! Je score: ${score}/${maxVragen}`;
    [...characterKnoppen, ...movieKnoppen].forEach(
      (knop) => (knop.style.display = "none")
    );
    nextButton.style.display = "none";
    toonMelding("");
  }

  nextButton.addEventListener("click", () => {
    if (checkMode) {
      controleerAntwoord();
    } else {
      huidigeVraagIndex++;
      laadVraag();
    }
  });

  startButton.addEventListener("click", () => {
    startButton.style.display = "none";
    backToMenuButton.style.display = "none";
    quizContainer.style.display = "block";
    controlButtons.style.display = "block";
    introTitle.style.display = "none";
    introText.style.display = "none";

    startAudio();
    huidigeVraagIndex = 0;
    score = 0;
    gebruikteQuotes = [];
    laadVraag();
  });

  // herstart knop voor na de quiz
restartButton.addEventListener("click", function () {
    score = 0;
    huidigeVraagIndex = 0;
    gebruikteQuotes = [];

    [...characterKnoppen, ...movieKnoppen].forEach((knop) => {
      knop.style.display = "inline-block";
      knop.disabled = false;
    });

    nextButton.style.display = "inline-block";
    toonMelding("");

    laadVraag();
    
  });
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
  if (!selectedFeedback || !reason) {
    errorEl.textContent = "Kies een reactie en geef een reden op.";
    errorEl.style.display = "block";
    return;
  }
  errorEl.textContent = "";
  errorEl.style.display = "none";
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

