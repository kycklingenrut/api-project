const express = require("express");
const { initiateDatabase } = require("./handlers/db-handlers");
const coffeeRoutes = require("./routes/routes");
const app = express();

app.use(express.json());
app.use("/api", coffeeRoutes);

app.listen(8000, () => {
  console.log("server started");
  initiateDatabase();
});
