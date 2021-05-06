const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const { nanoid } = require("nanoid");
const moment = require("moment");

const adapter = new FileSync("menu.json");
const database = lowdb(adapter);

function initiateDatabase() {
  database.defaults({ menu: [] }, { orders: [] }, { accounts: [] }).write();
}

function getMenu() {
  let menu = database.get("menu").value();
  return menu;
}

function postOrder(orderDetails) {
  //Code for ETA and Current Time
  let eta = moment()
    .add(Math.floor(Math.random() * (10 - 5 + 1)) + 3, "m")
    .format("YYYY-MM-DD HH:mm:ss");
  let time = moment().format("HH:mm");

  //Code for ordering one/multiple coffee through array
  let title = [];
  let price = 0;
  for (let x = 0; x < orderDetails.id.length; x++) {
    let coffeeItem = database
      .get("menu")
      .find({ id: orderDetails.id[x] })
      .value();
    if (coffeeItem) {
      title.push(coffeeItem.title);
      price = price + coffeeItem.price;
    } else {
      return "No coffee for you, try again";
    }
  }
  const result = {
    success: false,
    orderDetails: false,
  };
  if (orderDetails) {
    result.success = true;
    result.message = "Successfully sent your order of coffee";
    const orderNumber = nanoid(3);
    order = database
      .get("orders")
      .push({
        id: orderDetails.id,
        title: title,
        price: price,
        userId: orderDetails.userId,
        orderNumber: orderNumber,
        ETA: eta,
        orderTime: time,
      })
      .write();
    return { orderNumber: orderNumber, ETA: eta };
  }
}

function addAccount(account) {
  // Checking if the username already exists
  const userNameExists = database
    .get("accounts")
    .find({ username: account.username })
    .value();

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
  return result;
}

function getOrderHistory(userId) {
  const order = database.get("orders").filter({ userId: userId }).value();
  let fullOrder = [];

  order.forEach((element) => {
    if (moment() > moment(element.ETA)) {
      element.status = "Delivered ";
    }
    if (moment() < moment(element.ETA)) {
      element.status = "Coffee coming up";
    }
    fullOrder.push(element);
  });
  const result = {
    success: false,
    order: false,
  };

  if (order.length > 0) {
    result.success = true;
    result.order = order;
  } else {
    result.success = false;
    result.message = "You have not placed an order yet";
  }
  return result;
}
exports.initiateDatabase = initiateDatabase;
exports.getMenu = getMenu;
exports.postOrder = postOrder;
exports.addAccount = addAccount;
exports.getOrderHistory = getOrderHistory;
