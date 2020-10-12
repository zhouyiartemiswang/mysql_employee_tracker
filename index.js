const { table } = require("console.table");
const inquirer = require("inquirer");
const mysql = require("mysql");

// const prompt = require("./lib/inquirer.js")
// const view = require("./lib/view.js");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId);
    // init();
});


