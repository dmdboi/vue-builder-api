import express from "express";

import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

import router from "./routes";

const app = express();

app.use(bodyParser.json());
app.use(router);

async function connectMongo() {
  if (!process.env.MONGO_DB_URL) {
    throw new Error("MONGO_DB_URL is not defined in .env file");
  }

  mongoose.connect(process.env.MONGO_DB_URL).then(() => console.log("[ DB ] MongoDB Connected"));
}

async function startExpress() {
  app.listen(3000, async () => {
    console.log("[ Server ] Running on port 3000");
  });
}

async function main() {
  await connectMongo();
  await startExpress();
}

main();
