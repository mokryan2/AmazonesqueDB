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

function displayItems() {
    console.log("Pulling up item list...\n");
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
        };
        searchItems();
    })
}
displayItems();

// ===== Purchase Process ===== //
function searchItems() {
    // Asks what you want to buy//
    inquirer.prompt([
        {
            name: "choice",
            message: "Which ID # would you like to buy?",
            validate:(val) => {
                if (isNaN(val) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then((answers) => {
        // Asks how many you want to buy //
        inquirer.prompt([
            {
                name: "quantity",
                message: "How many would you like to buy?",
                validate: (val) => {
                    if (isNaN(val) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then((purchase) => {
            // Looks at chosen item //
            connection.query("SELECT * FROM products WHERE id=" + "'" + answers.choice + "'", (err, res) => {
                if (err) throw err;
                if (purchase.quantity <= res[0].stock_quantity) {
                    var remainder = res[0].stock_quantity - purchase.quantity;
                    var purchaseTotal = purchase.quantity * res[0].price;
                    console.log("============================");
                    console.log("You want to purchase " + purchase.quantity + " of:");
                    console.log("============================");
                    console.log(
                        "Item Number: " + res[0].id +
                        "\nProduct Name: " + res[0].product_name +
                        "\nDepartment: " + res[0].department_name +
                        "\nPrice: $" + res[0].price)
                    console.log("============================");
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "confirmPurchase",
                            message: "Current sale is $" + purchaseTotal + ", is this right?",
                            choices: ["Yes", "No"]
                        }
                    ]).then((complete) => {
                        // Updates inventory if yes //
                        if (complete.confirmPurchase === "Yes") {
                            console.log("=============================================");
                            console.log("Your purchase of " + res[0].product_name + " is on the way!");
                            console.log("=============================================");
                            connection.query("UPDATE products SET stock_quantity =" + remainder + " WHERE id=" + answers.choice + ";",(err, res) => {
                                if (err) throw err;
                                inquirer.prompt([
                                    {
                                        type: "list",
                                        name: "buyMore",
                                        message: "Do you want to buy something else?",
                                        choices: ["Yes", "No"]
                                    }
                                    // Lets you buy more //
                                ]).then((extraPurchase) => {
                                    if(extraPurchase.buyMore === "Yes"){
                                        displayItems();
                                    }
                                    // Ends cycle //
                                    if(extraPurchase.buyMore === "No"){
                                        console.log("=============================================");
                                        console.log("Thank you for shopping with us! See you next time!");
                                        console.log("=============================================");
                                        process.exit(1);
                                    }
                                })
                            })
                        }
                        // Start over if no //
                        if (complete.confirmPurchase === "No"){
                            console.log("=============================================");
                            console.log("Thank you for shopping with us!");
                            console.log("=============================================");
                            inquirer.prompt([
                                {
                                    type: "list",
                                    name: "buyMore",
                                    message: "Do you want to buy something else?",
                                    choices: ["Yes", "No"]
                                }
                            ]).then((extraPurchase) => {
                                if(extraPurchase.buyMore === "Yes"){
                                    displayItems();
                                }
                                if(extraPurchase.buyMore === "No"){
                                    console.log("=============================================");
                                    console.log("Thank you for shopping with us! See you next time!");
                                    console.log("=============================================");
                                    process.exit(1);
                                }
                            })
                        }
                    })
                }
                else{
                    console.log("=============================================");
                    console.log("That item is not in stock! Please try again!")
                    console.log("=============================================");
                    searchItems();
                }
            })
        })
    })
};