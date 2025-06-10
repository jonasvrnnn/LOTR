"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const session_1 = __importDefault(require("./session"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const functions_1 = require("./functions");
const db_1 = require("./db");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
let db;
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(session_1.default);
// View engine en static files
app.set("view engine", "ejs");
app.use(express_1.default.static("./public"));
// Routes
app.get("/", functions_1.requireLogin, (req, res) => {
    res.render("landing", { username: req.session.user });
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/gameMode", (req, res) => {
    res.render("gameMode");
});
app.get("/sudden_death", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameData = yield (0, functions_1.loadGameData)(db);
    res.render("game", {
        gameMode: "sudden_death",
        explanation: `<p>Je krijgt vragen één voor één en hebt 30 seconden per vraag om te antwoorden. Maar pas op: als je één fout maakt, is het game over! Hoe ver kun jij komen? Succes!</p>
    <p>Denk goed na, speel tactisch en probeer zover mogelijk te komen. Succes!</p>`,
        gameData: encodeURIComponent(JSON.stringify(gameData)),
    });
}));
app.get("/ten_rounds", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameData = yield (0, functions_1.loadGameData)(db);
    res.render("game", {
        gameMode: "ten_rounds",
        explanation: `<p>Je krijgt 10 vragen en hebt 30 seconden per vraag om te antwoorden. Probeer zoveel mogelijk correcte antwoorden te geven binnen de tijd. Veel succes!</p>
    <p>Beantwoord zoveel mogelijk vragen correct om een hoge score te behalen. Als de tijd om is, ga je automatisch naar de volgende vraag. Succes!</p>`,
        gameData: encodeURIComponent(JSON.stringify(gameData)),
    });
}));
app.get("/profile", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    res.render("profile", { user: req.session.user });
});
app.get("/profile/edit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    try {
        const user = yield db
            .collection("users")
            .findOne({ username: req.session.user.username });
        if (!user) {
            return res.redirect("/login");
        }
        res.render("edit-profile", { user });
    }
    catch (err) {
        console.error(err);
        res.redirect("/profile");
    }
}));
app.get("/statistics", functions_1.requireLogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const username = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.username;
    if (!username) {
        return res.redirect("/login");
    }
    const results = yield db.collection("results").find({ username }).toArray();
    let suddenDeathHighscore = 0;
    let tenRoundsHighscore = 0;
    results.forEach((result) => {
        if (result.gameMode === "sudden_death" &&
            result.score > suddenDeathHighscore)
            suddenDeathHighscore = result.score;
        if (result.gameMode === "ten_rounds" && result.score > tenRoundsHighscore)
            tenRoundsHighscore = result.score;
    });
    const blacklistedQuotes = yield db
        .collection("blacklistedQuotes")
        .find()
        .toArray();
    res.render("statistics", {
        suddenDeathHighscore,
        tenRoundsHighscore,
        allResults: results,
        blacklistedQuotes,
    });
}));
//post requests
app.post("/save-result", functions_1.requireLogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { gameMode, score } = req.body;
    const username = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.username;
    if (!username) {
        res.status(401).json({ error: "Niet ingelogd" });
        return;
    }
    if (!gameMode || typeof score !== "number") {
        res.status(400).json({ error: "Ongeldige invoer" });
        return;
    }
    try {
        yield db.collection("results").insertOne({
            username,
            gameMode,
            score,
            date: new Date(),
        });
        res.status(200).json({ message: "Resultaat succesvol opgeslagen" });
    }
    catch (err) {
        console.error("Fout bij opslaan van resultaat:", err);
        res.status(500).json({ error: "Fout bij opslaan van resultaat" });
    }
}));
app.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { username, password } = req.body;
    const user = yield db.collection("users").findOne({ username });
    if (!user) {
        res.status(401).send("Gebruiker bestaat niet");
        return;
    }
    const isValid = yield bcrypt_1.default.compare(password, user.password);
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
        gender: (_a = user.gender) !== null && _a !== void 0 ? _a : undefined,
        displayName: (_b = user.displayName) !== null && _b !== void 0 ? _b : undefined,
        phoneNumber: (_c = user.phoneNumber) !== null && _c !== void 0 ? _c : undefined,
        createdAt: new Date(user.createdAt),
    };
    res.redirect("/");
}));
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, dateOfBirth, country, gender, displayName, phoneNumber, password, confirmPassword, } = req.body;
    // Basisvalidatie
    if (!username ||
        !email ||
        !dateOfBirth ||
        !country ||
        !password ||
        !confirmPassword) {
        res.status(400).send("Vul alle verplichte velden in");
    }
    if (password !== confirmPassword) {
        res.status(400).send("Wachtwoorden komen niet overeen");
    }
    const existingUser = yield db.collection("users").findOne({
        $or: [{ username }, { email }],
    });
    if (existingUser) {
        res.status(400).send("Gebruikersnaam of e-mail is al in gebruik");
    }
    const dob = new Date(dateOfBirth);
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    if (age < 13) {
        res.status(400).send("Je moet minstens 13 jaar oud zijn om te registreren");
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    yield db.collection("users").insertOne({
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
}));
app.post("/profile/edit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    const { displayName, email, dateOfBirth, country, gender, phoneNumber } = req.body;
    if (!email || !dateOfBirth || !country) {
        res.status(400).send("Vul alle verplichte velden in.");
        return;
    }
    try {
        yield db.collection("users").updateOne({ username: req.session.user.username }, {
            $set: {
                displayName: displayName || null,
                email,
                dateOfBirth: new Date(dateOfBirth),
                country,
                gender: gender || null,
                phoneNumber: phoneNumber || null,
            },
        });
        const updatedUser = yield db
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
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .send("Er is iets misgegaan bij het updaten van je profiel.");
    }
}));
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        db = yield (0, db_1.connectToDB)();
        console.log("✅ Verbonden met MongoDB.");
        app.listen(PORT, () => {
            console.log(`🚀 Server draait op http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error("❌ Fout bij verbinden met MongoDB:", err);
        process.exit(1);
    }
}))();
// Sluit database netjes af bij afsluiten
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\n🛑 SIGINT ontvangen. Database wordt afgesloten...");
    yield (0, db_1.closeDB)();
    process.exit(0);
}));
process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\n🛑 SIGTERM ontvangen. Database wordt afgesloten...");
    yield (0, db_1.closeDB)();
    process.exit(0);
}));
app.get("/register", (req, res) => {
    res.render("register");
});
