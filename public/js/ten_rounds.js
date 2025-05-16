document.addEventListener("DOMContentLoaded", function () {
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
  const characterKnoppen = document.querySelectorAll(".twee");
  const movieKnoppen = document.querySelectorAll(".een");
  const nextButton = document.querySelector(".next");
  const motivationalSection = document.getElementById("motivationalMessage");

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

  const motivationalMessages = [];
  const failMessages = [];

  const headers = {
    Accept: "application/json",
    Authorization: "Bearer UCTCCx7EBG3IuHh7Cfst",
  };

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
      window.location.reload();
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
    vraagElement.textContent = `Vraag ${huidigeVraagIndex + 1}: ${
      vraagInhoud.dialog
    }`;

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

    nextButton.textContent = "Check";
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
    nextButton.textContent = "Volgende";
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
    startAudio();
    huidigeVraagIndex = 0;
    score = 0;
    gebruikteQuotes = [];
    laadVraag();
  });

  async function main() {
    try {
      let responseQuotes = await fetch("https://the-one-api.dev/v2/quote", {
        headers: headers,
      });
      let responseCharacters = await fetch(
        "https://the-one-api.dev/v2/character",
        { headers: headers }
      );
      let responseMovies = await fetch("https://the-one-api.dev/v2/movie", {
        headers: headers,
      });

      let quotesData = await responseQuotes.json();
      let charactersData = await responseCharacters.json();
      let movieData = await responseMovies.json();
      quotes.push(...quotesData.docs);
      characters.push(...charactersData.docs);
      movies.push(...movieData.docs);
      movies = [...movies.slice(5)];
      let geldigeMovieIds = movies.map((m) => m._id);
      quotes = quotes.filter((q) => geldigeMovieIds.includes(q.movie));

      let geldigeCharacterIds = quotes.map((q) => q.character);
      characters = characters.filter((c) =>
        geldigeCharacterIds.includes(c._id)
      );
      console.log("Quotes geladen:", quotes.length);
      console.log("Characters geladen:", characters.length);
      console.log("Movies zijn geladen:", movies.length);
      console.log("Quotes en characters geladen!");
      startButton.disabled = false;
    } catch (error) {
      console.log("Fout bij ophalen van data:", error);
    }
  }

  // herstart knop voor na de quiz
  restartButton.addEventListener("click", function () {
    laadVraag();
  });
  main();
});
