document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startButton");
    const pauseButton = document.getElementById("pauseButton");
    const exitButton = document.getElementById("exitButton");
    const popup = document.getElementById("popup");
    const popupBackground = document.getElementById("popupBackground");
    const popupMessage = document.getElementById("popupMessage");
    const confirmButton = document.getElementById("confirmButton");
    const cancelButton = document.getElementById("cancelButton");

    
    startButton.addEventListener("click", function () {
        startButton.style.display = "none";
        document.getElementById("quizContainer").style.display = "block";
        document.getElementById("controlButtons").style.display = "block";
    });

  
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

    
    pauseButton.addEventListener("click", function () {
        showPopup("Weet je zeker dat je de quiz wilt pauzeren?", function () {
        });
    });

    
    exitButton.addEventListener("click", function () {
        showPopup("Weet je zeker dat je de quiz wilt verlaten?", function () {
            window.location.reload(); 
        });
    });
});



