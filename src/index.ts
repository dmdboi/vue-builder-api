import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

import router from "./routes";
import { connectMongo } from "./libs/database";

const app = express();

app.use(bodyParser.json());
app.use(router);

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
