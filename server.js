const lowdb = require("lowdb");
const express = require("express");
const FileSync = require("lowdb/adapters/FileSync");
const { nanoid } = require('nanoid');
const adapter = new FileSync("menu.json");
const database = lowdb(adapter);

const app = express();
app.use(express.json());

function initiateDatabase() {
  database.defaults({ menu: [] }, { orders: [] } ).write();
}
// To return a coffee menu
 app.get('/api/coffee', (req, res) => {
  let menu = database.get('menu').value();
  res.json(menu);
});

// To add orders
 app.post('/api/order', (req, res) => {
    const menuItem = req.body;
  menuItem.id = nanoid();
   database.get('orders').push(menuItem).write();
   res.json({ "status":"successfully added"})   
 });

// To delete orders
//  app.delete('/api/:id', (req, res) => {  
//   const menuItem = req.params.id;
//   database.get('menu').remove({ id: menuItem }).write();
//    res.json({ "status":"successfully deleted"})   
// });

app.listen(8000, () => {
  console.log("server started");
  initiateDatabase();
});
