import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);
const dbName = "lotrGame";

let dbInstance: any = null;

export async function connectToDB() {
  if (!dbInstance) {
    await client.connect();
    dbInstance = client.db(dbName);
  }
  return dbInstance;
}

export async function closeDB() {
  await client.close();
  console.log("database is afgesloten.");
}
