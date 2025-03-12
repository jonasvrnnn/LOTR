const quotes = [];
const characters = [];
let gebruikteQuotes = [];
let score = 0;

let huidigeVraagIndex = 0;
const maxVragen = 10;

const vraagElement = document.querySelector("h1");
const antwoordKnoppen = document.querySelectorAll(".btn");
const nextButton = document.querySelector(".next");
let aangeduid = false;

const headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer UCTCCx7EBG3IuHh7Cfst'
}

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

    // deze loop checked of er geen quote dubbel voorkomt in de quiz
    do {
      vraagInhoud = quotes[Math.floor(Math.random() * quotes.length)];
    } while (gebruikteQuotes.includes(vraagInhoud._id));

    gebruikteQuotes.push(vraagInhoud._id);

    vraagElement.textContent = vraagInhoud.dialog;


    const juisteCharacter = characters.find(c => c._id === vraagInhoud.character);

    // hier word een selectie gemaakt van character namen die niet overeen komen met de quote in de variabele vraaginhoud
    let fouteCharacters = characters
      .filter(c => c._id !== vraagInhoud.character)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    // hier word er met de spread operator een array gemaakt van de 3 foute en 1 juist antwoord waarin de volgorde random wordt gesorteert
    let antwoorden = [...fouteCharacters, juisteCharacter].sort(() => 0.5 - Math.random());

    // hier worden de antwoorden array toegewezen aan de textcontent van de knoppen
    antwoordKnoppen.forEach((knop, index) => {
      knop.textContent = antwoorden[index].name;
      // bij elke click word er een event overschreven op elke knop
      knop.onclick = function () {
        controleerAntwoord(knop, antwoorden[index]._id, juisteCharacter._id);
      };

    });

  } else {

    // Wanneer de 10 vragen voorbij zijn krijgt de gebruiker zijn totaalscore te zien
    vraagElement.textContent = `Quiz voltooid! Je score: ${score}/${maxVragen}`;
    antwoordKnoppen.forEach(knop => knop.style.display = "none");
    nextButton.style.display = "none";
  }
}

// in deze functie worden de id's vergeleken met elkaar de als het overeen komt word deze knop groen. anders word deze rood en zal het juiste antwoord ook zichtbaar worden door deze een groene achtergrond te geven
function controleerAntwoord(button, gekozenId, juisteId) {
  const juisteCharacter = characters.find(c => c._id === juisteId);

  if (gekozenId === juisteId) {
    button.style.backgroundColor = "green";
    button.style.color = "white";
    score++;
  } else {
    button.style.backgroundColor = "red";
    button.style.color = "white";


    antwoordKnoppen.forEach(knop => {
      if (knop.textContent === juisteCharacter.name) {
        knop.style.backgroundColor = "green";
        knop.style.color = "white";
      }
    });
  }

  aangeduid = true;
  // nadat een knop is geselecteerd kan je niet opnieuw een knop induwen
  antwoordKnoppen.forEach(knop => knop.disabled = true);
}

// de reset functie word aangeroepen aan het begin van laad vraag, hier word alles terug default gezet. 
function reset() {
  antwoordKnoppen.forEach(btn => {
    btn.style.backgroundColor = "";
    btn.style.color = "black";
    btn.disabled = false;
  });

  aangeduid = false;
}

// je kan enkel op de next button duwen als er een selectie is gemaakt.
nextButton.addEventListener("click", () => {
  if (aangeduid) {
    huidigeVraagIndex++;
    laadVraag();
  }
});


main();
