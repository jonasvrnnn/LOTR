
const motivationalMessages = [
    "Goed gedaan, je hebt het geweldig gedaan!",
    "Je hebt fantastisch gepresteerd, blijf zo doorgaan!",
    "Je bent op de goede weg, blijf leren!",
    "Uitstekend! Je hebt alles goed gedaan!",
    "Prachtig werk! Je hebt alle uitdagingen overwonnen!"
];


let quizCompleted = false;

function showMotivationalMessage() {
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    const message = motivationalMessages[randomIndex];

   
    document.getElementById("motivationalMessage").innerText = message;
    document.getElementById("motivationalMessage").style.display = "block"; // Zorg ervoor dat het zichtbaar is
}


function completeQuiz() {
    // Zet quizCompleted naar true
    quizCompleted = true;
    showMotivationalMessage(); // Toon het motiverende bericht
}

// Eventlistener voor de quizbeëindiging (hier kun je je eigen logica voor quiz voltooiing aanpassen)
document.getElementById("submitAnswer").addEventListener("click", function() {
    // Hier kun je controleren of de laatste vraag is beantwoord
    // For now, we will simulate this with the 'completeQuiz' function
    if (!quizCompleted) {
        // Als de quiz niet is voltooid, toon een motiverend bericht na elke vraag
        showMotivationalMessage();
    }
    // Simuleer dat de quiz voltooid is na de laatste vraag
    // Bijvoorbeeld na de laatste vraag kan completeQuiz worden aangeroepen
    // In een echte situatie kun je dit aanpassen aan je eigen logica voor de laatste vraag
    completeQuiz(); // Roep de functie aan als de laatste vraag is beantwoord
});
