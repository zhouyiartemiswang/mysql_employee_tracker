DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
    id INTEGER AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INTEGER AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INTEGER AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    PRIMARY KEY (id)
);

INSERT INTO department (name) VALUES ("Sales");
INSERT INTO department (name) VALUES ("Engineering");
INSERT INTO department (name) VALUES ("Finance");
INSERT INTO department (name) VALUES ("Legal");

INSERT INTO role (title, salary, department_id) VALUES ("Sales Lead", 100000, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Salesperson", 80000, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Lead Engineer", 190000, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Software Engineer", 120000, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Accountant", 125000, 3);
INSERT INTO role (title, salary, department_id) VALUES ("Legal Team Lead", 250000, 4);
INSERT INTO role (title, salary, department_id) VALUES ("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("John", "Doe", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Mike", "Chan", 2, 1);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Ashley", "Rogriguez", 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Kevin", "Tupik", 4, 3);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Malia", "Brown", 5);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Sarah", "Lourd", 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Tom", "Allen", 7, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Christian", "Eckenrode", 2, 2);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

-- SELECT 
--     employee.id,
--     employee.first_name,
--     employee.last_name,
--     Title,
--     Department,
--     Salary,
--     employee.manager_id
-- FROM
--     employee
--         LEFT JOIN
--     (SELECT 
--         role.title AS Title,
-- 		department.name AS Department,
-- 		role.salary As Salary
--     FROM
--         role
--     LEFT JOIN Department ON role.Department_id = Department.id) AS new_role
--     
--     ON employee.role_id = new_role.id;
-- 	LEFT JOIN new_role ON employee.role_id = role.id;
--     LEFT JOIN new_role ON 
    
SELECT 
    employee.id AS ID,
    employee.first_name AS "First Name",
    employee.last_name AS "Last Name",
    role.title AS Title,
    department.name AS Department,
    role.salary AS Salary,
    CONCAT(manager.first_name, " ", manager.last_name) AS Manager
FROM employee 
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
LEFT JOIN employee manager ON manager.id = employee.manager_id

SELECT * FROM 
(SELECT 
    employee.id AS ID,
    employee.first_name AS "First Name",
    employee.last_name AS "Last Name",
    role.title AS Title,
    department.name AS Department,
    role.salary AS Salary,
    CONCAT(manager.first_name, " ", manager.last_name) AS Manager
FROM employee 
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
LEFT JOIN employee manager ON manager.id = employee.manager_id) AS employee_combined
WHERE Manager = "John Doe";
-- WHERE Department = "Engineering"

-- SELECT 
-- 	role.title,
-- 	department.name,
-- 	role.salary
-- FROM
-- 	role
-- LEFT JOIN Department ON role.Department_id = Department.id
-- SELECT 
-- 	employee.id,
-- 	employee.first_name,
-- 	employee.last_name,
--     role.title,
--     manager_id
-- FROM
--     employee
-- LEFT JOIN
-- 	role
-- ON employee.role_id = role.id

-- LEFT JOIN

