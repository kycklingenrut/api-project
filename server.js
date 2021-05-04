const lowdb = require("lowdb");
const express = require("express");
const FileSync = require("lowdb/adapters/FileSync");
const { nanoid } = require("nanoid");
const moment = require("moment");

const adapter = new FileSync("menu.json");
const database = lowdb(adapter);

const app = express();
app.use(express.json());

function initiateDatabase() {
  database.defaults({ menu: [] }, { orders: [] }, { accounts: [] }).write();
}

// To return a coffee menu
app.get("/api/coffee", (req, res) => {
  let menu = database.get("menu").value();
  res.json(menu);
});

// To add orders
app.post("/api/order", (req, res) => {
  const orderDetails = req.body;

  //Code for ETA and Current Time
  let eta = Math.floor(Math.random() * 10) + 3 + " minutes";
  let time = moment().format("HH:mm");

  // menuItem.id = nanoid();
  const coffeeItem = database
    .get("menu")
    .find({ title: orderDetails.title })
    .value();
  console.log(coffeeItem);

  const result = {
    success: false,
    orderDetails: false,
  };
  if (!result.coffeeItem) {
    result.success = false;
    result.message = "The item doesn't exist in the menu";
  }
  if (coffeeItem) {
    result.success = true;
    result.message = "Successfully sent your order of coffee";
    const orderNumber = nanoid(3);
    order = database
      .get("orders")
      .push({
        id: coffeeItem.id,
        title: coffeeItem.title,
        price: coffeeItem.price,
        userId: orderDetails.id,
        orderNumber: orderNumber,
        ETA: eta,
        orderTime: time,
      })
      .write();
    result.orderDetails = { orderNumber: orderNumber, ETA: eta };
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

  console.log(userNameExists);

  const result = {
    success: false,
    userNameExists: false,
  };

  if (userNameExists) {
    result.userNameExists = true;
    result.message = "Username already exists, try another one";
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
    result.userNameExists = account;
    result.message = "Successfully created account";
  }
  res.json(result);
});

//Get specific order/orderhistory later
app.get("/api/order/:id", (req, res) => {
  const userId = req.params.id;
  console.log("Order details:", userId);

  const orderExists = database.get("orders").filter({ userId: userId }).value();
  console.log(orderExists);

  const result = {
    success: false,
    orderExists: false,
  };

  if (orderExists.length > 0) {
    result.success = true;
    result.orderExists = orderExists;
  } else {
    result.success = false;
    result.message = "You have not placed an order yet";
  }

  res.json(result);
});

app.listen(8000, () => {
  console.log("server started");
  initiateDatabase();
});
