import express from "express";
import bcrypt from "bcrypt";
import session from "./session";
import ejs from "ejs";
import { Db } from "mongodb";
import { loadGameData, requireLogin } from "./functions";
import { connectToDB, closeDB } from "./db";

// Initialisatie
const app = express();
const PORT = 3000;
let db: Db;

app.use(express.urlencoded({ extended: true }));

app.use(session);

// View engine en static files
app.set("view engine", "ejs");
app.use(express.static("./public"));

// Routes
app.get("/", requireLogin, (req, res) => {
  res.render("landing", { username: req.session.user });
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
app.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  res.render("profile", { user: req.session.user });
});
app.get("/profile/edit", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  try {
    const user = await db
      .collection("users")
      .findOne({ username: req.session.user.username });
    if (!user) {
      return res.redirect("/login");
    }

    res.render("edit-profile", { user });
  } catch (err) {
    console.error(err);
    res.redirect("/profile");
  }
});
app.get("/statistics", requireLogin, async (req, res) => {
  const username = req.session.user?.username;
  if (!username) {
    return res.redirect("/login");
  }

  // Voorbeeld: resultaten ophalen uit db.collection('results') (pas aan naar jouw database structuur)
  const results = await db.collection("results").find({ username }).toArray();

  // Bereken highscores
  let suddenDeathHighscore = 0;
  let tenRoundsHighscore = 0;

  results.forEach((result) => {
    if (result.gameMode === "sudden_death") {
      if (result.score > suddenDeathHighscore)
        suddenDeathHighscore = result.score;
    }
    if (result.gameMode === "ten_rounds") {
      if (result.score > tenRoundsHighscore) tenRoundsHighscore = result.score;
    }
  });

  res.render("statistics", {
    suddenDeathHighscore,
    tenRoundsHighscore,
    allResults: results,
  });
});

//post requests

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await db.collection("users").findOne({ username });
  if (!user) {
    res.status(401).send("Gebruiker bestaat niet");
    return;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    res.status(401).send("Wachtwoord incorrect");
    return;
  }

  req.session.user = {
    _id: user._id.toString(),
    username: user.username,
    email: user.email,
    dateOfBirth: new Date(user.dateOfBirth),
    country: user.country,
    gender: user.gender ?? undefined,
    displayName: user.displayName ?? undefined,
    phoneNumber: user.phoneNumber ?? undefined,
    createdAt: new Date(user.createdAt),
  };

  res.redirect("/");
});

app.post("/register", async (req, res) => {
  const {
    username,
    email,
    dateOfBirth,
    country,
    gender,
    displayName,
    phoneNumber,
    password,
    confirmPassword,
  } = req.body;

  // Basisvalidatie
  if (
    !username ||
    !email ||
    !dateOfBirth ||
    !country ||
    !password ||
    !confirmPassword
  ) {
    res.status(400).send("Vul alle verplichte velden in");
  }

  // Wachtwoorden matchen
  if (password !== confirmPassword) {
    res.status(400).send("Wachtwoorden komen niet overeen");
  }

  // Check of gebruiker al bestaat op username of email
  const existingUser = await db.collection("users").findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    res.status(400).send("Gebruikersnaam of e-mail is al in gebruik");
  }

  // Optioneel: controle leeftijd (bv. 13+)
  const dob = new Date(dateOfBirth);
  const ageDifMs = Date.now() - dob.getTime();
  const ageDate = new Date(ageDifMs);
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);
  if (age < 13) {
    res.status(400).send("Je moet minstens 13 jaar oud zijn om te registreren");
  }

  // Hash wachtwoord
  const hashedPassword = await bcrypt.hash(password, 10);

  // Gebruiker opslaan
  await db.collection("users").insertOne({
    username,
    email,
    dateOfBirth: dob,
    country,
    gender: gender || null,
    displayName: displayName || null,
    phoneNumber: phoneNumber || null,
    password: hashedPassword,
    createdAt: new Date(),
  });

  res.redirect("/login");
});

app.post("/profile/edit", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const { displayName, email, dateOfBirth, country, gender, phoneNumber } =
    req.body;

  // Validatie (optioneel uitbreiden)
  if (!email || !dateOfBirth || !country) {
    res.status(400).send("Vul alle verplichte velden in.");
    return;
  }

  try {
    // Update gebruiker in database
    await db.collection("users").updateOne(
      { username: req.session.user.username },
      {
        $set: {
          displayName: displayName || null,
          email,
          dateOfBirth: new Date(dateOfBirth),
          country,
          gender: gender || null,
          phoneNumber: phoneNumber || null,
        },
      }
    );

    // Update sessie data (optioneel, als je email of andere data gebruikt)
    const updatedUser = await db
      .collection("users")
      .findOne({ username: req.session.user.username });
    if (updatedUser) {
      req.session.user = {
        _id: updatedUser._id.toString(),
        username: updatedUser.username,
        email: updatedUser.email,
        displayName: updatedUser.displayName,
        dateOfBirth: updatedUser.dateOfBirth,
        country: updatedUser.country,
        gender: updatedUser.gender,
        phoneNumber: updatedUser.phoneNumber,
        createdAt: updatedUser.createdAt,
      };
    }

    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send("Er is iets misgegaan bij het updaten van je profiel.");
  }
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
