import { Movie, Quote, Character } from "./interface";
import { Db } from "mongodb";
const API_HEADERS = {
  Accept: "application/json",
  Authorization: "Bearer UCTCCx7EBG3IuHh7Cfst",
};

async function fetchAll(endpoint: string): Promise<any[]> {
  let page = 1;
  let allDocs: any[] = [];

  while (true) {
    const res = await fetch(`${endpoint}?limit=100&page=${page}`, {
      headers: API_HEADERS,
    });
    const data = await res.json();
    allDocs.push(...data.docs);

    if (data.docs.length < 100) break; // Laatste pagina
    page++;
  }

  return allDocs;
}

export async function loadGameData(db: Db): Promise<{
  quotes: Quote[];
  characters: Character[];
  movies: Movie[];
}> {
  console.time("total-load");

  console.time("check-db");
  const movieCount = await db.collection<Movie>("movies").countDocuments();
  const quoteCount = await db.collection<Quote>("quotes").countDocuments();
  const characterCount = await db
    .collection<Character>("characters")
    .countDocuments();
  console.timeEnd("check-db");

  let quotes: Quote[] = [];
  let characters: Character[] = [];
  let movies: Movie[] = [];

  if (movieCount === 0 && quoteCount === 0 && characterCount === 0) {
    console.log("⌛ Data wordt opgehaald van de API...");

    console.time("fetch-api");
    const [quotesData, charactersData, moviesData] = await Promise.all([
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
    quotes = quotesData.filter((q: Quote) => geldigeMovieIds.includes(q.movie));

    // Characters filteren op alleen characters die voorkomen in quotes
    const geldigeCharacterIds = quotes.map((q: Quote) => q.character);
    characters = charactersData.filter((c: Character) =>
      geldigeCharacterIds.includes(c._id)
    );

    console.log(`✅ Gefilterde movies: ${movies.length}`);
    console.log(`✅ Gefilterde quotes: ${quotes.length}`);
    console.log(`✅ Gefilterde characters: ${characters.length}`);

    console.time("insert-db");
    await db.collection<Movie>("movies").insertMany(movies);
    await db.collection<Quote>("quotes").insertMany(quotes);
    await db.collection<Character>("characters").insertMany(characters);
    console.timeEnd("insert-db");

    console.log("✅ Data succesvol toegevoegd aan MongoDB.");
  } else {
    console.log("⚠️ Data is al aanwezig in de database.");

    // Data ophalen uit DB
    movies = await db.collection<Movie>("movies").find().toArray();
    quotes = await db.collection<Quote>("quotes").find().toArray();
    characters = await db.collection<Character>("characters").find().toArray();
  }

  console.timeEnd("total-load");

  // Data teruggeven zodat route het kan gebruiken
  return { quotes, characters, movies };
}

export function requireLogin(req: any, res: any, next: any) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect("/login");
}
