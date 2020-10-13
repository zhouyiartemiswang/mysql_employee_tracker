const { table } = require("console.table");
const mysql = require("mysql");
const inquirer = require("inquirer");
// const connection = require("./connection");
const viewCommand = "SELECT employee.id, employee.first_name AS `First Name`, employee.last_name AS `Last Name`, role.title AS Title, department.name AS Department, role.salary AS Salary, CONCAT(manager.first_name, \" \", manager.last_name) AS Manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id";

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
                    "View All Roles",
                    "View All Departments",
                    "View Total Utilized Budget of a Department",
                    "Add Employee",
                    "Add Role",
                    "Add Department",
                    "Remove Employee",
                    "Remove Role",
                    "Remove Department",
                    "Update Employee Role",
                    "Update Employee Manager",
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

        case "View All Employees by Department":
            viewEmployeesByDepartment();
            break;

        case "View All Employees by Manager":
            viewEmployeesByManager();
            break;

        case "View All Roles":
            viewAllRoles();
            break;

        case "View All Departments":
            viewAllDepartments();
            break;

        case "View Total Utilized Budget of a Department":
            viewBudget();
            break;

        case "Add Employee":
            addEmployee();
            break;

        case "Add Role":
            addRole();
            break;

        case "Add Department":
            addDepartment();
            break;

        case "Remove Employee":
            remove("employee");
            break;

        case "Remove Role":
            remove("role");
            break;

        case "Remove Department":
            remove("department");
            break;

        case "Update Employee Role":
            updateEmployee("role");
            break;

        case "Update Employee Manager":
            updateEmployee("manager");
            break;

        default:
            break;
    }
}

function viewAllEmployees() {
    connection.query(viewCommand, function (err, data) {
        if (err) throw err;
        console.table(data);
        init();
    });
}

function viewEmployeesByDepartment() {
    connection.query("SELECT * FROM department", function (err, data) {
        if (err) throw err;
        // console.log(data);
        let departmentList = [];
        data.forEach(function (departmentEl) {
            departmentList.push(departmentEl.name);
        });
        inquirer
            .prompt([
                {
                    type: "list",
                    message: "Which department would you like to see?",
                    name: "department",
                    choices: departmentList
                }
            ]).then(function (answers) {
                connection.query(`SELECT * FROM (${viewCommand}) AS employee_combined WHERE Department = ?`, answers.department, function (err, data) {
                    if (err) throw err;
                    console.table(data);
                    init();
                });
            });
    });
}

function viewEmployeesByManager() {
    connection.query(viewCommand, function (err, data) {
        if (err) throw err;
        // console.log(data);
        let managerList = [];
        data.forEach(function (managerEl) {
            if (!managerList.includes(managerEl.Manager) && managerEl.Manager != null) {
                managerList.push(managerEl.Manager);
            }
        });
        console.log(managerList);
        inquirer
            .prompt([
                {
                    type: "list",
                    message: "Which manager would you like to see?",
                    name: "manager",
                    choices: managerList
                }
            ]).then(function (answers) {
                connection.query(`SELECT * FROM (${viewCommand}) AS employee_combined WHERE Manager = ?`, answers.manager, function (err, data) {
                    if (err) throw err;
                    console.table(data);
                    init();
                });
            });
    });
}

function viewAllRoles() {
    connection.query("SELECT role.id AS ID, role.title AS Title, role.salary AS salary, department.name AS Department FROM role LEFT JOIN department ON role.department_id = department.id", function (err, data) {
        if (err) throw err;
        console.table(data);
        init();
    });
}

function viewAllDepartments() {
    connection.query("SELECT id AS ID, name AS Department FROM department", function (err, data) {
        if (err) throw err;
        console.table(data);
        init();
    });
}

function viewBudget() {
    connection.query("SELECT name FROM department", function (err, data) {
        if (err) throw err;
        let departmentList = [];
        data.forEach(function (departmentEl) {
            departmentList.push(departmentEl.name);
        });
        inquirer
            .prompt([
                {
                    type: "list",
                    message: "Which department's budget do you want to see?",
                    name: "department",
                    choices: departmentList
                }
            ]).then(function (answers) {
                connection.query("SELECT department.id FROM department WHERE department.name = ?", answers.department, function (err, departmentId) {
                    if (err) throw err;
                    connection.query("SELECT SUM(salary) AS dept_budget FROM role WHERE department_id = ?", departmentId[0].id, function(err, budget) {
                        if (err) throw err;
                        console.log(`The budget for ${answers.department} department is $${budget[0].dept_budget}.`);
                        init();
                    });
                });
                
            });
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
                                        let managerList = ["None"];
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
                                                        viewAllEmployees();
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

// TODO: add new department if department is not listed 
function addRole() {
    connection.query("SELECT department.name FROM department", function (err, data) {
        let departmentList = [];
        data.forEach(function (departmentEl) {
            departmentList.push(departmentEl.name);
        });
        inquirer
            .prompt([
                {
                    type: "input",
                    message: "What role do you want to add?",
                    name: "role"
                },
                {
                    type: "number",
                    message: "What is the salary for that role?",
                    name: "salary"
                },
                {
                    type: "list",
                    message: "Which department does the role belong to?",
                    name: "department",
                    choices: departmentList
                },
            ]).then(function (answers) {
                // console.log(answers);
                connection.query("SELECT department.id FROM department WHERE department.name = ?", answers.department, function (err, data) {
                    if (err) throw err;
                    // console.log(data);
                    connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answers.role, answers.salary, data[0].id], function (err, data) {
                        if (err) throw err;
                        console.log("New role is added to the list.");
                        viewAllRoles();
                    })
                });
            });
    });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What department do you want to add?",
                name: "department"
            }
        ]).then(function (answers) {
            connection.query("INSERT INTO department (name) VALUES (?)", answers.department, function (err, data) {
                if (err) throw err;
                console.log("New department is added to the list.");
                viewAllDepartments();
            })
        });
}

