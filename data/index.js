const connection = require("./connection.js");

const viewCommand = "SELECT employee.id AS ID, employee.first_name AS `First Name`, employee.last_name AS `Last Name`, role.title AS Title, department.name AS Department, role.salary AS Salary, CONCAT(manager.first_name, \" \", manager.last_name) AS Manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id";

// Get all employees including id, first and last name, title, department, salary and manager
function displayAllEmployees() {
    return connection.query(viewCommand);
}

// Get department id and name
function findAllDepartments() {
    return connection.query("SELECT id AS ID, name AS Department FROM department");
}

// Get all employees for a specific department 
function displayEmployeeByDepartment(answers) {
    return connection.query(`SELECT * FROM (${viewCommand}) AS employee_combined WHERE Department = ?`, answers.department);
}

// Get all employees for a specific manager
function displayEmployeeByManager(answers) {
    return connection.query(`SELECT * FROM (${viewCommand}) AS employee_combined WHERE Manager = ?`, answers.manager);
}

// Get all roles including id, title, salary, and department
function displayAllRoles() {
    return connection.query("SELECT role.id AS ID, role.title AS Title, role.salary AS Salary, department.name AS Department FROM role LEFT JOIN department ON role.department_id = department.id");
}

// Get department id given department name
function getDepartmentId(answers) {
    return connection.query("SELECT ID FROM department WHERE department.name = ?", answers.department);
}

// Calculate department budget given department name
function getDepartmentBudget(answers) {
    return connection.query(`SELECT SUM(Salary) AS dept_budget FROM (${viewCommand}) AS new_table WHERE Department = ?`, answers.department);
}

// Get all role titles
function getRoleTitle() {
    return connection.query("SELECT role.title FROM role");
}

// Get role title given department id
function getRoleTitleFromDeptId(departmentId) {
    return connection.query("SELECT role.title FROM role WHERE role.department_id = ?", departmentId[0].ID);
}

// Get role id given role title
function getRoleId(answers) {
    return connection.query("SELECT role.id FROM role WHERE role.title = ?", answers.keyword);
}

// Get all managers full name
function getManagerName() {
    return connection.query("SELECT CONCAT(employee.first_name, \" \", employee.last_name) AS manager FROM employee");
}

// Get all employees full name
function getEmployeeName() {
    return connection.query("SELECT CONCAT(employee.first_name, \" \", employee.last_name) AS employee_name FROM employee");
}

// Get employee id given employee full name
function getEmployeeId(answers) {
    return connection.query("SELECT employee.id FROM employee WHERE CONCAT(employee.first_name, \" \", employee.last_name) = ?", answers.keyword)
}

// Add employee
function addEmployee(employeeInfo) {
    connection.query("INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", employeeInfo);
}

// Add role
function addRole(roleInfo) {
    connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", roleInfo);
}

// Add department
function addDepartment(answers) {
    connection.query("INSERT INTO department (name) VALUES (?)", answers.department);
}

// Delete employee
function removeEmployee(answers) {
    connection.query("DELETE FROM employee WHERE CONCAT(employee.first_name, \" \", employee.last_name) = ?", answers.keyword);
}

// Delete role
function removeRole(answers) {
    connection.query("DELETE FROM role WHERE role.title = ?", answers.keyword);
}

// Delete department 
function removeDepartment(answers) {
    connection.query("DELETE FROM department WHERE department.name = ?", answers.keyword);
}

// Update employee role given employee full name
function updateEmployeeRole(updateInfo) {
    connection.query("UPDATE employee SET role_id = ? WHERE CONCAT(employee.first_name, \" \", employee.last_name) = ?", updateInfo);
}

// Update employee manager given employee full name 
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

