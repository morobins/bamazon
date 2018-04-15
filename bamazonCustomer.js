var mysql = require("mysql");
var inquirer = require("inquirer");

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
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

//Show full inventory once connected
function afterConnection() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log(res);
    connection.end();
  });
}


inquirer
    .prompt([{
      //The first should ask them the ID of the product they would like to buy.
        name: 'name',
        message: 'What product would you like to buy?',
        type: 'input',
        default: "Computer"
      },
      //message should ask how many units of the product they would like to buy.
      {
        name: 'category',
        message: 'How many would you like to buy?',
        type: 'list',
        choices: ["Electronics", "Clothing", "Beauty", "Shoes", "Other"]
      }
    ])

    //If not enough in stock - show 'Insufficient Quanity'
    //If in stock - update the SQL database to reflect the remaining quantity. Once the update goes through, show the customer the total cost of their purchase.