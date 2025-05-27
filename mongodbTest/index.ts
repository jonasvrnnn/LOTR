import { MongoClient } from "mongodb";
import * as readline from "readline-sync";
const uri =
  "mongodb+srv://jonasverbruggen6:LprLmCOY7D3OFcz6@cluster0.9gykguf.mongodb.net/";
const client = new MongoClient(uri);
let voortgaan: boolean = true;
let cursor;
let result;
let naam;
interface Persoon {
  naam: string;
  leeftijd: number;
}
async function main() {
  try {
    await client.connect();
    console.log("verbonden met mongoDB");
    while (voortgaan === true) {
      let antwoord = readline.question(
        "Wat wil je doen?:\n1: persoon toevoegen\n2: personen bekijken\n3: een specifieke persoon bekijken.\n4: een persoon verwijderen\n5: stoppen\n"
      );
      switch (antwoord) {
        // persoon toevoegen aan de database
        case "1":
          console.clear();
          naam = readline.question("Geef een naam\n");
          let leeftijd: number = Number(
            readline.question("geef de leeftijd\n")
          );
          let persoon: Persoon = { naam: naam, leeftijd: leeftijd };
          result = await client
            .db("demo_db")
            .collection<Persoon>("personen")
            .insertOne(persoon);
          console.log(`persoon gemaakt op id: ${result.insertedId}`);
          break;
        // alle personen tonen van de database
        case "2":
          console.clear();
          cursor = client.db("demo_db").collection<Persoon>("personen").find();
          let personen = await cursor.toArray();
          console.log(personen);
          break;
        // een specifieke persoon tonen uit de database
        case "3":
          console.clear();
          let keuze = readline.question(
            "persoon zoeken op naam of leeftijd?\n"
          );
          if (keuze === "naam") {
            naam = readline.question("Op welke naam wil je zoeken?\n");
            cursor = client
              .db("demo_db")
              .collection<Persoon>("personen")
              .find({ naam: naam });
            result = await cursor.toArray();
            console.log(result);
          } else if (keuze === "leeftijd") {
            let leeftijd: number = Number(
              readline.question("Op welke leeftijd wil je zoeken?\n")
            );
            cursor = client
              .db("demo_db")
              .collection<Persoon>("personen")
              .find({ leeftijd: leeftijd });
            result = await cursor.toArray();
            console.log(result);
          } else {
            console.log("kies een schrijf naam of leeftijd!!");
          }
          break;
        // een persoon verwijderen uit de database
        case "4":
          console.clear();
          naam = readline.question("Welke persoon wenst u te verwijderen?");
          cursor = await client
            .db("demo_db")
            .collection<Persoon>("personen")
            .deleteMany({ naam: naam });
          console.log(
            `${cursor.deletedCount} persoon/personen met de naam ${naam} is/zijn verwijderd.`
          );
          break;
        case "5":
          console.clear();
          voortgaan = false;
          break;

        default:
          break;
      }
      readline.question("Druk op Enter om verder te gaan...");
      console.clear();
    }
  } catch (e) {
    console.log(e);
  } finally {
    await client.close();
    console.log("Verbinding gesloten!");
  }
}
main();
