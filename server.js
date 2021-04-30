const lowdb = require("lowdb");
const express = require("express");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("menu.json");
const database = lowdb(adapter);

const app = express();
app.use(express.json());

function initiateDatabase() {
  database.defaults({ menu: [] }, { account: [] }).write();
}

// /api/account 	POST 	Skapar ett användarkonto
app.post("/api/account", (request, response) => {
  const account = request.body;
  console.log("Konto att lägga till", account);

  const userNameExists = database
    .get("account")
    .find({ username: account.username })
    .value();

  console.log("usernameExits:", userNameExists);

  const result = {
    success: false,
    userNameExists: false,
  };

  if (userNameExists) {
    result.userNameExists = true;
  }
  if (!result.userNameExists) {
    database.get("account").push(account).write();
    result.success = true;
  }
  response.json(result);
});

app.listen(8000, () => {
  console.log("server started");
  initiateDatabase();
});
