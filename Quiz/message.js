const motivationalMessages = [
    "Je hebt de wijsheid van Gandalf! Goed gedaan 🧙‍♂️!",
    "Dat was een machtig antwoord, waardig voor een koning 👑!" ,
    "Eén antwoord om ze allemaal te verslaan! Je hebt het goed 💍🔥!" ,
    "Zelfs Elrond zou onder de indruk zijn van jouw kennis 📜!" ,
    "Net als Legolas’ pijlen, raakte jouw antwoord doel 🏹!" ,
    "De weg gaat altijd verder, en jij bewandelt hem met wijsheid 🛤️!",
    "Dat was een legendarisch antwoord, waardig voor de Zaal van Gondor 🏰!",
    "Zelf Sauron zou niet kunnen ontkennen dat dit juist was 👁️!",
    "Bij het licht van Eärendil, jij bent echt slim 🌟!",
    "Je hebt bewezen zo wijs te zijn als de elfen van Rivendel 🌿!" 

];


let quizCompleted = false;

function showMotivationalMessage() {
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    const message = motivationalMessages[randomIndex];

   
    document.getElementById("motivationalMessage").innerText = message;
    document.getElementById("motivationalMessage").style.display = "block"; 
}


function completeQuiz() {
    
    quizCompleted = true;
    showMotivationalMessage(); 
}


document.getElementById("submitAnswer").addEventListener("click", function() {
    
    if (!quizCompleted) {
        
        showMotivationalMessage();
    }
  
    completeQuiz(); 


document.getElementById("submitAnswer").addEventListener("click", function() {
    if (!quizCompleted) {
        showMotivationalMessage();  
    }
    completeQuiz();  
});


document.querySelector(".next").addEventListener("click", function() {
});

});
