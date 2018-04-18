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
      console.log("ID#: " + res[i].id + " || " + "Product: " + res[i].product_name + " || " + "Price : $" + res[i].price);
    }
    //inquirer prompts asking what product user wants to buy and how many
    inquirer
      .prompt([{
          //ask for ID of product they want to buy
          name: 'id',
          message: 'What is the ID# of the product you want to buy?',
          type: 'input',
          default: 1,
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        //message should ask how many units of the product they would like to buy.
        {
          name: 'units',
          message: 'How many would you like to buy?',
          type: 'input',
          default: 1,
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      //If not enough in stock - show 'Insufficient Quanity' 
      //it doesn't like when I try with a ? PLEASE HELP
      .then(function (response) {
        var itemPicked = {};
        for (var i = 0; i < res.length; i++) {
          if (res[i].id == response.id) {
            itemPicked = res[i];
          }
        }
        if (response.units <= itemPicked.stock_quantity) {
          console.log("Thank you for your purchase!");
          //If in stock - update the SQL database to reflect the remaining quantity. Once the update goes through, show the customer the total cost of their purchase.
          connection.query('UPDATE products SET stock_quantity = ? WHERE id = ?', [(itemPicked.stock_quantity - response.units), response.id], function (err, res) {
            if (err) throw err;
            console.log("Stock has been updated.");
          })
        } else {
          //If not enough in stock, console not enough message
          console.log("Sorry! Not enough product in stock.")
        }
      });
  });
};