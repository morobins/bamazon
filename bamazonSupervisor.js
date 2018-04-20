var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");

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
  superTasks();
});

function superTasks() {
var tasks = ["View Product Sales by Department", "Create New Department"];

inquirer
  .prompt([{
    name: 'options',
    message: 'What do you want to do?',
    type: 'list',
    choices: tasks
  }])
  .then(function (action) {

    switch (action.options) {
      case "View Product Sales by Department":
        viewProductSales();
        break;

      case "Create New Department":
        createDepartment();
        break;
    }
  });
};

// View Product Sales by Department

// When a supervisor selects View Product Sales by Department, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.

// department_id	department_name	over_head_costs	product_sales	total_profit

// The total_profit column should be calculated on the fly using the difference between over_head_costs and product_sales. total_profit should not be stored in any database. You should use a custom alias.


// Create New Department
function createDepartment() {
  inquirer
    .prompt([{
        name: 'name',
        message: 'What department would you like to add?',
        type: 'input'
      },
      {
        name: 'costs',
        message: 'What is the overhead cost?',
        type: 'input'
      }
    ])
    //add the prduct to the database
    .then(function (department) {
      console.log("New department added!\n");
      var query = connection.query(
        "INSERT INTO departments SET ?", {
          department_name: department.name,
          over_head_costs: department.costs
        },
        function (err, res) {
          if(err) throw err;
        }
      );
      superTasks();
    });
}

