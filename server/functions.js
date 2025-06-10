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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadGameData = loadGameData;
exports.requireLogin = requireLogin;
const API_HEADERS = {
    Accept: "application/json",
    Authorization: "Bearer UCTCCx7EBG3IuHh7Cfst",
};
function fetchAll(endpoint) {
    return __awaiter(this, void 0, void 0, function* () {
        let page = 1;
        let allDocs = [];
        while (true) {
            const res = yield fetch(`${endpoint}?limit=100&page=${page}`, {
                headers: API_HEADERS,
            });
            const data = yield res.json();
            allDocs.push(...data.docs);
            if (data.docs.length < 100)
                break; // Laatste pagina
            page++;
        }
        return allDocs;
    });
}
function loadGameData(db) {
    return __awaiter(this, void 0, void 0, function* () {
        console.time("total-load");
        console.time("check-db");
        const movieCount = yield db.collection("movies").countDocuments();
        const quoteCount = yield db.collection("quotes").countDocuments();
        const characterCount = yield db
            .collection("characters")
            .countDocuments();
        console.timeEnd("check-db");
        let quotes = [];
        let characters = [];
        let movies = [];
        if (movieCount === 0 && quoteCount === 0 && characterCount === 0) {
            console.log("⌛ Data wordt opgehaald van de API...");
            console.time("fetch-api");
            const [quotesData, charactersData, moviesData] = yield Promise.all([
                fetchAll("https://the-one-api.dev/v2/quote"),
                fetchAll("https://the-one-api.dev/v2/character"),
                fetchAll("https://the-one-api.dev/v2/movie"),
            ]);
            console.timeEnd("fetch-api");
            console.log(`🎥 Movies ontvangen: ${moviesData.length}`);
            console.log(`🧠 Characters ontvangen: ${charactersData.length}`);
            console.log(`🗣️ Quotes ontvangen: ${quotesData.length}`);
            // Films filteren (laatste paar)
            movies = moviesData.slice(5); // skip eerste 5
            const geldigeMovieIds = movies.map((m) => m._id);
            // Quotes filteren op alleen geldige films
            quotes = quotesData.filter((q) => geldigeMovieIds.includes(q.movie));
            // Characters filteren op alleen characters die voorkomen in quotes
            const geldigeCharacterIds = quotes.map((q) => q.character);
            characters = charactersData.filter((c) => geldigeCharacterIds.includes(c._id));
            console.log(`✅ Gefilterde movies: ${movies.length}`);
            console.log(`✅ Gefilterde quotes: ${quotes.length}`);
            console.log(`✅ Gefilterde characters: ${characters.length}`);
            console.time("insert-db");
            yield db.collection("movies").insertMany(movies);
            yield db.collection("quotes").insertMany(quotes);
            yield db.collection("characters").insertMany(characters);
            console.timeEnd("insert-db");
            console.log("✅ Data succesvol toegevoegd aan MongoDB.");
        }
        else {
            console.log("⚠️ Data is al aanwezig in de database.");
            // Data ophalen uit DB
            movies = yield db.collection("movies").find().toArray();
            quotes = yield db.collection("quotes").find().toArray();
            characters = yield db.collection("characters").find().toArray();
        }
        console.timeEnd("total-load");
        // Data teruggeven zodat route het kan gebruiken
        return { quotes, characters, movies };
    });
}
function requireLogin(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    return res.redirect("/login");
}
