const projects = document.querySelectorAll(".project");

function selectProject(projectName) {
  if (projectName === "Lord of the Rings") {
    setTimeout(() => {
      window.location.href = "/gameMode";
    }, 2300);
  }
}

projects.forEach((project) => {
  project.addEventListener("click", () => {
    const projectName = project
      .querySelector(".project-title")
      .innerText.trim();
    selectProject(projectName);
  });
});

function login() {
  window.location.href = "/login";
}
