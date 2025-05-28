"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const mongodb_1 = require("mongodb");
const readline = __importStar(require("readline-sync"));
const uri = "mongodb+srv://jonasverbruggen6:LprLmCOY7D3OFcz6@cluster0.9gykguf.mongodb.net/";
const client = new mongodb_1.MongoClient(uri);
let voortgaan = true;
let cursor;
let result;
let naam;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("verbonden met mongoDB");
            while (voortgaan === true) {
                let antwoord = readline.question("Wat wil je doen?:\n1: persoon toevoegen\n2: personen bekijken\n3: een specifieke persoon bekijken.\n4: een persoon verwijderen\n5: stoppen\n");
                switch (antwoord) {
                    // persoon toevoegen aan de database
                    case "1":
                        console.clear();
                        naam = readline.question("Geef een naam\n");
                        let leeftijd = Number(readline.question("geef de leeftijd\n"));
                        let persoon = { naam: naam, leeftijd: leeftijd };
                        result = yield client
                            .db("demo_db")
                            .collection("personen")
                            .insertOne(persoon);
                        console.log(`persoon gemaakt op id: ${result.insertedId}`);
                        break;
                    // alle personen tonen van de database
                    case "2":
                        console.clear();
                        cursor = client.db("demo_db").collection("personen").find();
                        let personen = yield cursor.toArray();
                        console.log(personen);
                        break;
                    // een specifieke persoon tonen uit de database
                    case "3":
                        console.clear();
                        let keuze = readline.question("persoon zoeken op naam of leeftijd?\n");
                        if (keuze === "naam") {
                            naam = readline.question("Op welke naam wil je zoeken?\n");
                            cursor = client
                                .db("demo_db")
                                .collection("personen")
                                .find({ naam: naam });
                            result = yield cursor.toArray();
                            console.log(result);
                        }
                        else if (keuze === "leeftijd") {
                            let leeftijd = Number(readline.question("Op welke leeftijd wil je zoeken?\n"));
                            cursor = client
                                .db("demo_db")
                                .collection("personen")
                                .find({ leeftijd: leeftijd });
                            result = yield cursor.toArray();
                            console.log(result);
                        }
                        else {
                            console.log("kies een schrijf naam of leeftijd!!");
                        }
                        break;
                    // een persoon verwijderen uit de database
                    case "4":
                        console.clear();
                        naam = readline.question("Welke persoon wenst u te verwijderen?");
                        cursor = yield client
                            .db("demo_db")
                            .collection("personen")
                            .deleteMany({ naam: naam });
                        console.log(`${cursor.deletedCount} persoon/personen met de naam ${naam} is/zijn verwijderd.`);
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
        }
        catch (e) {
            console.log(e);
        }
        finally {
            yield client.close();
            console.log("Verbinding gesloten!");
        }
    });
}
main();
