//====Dependencies====//
const mysql = require("mysql");
const inquirer = require("inquirer");
require("dotenv").config();

//====Server Connection====/

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'bamazon_db'
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected as ID ${connection.threadId}`)
});

// ===== Manager Options ===== //

managerCommand();

function managerCommand() {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function (action) {
        if (action.choice === "View Products for Sale") {
            console.log("Pulling up items list...\n");
            connection.query("SELECT * FROM products", (err, res) => {
                if (err) throw err;
                for (var i in res) {
                    console.log("============================");
                    console.log(
                        "Item Number: " + res[i].id +
                        "\nProduct Name: " + res[i].product_name +
                        "\nDepartment: " + res[i].department_name +
                        "\nPrice: $" + res[i].price +
                        "\nStock Left: " + res[i].stock_quantity);
                    console.log("============================");
                }
                managerCommand();
            })
        };
        if (action.choice === "View Inventory") {
            console.log("Pulling up items list...\n");
            connection.query("SELECT * FROM products", (err, res) => {
                for (var i in res) {
                    if (res[i].stock_quantity < 50000) {
                        if (err) throw err;
                        console.log("============================");
                        console.log(
                            "Item Number: " + res[i].id +
                            "\nProduct Name: " + res[i].product_name +
                            "\nDepartment: " + res[i].department_name +
                            "\nStock Left: " + res[i].stock_quantity +
                            "\nThis item is running low on supplies!"+
                            "\nPlease refill stock!");
                        console.log("============================");
                    }
                    else {
                        console.log("============================");
                        console.log("Item number " + res[i].id + " currently has enough in stock!");
                        console.log("============================");
                    }
                }
                managerCommand();
            })
        }
        if (action.choice === "Add to Inventory") {

        }
    })
}