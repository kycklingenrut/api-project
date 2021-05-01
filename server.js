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
// To return a coffee menu
 app.get('/api/coffee', (req, res) => {
  const menu = require('./menu.json');
  res.json(menu);
});

// To add orders




app.listen(8000, () => {
  console.log("server started");
  initiateDatabase();
});
