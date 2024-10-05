const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const { getContent, postContent } = require("./controllers/content");
const { getPageHTMLByRef, getPageByRef } = require("./controllers/pages");

const app = express();

app.use(bodyParser.json());

app.get("/content/:type", getContent);
app.post("/content", postContent);

app.get("/page/:ref", getPageByRef);
app.get("/page/:ref/html", getPageHTMLByRef);

async function connectMongo() {
  mongoose.connect(process.env.MONGO_DB_URL).then(() => console.log("Connected!"));
}

async function startExpress() {
  app.listen(3000, async () => {
    console.log("Server is running on port 3000");
  });
}

async function main() {
  await connectMongo();
  await startExpress();
}

main();
