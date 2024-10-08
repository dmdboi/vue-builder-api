#!/usr/bin/env node

const fs = require("fs");
const { MongoClient } = require("mongodb");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const [, , collectionName] = process.argv;

if (!collectionName) {
  console.error("Usage: node seeder.js <collectionName>");
  process.exit(1);
}

const uri = process.env.MONGO_DB_URL;

// Function to seed the database
async function seedDatabase() {
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("test");
    const collection = db.collection(collectionName);

    // Read and parse the JSON file
    const filePath = path.resolve(`./db/${collectionName}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!Array.isArray(data)) {
      console.error("JSON file must contain an array of objects.");
      process.exit(1);
    }

    // Insert data into the collection
    const result = await collection.insertMany(data);
    console.log(`Inserted ${result.insertedCount} documents into the collection '${collectionName}'`);
  } catch (err) {
    console.error("Error occurred while seeding the database:", err);
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log("Connection to MongoDB closed");
  }
}

// Run the seeder
seedDatabase();
