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
    init();
});

function init() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "ans1",
                choices: [
                    "View All Employees", 
                    "View All Employees by Department", 
                    "View All Employees by Manager", 
                    "Add Employee", 
                    "Remove Employee", 
                    "Update Employee Role", 
                    "Update Employee Manager", 
                    "View All Roles", 
                    "Add Role", 
                    "Remove Role", 
                    "View All Departments", 
                    "Add Department",
                    "Remove Department",
                    "View Total Utilized Budget of a Department",
                    "Quit"
                ]
            }
        ]).then(function(answers) {
            view(answers.ans1);
            // console.log(answers);
            init();
        });

}

function view(userAns) {
    switch (userAns) {

        // case "View All Employees":
        //     connection.query("")
        //     break;

        // case "View All Employees by Department":
        //     connection.query("")
        //     break;

        // case "View All Employees by Manager":
        //     connection.query("")
        //     break;

        case "Add Employee":
            addEmployee();
            break;
            
        case "View All Departments":
            connection.query("SELECT * FROM department", function(err, data) {
                if (err) throw err;
                console.table(data);
            });
            break;

        case "View All Roles":
            connection.query("SELECT * FROM role", function(err, data) {
                if (err) throw err;
                console.table(data);
            });
            break;
        
        default:
            break;
    }
}

function addEmployee() {

}