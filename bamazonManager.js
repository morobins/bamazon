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
  askTask();
});

function askTask() {
var tasks = ["View ProductS for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"];

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
      case "View ProductS for Sale":
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
};
//Show full inventory
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
    askTask();
  });
};

//show products with an inventory less than 5
function lowInventory() {
  console.log("These are the products with less than 5 units available");
  console.log("=====================================================\n");
  //SELECT artist, COUNT(*) - adds a new coloumn named "Count", From table, GROUP BY (aggregate)
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      // Log all results of the SELECT statement
      console.log("ID: " + res[i].id + " || " + "Product: " + res[i].product_name + " || " + "Price: $" + res[i].price + " || " + "Stock Available: " + res[i].stock_quantity)
    };
    askTask();
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
      askTask();
    });
};

//select an item and add to the inventory - DOES IT HAVE TO BE MORE SPECIFICALLY AND CHECK TO MAKE SURE IT IS A HIGHER NUMBER OR CAN IT JUST ADJUST THE INVENTORY
function addInventory() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    // console.log(res);
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
          message: 'How many units would you like to add?',
          type: 'input'
        }
      ])
      //Match the product selected with the corresponding product in the database
      //DO I NEED RES[i]??
      .then(function (response) {
        var itemPicked = {};
        // console.log(response);
        for (var i = 0; i < res.length; i++) {
          if (res[i].product_name === response.name) {
            itemPicked = res[i];
          }
        };
        // console.log(itemPicked);
        //update the inventory of that selected item
        console.log("Product Inventory Updated!");
        connection.query('UPDATE products SET stock_quantity = ' + (itemPicked.stock_quantity + parseInt(response.newInventory)) + ' WHERE id = ' + itemPicked.id, function (err, res) {
          if (err) throw err;
        
      // } else {
      //   console.log("Update not successful!")
      //   {}
            console.log(res.affectedRows);
          })
          askTask();
        });
      });
  };
