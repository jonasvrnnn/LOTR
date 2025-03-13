const quotes = [];
const characters = [];
let gebruikteQuotes = [];
let score = 0;

let huidigeVraagIndex = 0;
const maxVragen = 10;

const vraagElement = document.querySelector("h2");
const antwoordKnoppen = document.querySelectorAll(".btn");
const nextButton = document.querySelector(".next");

let geselecteerdeKnop = null;
let juisteCharacterId = null;
let checkMode = true;

// Maak een container voor de knop en de melding
const container = document.createElement("div");
nextButton.parentNode.insertBefore(container, nextButton); // Plaats de container net voor de nextButton

// Maak een aparte container voor de melding
const meldingElement = document.createElement("div");
meldingElement.style.fontWeight = "bold";
meldingElement.style.transition = "opacity 0.3s"; // Zorg voor een mooie overgang als de melding verschijnt

// Voeg de melding en de knop toe aan de container
container.appendChild(nextButton);
container.appendChild(meldingElement); // Voeg de melding toe in de container

// CSS voor de container
container.style.display = 'flex';
container.style.flexDirection = 'column';
container.style.alignItems = 'center';
container.style.justifyContent = 'center';
container.style.marginTop = '20px';

// Zorg ervoor dat de melding ruimte krijgt zonder dat de knop verschuift
meldingElement.style.minHeight = '30px';  // Zorgen dat er altijd ruimte is voor een melding
meldingElement.style.marginTop = '10px';

// API headers
const headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer UCTCCx7EBG3IuHh7Cfst'
};

const main = async () => {
  try {
    let responseQuotes = await fetch("https://the-one-api.dev/v2/quote", { headers: headers });
    let responseCharacters = await fetch("https://the-one-api.dev/v2/character", { headers: headers });

    let quotesData = await responseQuotes.json();
    let charactersData = await responseCharacters.json();

    quotes.push(...quotesData.docs);
    characters.push(...charactersData.docs);

    console.log("Quotes en characters geladen!");
    laadVraag();
  } catch (error) {
    console.log("Fout bij ophalen van data:", error);
  }
};

function laadVraag() {
  if (huidigeVraagIndex < maxVragen) {
    reset();

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
      laadVraag(); // probeer een andere vraag als er iets misgaat
      return;
    }

    let fouteCharacters = characters
      .filter(c => c._id !== juisteCharacterId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    let antwoorden = [...fouteCharacters, juisteCharacter].sort(() => 0.5 - Math.random());

    antwoordKnoppen.forEach((knop, index) => {
      knop.textContent = antwoorden[index].name;

      // Reset click handlers
      knop.onclick = () => selecteerAntwoord(knop, antwoorden[index]._id);
    });

    // Zet de knop terug op "Check"
    nextButton.textContent = "Volgende";
    checkMode = true;
    geselecteerdeKnop = null;

  } else {
    vraagElement.textContent = `Quiz voltooid! Je score: ${score}/${maxVragen}`;
    antwoordKnoppen.forEach(knop => knop.style.display = "none");
    nextButton.style.display = "none";
    meldingElement.textContent = ""; // Zorg ervoor dat er geen melding verschijnt als de quiz voltooid is
  }
}

function selecteerAntwoord(button, gekozenId) {
  geselecteerdeKnop = { button, gekozenId };

  // Reset de stijl van alle knoppen
  antwoordKnoppen.forEach(knop => {
    knop.style.backgroundColor = "";
    knop.style.color = "black";
  });

  // Geef de geselecteerde knop een grijze achtergrond
  button.style.backgroundColor = "gray";
  button.style.color = "white";
}

function controleerAntwoord() {
  if (!geselecteerdeKnop) {
    meldingElement.textContent = "Kies eerst een antwoord voordat je checkt!";
    meldingElement.style.opacity = 1; // Toon melding
    meldingElement.style.color ="red";
    return;
  }

  // Disable knoppen zodat je niet meer kunt aanpassen na checken
  antwoordKnoppen.forEach(knop => knop.disabled = true);

  const gekozenId = geselecteerdeKnop.gekozenId;

  if (gekozenId === juisteCharacterId) {
    geselecteerdeKnop.button.style.backgroundColor = "white";
    geselecteerdeKnop.button.style.color = "green";
    score++;
    meldingElement.textContent = "Goed zo!";
    meldingElement.style.opacity = 1; // Toon melding
  } else {
    geselecteerdeKnop.button.style.backgroundColor = "white";
    geselecteerdeKnop.button.style.color = "red";

    const juisteCharacter = characters.find(c => c._id === juisteCharacterId);

    antwoordKnoppen.forEach(knop => {
      if (knop.textContent === juisteCharacter.name) {
        knop.style.backgroundColor = "white";
        knop.style.color = "green";
      }
    });
  }
}

function reset() {
  antwoordKnoppen.forEach(btn => {
    btn.style.backgroundColor = "";
    btn.style.color = "black";
    btn.disabled = false;
  });

  geselecteerdeKnop = null;
  meldingElement.style.opacity = 0; // Verberg melding bij reset
}

nextButton.addEventListener("click", () => {
  if (checkMode) {
    // Eerst checken
    if (!geselecteerdeKnop) {
      meldingElement.textContent = "Kies eerst een antwoord voordat je checkt!";
      meldingElement.style.opacity = 1; // Toon melding
      return;
    }

    controleerAntwoord();
    nextButton.textContent = "Next";
    checkMode = false;
  } else {
    // Dan volgende vraag
    huidigeVraagIndex++;
    laadVraag();
    meldingElement.style.opacity = 0; // Verberg melding voor de volgende vraag
  }
});

main();


