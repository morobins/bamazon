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
    //Bring in inquirer to ask initial questions for purchase
    inquirer
      .prompt([{
          //The first should ask them the ID of the product they would like to buy.
          name: 'id',
          message: 'What product would you like to buy (by ID number)?',
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
        var itemPicked = res[0];
        var query = "SELECT stock_quantity FROM products WHERE id ='" + response.id + "'";
        connection.query(query, function (err, res) {
          if (err) throw err;
          console.log(res);
          if (res.length === 0) {
            console.log("Error");
          } else if (response.units <= itemPicked.stock_quantity) {
            console.log("Sold! Thank you for your purchase!");
            //If in stock - update the SQL database to reflect the remaining quantity. Once the update goes through, show the customer the total cost of their purchase.
            connection.query('UPDATE products SET stock_quantity = ' + (itemPicked.stock_quantity - parseInt(response.units)) + ' WHERE id = ' + response.id, function (err, res) {
              if (err) throw err;
              console.log("Stock updated!");
            })
          } else {
            console.log("Insufficient Quantity!")
          }
        });
      });
  });
}
