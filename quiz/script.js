import vragen from "./vragen.json" with {type: 'json'};

let huidigeVraagIndex = 0;
const maxVragen = 10;

const vraagElement = document.querySelector("h1");
const antwoordKnoppen = document.querySelectorAll(".btn");
const nextButton = document.querySelector(".next");

function laadVraag() {
  if (huidigeVraagIndex < maxVragen) {
    reset();
    const vraagInhoud = vragen[huidigeVraagIndex];
    // Het h1 element krijgt de aangeduide vraag al text inhoud
    vraagElement.textContent = vraagInhoud.vraag;
    // Al de knopppen krijgen de mogelijke antwoorden van de json file
    vraagInhoud.antwoorden.forEach((antwoord, index) => {
      antwoordKnoppen[index].textContent = antwoord;
      // Na het clicken van het de knop met 
      antwoordKnoppen[index].addEventListener("click", ()=> controleerAntwoord(antwoordKnoppen[index], antwoord, vraagInhoud.juisteAntwoord)) ;
    });
  } else {
    vraagElement.textContent = "Quiz voltooid!";
    antwoordKnoppen.forEach(knop => knop.style.display = "none");
    nextButton.style.display = "none";
  }
}
// Het antwoord word hier gecontroleerd
function controleerAntwoord(button, gekozenAntwoord, juisteAntwoord) {
  if (gekozenAntwoord === juisteAntwoord) {
    button.style.backgroundColor = "green";
    button.style.color = "white";
  } else {
    button.style.backgroundColor = "red";
    button.style.color = "white";
    
    antwoordKnoppen.forEach(knop => {
      if (knop.textContent === juisteAntwoord) {
        knop.style.backgroundColor = "green";
        knop.style.color = "white";
      }
    });
  }
  antwoordKnoppen.forEach(knop => knop.disabled = true); 
}

function reset() {
  antwoordKnoppen.forEach(btn => {
    btn.style.backgroundColor = "";
    btn.style.color = "black";
    btn.disabled = false;
  });
}

nextButton.addEventListener("click", () => {
  huidigeVraagIndex++;
  laadVraag();
});

laadVraag();
