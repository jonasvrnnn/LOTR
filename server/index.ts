import express from "express";
import ejs from "ejs";
import { Db } from "mongodb";
import { loadGameData } from "./functions";
import { connectToDB, closeDB } from "./db";

// Initialisatie
const app = express();
const PORT = 3000;
let db: Db;

// View engine en static files
app.set("view engine", "ejs");
app.use(express.static("./public"));

// Routes
app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/gameMode", (req, res) => {
  res.render("gameMode");
});

app.get("/sudden_death", async (req, res) => {
  const gameData = await loadGameData(db);
  res.render("game", {
    gameMode: "sudden_death",
    explanation: `<p>Je krijgt vragen één voor één en hebt 30 seconden per vraag om te antwoorden. Maar pas op: als je één fout maakt, is het game over! Hoe ver kun jij komen? Succes!</p>
    <p>Denk goed na, speel tactisch en probeer zover mogelijk te komen. Succes!</p>`,
    gameData: encodeURIComponent(JSON.stringify(gameData)),
  });
});

app.get("/ten_rounds", async (req, res) => {
  const gameData = await loadGameData(db);
  res.render("game", {
    gameMode: "ten_rounds",
    explanation: `<p>Je krijgt 10 vragen en hebt 30 seconden per vraag om te antwoorden. Probeer zoveel mogelijk correcte antwoorden te geven binnen de tijd. Veel succes!</p>
    <p>Beantwoord zoveel mogelijk vragen correct om een hoge score te behalen. Als de tijd om is, ga je automatisch naar de volgende vraag. Succes!</p>`,
    gameData: encodeURIComponent(JSON.stringify(gameData)),
  });
});

// Eerst verbinden met DB, dan pas server starten
(async () => {
  try {
    db = await connectToDB();
    console.log("✅ Verbonden met MongoDB.");

    app.listen(PORT, () => {
      console.log(`🚀 Server draait op http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Fout bij verbinden met MongoDB:", err);
    process.exit(1);
  }
})();

// Sluit database netjes af bij afsluiten
process.on("SIGINT", async () => {
  console.log("\n🛑 SIGINT ontvangen. Database wordt afgesloten...");
  await closeDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 SIGTERM ontvangen. Database wordt afgesloten...");
  await closeDB();
  process.exit(0);
});

app.get("/register", (req, res) => {
  res.render("register");
});
