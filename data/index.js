const connection = require("./connection.js");

const viewCommand = "SELECT employee.id AS ID, employee.first_name AS `First Name`, employee.last_name AS `Last Name`, role.title AS Title, department.name AS Department, role.salary AS Salary, CONCAT(manager.first_name, \" \", manager.last_name) AS Manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id";

function displayAllEmployees() {
    return connection.query(viewCommand);
}

function findAllDepartments() {
    return connection.query("SELECT id AS ID, name AS Department FROM department");
}

function displayEmployeeByDepartment(answers) {
    return connection.query(`SELECT * FROM (${viewCommand}) AS employee_combined WHERE Department = ?`, answers.department);
}

function displayEmployeeByManager(answers) {
    return connection.query(`SELECT * FROM (${viewCommand}) AS employee_combined WHERE Manager = ?`, answers.manager);
}

function displayAllRoles() {
    return connection.query("SELECT role.id AS ID, role.title AS Title, role.salary AS Salary, department.name AS Department FROM role LEFT JOIN department ON role.department_id = department.id");
}

function getDepartmentId(answers) {
    return connection.query("SELECT ID FROM department WHERE department.name = ?", answers.department);
}

function getDepartmentBudget(departmentId) {
    return connection.query("SELECT SUM(salary) AS dept_budget FROM role WHERE department_id = ?", departmentId[0].ID);
}

function getRoleTitle() {
    return connection.query("SELECT role.title FROM role");
}

function getRoleTitleFromDeptId(departmentId) {
    return connection.query("SELECT role.title FROM role WHERE role.department_id = ?", departmentId[0].ID);
}

function getRoleId(answers) {
    return connection.query("SELECT role.id FROM role WHERE role.title = ?", answers.keyword);
}

function getManagerName() {
    return connection.query("SELECT CONCAT(employee.first_name, \" \", employee.last_name) AS manager FROM employee");
}

function getEmployeeName() {
    return connection.query("SELECT CONCAT(employee.first_name, \" \", employee.last_name) AS employee_name FROM employee");
}

function getEmployeeId(answers) {
    return connection.query("SELECT employee.id FROM employee WHERE CONCAT(employee.first_name, \" \", employee.last_name) = ?", answers.keyword)
}

function addEmployee(employeeInfo) {
    connection.query("INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", employeeInfo);
}

function addRole(roleInfo) {
    connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", roleInfo);
}

function addDepartment(answers) {
    connection.query("INSERT INTO department (name) VALUES (?)", answers.department);
}

function removeEmployee(answers) {
    connection.query("DELETE FROM employee WHERE CONCAT(employee.first_name, \" \", employee.last_name) = ?", answers.keyword);
}

function removeRole(answers) {
    connection.query("DELETE FROM role WHERE role.title = ?", answers.keyword);
}

function removeDepartment(answers) {
    connection.query("DELETE FROM department WHERE department.name = ?", answers.keyword);
}

function updateEmployeeRole(updateInfo) {
    connection.query("UPDATE employee SET role_id = ? WHERE CONCAT(employee.first_name, \" \", employee.last_name) = ?", updateInfo);
}

function updateEmployeeManager(updateInfo) {
    connection.query("UPDATE employee SET manager_id = ? WHERE CONCAT(employee.first_name, \" \", employee.last_name) = ?", updateInfo);
}

module.exports = { 
    displayAllEmployees,
    findAllDepartments,
    displayEmployeeByDepartment,
    displayEmployeeByManager,
    displayAllRoles,
    getDepartmentId,
    getDepartmentBudget,
    getRoleTitle,
    getRoleTitleFromDeptId,
    getRoleId,
    getManagerName,
    getEmployeeName,
    getEmployeeId,
    addEmployee,
    addRole,
    addDepartment,
    removeEmployee,
    removeRole,
    removeDepartment,
    updateEmployeeRole,
    updateEmployeeManager
}

