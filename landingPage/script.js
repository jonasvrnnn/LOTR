function selectProject(project) {
    document.getElementById('banner').innerText = project;
}

//inloggen
function login() {
    alert("Inloggen...");
}



//selecteren van project
function selectProject(project) {
    if (project === 'Project 3') {
        alert("Je kunt momenteel niet deelnemen aan dit project. Controleer de voorwaarden of neem contact op met de beheerder.");
    } else {
        document.getElementById('banner').innerText = "Geselecteerd: " + project;
    }
}


//langs projecten scrollen
let currentIndex = 0;

function scrollProjects(direction) {
    const container = document.querySelector(".project-container");
    const projects = document.querySelectorAll(".project");
    const projectWidth = projects[0].offsetWidth + 20; // Breedte + margin

    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = 0;
    } else if (currentIndex > projects.length - 1) {
        currentIndex = projects.length - 1;
    }

    container.style.transform = `translateX(${-currentIndex * projectWidth}px)`;
}


