const lowdb = require("lowdb");
const express = require("express");
const FileSync = require("lowdb/adapters/FileSync");
const { nanoid } = require("nanoid");

const adapter = new FileSync("menu.json");
const database = lowdb(adapter);

const app = express();
app.use(express.json());

function initiateDatabase() {
  database.defaults({ menu: [] }, { orders: [] }, { accounts: [] }).write();
}

// Creating a user-account
app.post("/api/account", (req, res) => {
  const account = req.body;
  console.log("Account to add", account);

  // Checking if the username already exists
  const userNameExists = database
    .get("accounts")
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
  // If username doesnt exist, write account-details to DB
  // and append a random ID with 10 characters
  if (!result.userNameExists) {
    database
      .get("accounts")
      .push({
        userId: nanoid(10),
        username: account.username,
        password: account.password,
      })
      .write();
    result.success = true;
  }
  res.json(result);
});

//Get specific order/orderhistory later
app.get("/api/order/:id", (req, res) => {
  const orderDetails = req.params.id;
  console.log("Order details:", orderDetails);

  const allOrders = database.get("order").value();

  let result = {};
  if (allOrders.length > 0) {
    result.success = true;
  } else {
    result.success = false;
    result.message = "This order doesn't exist yet";
  }

  res.json(result);
});
app.listen(8000, () => {
  console.log("server started");
  initiateDatabase();
});
