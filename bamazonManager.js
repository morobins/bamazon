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
// connection.connect(function (err) {
//   if (err) throw err;
//   console.log("connected as id " + connection.threadId);
// });

var tasks = ["View Product for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"];

//Ask what do you want to do - list four options
inquirer
  .prompt([{
    name: 'selectTask',
    message: 'What do you want to do?',
    type: 'list',
    choices: tasks
  }])
  .then(function (action) {

    switch (action.selectTask) {
      case "View Product for Sale":
        viewProducts();
        break;

      case "View Low Inventory":
        lowInventory();
        break;

      case "Add to Inventory":
        addInventory();
        break;

      case "Add New Product":
        newProduct();
        break;
    }
  });

//Show full inventory once connected
function viewProducts() {
  console.log("These are the products currently for sale at Bamazon");
  console.log("==================================================\n");
  //SELECT artist, COUNT(*) - adds a new coloumn named "Count", From table, GROUP BY (aggregate)
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      // Log all results of the SELECT statement
      console.log("ID: " + res[i].id + " || " + "Product: " + res[i].product_name + " || " + "Price: $" + res[i].price + " || " + "Stock Available: " + res[i].stock_quantity)
    };
  });
};

//show products with an inventory less than 10
function lowInventory() {
  console.log("These are the products with less than 10 units available");
  console.log("==================================================\n");
  //SELECT artist, COUNT(*) - adds a new coloumn named "Count", From table, GROUP BY (aggregate)
  connection.query("SELECT * FROM products WHERE stock_quantity < 10", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      // Log all results of the SELECT statement
      console.log("ID: " + res[i].id + " || " + "Product: " + res[i].product_name + " || " + "Price: $" + res[i].price + " || " + "Stock Available: " + res[i].stock_quantity)
    };
  });
};

//update inventory of a specific item
function newProduct() {
  inquirer
    .prompt([{
        name: 'name',
        message: 'What product would you like to add?',
        type: 'input'
      },
      {
        name: 'department',
        message: 'What department should this product be added to?',
        type: 'input'
      },
      {
        name: 'price',
        message: 'How much does it cost?',
        type: 'input',
      },
      {
        name: 'stock',
        message: 'How many units are available?',
        type: 'input'
      }
    ])
    //add the prduct to the database
    .then(function (product) {
      console.log("Inserting a new product...\n");
      var query = connection.query(
        "INSERT INTO products SET ?", {
          product_name: product.name,
          department_name: product.department,
          price: product.price,
          stock_quantity: product.stock
        },
        function (err, res) {}
      );
    });
};

//select an item and update the inventory
function addInventory() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    var items = [];
    for (var i = 0; i < res.length; i++) {
      items.push(res[i].product_name);
    }
    inquirer
      .prompt([{
          name: 'name',
          message: 'What product would you like to update the inventory for?',
          type: 'list',
          choices: items
        },
        {
          name: 'newInventory',
          message: 'How many units are available?',
          type: 'input'
        }
      ])
      //Match the product selected with the corresponding product in the database
      .then(function (response) {
        var itemPicked = {};
        console.log(response);
        for (var i = 0; i < res.length; i++) {
          if (res[i].product_name === response.name) {
            itemPicked = res[i];
          }
        };
        console.log(itemPicked);
        //update the inventory of that selected item
        {
          console.log("you are the new high bidder");
          connection.query("UPDATE auctions SET ? WHERE ?", [{
              highest_bid: parseInt(response.newBid)
            },
            {
              id: itemPicked.id
            }
          ], function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows);
          })
        }
      });
  });
};