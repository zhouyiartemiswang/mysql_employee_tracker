const { table } = require("console.table");

// TODO: View departments
// TODO: View roles
// TODO: View employees

function viewDepartments(departmentData) {
    console.table(departmentData);
}

function viewRoles(roleData) {
    console.table(roleData);
}

function viewEmployees(employeeData) {
    console.table(employeeData);
}

module.exports = { 
    viewDepartments: viewDepartments, 
    viewRoles: viewRoles, 
    viewEmployees: viewEmployees
} 