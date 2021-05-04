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

// To return a coffee menu
app.get("/api/coffee", (req, res) => {
  let menu = database.get("menu").value();
  res.json(menu);
});

// To add orders
app.post("/api/order", (req, res) => {
  const menuItem = req.body;
  // menuItem.id = nanoid();
  const coffeeItem = database
    .get("menu")
    .find({ title: menuItem.title })
    .value();
  console.log(coffeeItem);

  const result = {
    success: false,
    menuItem: false,
  };
  if (!result.coffeeItem) {
    result.success = false;
    result.message = "The item doesn't exist in the menu";
  }
  if (coffeeItem) {
    result.success = true;
    result.message = "Succesfully sent your order of coffee";
    result.menuItem = true;

    order = database
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

  console.log("usernameExists:", userNameExists);

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
