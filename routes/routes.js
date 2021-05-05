const { Router } = require("express");
const {
  getMenu,
  postOrder,
  addAccount,
  getOrderHistory,
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

module.exports = router;
