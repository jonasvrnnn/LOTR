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
    gameData: encodeURIComponent(JSON.stringify(gameData)),
  });
});

app.get("/ten_rounds", async (req, res) => {
  const gameData = await loadGameData(db);
  res.render("game", {
    gameMode: "ten_rounds",
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
