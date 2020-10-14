const { table } = require("console.table");
const inquirer = require("inquirer");
const db = require("./data");

init();

// Start to ask user questions and direct to specific functions
async function init() {

    const answers = await inquirer.prompt([
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
    ]);

    switch (answers.ans1) {

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

        case "Quit":
            quit();
            break;

        default:
            break;
    }

}

// Display all employees including id, first and last name, title, department, salary and manager
async function viewAllEmployees() {

    const data = await db.displayAllEmployees();
    console.log("\n");
    console.table(data);
    init();

}

// Display all employees in a user-selected department
async function viewEmployeesByDepartment() {

    // Find names of all departments
    const data = await db.findAllDepartments();

    // Generate a list of all departments to use in prompt
    const answers = await inquirer.prompt([
        {
            type: "list",
            message: "Which department would you like to see?",
            name: "department",
            choices: generateList(data, "department")
        }
    ]);

    // Based on user selection, find all employees from selected department and display
    const employees = await db.displayEmployeeByDepartment(answers);
    console.log("\n");
    console.table(employees);

    init();
}

// Display all employees under a user-selected manager
async function viewEmployeesByManager() {

    // Generate manager list from employee list to use in prompt
    const data = await db.displayAllEmployees();
    const answers = await inquirer.prompt([
        {
            type: "list",
            message: "Which manager would you like to see?",
            name: "manager",
            choices: generateList(data, "manager1")
        }
    ]);

    // Based on user selection, find all employees from selected manager and display
    const employees = await db.displayEmployeeByManager(answers);
    console.log("\n");
    console.table(employees);

    init();

}

// Display all roles
async function viewAllRoles() {

    // Get all roles from role table
    const data = await db.displayAllRoles();
    console.log("\n");
    console.table(data);

    init();
}

// Display all departments
async function viewAllDepartments() {

    // Get all departments from department table
    const data = await db.findAllDepartments();
    console.log("\n");
    console.table(data);

    init();

}

// Display budget of a user-selected department 
async function viewBudget() {

    // Get all department names to use in prompt
    const data = await db.findAllDepartments();
    const answers = await inquirer.prompt([
        {
            type: "list",
            message: "Which department's budget do you want to see?",
            name: "department",
            choices: generateList(data, "department")
        }
    ]);

    // Get id of the department user selected
    const departmentId = await db.getDepartmentId(answers);
    
    // Get budget of that department 
    const budget = await db.getDepartmentBudget(departmentId);
    console.log(`\nThe budget for ${answers.department} department is $${budget[0].dept_budget}.\n`);

    init();

}

// Add an employee
async function addEmployee() {

    const answers = await inquirer.prompt([
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
    ]);
    
    let employeeInfo = []; // Initiate an empty array to hold new employee's info
    // Add employee's first and last name into employeeInfo array
    employeeInfo.push(answers.firstName, answers.lastName);

    // Get all department names to use in prompt
    const data = await db.findAllDepartments();
    const answers2 = await inquirer.prompt([
        {
            type: "list",
            message: "What is the employee's department?",
            name: "department",
            choices: generateList(data, "department")
        }
    ]);

    // Get id of the department selected by user
    const departmentId = await db.getDepartmentId(answers2);

    // Get all roles in that department and generate a list to use in prompt
    const roleTitle = await db.getRoleTitleFromDeptId(departmentId);
    const answers3 = await inquirer.prompt([
        {
            type: "list",
            message: "What is the employee's role?",
            name: "keyword",
            choices: generateList(roleTitle, "role")
        }
    ]);

    // Get id of role selected by user
    const roleId = await db.getRoleId(answers3);

    // Add role id into employeeInfo array
    employeeInfo.push(roleId[0].id);

    // Get managers from employee table
    const manager = await db.getManagerName();

    // Generate manager list to use in prompt
    let managerList = generateList(manager, "manager2");

    // Add choice "None" to indicate no manager
    managerList.push("None");
    const answers4 = await inquirer.prompt([
        {
            type: "list",
            message: "What is the employee's manager?",
            name: "keyword",
            choices: managerList
        }
    ]);

    // Get id of manager selected by user
    const managerId = await db.getEmployeeId(answers4);

    // If user selected "None", add "null" to manager_id column
    if (answers4.manager === "None") {
        employeeInfo.push(null);
    } 
    // Otherwise add manager id to manager_id column
    else {
        employeeInfo.push(managerId[0].id);
    }

    // Add employee with all info in employeeInfo array
    await db.addEmployee(employeeInfo);

    console.log(`\n${employeeInfo[0]} ${employeeInfo[1]} is added to employee list.`);

    // Display all employee to show newly added employee
    viewAllEmployees();

}

