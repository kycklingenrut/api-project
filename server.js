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

 app.get('/api/coffee', (req, res) => {
  const menu = require('./menu.json');
  res.json(menu);
});


app.listen(8000, () => {
  console.log("server started");
  initiateDatabase();
});
