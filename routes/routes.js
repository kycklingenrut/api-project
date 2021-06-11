const { Router } = require("express");
const {
  getMenu,
  postOrder,
  addAccount,
  getOrderHistory,
  login,
} = require("../handlers/db-handlers.js");

const router = new Router();

router.get("/coffee", (req, res) => {
  res.json(getMenu());
});

router.post("/order", (req, res) => {
  const orderDetails = req.body;
  res.json(postOrder(orderDetails));
});

// Creating a user-account
router.post("/account", (req, res) => {
  const account = req.body;
  res.json(addAccount(account));
});

//Get specific order/orderhistory later
router.get("/order/:id", (req, res) => {
  const userId = req.params.id;
  res.json(getOrderHistory(userId));
});

router.post("/login", (req, res) => {
  let user = req.body;
  res.json(login(user));
});

module.exports = router;
