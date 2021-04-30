const lowdb = require("lowdb");
const express = require("express");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("menu.json");
const database = lowdb(adapter);

const app = express();
app.use(express.json());

function initiateDatabase() {
  database.defaults({ menu: [] }).write();
}

app.listen(8000, () => {
  console.log("server started");
  initiateDatabase();
});
