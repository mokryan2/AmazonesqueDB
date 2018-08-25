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
function managerCommand() {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Inventory", "Add to Inventory", "Add New Product", "Finish Working"]
        }
    ]).then((action) => {
        if (action.choice === "View Products for Sale") {
            console.log("Pulling up items list...\n");
            connection.query("SELECT * FROM products", (err, res) => {
                if (err) throw err;
                for (var i in res) {
                    console.log("======================================");
                    console.log(
                        "Item Number: " + res[i].id +
                        "\nProduct Name: " + res[i].product_name +
                        "\nDepartment: " + res[i].department_name +
                        "\nPrice: $" + res[i].price +
                        "\nStock Left: " + res[i].stock_quantity);
                    console.log("======================================");
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
                        console.log("===========================================");
                        console.log(
                            "Item Number: " + res[i].id +
                            "\nProduct Name: " + res[i].product_name +
                            "\nDepartment: " + res[i].department_name +
                            "\nStock Left: " + res[i].stock_quantity +
                            "\nThis item is running low on supplies!" +
                            "\nPlease refill stock!");
                        console.log("===========================================");
                    }
                    else {
                        console.log("===================================================================");
                        console.log("Item number " + res[i].id + " currently has enough in stock!");
                        console.log("===================================================================");
                    }
                }
                managerCommand();
            })
        }
        if (action.choice === "Add to Inventory") {
            inquirer.prompt([
                {
                    name: "listItem",
                    message: "Which ID would you like to order more of?"
                },
                {
                    name: "supplyItem",
                    message: "How much would you like to add?"
                }
            ]).then((addInventory) => {
                connection.query("SELECT * FROM products WHERE id =" + "'" + addInventory.listItem + "'", (err, res) => {
                    if (err) throw err;
                    var addToQuantity = parseInt(res[0].stock_quantity) + parseInt(addInventory.supplyItem);
                    connection.query("UPDATE products SET stock_quantity = " + addToQuantity + " WHERE id = " + addInventory.listItem + ";", (err, stockRes) => {
                        if (err) throw err;
                        console.log("=====================================================");
                        console.log(
                            "Product #" + res[0].id + " has been restocked!" +
                            "\nPlease check your new stock!")
                        console.log("=====================================================");
                        managerCommand();
                    })
                })
            })
        }
        if (action.choice === "Add New Product") {
            inquirer.prompt([
                {
                    name: "productName",
                    message: "What is the product called?"
                },
                {
                    name: "deptName",
                    message: "What department does it belong to?"
                },
                {
                    name: "cost",
                    message: "How much does it cost?",
                },
                {
                    name: "inventory",
                    message: "How much are you adding?"
                }
            ]).then((newProduct) => {
                connection.query("INSERT INTO products(product_name, department_name, price, stock_quantity) values ('" + newProduct.productName + "' , '" + newProduct.deptName + "'," + newProduct.cost + "," + newProduct.inventory + ")", (err, res) => {
                    if (err) throw err;
                    console.log("=================================");
                    console.log("Your new item has been added!" +
                        "\nDon't forget to check your product list!")
                    console.log("=================================");
                    managerCommand();
                })
            })
        }
        if (action.choice === "Finish Working"){
            console.log("Thank you for your work! See you next time!");
            process.exit(1);
        }
    })
}

managerCommand();