// Add a role
async function addRole() {

    // Get all departments to use in prompt
    const data = await db.findAllDepartments();
    const answers = await inquirer.prompt([
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
            choices: generateList(data, "department")
        }
    ]);

    // Get id of department selected by user
    const departmentId = await db.getDepartmentId(answers);

    // Assign role title, salary, and department id to roleInfo
    let roleInfo = [answers.role, answers.salary, departmentId[0].ID];
    
    // Add role to role table
    await db.addRole(roleInfo);
    console.log(`\n${answers.role} is added to the list.`);
    
    // Display all role to show newly added role
    viewAllRoles();

}

// Add a department 
async function addDepartment() {

    const answers = await inquirer.prompt([
        {
            type: "input",
            message: "What department do you want to add?",
            name: "department"
        }
    ]);

    // Add a department to department table 
    await db.addDepartment(answers);

    console.log(`\n${answers.department} is added to the list.`);

    // Display all department to show newly added department 
    viewAllDepartments();

}

// Remove employee, role or department 
async function remove(keyword) {

    let choiceList = [];

    // Generate list based on parameter passed in
    if (keyword === "employee") {

        const data = await db.getEmployeeName();
        choiceList = generateList(data, "employee");

    } else if (keyword === "role") {

        const data = await db.getRoleTitle();
        choiceList = generateList(data, "role");

    } else if (keyword === "department") {

        const data = await db.findAllDepartments();
        choiceList = generateList(data, "department");

    } else {

        return console.log("Wrong keyword, try again!");

    }

    const answers = await inquirer.prompt([
        {
            type: "list",
            message: `Which ${keyword} do you want to remove?`,
            name: "keyword",
            choices: choiceList
        }
    ]);

    // Remove employee, role or department 
    if (keyword === "employee") {

        const data2 = await db.removeEmployee(answers);
        console.log(`\n${answers.keyword} is removed from the list.`);
        viewAllEmployees();

    } else if (keyword === "role") {

        const data2 = await db.removeRole(answers);
        console.log(`\n${answers.keyword} is removed from the list.`);
        viewAllRoles();

    } else if (keyword === "department") {

        const data2 = await db.removeDepartment(answers);
        console.log(`\n${answers.keyword} is removed from the list.`);
        viewAllDepartments();

    }

}

// Update employee role or manager
async function updateEmployee(keyword) {

    // Get names of employees
    const data = await db.getEmployeeName();

    // Get roles of employees
    const data2 = await db.getRoleTitle();

    // Generate list of employees and roles
    let employeeList = generateList(data, "employee");
    let choiceList = generateList(data2, "role");

    // If updating manager, then choiceList will be employeeList
    if (keyword === "manager") {
        choiceList = employeeList;
    }

    const answers = await inquirer.prompt([
        {
            type: "list",
            message: `Which employee's ${keyword} do you want to update?`,
            name: "employee",
            choices: employeeList
        },
        {
            type: "list",
            message: `Which ${keyword} do you want to set for the selected employee?`,
            name: "keyword",
            choices: choiceList
        }
    ]);

    // Update role or manager
    if (keyword === "role") {

        const roleId = await db.getRoleId(answers);
        await db.updateEmployeeRole([roleId[0].id, answers.employee]);

    } else if (keyword === "manager") {

        const employeeId = await db.getEmployeeId(answers);
        await db.updateEmployeeManager([employeeId[0].id, answers.employee]);

    } else {
        return console.log("Wrong keyword, try again!");
    }

    console.log(`\n${answers.employee}'s ${keyword} is updated.`);
    
    // Display all employees to show updates
    viewAllEmployees();

}

// Function input: data, type (string)
// Function output: list to be used in prompt
function generateList(data, type) {

    let list = [];
    data.forEach(function (dataEl) {
        if (type === "department") {
            list.push(dataEl.Department);

        } else if (type === "manager1") {

            if (!list.includes(dataEl.Manager) && dataEl.Manager != null) {
                list.push(dataEl.Manager);
            }

        } else if (type === "manager2") {
            list.push(dataEl.manager);

        } else if (type === "role") {
            list.push(dataEl.title);

        } else if (type === "employee") {
            list.push(dataEl.employee_name);

        }
    });
    
    return list;
    
}

// Quit the application
function quit() {
    console.log("Bye!");
    process.exit();
}