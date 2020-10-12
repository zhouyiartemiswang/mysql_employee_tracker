const { table } = require("console.table");
const mysql = require("mysql");
const inquirer = require("inquirer");
// const connection = require("./connection");

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
        ]).then(function (answers) {
            view(answers.ans1);
            // console.log(answers);
        });

}

function view(userAns) {
    switch (userAns) {

        case "View All Employees":
            viewAllEmployees();
            break;

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
            connection.query("SELECT * FROM department", function (err, data) {
                if (err) throw err;
                console.table(data);
                init();
            });
            break;

        case "View All Roles":
            connection.query("SELECT * FROM role", function (err, data) {
                if (err) throw err;
                console.table(data);
                init();
            });
            break;

        default:
            break;
    }
}

function viewAllEmployees() {
    connection.query("SELECT employee.id, employee.first_name AS `First Name`, employee.last_name AS `Last Name`, role.title AS Title, department.name AS Department, role.salary AS Salary, CONCAT(manager.first_name, \" \", manager.last_name) AS Manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id", function (err, data) {
        if (err) throw err;
        console.table(data) 
    });
}

function addEmployee() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the employee's first name?",
                name: "firstName"
            },
            {
                type: "input",
                message: "What is the employee's last name?",
                name: "lastName"
            }
        ]).then(function (answers) {

            let employeeInfo = [];
            employeeInfo.push(answers.firstName, answers.lastName);
            // let roleId = getRoleId(answers.department);
            // employeeInfo.push(roleId);
            connection.query("SELECT * FROM department", function (err, data) {
                if (err) throw err;
                // console.log(data);
                let departmentList = [];
                data.forEach(function (departmentEl) {
                    departmentList.push(departmentEl.name);
                });
                // console.log(managerList);
                inquirer.prompt([
                    {
                        type: "list",
                        message: "What is the employee's department?",
                        name: "department",
                        choices: departmentList
                    }
                ]).then(function (answers) {

                    connection.query("SELECT department.id FROM department WHERE department.name = ?", answers.department, function (err, departmentId) {
                        if (err) throw err;

                        connection.query("SELECT role.title FROM role WHERE role.department_id = ?", departmentId[0].id, function (err, roleTitle) {
                            if (err) throw err;
                            // console.log(roleTitle);
                            // console.log(typeof roleTitle);
                            let roleList = [];
                            roleTitle.forEach(function (roleEl) {
                                roleList.push(roleEl.title);
                            })
                            // console.log(roleList);
                            inquirer
                                .prompt([
                                    {
                                        type: "list",
                                        message: "What is the employee's role?",
                                        name: "role",
                                        choices: roleList
                                    }
                                ]).then(function (answers) {
                                    connection.query("SELECT role.id FROM role WHERE role.title = ?", answers.role, function (err, roleId) {
                                        if (err) throw err;
                                        employeeInfo.push(roleId[0].id);
                                        // console.log(employeeInfo);
                                        // employeeNameList();
                                        let managerList = [];
                                        connection.query("SELECT CONCAT(employee.first_name, \" \", employee.last_name) AS manager FROM employee", function (err, data) {
                                            if (err) throw err;
                                            // console.log(data);
                                            data.forEach(function (managerEl) {
                                                managerList.push(managerEl.manager);
                                            })
                                            // console.log(managerList);
                                            inquirer.prompt([
                                                {
                                                    type: "list",
                                                    message: "What is the employee's manager?",
                                                    name: "manager",
                                                    choices: managerList
                                                }
                                            ]).then(function (answers) {
                                                connection.query("SELECT employee.id FROM employee WHERE CONCAT(employee.first_name, \" \", employee.last_name) = ?", answers.manager, function (err, managerId) {
                                                    if (err) throw err;
                                                    employeeInfo.push(managerId[0].id);
                                                    console.log(employeeInfo);
                                                    connection.query("INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", employeeInfo, function (err, data) {
                                                        if (err) throw err;
                                                        console.log(`${employeeInfo[0]} ${employeeInfo[1]} is added to employee list.`);
                                                        connection.query("SELECT * FROM employee", function (err, data) {
                                                            console.table(data);
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                        });

                    });
                });
            });

        });
}

function employeeNameList() {
                connection.query("SELECT CONCAT(employee.first_name, \" \", employee.last_name) AS manager FROM employee", function (err, data) {
                    if (err) throw err;
                    console.log(data);
                });
            }
function getRoleId(department) {
                connection.query("SELECT department.id FROM department WHERE department.name = ?", department, function (err, departmentId) {
                    if (err) throw err;

                    connection.query("SELECT role.title FROM role WHERE role.department_id = ?", departmentId[0].id, function (err, roleTitle) {
                        if (err) throw err;
                        // console.log(roleTitle);
                        // console.log(typeof roleTitle);
                        let roleList = [];
                        roleTitle.forEach(function (roleEl) {
                            roleList.push(roleEl.title);
                        })
                        // console.log(roleList);
                        inquirer
                            .prompt([
                                {
                                    type: "list",
                                    message: "What is the employee's role?",
                                    name: "role",
                                    choices: roleList
                                }
                            ]).then(function (answers) {
                                connection.query("SELECT role.id FROM role WHERE role.title = ?", answers.role, function (err, roleId) {
                                    if (err) throw err;
                                    return roleId;
                                });
                            });
                    });

                });
            }
// init();
module.exports = { init };