function remove(keyword) {
    let queryCommandSelect = "";
    let queryCommandDelete = "";
    if (keyword === "employee") {
        queryCommandSelect = "SELECT CONCAT(employee.first_name, \" \", employee.last_name) AS employee_name FROM employee";
        queryCommandDelete = "DELETE FROM employee WHERE CONCAT(employee.first_name, \" \", employee.last_name) = ?";
    } else if (keyword === "role") {
        queryCommandSelect = "SELECT role.title FROM role";
        queryCommandDelete = "DELETE FROM role WHERE role.title = ?";
    } else if (keyword === "department") {
        queryCommandSelect = "SELECT department.name FROM department";
        queryCommandDelete = "DELETE FROM department WHERE department.name = ?";
    } else {
        return console.log("Wrong keyword, try again!");
    }
    connection.query(queryCommandSelect, function (err, data) {
        if (err) throw err;
        console.log(data);
        let choiceList = [];
        data.forEach(function (el) {
            if (keyword === "employee") {
                choiceList.push(el.employee_name);
            } else if (keyword === "role") {
                choiceList.push(el.title);
            } else if (keyword === "department") {
                choiceList.push(el.name);
            }
        });
        inquirer
            .prompt([
                {
                    type: "list",
                    message: `Which ${keyword} do you want to remove?`,
                    name: "keyword",
                    choices: choiceList
                }
            ]).then(function (answers) {
                connection.query(queryCommandDelete, answers.keyword, function (err, data) {
                    if (err) throw err;
                    console.log(`${answers.keyword} is removed from the list.`);
                    if (keyword === "employee") {
                        viewAllEmployees();
                    } else if (keyword === "role") {
                        viewAllRoles();
                    } else if (keyword === "department") {
                        viewAllDepartments();
                    }
                });
            });
    });
}

// TODO: exclude current role from role list
function updateEmployee(keyword) {
    connection.query("SELECT CONCAT(employee.first_name, \" \", employee.last_name) AS employee_name FROM employee", function (err, data) {
        if (err) throw err;
        // console.log(data);
        let employeeList = [];
        data.forEach(function (employeeEl) {
            employeeList.push(employeeEl.employee_name);
        });


        connection.query("SELECT role.title FROM role", function (err, data) {
            if (err) throw err;
            console.log(data);
            let choiceList = [];
            data.forEach(function (el) {
                choiceList.push(el.title);
            });
            if (keyword === "manager") {
                choiceList = employeeList;
            }
            inquirer
                .prompt([
                    {
                        type: "list",
                        message: `Which employee's ${keyword} do you want to update?`,
                        name: "employee",
                        choices: employeeList
                    },
                    {
                        type: "list",
                        message: `Which ${keyword} do you want to set for the selected employee?`,
                        name: "updateEl",
                        choices: choiceList
                    }
                ]).then(function (answers) {
                    console.log(typeof answers.updateEl);
                    let queryCommandSelect = "";
                    let queryCommandUpdate = "";

                    if (keyword === "role") {
                        queryCommandSelect = "SELECT role.id FROM role WHERE role.title = ?";
                        queryCommandUpdate = "UPDATE employee SET role_id = ? WHERE CONCAT(employee.first_name, \" \", employee.last_name) = ?";
                    } else if (keyword === "manager") {
                        queryCommandSelect = "SELECT employee.id FROM employee WHERE CONCAT(employee.first_name, \" \", employee.last_name) = ?";
                        queryCommandUpdate = "UPDATE employee SET manager_id = ? WHERE CONCAT(employee.first_name, \" \", employee.last_name) = ?";
                    } else {
                        return console.log("Wrong keyword, try again!");
                    }

                    connection.query(queryCommandSelect, answers.updateEl, function (err, data) {
                        if (err) throw err;
                        console.log(data);
                        connection.query(queryCommandUpdate, [data[0].id, answers.employee], function (err, data) {
                            if (err) throw err;
                            console.log(`${answers.employee}'s ${keyword} is updated.`);
                            viewAllEmployees();
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