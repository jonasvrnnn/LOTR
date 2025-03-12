function selectProject(project) {
    document.getElementById('banner').innerText = project;
}

//inloggen
function login() {
    alert("Inloggen...");
}



//selecteren van project
function selectProject(projectName) {
    // Controleer of het geselecteerde project 'Wizards of the Forgotten Realm' is
    if (projectName === 'Wizards of the Forgotten Realm') {
        alert("Je kunt momenteel niet deelnemen aan dit project. Controleer de voorwaarden of neem contact op met de beheerder.");
    } else {
        document.getElementById('banner').innerText = "Geselecteerd: " + projectName;
    }
}



// //langs projecten scrollen
// Selecteer de projecten en banner
const projects = document.querySelectorAll('.project');
const banner = document.getElementById('banner');
let currentIndex = 0; // Start bij het eerste project

// De lijst van projectnamen
const projectNames = [
    'Chronicles of Eldoria',
    'Lord of the Rings',
    'Wizards of the Forgotten Realm'
];

// Functie om de actieve selectie bij te werken
function updateSelection() {
    projects.forEach((project, index) => {
        if (index === currentIndex) {
            project.classList.add('active'); // Markeer het geselecteerde project
        } else {
            project.classList.remove('active');
        }
    });

    // Update de banner met de naam van het geselecteerde project
    banner.innerText = `Geselecteerd: ${projectNames[currentIndex]}`;
}

// Scroll naar het volgende of vorige project in volgorde
function scrollProjects(direction) {
    currentIndex += direction;

    // Zorg ervoor dat de index binnen de grenzen blijft
    if (currentIndex < 0) {
        currentIndex = projects.length - 1; // Spring naar het laatste project
    } else if (currentIndex >= projects.length) {
        currentIndex = 0; // Spring terug naar het eerste project
    }

    updateSelection();
}

// Voeg event listeners toe aan de pijlen
// Linkerpijl: verhoog de index
document.getElementById('left-arrow').addEventListener('click', () => scrollProjects(1));

// Rechtermijl: verlaag de index
document.getElementById('right-arrow').addEventListener('click', () => scrollProjects(-1));

// Initialiseer de selectie met het eerste project
updateSelection();

// Functie om een project te selecteren met de muis
function selectProject(projectName) {
    // Zoek de index van het geselecteerde project
    const selectedIndex = projectNames.indexOf(projectName);
    currentIndex = selectedIndex; // Werk de index bij
    updateSelection(); // Update de actieve selectie

    // Update de banner
    banner.innerText = "Geselecteerd: " + projectName;
}

// Voeg event listeners toe voor het klikken op een project
projects.forEach((project) => {
    project.addEventListener('click', () => {
        // Haal de naam van het project op
        const projectName = project.querySelector('.project-title').innerText;
        selectProject(projectName); // Selecteer het project
    });
});

// Inlog functie
function login() {
    alert("Inloggen...");
}

