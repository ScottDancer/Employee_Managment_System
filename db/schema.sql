DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  INDEX department_index (department_id),
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  INDEX role_index (role_id),
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  manager_id INT,
  INDEX manager_index (manager_id),
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

use employees_db;

INSERT INTO department (name)
VALUES ('HR'), ('Programming'), ("Design");

INSERT INTO role (title, salary, department_id)
VALUES ('HR Representive', 80000, 1), ('Lead Programmer', 150000, 2), ('Visual Designer', 100000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Pepper', 2, NULL), ('Rick', 'Peters', 3, 1), ('Crystal', 'Waters', 1, 2);