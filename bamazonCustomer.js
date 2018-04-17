var mysql = require("mysql");
var inquirer = require("inquirer");

//connect to local sequel pro
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "products_db"
});

//Show Connection ID
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

//Show full inventory once connected
function afterConnection() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log("ID: " + res[i].id + " || " + "Product: " + res[i].product_name + " || " + "Price: $" + res[i].price);
    }
    makePurchase();
  });
}

//Why is inquirer coming up on connection?
function makePurchase() {
inquirer
  .prompt([{
      //The first should ask them the ID of the product they would like to buy.
      name: 'id',
      message: 'What product would you like to buy?',
      type: 'input',
      default: "01"
    },
    //message should ask how many units of the product they would like to buy.
    {
      name: 'units',
      message: 'How many would you like to buy?',
      type: 'input',
      default: 1
    }
  ])
  //If not enough in stock - show 'Insufficient Quanity' - DO I HAVE TO PUSH ALL OF THE PRODUCTS INTO AN ARRAY FIRST TO MAKE THIS WORK?
  .then(function (response) {
    connection.query("SELECT * FROM products", function (err, res) {
      if (err) throw err;
      var chosenItem;
      for (var i = 0; i < res.length; i++) {
        if (res[i].id === response.id) {
          chosenItem = res[i];
        }
      }
      //check stock of chosen item
      if (chosenItem.stock_quantity > response.units) {
        console.log("Sold");
      } else {
        console.log("Insufficient Quantity!")
      }
    });
  });
};

//If in stock - update the SQL database to reflect the remaining quantity. Once the update goes through, show the customer the total cost of their purchase.

//   connection.query("UPDATE auctions SET ? WHERE ?", [{
//     highest_bid: parseInt(response.newBid)
//   },
//   {
//     id: response.id
//   }
// ], function (err, res) {
//   if (err) throw err;
//   console.log(res.affectedRows);
// })