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

// To add orders
app.post("/api/order", (req, res) => {
  const menuItem = req.body;
  // menuItem.id = nanoid();
  const coffeeItem = database
    .get("menu")
    .find({ title: menuItem.title })
    .value();
  console.log(coffeeItem);
  const userStatus = database
    .get("accounts")
    .find({ userId: menuItem.id })
    .value();

  const result = {
    success: false,
    menuItem: false,
    userStatus: false,
  };
  if (!result.coffeeItem || !result.userStatus) {
    result.success = false;
    result.message =
      "The item doesn't exist in the menu or you got the wrong account";
  }
  if (coffeeItem && userStatus) {
    result.success = true;
    result.menuItem = true;
    result.userStatus = true;
    database
      .get("orders")
      .push({
        id: coffeeItem.id,
        title: coffeeItem.title,
        price: coffeeItem.price,
        userId: menuItem.id,
        orderNumber: nanoid(3),
      })
      .write();
  }
  res.json(result);
});

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
        id: nanoid(10),
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

  const allOrders = database
    .get("orders")
    .filter({ userId: orderDetails })
    .value();
  console.log(allOrders);

  let result = {};
  if (allOrders.length > 0) {
    result.success = true;
  } else {
    result.success = false;
    result.message = "You have not placed an order yet";
  }

  res.json(allOrders);
});
app.listen(8000, () => {
  console.log("server started");
  initiateDatabase();
});
