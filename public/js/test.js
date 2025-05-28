document.addEventListener("DOMContentLoaded", function () {
  const dataDiv = document.getElementById("game-data");

  if (!dataDiv) {
    console.error("Data-div niet gevonden");
    return;
  }

  try {
    const rawData = decodeURIComponent(dataDiv.dataset.json);
    const gameData = JSON.parse(rawData);
    const gameMode = dataDiv.dataset.mode;

    console.log("Game mode:", gameMode);
    console.log("Game data ontvangen:", gameData);
  } catch (err) {
    console.error("Fout bij parsen van gameData:", err);
  }
});
