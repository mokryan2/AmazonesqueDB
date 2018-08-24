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
    })
}
displayItems();