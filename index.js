const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const { getContent, postContent, listContent, getContentHTML } = require("./controllers/content");
const { getPageHTMLByRef, getPageByRef } = require("./controllers/pages");
const { findAllComponents } = require("./libs/template");

const app = express();

app.use(bodyParser.json());

app.get("/content/:type", listContent);
app.get("/content/:type/:ref", getContent);
app.get("/content/:type/:ref/html", getContentHTML);
app.post("/content", postContent);

app.get("/page/:ref", getPageByRef);
app.get("/page/:ref/html", getPageHTMLByRef);

app.post("/tree", async (req, res) => {
  const results = await findAllComponents(req.body, []);
  res.json(results);
});

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
