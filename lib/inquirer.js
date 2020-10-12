const inquirer = require("inquirer");

// TODO: Add departments
// TODO: Add roles
// TODO: Add employees

// TODO: Remove employee
// TODO: Remove role
// TODO: Remove department

// TODO: Update employee roles
// TODO: Update employee manager

// TODO: View budget

function init() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "ans1",
                choices: ["View All Employees", "View All Employees by Department", "View All Employees by Manager", "View All Departments", "View All Roles"]
            }
        ]).then(function(answers) {
            if (answers.ans1 === "View All Employees") {
                
            }
            console.log(answers);
        });

}


module.exports = { init };