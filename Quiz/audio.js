document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startButton");
    const quizContainer = document.getElementById("quizContainer");
    const controlButtons = document.getElementById("controlButtons");
    const lotrAudio = document.getElementById("lotrAudio");
    const pauseButton = document.getElementById("pauseButton");

    // start muziek
    function startAudio() {
        lotrAudio.play().catch(error => {
            console.log("Autoplay geblokkeerd, gebruiker moet handmatig starten.");
        });
    }

    
    startButton.addEventListener("click", function() {
        quizContainer.style.display = "block";  
        controlButtons.style.display = "block"; 
        startAudio();
    });

    
});

