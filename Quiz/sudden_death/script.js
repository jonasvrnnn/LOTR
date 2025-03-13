const quotes = [];
const characters = [];
let gebruikteQuotes = [];
let score = 0;

const vraagElement = document.querySelector("h1");
const antwoordKnoppen = document.querySelectorAll(".btn");
const nextButton = document.querySelector(".next");

let geselecteerdeKnop = null;
let juisteCharacterId = null;
let checkMode = true;

// Maak de container voor de melding en de knop
const container = document.createElement("div");
nextButton.parentNode.insertBefore(container, nextButton); // Voeg de container net voor de nextButton toe

// Maak het melding div element dynamisch aan
const meldingElement = document.createElement("div");
meldingElement.style.marginTop = "10px";
meldingElement.style.color = "red";
meldingElement.style.fontWeight = "bold";
meldingElement.style.minHeight = "30px";  // Zorg ervoor dat er altijd genoeg ruimte is voor de melding

// Voeg de melding en de knop toe aan de container
container.appendChild(nextButton);
container.appendChild(meldingElement);

// CSS voor de container
container.style.display = 'flex';
container.style.flexDirection = 'column';
container.style.alignItems = 'center';
container.style.justifyContent = 'center';
container.style.marginTop = '20px';

// Zorg ervoor dat de melding altijd een vaste hoogte heeft
meldingElement.style.minHeight = '30px';  // Zorgt ervoor dat de melding geen ruimte krijgt om de knop te verplaatsen

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

function toonMelding(tekst, kleur = "red") {
  meldingElement.textContent = tekst;
  meldingElement.style.color = kleur;
}

function laadVraag() {
  reset();
  toonMelding(""); // Maak de melding leeg bij elke nieuwe vraag

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

  nextButton.textContent = "Check";
  checkMode = true;
  geselecteerdeKnop = null;
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
    toonMelding("Selecteer eerst een antwoord!");
    return;
  }

  antwoordKnoppen.forEach(knop => knop.disabled = true);

  const gekozenId = geselecteerdeKnop.gekozenId;

  if (gekozenId === juisteCharacterId) {
    geselecteerdeKnop.button.style.backgroundColor = "green";
    geselecteerdeKnop.button.style.color = "white";
    score++;
    nextButton.textContent = "Next";
    checkMode = false;
    toonMelding("Goed gedaan!", "green");
  } else {
    geselecteerdeKnop.button.style.backgroundColor = "red";
    geselecteerdeKnop.button.style.color = "white";

    const juisteCharacter = characters.find(c => c._id === juisteCharacterId);

    antwoordKnoppen.forEach(knop => {
      if (knop.textContent === juisteCharacter.name) {
        knop.style.backgroundColor = "green";
        knop.style.color = "white";
      }
    });

    // Toon de game over tekst enkel in de titel (vraagElement)
    vraagElement.textContent = `Game Over! Je eindscore is ${score}.`;
    antwoordKnoppen.forEach(knop => knop.style.display = "none");
    nextButton.style.display = "none";

    // Geen melding onder de knop na game over
    meldingElement.textContent = ""; // Leeg de melding, geen extra boodschap
  }
}

function reset() {
  antwoordKnoppen.forEach(btn => {
    btn.style.backgroundColor = "";
    btn.style.color = "black";
    btn.disabled = false;
  });

  geselecteerdeKnop = null;
}

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

main();
